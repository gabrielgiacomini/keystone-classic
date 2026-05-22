import type { Request, Response, NextFunction } from 'express';
import type { Keystone } from '../../../../index.mjs';
import dayjs from 'dayjs';
import csvUnparse from '../../../../lib/utils/csvUnparse.mjs';
import applyRelationshipPopulate from './applyRelationshipPopulate.mjs';
import {
	applyDownloadLimit,
	createDownloadLimitError,
	isDownloadLimitExceeded,
	resolveDownloadLimit,
} from './downloadLimit.mjs';

/**
 * Streams the filtered list as a CSV or JSON file attachment.
 * Format is determined by the `:format` route param (export.csv or export.json).
 */
export default function listDownload(req: Request, res: Response, next: NextFunction): void {
	const keystone = req.keystone as Keystone;
	// req.list is always set by the initList middleware before this handler runs.
	const list = req.list;
	if (!list) {
		res.status(500).json({ error: 'list context missing' });
		return;
	}

	const format = (req.params.format as string).split('.')[1]; // json or csv
	const where: Record<string, unknown> = {};
	let filters: unknown = req.query.filters;
	if (filters && typeof filters === 'string') {
		try { filters = JSON.parse(req.query.filters as string); }
		catch (_e) { /* */ }
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
	if (req.query.expandRelationshipFields) {
		list.relationshipFields.forEach(function (i: { path: string }) {
			query.populate(i.path);
		});
	}
	const downloadLimit = resolveDownloadLimit(keystone);
	applyDownloadLimit(query, downloadLimit);
	const sort = list.expandSort(req.query.sort);
	query.sort(sort.string);
	query.exec()
		.then(function (results: unknown[]) {
			if (isDownloadLimitExceeded(results, downloadLimit)) {
				res.status(413).json(createDownloadLimitError(downloadLimit));
				return;
			}

			let data: Record<string, unknown>[];
			const fields: string[] = [];
			if (format === 'csv') {
				data = results.map(function (item: unknown) {
					const row = list.getCSVData(item, {
						expandRelationshipFields: req.query.expandRelationshipFields,
						fields: req.query.select,
						user: req.user,
					});
					Object.keys(row).forEach(function (i: string) {
						if (!fields.includes(i)) fields.push(i);
					});
					return row;
				});
				res.attachment(list.path + '-' + dayjs().format('YYYYMMDD-HHmmss') + '.csv');
				res.setHeader('Content-Type', 'application/octet-stream');
				const content = csvUnparse({
					data: data,
					fields: fields,
				}, {
					delimiter: keystone.get('csv field delimiter') || ',',
				});
				res.end(content, 'utf-8');
			} else {
				data = results.map(function (item: unknown) {
					return list.getData(item, req.query.select, req.query.expandRelationshipFields);
				});
				res.json(data);
			}
		})
		.catch(next);
}
