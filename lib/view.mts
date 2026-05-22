import keystone from '../index.mjs';
import isObject from './utils/isObject.mjs';
import type { Request, Response } from 'express';

type NextFn = (err?: Error) => void;
type QueueFn = (next: NextFn) => void;

/** A Mongoose-style query object that exposes an exec() returning a Promise. */
interface ExecableQuery {
	exec(): Promise<unknown>;
}

/** Options accepted by the QueryCallbacks constructor. */
interface QueryCallbackOptions {
	err?: CallbackMap['err'];
	none?: CallbackMap['none'];
	then?: CallbackMap['then'];
}

/** Internal map of named callbacks stored in a QueryCallbacks instance. */
interface CallbackMap {
	err?: (err: Error, next: NextFn) => void;
	none?: (next: NextFn) => void;
	then?: string | ((err: Error | null, results: unknown, next: NextFn) => void);
}

/** Shape of `this` inside View constructor and prototype methods. */
interface ViewInstance {
	req: Request;
	res: Response;
	initQueue: (QueueFn | QueueFn[])[];
	actionQueue: QueueFn[];
	queryQueue: QueueFn[];
	renderQueue: QueueFn[];
}

/** Locals passed to a render template — a plain key/value map. */
type TemplateLocals = Record<string, unknown>;

/** A render function invoked at the end of the queue. */
type RenderFn = (err: Error | null, req: Request, res: Response) => void;

function View(this: ViewInstance, req: Request, res: Response): void {

	if (req.constructor.name !== 'IncomingMessage') {
		throw new Error('Keystone.View Error: Express request object is required.');
	}

	if (res.constructor.name !== 'ServerResponse') {
		throw new Error('Keystone.View Error: Express response object is required.');
	}

	this.req = req;
	this.res = res;

	this.initQueue = [] as (QueueFn | QueueFn[])[];
	this.actionQueue = [] as QueueFn[];
	this.queryQueue = [] as QueueFn[];
	this.renderQueue = [] as QueueFn[];
}

export default View;

/** Typed prototype to avoid unsafe member-access on the plain-function prototype. */
interface ViewPrototype {
	on(on: string | boolean | Record<string, unknown> | (() => boolean), ...args: unknown[]): ViewInstance;
	query(key: string, query: ExecableQuery, options?: QueryCallbackOptions | string): QueryCallbacks;
	render(renderFn: string | RenderFn, locals?: TemplateLocals | (() => TemplateLocals), callback?: NextFn): void;
}
const ViewProto = View.prototype as unknown as ViewPrototype;

ViewProto.on = function (this: ViewInstance, on: string | boolean | Record<string, unknown> | (() => boolean)): ViewInstance {

	const req = this.req;
	let callback = arguments[1] as QueueFn;

	if (typeof on === 'function') {

		if (on()) {
			this.actionQueue.push(callback);
		}

	} else if (isObject(on)) {

		const onObj = on as Record<string, unknown>;

		const check = function (value: unknown, path: string) {
			const parts = path.split('.');
			// Walk dot-path through an untyped object map starting from req
			let ctx: Record<string, unknown> = Object.assign({}, req as unknown as Record<string, unknown>);
			for (let i = 0; i < parts.length - 1; i++) {
				const part = parts[i];
				if (part === undefined) continue; // unreachable: i < parts.length - 1
				if (!ctx[part]) {
					return false;
				}
				ctx = ctx[part] as Record<string, unknown>;
			}
			path = parts[parts.length - 1] ?? '';
			return (value === true && path in ctx) ? true : (ctx[path] === value);
		};

			if (Object.entries(onObj).every(([path, value]) => check(value, path))) {
				this.actionQueue.push(callback);
			}

	} else if (on === 'get' || on === 'post' || on === 'put' || on === 'delete') {

		if (req.method !== (on as string).toUpperCase()) {
			return this;
		}

		if (arguments.length === 3) {

			callback = arguments[2] as QueueFn;

			let values: Record<string, unknown> = {};
			const arg1: unknown = arguments[1];
			if (typeof arg1 === 'string') {
				values[arg1] = true;
			} else {
				values = arguments[1] as Record<string, unknown>;
			}

			const ctx = (on === 'post' || on === 'put') ? req.body as Record<string, unknown> : req.query as Record<string, unknown>;

			if (!Object.entries(values).every(function ([path, value]) {
				return (value === true && path in ctx) ? true : (ctx[path] === value);
			})) {
				return this;
			}

		}

		this.actionQueue.push(callback);

	} else if (on === 'init') {

		this.initQueue.push(callback);

	} else if (on === 'render') {

		this.renderQueue.push(callback);

	}

	return this;

};

class QueryCallbacks {
	callbacks: CallbackMap;

	constructor(options: QueryCallbackOptions | string) {
		let opts: QueryCallbackOptions;
		if (typeof options === 'string') {
			opts = { then: options };
		} else {
			opts = options;
		}
		this.callbacks = {};
		if (opts.err) this.callbacks.err = opts.err;
		if (opts.none) this.callbacks.none = opts.none;
		if (opts.then) this.callbacks.then = opts.then;
	}

	has(fn: string) { return (fn in this.callbacks); }
	err(fn: CallbackMap['err']) { this.callbacks.err = fn; return this; }
	none(fn: CallbackMap['none']) { this.callbacks.none = fn; return this; }
	then(fn: CallbackMap['then']) { this.callbacks.then = fn; return this; }
}

ViewProto.query = function (this: ViewInstance, key: string, query: ExecableQuery, options?: QueryCallbackOptions | string): QueryCallbacks {

	let locals: Record<string, unknown> = this.res.locals as Record<string, unknown>;
	const parts = key.split('.');
	const chain = new QueryCallbacks(options ?? {});

	key = parts.pop() ?? '';

	for (const part of parts) {
		if (!locals[part]) {
			locals[part] = {};
		}
		locals = locals[part] as Record<string, unknown>;
	}

	this.queryQueue.push(function (next: NextFn) {
		const handle = function (err: Error | null, results: unknown) {

			locals[key] = results;
			const callbacks = chain.callbacks;

			if (err) {
				const errCb = callbacks.err;
				if (errCb) {
					return errCb(err, next);
				}
			} else {
				if ((!results || (Array.isArray(results) && results.length === 0)) && callbacks.none) {
					return callbacks.none(next);
				} else if ('then' in callbacks) {
					if (typeof callbacks.then === 'function') {
						return (callbacks.then as (err: Error | null, results: unknown, next: NextFn) => void)(err, results, next);
					} else {
						return keystone.populateRelated(results, callbacks.then, function (e: Error | null) { next(e ?? undefined); });
					}
				}
			}

			return next(err ?? undefined);

		};
		query.exec().then(function (results: unknown) {
			handle(null, results);
		}, function (err: unknown) {
			handle(err instanceof Error ? err : new Error(String(err)), undefined);
		});
	});

	return chain;
};


ViewProto.render = function (this: ViewInstance, renderFn: string | RenderFn, locals?: TemplateLocals | (() => TemplateLocals), callback?: NextFn): void {

	const req = this.req;
	const res = this.res;

	if (typeof renderFn === 'string') {
		const viewPath = renderFn;
		const self = this;
		renderFn = function () {
			if (typeof locals === 'function') {
				locals = locals();
			}
			self.res.render(viewPath, locals, callback);
		} as RenderFn;
	}

	if (typeof renderFn !== 'function') {
		throw new Error('Keystone.View.render() renderFn must be a templatePath (string) or a function.');
	}

	this.initQueue.push.apply(this.initQueue, this.actionQueue);
	this.initQueue.push.apply(this.initQueue, this.queryQueue);

	const preRenderQueue: QueueFn[] = [];

	keystone.getMiddleware('pre:render').forEach(function (fn: (...args: unknown[]) => void) {
		preRenderQueue.push(function (next: NextFn) {
			fn(req, res, next);
		});
	});

	this.initQueue.push(preRenderQueue);
	this.initQueue.push(this.renderQueue);

	function callbackToPromise(fn: QueueFn): Promise<void> {
		return new Promise(function (resolve, reject) {
			fn(function (err?: Error) { if (err) reject(err); else resolve(); });
		});
	}

	const finalRenderFn = renderFn;
	const queue = this.initQueue;
	(async function () {
		for (const i of queue) {
			if (Array.isArray(i)) {
				await Promise.all(i.map(callbackToPromise));
			} else if (typeof i === 'function') {
				await callbackToPromise(i);
			} else {
				throw new Error('Keystone.View.render() events must be functions.');
			}
		}
	}()).then(function () {
		finalRenderFn(null, req, res);
	}, function (err: unknown) {
		finalRenderFn(err instanceof Error ? err : new Error(String(err)), req, res);
	});

};
