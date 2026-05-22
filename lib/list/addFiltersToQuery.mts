import debugLib from 'debug';
import type { KeystoneList } from '../list.mjs';

const debug = debugLib('keystone:core:list:addFiltersToQuery');

type MongoQuery = Record<string, unknown> & { $or?: unknown[]; $and?: unknown[] };

function combineQueries(a: MongoQuery, b: MongoQuery): MongoQuery {
	if (a.$or && b.$or) {
		const combinedAnd = Array.isArray(a.$and) ? a.$and : [];
		combinedAnd.push({ $or: a.$or });
		delete a.$or;
		if (Array.isArray(b.$and)) {
			combinedAnd.push(...b.$and);
		}
		combinedAnd.push({ $or: b.$or });
		delete b.$or;
		delete b.$and;
		a.$and = combinedAnd;
	}
	return Object.assign(a, b);
}

export default function addFiltersToQuery(this: KeystoneList, filters: Record<string, unknown>): Record<string, unknown> {
	const self = this;
	const fields = Object.keys(this.fields);
	const query: MongoQuery = {};
	fields.forEach(function (path: string) {
		const field = self.fields[path] as (undefined | { path: string; addFilterToQuery?: (f: unknown) => MongoQuery });
		if (!field || !field.addFilterToQuery || !filters[field.path]) return;
		combineQueries(query, field.addFilterToQuery(filters[field.path]));
	});
	debug('Adding filters to query, returned:', query);
	return query;
}
