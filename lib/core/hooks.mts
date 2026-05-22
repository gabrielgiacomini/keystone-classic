type HookDone = (err?: unknown, ...results: unknown[]) => void;
type HookMiddleware = (...args: unknown[]) => unknown;
type HookMethod = (...args: unknown[]) => unknown;
type HookMethodConfig = Record<string, HookMethod>;
type HookInitializer = string | HookMethodConfig | HookInitializer[];
type ThenableFactory = (
	executor: (resolve: (value?: unknown) => void, reject: (reason?: unknown) => void) => void
) => PromiseLike<unknown>;

export interface HookOptions {
	strict?: boolean;
	qualifiers?: {
		pre?: string;
		post?: string;
	};
	createThenable?: ThenableFactory;
}

interface HookState {
	middleware: Record<string, HookMiddleware[]>;
	opts: Required<HookOptions> & {
		qualifiers: {
			pre: string;
			post: string;
		};
	};
}

interface HookDescriptor {
	type?: string;
	name?: string;
}

interface CallHookParams {
	context: unknown;
	hook: string;
	args: unknown[];
}

export interface Hookable {
	__grappling: HookState;
	allowHooks(...hooks: Array<string | string[]>): this;
	hook(qualifiedHook: string, ...middleware: HookMiddleware[]): this | PromiseLike<unknown>;
	unhook(qualifiedHook?: string, ...middleware: HookMiddleware[]): this;
	hookable(...qualifiedHooks: Array<string | string[]>): boolean;
	addHooks(...methods: HookInitializer[]): this;
	addAsyncHooks(...methods: HookInitializer[]): this;
	addSyncHooks(...methods: HookInitializer[]): this;
	addThenableHooks(...methods: HookInitializer[]): this;
	callHook(qualifiedHook: string, ...args: unknown[]): this;
	callHook(context: object, qualifiedHook: string, ...args: unknown[]): this;
	callAsyncHook(qualifiedHook: string, ...args: unknown[]): this;
	callAsyncHook(context: object, qualifiedHook: string, ...args: unknown[]): this;
	callSyncHook(qualifiedHook: string, ...args: unknown[]): this;
	callSyncHook(context: object, qualifiedHook: string, ...args: unknown[]): this;
	callThenableHook(qualifiedHook: string, ...args: unknown[]): PromiseLike<unknown>;
	callThenableHook(context: object, qualifiedHook: string, ...args: unknown[]): PromiseLike<unknown>;
	getMiddleware(qualifiedHook: string): HookMiddleware[];
	hasMiddleware(qualifiedHook: string): boolean;
	pre(hookName: string, ...middleware: HookMiddleware[]): this | PromiseLike<unknown>;
	post(hookName: string, ...middleware: HookMiddleware[]): this | PromiseLike<unknown>;
}

function defaultCreateThenable (): PromiseLike<unknown> {
	throw new Error('Instance not set up for thenable creation, please set `opts.createThenable`');
}

function flatten<T> (items: Array<T | T[]>): T[] {
	const flattened: T[] = [];
	for (const item of items) {
		if (Array.isArray(item)) {
			flattened.push(...flatten(item as Array<T | T[]>));
		} else {
			flattened.push(item);
		}
	}
	return flattened;
}

function parseHook (hook?: string): HookDescriptor {
	const parts = hook ? hook.split(':') : [];
	return {
		type: parts[parts.length - 2],
		name: parts[parts.length - 1],
	};
}

function qualifyHook (hook: HookDescriptor): HookDescriptor {
	if (!hook.name || !hook.type) {
		throw new Error('Only qualified hooks are allowed, e.g. "pre:save", not "save"');
	}
	return hook;
}

function isThenable (subject: unknown): subject is PromiseLike<unknown> {
	return Boolean(subject && typeof (subject as { then?: unknown }).then === 'function');
}

function coerceError (err: unknown): Error {
	if (err instanceof Error) return err;
	if (typeof err === 'string') return new Error(err);
	return new Error('Hook middleware failed with a non-error value');
}

function addMiddleware (instance: Hookable, hook: string, middlewareArgs: HookMiddleware[]): void {
	const fns = flatten<HookMiddleware>(middlewareArgs);
	const cache = instance.__grappling;
	const existing = cache.middleware[hook];
	if (!existing && cache.opts.strict) {
		throw new Error('Hooks for ' + hook + ' are not supported.');
	}
	cache.middleware[hook] = (existing ?? []).concat(fns);
}

function createQualifierMethod (qualifier: string) {
	return function qualifierHook (this: Hookable, hookName: string, ...middleware: HookMiddleware[]): Hookable | PromiseLike<unknown> {
		const qualifiedHook = qualifier + ':' + hookName;
		if (middleware.length) {
			addMiddleware(this, qualifiedHook, middleware);
			return this;
		}
		const thenable = this.__grappling.opts.createThenable((resolve) => {
			addMiddleware(this, qualifiedHook, [resolve]);
		});
		return thenable;
	};
}

function dezalgofy (fn: (done: HookDone) => void, done: HookDone): void {
	let isSync = true;
	fn(function safeDone (err?: unknown, ...results: unknown[]) {
		if (isSync) {
			process.nextTick(function deferredDone () {
				done(err, ...results);
			});
			return;
		}
		done(err, ...results);
	});
	isSync = false;
}

function iterateAsyncMiddleware (context: unknown, middleware: HookMiddleware[], args: unknown[], done?: HookDone): void {
	const finish = done ?? function defaultDone (err?: unknown) {
		if (err) {
			throw coerceError(err);
		}
	};
	let index = 0;
	let seriesFinished = false;
	let waiting = 0;
	let finished = false;

	function complete (err?: unknown): void {
		if (finished) return;
		finished = true;
		finish(err);
	}

	function maybeComplete (): void {
		if (seriesFinished && waiting === 0) {
			complete();
		}
	}

	function next (err?: unknown): void {
		if (finished) return;
		if (err) {
			complete(err);
			return;
		}
		if (index >= middleware.length) {
			seriesFinished = true;
			maybeComplete();
			return;
		}
		const callback = middleware[index++];
		if (!callback) {
			seriesFinished = true;
			maybeComplete();
			return;
		}
		const declaredDelta = callback.length - args.length;
		try {
			if (declaredDelta === 1) {
				callback.apply(context, args.concat(next));
				return;
			}
			if (declaredDelta === 2) {
				waiting += 1;
				let waitDoneCalled = false;
				const waitDone: HookDone = function waitDone (waitErr?: unknown) {
					if (waitDoneCalled || finished) return;
					waitDoneCalled = true;
					waiting -= 1;
					if (waitErr) {
						complete(waitErr);
						return;
					}
					maybeComplete();
				};
				callback.apply(context, args.concat(next, waitDone));
				return;
			}
			const result = callback.apply(context, args);
			if (isThenable(result)) {
				result.then(function onResolved () {
					next();
				}, next);
				return;
			}
			next();
		} catch (callbackErr) {
			next(callbackErr);
		}
	}

	next();
}

function iterateSyncMiddleware (context: unknown, middleware: HookMiddleware[], args: unknown[]): void {
	for (const callback of middleware) {
		callback.apply(context, args);
	}
}

function parseCallHookParams (instance: Hookable, args: unknown[]): CallHookParams {
	return {
		context: typeof args[0] === 'string' ? instance : args.shift(),
		hook: args.shift() as string,
		args,
	};
}

function buildHookConfig (instance: Hookable, entries: HookInitializer[]): HookMethodConfig {
	const config: HookMethodConfig = {};
	for (const entry of flatten<HookInitializer>(entries)) {
		if (typeof entry === 'string') {
			const hook = parseHook(entry);
			const method = hook.name ? (instance as unknown as Record<string, HookMethod | undefined>)[hook.name] : undefined;
			if (!method) {
				throw new Error('Cannot add hooks to undeclared method:"' + hook.name + '"');
			}
			config[entry] ??= method;
		} else if (typeof entry === 'object') {
			for (const [hook, method] of Object.entries(entry)) {
				config[hook] ??= method;
			}
		} else {
			throw new Error('`addHooks` expects (arrays of) Strings or Objects');
		}
	}
	instance.allowHooks(Object.keys(config));
	return config;
}

function wrapAsyncHooks (instance: Hookable, config: HookMethodConfig): void {
	for (const [hook, method] of Object.entries(config)) {
		const hookObj = parseHook(hook);
		(instance as unknown as Record<string, HookMethod>)[hookObj.name as string] = function hookedAsyncMethod (this: Hookable, ...callArgs: unknown[]): unknown {
			const hookContext = this;
			const done = callArgs.pop();
			if (typeof done !== 'function') {
				throw new Error('Async methods should receive a callback as a final parameter');
			}
			let results: unknown[] = [];
			dezalgofy((safeDone) => {
				iterateAsyncMiddleware(hookContext, hookContext.getMiddleware('pre:' + hookObj.name), callArgs, (preErr?: unknown) => {
					if (preErr) {
						safeDone(preErr);
						return;
					}
					method.apply(hookContext, callArgs.concat(function originalDone (methodErr?: unknown, ...methodResults: unknown[]) {
						if (methodErr) {
							safeDone(methodErr);
							return;
						}
						results = methodResults;
						iterateAsyncMiddleware(hookContext, hookContext.getMiddleware('post:' + hookObj.name), callArgs, (postErr?: unknown) => {
							safeDone(postErr, ...results);
						});
					}));
				});
			}, done as HookDone);
			return undefined;
		};
	}
}

function wrapSyncHooks (instance: Hookable, config: HookMethodConfig): void {
	for (const [hook, method] of Object.entries(config)) {
		const hookObj = parseHook(hook);
		(instance as unknown as Record<string, HookMethod>)[hookObj.name as string] = function hookedSyncMethod (this: Hookable, ...callArgs: unknown[]): unknown {
			const hookContext = this;
			let result: unknown;
			const middleware = hookContext.getMiddleware('pre:' + hookObj.name);
			middleware.push(function runOriginal () {
				result = method.apply(hookContext, callArgs);
			});
			iterateSyncMiddleware(hookContext, middleware.concat(hookContext.getMiddleware('post:' + hookObj.name)), callArgs);
			return result;
		};
	}
}

function wrapThenableHooks (instance: Hookable, config: HookMethodConfig): void {
	for (const [hook, method] of Object.entries(config)) {
		const hookObj = parseHook(hook);
		(instance as unknown as Record<string, HookMethod>)[hookObj.name as string] = function hookedThenableMethod (this: Hookable, ...callArgs: unknown[]): PromiseLike<unknown> {
			return this.__grappling.opts.createThenable((resolve, reject) => {
				iterateAsyncMiddleware(this, this.getMiddleware('pre:' + hookObj.name), callArgs, (preErr?: unknown) => {
					if (preErr) {
						reject(preErr);
						return;
					}
					const result = method.apply(this, callArgs);
					if (!isThenable(result)) {
						reject(new Error('Thenable hook method "' + hookObj.name + '" did not return a thenable'));
						return;
					}
					result.then((methodResult) => {
						iterateAsyncMiddleware(this, this.getMiddleware('post:' + hookObj.name), callArgs, (postErr?: unknown) => {
							if (postErr) {
								reject(postErr);
								return;
							}
							resolve(methodResult);
						});
					}, reject);
				});
			});
		};
	}
}

const hookMethods = {
	allowHooks (this: Hookable, ...hooks: Array<string | string[]>): Hookable {
		const allowedHooks = flatten<string>(hooks);
		const { middleware, opts } = this.__grappling;
		for (const hook of allowedHooks) {
			if (typeof hook !== 'string') {
				throw new Error('`allowHooks` expects (arrays of) Strings');
			}
			const hookObj = parseHook(hook);
			if (hookObj.type) {
				if (hookObj.type !== opts.qualifiers.pre && hookObj.type !== opts.qualifiers.post) {
					throw new Error('Only "' + opts.qualifiers.pre + '" and "' + opts.qualifiers.post + '" types are allowed, not "' + hookObj.type + '"');
				}
				middleware[hook] ??= [];
				continue;
			}
			middleware[opts.qualifiers.pre + ':' + hookObj.name] ??= [];
			middleware[opts.qualifiers.post + ':' + hookObj.name] ??= [];
		}
		return this;
	},

	hook (this: Hookable, qualifiedHook: string, ...middleware: HookMiddleware[]): Hookable | PromiseLike<unknown> {
		qualifyHook(parseHook(qualifiedHook));
		if (middleware.length) {
			addMiddleware(this, qualifiedHook, middleware);
			return this;
		}
		return this.__grappling.opts.createThenable((resolve) => {
			addMiddleware(this, qualifiedHook, [resolve]);
		});
	},

	unhook (this: Hookable, qualifiedHook?: string, ...middleware: HookMiddleware[]): Hookable {
		const hookObj = parseHook(qualifiedHook);
		const storedMiddleware = this.__grappling.middleware;
		const { pre, post } = this.__grappling.opts.qualifiers;
		if (hookObj.type || middleware.length) {
			qualifyHook(hookObj);
			const currentMiddleware = storedMiddleware[qualifiedHook as string];
			if (currentMiddleware) {
				storedMiddleware[qualifiedHook as string] = middleware.length
					? currentMiddleware.filter((fn) => !middleware.includes(fn))
					: [];
			}
		} else if (hookObj.name) {
			if (storedMiddleware[pre + ':' + hookObj.name]) storedMiddleware[pre + ':' + hookObj.name] = [];
			if (storedMiddleware[post + ':' + hookObj.name]) storedMiddleware[post + ':' + hookObj.name] = [];
		} else {
			for (const hook of Object.keys(storedMiddleware)) {
				storedMiddleware[hook] = [];
			}
		}
		return this;
	},

	hookable (this: Hookable, ...qualifiedHooks: Array<string | string[]>): boolean {
		if (!this.__grappling.opts.strict) {
			return true;
		}
		const hooks = flatten<string>(qualifiedHooks);
		return hooks.every((hook) => {
			qualifyHook(parseHook(hook));
			return Boolean(this.__grappling.middleware[hook]);
		});
	},

	addHooks (this: Hookable, ...methods: HookInitializer[]): Hookable {
		wrapAsyncHooks(this, buildHookConfig(this, methods));
		return this;
	},

	addAsyncHooks (this: Hookable, ...methods: HookInitializer[]): Hookable {
		return this.addHooks(...methods);
	},

	addSyncHooks (this: Hookable, ...methods: HookInitializer[]): Hookable {
		wrapSyncHooks(this, buildHookConfig(this, methods));
		return this;
	},

	addThenableHooks (this: Hookable, ...methods: HookInitializer[]): Hookable {
		wrapThenableHooks(this, buildHookConfig(this, methods));
		return this;
	},

	callHook (this: Hookable, ...args: unknown[]): Hookable {
		const params = parseCallHookParams(this, args);
		const maybeDone = params.args[params.args.length - 1];
		const done = typeof maybeDone === 'function' ? params.args.pop() as HookDone : undefined;
		if (done) {
			dezalgofy((safeDone) => {
				iterateAsyncMiddleware(params.context, this.getMiddleware(params.hook), params.args, safeDone);
			}, done);
		} else {
			iterateAsyncMiddleware(params.context, this.getMiddleware(params.hook), params.args);
		}
		return this;
	},

	callAsyncHook (this: Hookable, ...args: unknown[]): Hookable {
		return hookMethods.callHook.apply(this, args);
	},

	callSyncHook (this: Hookable, ...args: unknown[]): Hookable {
		const params = parseCallHookParams(this, args);
		iterateSyncMiddleware(params.context, this.getMiddleware(params.hook), params.args);
		return this;
	},

	callThenableHook (this: Hookable, ...args: unknown[]): PromiseLike<unknown> {
		const params = parseCallHookParams(this, args);
		return this.__grappling.opts.createThenable((resolve, reject) => {
			dezalgofy((safeDone) => {
				iterateAsyncMiddleware(params.context, this.getMiddleware(params.hook), params.args, safeDone);
			}, (err?: unknown) => {
				if (err) {
					reject(err);
					return;
				}
				resolve();
			});
		});
	},

	getMiddleware (this: Hookable, qualifiedHook: string): HookMiddleware[] {
		qualifyHook(parseHook(qualifiedHook));
		return (this.__grappling.middleware[qualifiedHook] ?? []).slice();
	},

	hasMiddleware (this: Hookable, qualifiedHook: string): boolean {
		return this.getMiddleware(qualifiedHook).length > 0;
	},
};

export function installHooks<T extends object> (instance: T, opts: HookOptions = {}): T & Hookable {
	const qualifiers = {
		pre: opts.qualifiers?.pre ?? 'pre',
		post: opts.qualifiers?.post ?? 'post',
	};
	const hookable = instance as T & Hookable;
	hookable.__grappling = {
		middleware: {},
		opts: {
			strict: opts.strict ?? true,
			qualifiers,
			createThenable: opts.createThenable ?? defaultCreateThenable,
		},
	};
	Object.assign(hookable, hookMethods);
	(hookable as unknown as Record<string, unknown>)[qualifiers.pre] = createQualifierMethod(qualifiers.pre);
	(hookable as unknown as Record<string, unknown>)[qualifiers.post] = createQualifierMethod(qualifiers.post);
	return hookable;
}

export type { HookMiddleware };
