import keystoneSingleton from '../../../index.mjs';

/**
 * Minimal document shape for `getRelated` (the `this` context).
 * This method is registered on the schema via `schema.methods.getRelated`.
 */
interface GetRelatedDoc {
	id?: string;
	list: {
		key: string;
		relationships: Record<string, {
			path: string;
			ref: string;
			refPath: string;
			sort?: string;
		}>;
		defaultSort: string;
	};
	_populatedRelationships?: Record<string, boolean>;
	[key: string]: unknown;
}

/**
 * Options parsed from each relationship path string.
 */
interface RelPathOptions {
	path: string;
	populate?: string[];
	related?: string[];
	sort?: string;
}

/**
 * Minimal shape of a ref list used inside the queue closures.
 */
interface RefList {
	key: string;
	fields: Record<string, { type: string; path: string; many?: boolean }>;
	relationships: Record<string, { path: string; ref: string; refPath: string; sort?: string }>;
	defaultSort: string;
	model: {
		find(): RefQuery;
	};
}

interface RefQuery {
	where(path: string, value?: unknown): RefQuery;
	populate(paths: string[]): RefQuery;
	in(values: unknown[]): RefQuery;
	equals(value: unknown): RefQuery;
	sort(s: string): RefQuery;
	exec(): Promise<GetRelatedResult[]>;
}

interface GetRelatedResult {
	id?: string;
	populateRelated(paths: string[], callback: (err: unknown) => void): void;
	[key: string]: unknown;
}

/**
 * Populates one or more named relationships on the document and returns the results.
 * @param paths - Space-separated relationship path string or array of path strings.
 * @param callback - Called with `(err, results)` when all relationships are resolved.
 * @param nocollapse - When true, always returns a keyed object even for a single path.
 */
export default function getRelated(
	this: GetRelatedDoc,
	paths: string | string[],
	callback: (err: unknown, results?: Record<string, unknown>) => void,
	nocollapse?: boolean
): void {
	const keystone = keystoneSingleton;
	const item = this;
	const list = this.list;
	const queue: Record<string, () => Promise<GetRelatedResult[]>> = {};

	if (typeof callback !== 'function') {
		throw new Error('List.getRelated(paths, callback, nocollapse) requires a callback function.');
	}

	if (typeof paths === 'string') {
		const pathsArr = paths.split(' ');
		let lastPath = '';
		const pathsResult: string[] = [];
		for (const segment of pathsArr) {
			lastPath += (lastPath.length ? ' ' : '') + segment;
			if (!lastPath.includes('[') || lastPath.endsWith(']')) {
				pathsResult.push(lastPath);
				lastPath = '';
			}
		}
		paths = pathsResult;
	}

	(paths as string[]).forEach(function (rawOptions: string) {
		let options: RelPathOptions;
		let populateString = '';

		if (typeof rawOptions === 'string') {
			if (rawOptions.indexOf('[') > 0) {
				populateString = rawOptions.substring(rawOptions.indexOf('[') + 1, rawOptions.indexOf(']'));
				rawOptions = rawOptions.slice(0, rawOptions.indexOf('['));
			}
			options = { path: rawOptions };
		} else {
			options = rawOptions as unknown as RelPathOptions;
		}
		const optPopulate: string[] = options.populate ?? [];
		const optRelated: string[] = options.related ?? [];
		options.populate = optPopulate;
		options.related = optRelated;

		const relationship = list.relationships[options.path];
		if (!relationship) throw new Error('List.getRelated: list ' + list.key + ' does not have a relationship ' + options.path + '.');

		const refList = (keystone.lists as unknown as Record<string, RefList>)[relationship.ref];
		if (!refList) throw new Error('List.getRelated: list ' + relationship.ref + ' does not exist.');

		const rawRelField = refList.fields[relationship.refPath];
		if (rawRelField?.type !== 'relationship') throw new Error('List.getRelated: relationship ' + relationship.ref + ' on list ' + list.key + ' refers to a path (' + relationship.refPath + ') which is not a relationship field.');
		const relField = rawRelField;

		if (populateString.length) {
			populateString.split(' ').forEach(function (key: string) {
				if (refList.relationships[key]) { optRelated.push(key); }
				else { optPopulate.push(key); }
			});
		}

		queue[relationship.path] = async function (): Promise<GetRelatedResult[]> {
			let query = refList.model.find().where(relField.path);
			if (options.populate && options.populate.length) { query = query.populate(options.populate); }
			if (relField.many) { query = query.in([item.id]); }
			else { query = query.equals(item.id); }
			query = query.sort(options.sort ?? relationship.sort ?? refList.defaultSort);

			if (options.related && options.related.length) {
				const results: GetRelatedResult[] = await query.exec();
				if (!results.length) return results;
				await Promise.all(results.map(function (relatedItem: GetRelatedResult) {
					return new Promise<void>(function (resolve, reject) {
						relatedItem.populateRelated(options.related ?? [], function (err: unknown) {
							if (err) reject(err as Error); else resolve();
						});
					});
				}));
				return results;
			}
			return query.exec();
		};

		if (!item._populatedRelationships) item._populatedRelationships = {};
		item._populatedRelationships[relationship.path] = true;
	});

	const keys = Object.keys(queue);
	Promise.all(keys.map(function (key) {
		const fn = queue[key];
		return fn ? fn() : Promise.resolve([] as GetRelatedResult[]);
	}))
		.then(function (values: GetRelatedResult[][]) {
			const results: Record<string, unknown> = {};
			keys.forEach(function (key, idx) { results[key] = values[idx]; });
			if (!nocollapse && (paths as string[]).length === 1) {
				const firstPath = (paths as string[])[0];
				return callback(null, firstPath !== undefined ? { [firstPath]: results[firstPath] } : {});
			}
			callback(null, results);
		}, callback);
}
