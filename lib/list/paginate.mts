/** Shape of the object resolved by a paginated query. */
export interface PaginationResult {
	total: number;
	results: unknown[];
	currentPage: number;
	totalPages: number;
	pages: number[];
	previous: number | false;
	next: number | false;
	first: number;
	last: number;
}

type PaginationCallback = (err: unknown, result?: PaginationResult) => void;

interface PaginateOptions {
	filters?: Record<string, unknown>;
	optionalExpression?: Record<string, unknown>;
	page?: number | string;
	perPage?: number | string;
	maxPages?: number | string;
	select?: unknown;
	sort?: unknown;
}

interface PaginationQuery {
	select(...args: unknown[]): PaginationQuery;
	sort(...args: unknown[]): PaginationQuery;
	where(...args: unknown[]): PaginationQuery;
	exec(cb: PaginationCallback): undefined;
	exec(cb?: undefined): Promise<PaginationResult>;
	exec(cb?: PaginationCallback): Promise<PaginationResult> | undefined;
	then(onFulfilled?: (value: PaginationResult) => unknown, onRejected?: (reason: unknown) => unknown): Promise<unknown>;
	catch(onRejected?: (reason: unknown) => unknown): Promise<unknown>;
	finally(onFinally?: () => void): Promise<unknown>;
	[key: string]: unknown;
}

/**
 * Minimal `this` surface consumed by `paginate()`.  Using a structural subset
 * rather than the full `KeystoneList` keeps the function usable from unit-test
 * stubs that only provide `model`, `getPages`, and `pagination`.
 * `model` is typed as `unknown` so that test stubs (which only implement
 * `find`) satisfy the interface; the internal cast below restores the full
 * Mongoose Model API for production use.
 */
interface PaginateThis {
	model: unknown;
	getPages(result: Record<string, unknown>, maxPages: number): void;
	pagination?: { maxPages: number };
}

/**
 * Adds skip/limit pagination to a Mongoose query.
 * @param options - Pagination options (page, perPage, maxPages).
 * @param callback - Optional callback for the paginated query.
 * @returns A paginated query with metadata.
 */
export default function paginate(this: PaginateThis, options: PaginateOptions = {}, callback?: PaginationCallback): PaginationQuery {
	const list = this;
	// JUSTIFIED: Mongoose query types are complex generics; widening to unknown is safe since we only call .find/.exec/.sort etc.
	type AnyModel = import('mongoose').Model<Record<string, unknown>>;
	const model = this.model as unknown as AnyModel;

	const query = model.find(options.filters ?? {}, options.optionalExpression ?? {});
	const countQuery = model.find(options.filters ?? {});

	const currentPage = Number(options.page) || 1;
	const resultsPerPage = Number(options.perPage) || 50;
	const maxPages = Number(options.maxPages) || 10;
	const skip = (currentPage - 1) * resultsPerPage;

	list.pagination = { maxPages: maxPages };

	if (options.select) {
		query.select(options.select as string);
	}

	if (options.sort) {
		query.sort(options.sort as string);
	}

	// JUSTIFIED: wrapper is a partial PaginationQuery — the Proxy below fills in the rest
	// (including `where` and other Mongoose query methods) by delegating to the underlying query.
	const wrapper = {
		select(...args: unknown[]) {
			query.select(args[0] as string);
			return paginationQuery;
		},
		sort(...args: unknown[]) {
			query.sort(args[0] as string);
			return paginationQuery;
		},
		exec(cb?: PaginationCallback) {
			const promise: Promise<PaginationResult> = countQuery.countDocuments().exec().then(function (count: number) {
				query.limit(resultsPerPage).skip(skip);
				return query.exec().then(function (results: unknown[]) {
					const totalPages = Math.ceil(count / resultsPerPage);
					const rtn: PaginationResult = {
						total: count,
						results: results,
						currentPage: currentPage,
						totalPages: totalPages,
						pages: [],
						previous: (currentPage > 1) ? (currentPage - 1) : false,
						next: (currentPage < totalPages) ? (currentPage + 1) : false,
						first: skip + 1,
						last: skip + results.length,
					};
					// `getPages` mutates rtn.pages in-place; cast needed because the interface
					// expects Record<string,unknown> but we pass the typed PaginationResult.
					list.getPages(rtn as unknown as Record<string, unknown>, maxPages);
					return rtn;
				});
			});

			if (cb) {
				promise.then(function (result: PaginationResult) {
					cb(null, result);
				}, function (err: unknown) {
					cb(err);
				});
				return undefined;
			}

			return promise;
		},
		then(onFulfilled?: (value: PaginationResult) => unknown, onRejected?: (reason: unknown) => unknown) {
			// exec() without a callback always returns a Promise (never undefined).
			return (paginationQuery.exec() as Promise<PaginationResult>).then(onFulfilled, onRejected);
		},
		catch(onRejected?: (reason: unknown) => unknown) {
			return (paginationQuery.exec() as Promise<PaginationResult>).catch(onRejected);
		},
		finally(onFinally?: () => void) {
			return (paginationQuery.exec() as Promise<PaginationResult>).finally(onFinally);
		},
	};

	// JUSTIFIED: Proxy wraps the wrapper to delegate unknown query methods (e.g. `where`) to the
	// underlying Mongoose query.  The cast is safe: the Proxy fulfils the full PaginationQuery
	// contract at runtime by forwarding any property not on `wrapper` to the underlying query.
	const paginationQuery = new Proxy(wrapper, {
		get(target, prop, receiver) {
			if (Reflect.has(target, prop)) {
				return Reflect.get(target, prop, receiver) as unknown;
			}
			const value = (query as unknown as Record<string | symbol, unknown>)[prop];
			if (typeof value === 'function') {
				return (...args: unknown[]) => {
					const result = (value as (...a: unknown[]) => unknown).apply(query, args);
					return result === query ? paginationQuery : result;
				};
			}
			return value;
		},
	}) as unknown as PaginationQuery;

	if (callback) {
		paginationQuery.exec(callback);
		return paginationQuery;
	}

	return paginationQuery;
}
