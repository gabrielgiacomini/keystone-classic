import type { Request, Response } from 'express';
import listToArray from '../../../../lib/list/listToArray.mjs';
import applyRelationshipPopulate from './applyRelationshipPopulate.mjs';

/**
 * Returns filtered and paginated list documents.
 * Accepts `fields`, `filters`, `search`, `sort`, `limit`, `skip`, `populate`,
 * `expandRelationshipFields`, `count`, and `results` query parameters.
 */
export default async function listGet(req: Request, res: Response): Promise<void> {
	// req.list is always set by the initList middleware before this handler runs.
	const list = req.list;
	if (!list) {
		res.status(500).json({ error: 'list context missing' });
		return;
	}
	const where: Record<string, unknown> = {};
	let fields: string[] | false | undefined = undefined;
	const rawFields = req.query.fields;
	const includeCount = req.query.count !== 'false';
	const includeResults = req.query.results !== 'false';
	if (includeResults && rawFields) {
		if (rawFields === 'false') {
			fields = false;
		} else if (typeof rawFields === 'string') {
			fields = listToArray(rawFields);
		} else if (Array.isArray(rawFields)) {
			// already an array from qs parse
		} else {
			res.status(401).json({ error: 'fields must be undefined, a string, or an array' });
			return;
		}
	}
	let filters: unknown = req.query.filters;
	if (filters && typeof filters === 'string') {
		try { filters = JSON.parse(req.query.filters as string); }
		catch (_e) { }
	}
	if (typeof filters === 'object' && filters !== null) {
		Object.assign(where, list.addFiltersToQuery(filters));
	}
	if (req.query.search) {
		Object.assign(where, list.addSearchToQuery(req.query.search));
	}
	const query = list.model.find(where);
	if (req.query.populate) {
		const populateResult = applyRelationshipPopulate(list, query, req.query.populate);
		if (!populateResult.ok) {
			res.status(400).json({ error: 'invalid populate fields', fields: populateResult.invalid });
			return;
		}
	}
	if (req.query.expandRelationshipFields && req.query.expandRelationshipFields !== 'false') {
		list.relationshipFields.forEach(function (i: { path: string }) {
			query.populate(i.path);
		});
	}
	const sort = list.expandSort(req.query.sort);
	// MongoDB's $near / $nearSphere operators are incompatible with countDocuments
	// (the aggregation-based count path) — they require sort-order semantics that
	// MongoDB only supports in a plain find().  Detect proximity queries and skip
	// the count to avoid a MongoServerError.
	function hasProximityOperator (obj: unknown): boolean {
		if (!obj || typeof obj !== 'object') return false;
		for (const k of Object.keys(obj)) {
			if (k === '$near' || k === '$nearSphere') return true;
			if (hasProximityOperator((obj as Record<string, unknown>)[k])) return true;
		}
		return false;
	}
	const whereHasProximity = hasProximityOperator(where);

	try {
		let count = 0;
		if (includeCount && !whereHasProximity) {
			// Issue the count against the model so we don't mutate / re-exec
			// the `query` instance used for the find below (Mongoose throws
			// "Query was already executed" if the same Query is exec'd twice).
			count = await list.model.countDocuments(where).exec();
		}
		let items: unknown[] = [];
		if (includeResults) {
			query.limit(Number(req.query.limit) || 100);
			query.skip(Number(req.query.skip) || 0);
			if (sort.string) {
				query.sort(sort.string);
			}
			items = await query.exec();
		}
		res.json({
			results: includeResults
				? items.map(function (item: unknown) {
					return list.getData(item, fields, req.query.expandRelationshipFields);
				})
				: undefined,
			// count is unavailable for proximity queries ($near/$nearSphere are
			// incompatible with MongoDB's countDocuments aggregation stage).
			count: includeCount && !whereHasProximity ? count : undefined,
		});
	} catch (err: unknown) {
		res.logError('admin/server/api/list/get', 'database error finding items', err);
		res.apiError('database error', err);
	}
}
