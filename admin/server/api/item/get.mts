import type { Request, Response } from 'express';
import type { Keystone } from '../../../../index.mjs';
import _ from 'lodash';
import listToArray from '../../../../lib/list/listToArray.mjs';
import { getAdminLegacyPath } from '../../../../lib/core/adminSurfacePathUtils.mjs';

/**
 * Returns a single list item by id.
 * Accepts optional `fields` and `drilldown` query parameters.
 */
interface DrilldownItem {
	list: unknown;
	items: Array<{ label: string; href: string }>;
	more?: boolean;
}
interface Drilldown {
	def: string[];
	items: DrilldownItem[];
}

/** Minimal shape of a relationship field as accessed in the drilldown handler. */
interface RelationshipField {
	type: 'relationship';
	path: string;
	many: boolean;
	refList: {
		model: import('mongoose').Model<Record<string, unknown>>;
		path: string;
		getOptions(): Record<string, unknown>;
		getDocumentName(doc: Record<string, unknown>, escape?: boolean): string;
	};
}

/**
 * Express handler that returns a single list item by id.
 * Accepts optional fields and drilldown query parameters.
 */
export default function itemGet(req: Request, res: Response): void {
	const keystone = req.keystone as Keystone;
	const adminLegacyPath = getAdminLegacyPath(keystone);
	// req.list is always set by the initList middleware before this handler runs.
	const list = req.list;
	if (!list) {
		res.status(500).json({ error: 'list context missing' });
		return;
	}
	const query = list.model.findById(req.params.id);

	let fields: string[] | false | undefined = undefined;
	const rawFields = req.query.fields;
	if (rawFields === 'false') {
		fields = false;
	} else if (typeof rawFields === 'string') {
		fields = listToArray(rawFields);
	} else if (rawFields !== undefined && !Array.isArray(rawFields)) {
		res.status(401).json({ error: 'fields must be undefined, a string, or an array' });
		return;
	}
	if (req.query.expandRelationshipFields && req.query.expandRelationshipFields !== 'false') {
		list.relationshipFields.forEach(function (i: { path: string }) {
			query.populate(i.path);
		});
	}

	void query.exec().then(async function (item: unknown) {
		if (!item) {
			res.status(404).json({ err: 'not found', id: req.params.id });
			return;
		}
		const doc = item as Record<string, { get(path: string): unknown }> & { get(path: string): unknown };

		let drilldown: Drilldown | undefined;

		if (req.query.drilldown === 'true' && list.get('drilldown')) {
			drilldown = {
				def: (list.get('drilldown') as string).split(' ').reverse(),
				items: [],
			};

			for (const path of drilldown.def) {
				const rawField = list.fields[path];

				if (rawField?.type !== 'relationship') {
					throw new Error('Drilldown for ' + list.key + ' is invalid: field at path ' + path + ' is not a relationship.');
				}
				// After the type-guard throw above, rawField is a relationship field.
				const field = rawField as unknown as RelationshipField;

				const refList = field.refList;

					if (field.many) {
						const manyIds = doc.get(field.path) as unknown[];
						if (!manyIds.length) continue;
						const results = await refList.model.find().where('_id').in(manyIds).limit(4).exec();
						const more = (results.length === 4) ? results.pop() : false;
						if (results.length) {
							drilldown.items.push({
								list: refList.getOptions(),
								items: _.map(results, function (i: Record<string, unknown>) {
									return {
										label: refList.getDocumentName(i),
										href: adminLegacyPath + '/' + refList.path + '/' + String(i.id),
									};
								}),
								more: Boolean(more),
							});
						}
					} else {
					if (!doc.get(field.path)) continue;
					const result = await refList.model.findById(doc.get(field.path)).exec();
					if (result) {
						const r = result as Record<string, unknown>;
						drilldown.items.push({
							list: refList.getOptions(),
							items: [{
								label: refList.getDocumentName(result),
								href: adminLegacyPath + '/' + refList.path + '/' + String(r.id),
							}],
						});
					}
				}
			}

			drilldown.def.reverse();
			drilldown.items.reverse();
		}

		res.json(_.assign(list.getData(item, fields, req.query.expandRelationshipFields), { drilldown }));
	}).catch(function (err: unknown) {
		res.logError('admin/server/api/item/get', 'database error finding item', err);
		res.apiError('database error', err);
	});
}
