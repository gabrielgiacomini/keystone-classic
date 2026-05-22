import { slug } from '../utils/string.mjs';
import type { KeystoneList } from '../list.mjs';

function isObject(value: unknown): value is Record<string, unknown> {
	return value !== null && (typeof value === 'object' || typeof value === 'function');
}

interface AutokeyLock {
	ready: Promise<void>;
	release: () => void;
}

/**
 * The parsed shape of a single autokey `from` source path entry.
 */
interface AutokeyFromEntry {
	path: string;
	format: string | undefined;
}

/**
 * Shape of the resolved autokey options object (after normalisation).
 */
interface AutokeyOpts {
	from: AutokeyFromEntry[];
	path: string;
	unique?: boolean | Record<string, string>;
	fixed?: boolean;
	locale?: string;
	ignoreIncompleteSource?: boolean;
	/** Typo alias for ignoreIncompleteSource (Keystone Classic compat). */
	ingoreIncompleteSource?: boolean;
}

/**
 * Minimal schema interface used by the autokey plugin.
 * Provides loosely-typed `pre`/`post`/`add`/`pathType` hooks sufficient for
 * autokey without coupling to the full Mongoose Schema generic machinery.
 */
interface AutokeySchema {
	add(def: Record<string, unknown>): void;
	pathType(path: string): string;
	pre(event: 'save', fn: (this: AutokeyDoc, next: (err?: unknown) => void) => void): void;
	post(
		event: 'save',
		fn:
			| ((this: AutokeyDoc, doc: AutokeyDoc, next: (err?: unknown) => void) => void)
			| ((this: AutokeyDoc, err: unknown, doc: AutokeyDoc, next: (err?: unknown) => void) => void)
	): void;
}

function stringifyAutokeyValue(value: unknown): string {
	if (value === null || value === undefined) return '';
	if (typeof value === 'string') return value;
	if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') return String(value);
	return Object.prototype.toString.call(value);
}

/**
 * Mongoose document shape as seen by the autokey plugin's pre/post hooks.
 * Includes all members required by `MongooseDocument` (from fields/types/Type.mts)
 * so that `list.fields[path].format(doc)` and `.isModified(doc)` calls compile.
 */
interface AutokeyDoc {
	/** Document _id. */
	id?: string;
	/** Mongoose $locals bag for per-save state. */
	$locals?: Record<string, unknown>;
	/** Get a field value by path. */
	get(path: string): unknown;
	/** Set a field value by path. */
	set(path: string, value: unknown): void;
	/** True when the given path has been modified since last save. */
	isModified(path: string): boolean;
	/** True when the given path is selected in this query. */
	isSelected(path: string): boolean;
	/** Returns a plain-object snapshot of the document. */
	toObject(): Record<string, unknown>;
}

/**
 * Mongoose schema plugin that auto-generates a URL-slug key field from one or
 * more source paths before each save.  Configured via the list's `autokey` option.
 * When `unique` is set, appends an incrementing suffix until the slug is unique.
 */
export default function autokey(this: KeystoneList): void {
	const rawAutokey = this.get('autokey');
	const autokeyOpts: AutokeyOpts = this.autokey = Object.assign({}, rawAutokey as Record<string, unknown>) as unknown as AutokeyOpts;

	const list = this;

	if (autokeyOpts.ignoreIncompleteSource === undefined) {
		autokeyOpts.ignoreIncompleteSource = autokeyOpts.ingoreIncompleteSource;
	}

	if (!(autokeyOpts as { from?: unknown }).from) {
		throw new Error('Invalid List Option (autokey) for ' + list.key + ' (from is required)\n');
	}
	if (!autokeyOpts.path) {
		throw new Error('Invalid List Option (autokey) for ' + list.key + ' (path is required)\n');
	}

	const rawFrom: unknown = (autokeyOpts as unknown as Record<string, unknown>)['from'];
	const fromArray: string[] = typeof rawFrom === 'string' ? rawFrom.split(' ') : (rawFrom as string[]);
	autokeyOpts.from = fromArray.map(function (i: string) {
		const parts = i.split(':');
		return { path: parts[0] ?? '', format: parts[1] };
	});

	const schemaDef: Record<string, unknown> = {};
	schemaDef[autokeyOpts.path] = { type: String, index: true };
	if (autokeyOpts.unique) {
		schemaDef[autokeyOpts.path] = { type: String, index: { unique: true, sparse: true } };
	}

	// JUSTIFIED: list.schema is a fully valid Mongoose Schema at runtime;
	// this cast relaxes the overload resolution for hook/add registration.
	const schema = list.schema as unknown as AutokeySchema;
	schema.add(schemaDef);

	const autokeyLocks = new Map<string, Promise<void>>();
	const settled = Promise.resolve();

	const getUniqueScope = function (doc: AutokeyDoc): Array<[string, unknown]> {
		if (!isObject(autokeyOpts.unique)) {
			return [];
		}
		return Object.entries(autokeyOpts.unique as Record<string, string>).map(function ([path, value]) {
			if (typeof value === 'string' && value.startsWith(':')) {
				return [path, doc.get(value.slice(1))] as [string, unknown];
			}
			return [path, value] as [string, unknown];
		});
	};

	const applyUniqueScope = function (query: { where(path: string, value: unknown): void }, scope: Array<[string, unknown]>): void {
		scope.forEach(function ([path, value]) {
			query.where(path, value);
		});
	};

	const getLockKey = function (src: string, scope: Array<[string, unknown]>): string {
		return JSON.stringify([list.key, autokeyOpts.path, src, scope]);
	};

	const acquireAutokeyLock = function (key: string): AutokeyLock {
		const previous = autokeyLocks.get(key) ?? settled;
		let releaseCurrent!: () => void;
		const current = new Promise<void>(function (resolve) {
			releaseCurrent = resolve;
		});
		const chain = previous.catch(function () { /* keep the lock chain alive */ }).then(function () {
			return current;
		});
		autokeyLocks.set(key, chain);

		let released = false;
		return {
			ready: previous.catch(function () { /* a failed prior save should not deadlock later saves */ }),
			release() {
				if (released) {
					return;
				}
				released = true;
				releaseCurrent();
				void chain.finally(function () {
					if (autokeyLocks.get(key) === chain) {
						autokeyLocks.delete(key);
					}
				});
			},
		};
	};

	const setAutokeyLockRelease = function (doc: AutokeyDoc, release: () => void): void {
		doc.$locals = doc.$locals ?? {};
		if (typeof doc.$locals['__keystoneAutokeyRelease'] === 'function') {
			(doc.$locals['__keystoneAutokeyRelease'] as () => void)();
		}
		doc.$locals['__keystoneAutokeyRelease'] = release;
	};

	const releaseAutokeyLock = function (doc: AutokeyDoc | null | undefined): void {
		const locals = doc?.$locals;
		const release = locals?.['__keystoneAutokeyRelease'];
		if (typeof release === 'function' && locals) {
			delete locals['__keystoneAutokeyRelease'];
			(release as () => void)();
		}
	};

	// Minimal query interface for findOne().where().exec() used in getUniqueKey.
	type FindQuery = {
		where(path: string, value: unknown): FindQuery;
		exec(): Promise<Array<{ id?: string | number; get?(path: string): unknown } | null>>;
	};

	const getUniqueKey = function (doc: AutokeyDoc, src: string, scope: Array<[string, unknown]>, callback: (err?: unknown) => void) {
		const q = (list.model as unknown as { find(): FindQuery }).find().where(autokeyOpts.path, src);
		applyUniqueScope(q, scope);
		q.exec().then(function (results) {
			const validResults = results.filter((r): r is NonNullable<typeof r> => r !== null);
			const firstResult = validResults[0];
			if (validResults.length && (validResults.length > 1 || (firstResult !== undefined && firstResult.id != doc.id))) { // eslint-disable-line eqeqeq
				const match = /^(.+)\-(\d+)$/.exec(src);
				let incStr: string;
				if (match?.length === 3 && match[1] !== undefined && match[2] !== undefined) {
					src = match[1];
					incStr = '-' + (Number(match[2]) + 1);
				} else {
					incStr = '-1';
				}
				return getUniqueKey(doc, src + incStr, scope, callback);
			} else {
				doc.set(autokeyOpts.path, src);
				return callback();
			}
		}, callback);
	};

	schema.pre('save', function (this: AutokeyDoc, next: (err?: unknown) => void) {
		const doc = this;
		let modified = false;
		let incomplete = false;
		const values: string[] = [];

		for (const ops of autokeyOpts.from) {
			// JUSTIFIED: list.fields is typed over TFields generic; we need a minimal
		// structural interface matching `format` and `isModified`. The cast via
		// unknown avoids the FieldInstanceFor<FieldSpec> union mismatch.
		const fieldInstance = (list.fields as unknown as Record<string, { format(doc: AutokeyDoc, fmt: string | undefined): string; isModified(doc: AutokeyDoc): boolean } | undefined>)[ops.path];
				if (fieldInstance) {
					values.push(fieldInstance.format(doc, ops.format));
					if (fieldInstance.isModified(doc)) { modified = true; }
					else if (!doc.isSelected(ops.path)) { incomplete = true; }
				} else {
					values.push(stringifyAutokeyValue(doc.get(ops.path)));
					if (ops.path !== 'id' && (schema as unknown as { pathType(p: string): string }).pathType(ops.path) === 'virtual' || doc.isModified(ops.path)) {
						modified = true;
				}
			}
		}

		if (incomplete && !autokeyOpts.ignoreIncompleteSource) { return next(); }
		if ((!modified || autokeyOpts.fixed) && (doc.get(autokeyOpts.path) || !doc.isSelected(autokeyOpts.path))) {
			return next();
		}

			const newKey = slug(values.join(' '), undefined, { locale: autokeyOpts.locale }) || doc.id;

		if (autokeyOpts.unique) {
			if (doc.get(autokeyOpts.path) === newKey) {
				return next();
			}
			const scope = getUniqueScope(doc);
			const lock = acquireAutokeyLock(getLockKey(String(newKey), scope));
			lock.ready.then(function () {
				getUniqueKey(doc, String(newKey), scope, function (err?: unknown) {
					if (err) {
						lock.release();
						return next(err);
					}
					setAutokeyLockRelease(doc, lock.release);
					return next();
				});
				}, function (err: unknown) {
					lock.release();
					next(err);
				});
			} else {
				doc.set(autokeyOpts.path, String(newKey));
				return next();
		}
	});

		schema.post('save', function (this: AutokeyDoc, doc: AutokeyDoc, next: (err?: unknown) => void) {
			releaseAutokeyLock(doc);
			next();
		});

		schema.post('save', function (this: AutokeyDoc, err: unknown, doc: AutokeyDoc, next: (err?: unknown) => void) {
			releaseAutokeyLock(doc);
			next(err);
		});
}
