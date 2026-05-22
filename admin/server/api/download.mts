import type { Request, Response } from 'express';
import _ from 'lodash';
import dayjs from 'dayjs';
import csvUnparse from '../../../lib/utils/csvUnparse.mjs';
import escapeValueForExcel from '../../../lib/security/escapeValueForExcel.mjs';
import {
	applyDownloadLimit,
	createDownloadLimitError,
	isDownloadLimitExceeded,
	resolveDownloadLimit,
} from './list/downloadLimit.mjs';

const FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;

/** Serialises an autokey field value for CSV without relying on `Object` default stringification. */
function stringifyAutokeyValue(value: unknown): string {
	if (value === null || value === undefined) {
		return '';
	}
	if (typeof value === 'string') {
		return value;
	}
	if (typeof value === 'number') {
		return value.toString();
	}
	if (typeof value === 'boolean') {
		return `${value}`;
	}
	if (typeof value === 'bigint') {
		return value.toString();
	}
	return JSON.stringify(value);
}

/** Minimal shape of a Keystone field descriptor used in the download handler. */
interface KeystoneField {
	type: string;
	path: string;
	many?: boolean;
	/** The referenced list (for relationship fields). */
	refList?: {
		getDocumentName(doc: MongooseDoc): string;
	};
	/** Formats the field value for display. */
	format(doc: MongooseDoc): string;
}

/** Minimal shape of a Mongoose document as returned by `list.model.find()`. */
interface MongooseDoc {
	id: string;
	get(path: string): unknown;
	/** Optional custom CSV serialisation method added by the user's model. */
	toCSV?: (...args: unknown[]) => unknown;
}

/** A single CSV row — string-keyed, string values (after escaping). */
type CsvRow = Record<string, string>;

/** Dependency-injection map passed to `toCSV` methods. */
interface DepsMap {
	req: Request;
	user: Request['user'];
	row?: CsvRow;
	callback?: (err: unknown, result: unknown) => void;
	[key: string]: unknown;
}

/**
 * Streams a filtered list as a CSV file attachment.
 * Supports a `toCSV` method on documents for custom row serialisation.
 */
export default function download(req: Request, res: Response): void {
	if (!req.keystone) {
		res.status(500).json({ error: 'Keystone not initialised' });
		return;
	}
	const keystone = req.keystone;
	// req.list is always set by the initList middleware before this handler runs.
	if (!req.list) {
		res.status(500).json({ error: 'List not initialised' });
		return;
	}
	const list = req.list;

	const filters = list.processFilters(req.query.q);
	const queryFilters = list.getSearchFilters(req.query.search, filters);
	const relFields: string[] = [];

	_.forEach(list.fields as Record<string, KeystoneField>, function (field: KeystoneField) {
		if (field.type === 'relationship') {
			relFields.push(field.path);
		}
	});

	const getRowData = function getRowData(i: MongooseDoc): CsvRow {
		const rowData: CsvRow = { id: i.id };

		if (list.get('autokey')) {
			const autokey = list.get('autokey') as { path: string };
			rowData[autokey.path] = stringifyAutokeyValue(i.get(autokey.path));
		}

		_.forEach(list.fields as Record<string, KeystoneField>, function (field: KeystoneField) {
			if (field.type === 'boolean') {
				rowData[field.path] = i.get(field.path) ? 'true' : 'false';
			} else if (field.type === 'relationship') {
				const refList = field.refList;
				if (!refList) {
					throw new Error('Relationship field "' + field.path + '" is missing refList');
				}
				const refData = i.get(field.path);
				if (field.many) {
					const values: string[] = [];
					if (Array.isArray(refData) && refData.length) {
						_.forEach(refData as MongooseDoc[], function (item: MongooseDoc) {
							let name = refList.getDocumentName(item);
							if (keystone.get('csv expanded')) {
								name = '[' + item.id + ',' + name + ']';
							}
							values.push(name);
						});
					}
					rowData[field.path] = values.join(', ');
				} else {
					const singleRef = refData as MongooseDoc | null | undefined;
					if (keystone.get('csv expanded')) {
						rowData[field.path + '_id'] = singleRef ? singleRef.id : '';
						rowData[field.path + '_name'] = singleRef ? refList.getDocumentName(singleRef) : field.format(i);
					} else {
						rowData[field.path] = singleRef ? refList.getDocumentName(singleRef) : field.format(i);
					}
				}
			} else {
				rowData[field.path] = field.format(i);
			}
		});

		_.forOwn(rowData, (value: string, prop: string) => {
			rowData[prop] = escapeValueForExcel(value);
		});

		return rowData;
	};

	const query = list.model.find(queryFilters);
	const downloadLimit = resolveDownloadLimit(keystone);
	applyDownloadLimit(query, downloadLimit);
	if (relFields.length) {
		query.populate(relFields.join(' '));
	}
	(query.exec() as Promise<MongooseDoc[]>).then(function (results: MongooseDoc[]) {
		if (isDownloadLimitExceeded(results, downloadLimit)) {
			res.status(413).json(createDownloadLimitError(downloadLimit));
			return;
		}

		const sendCSV = function (data: CsvRow[]) {
			res.attachment(list.path + '-' + dayjs().format('YYYYMMDD-HHmmss') + '.csv');
			res.setHeader('Content-Type', 'application/octet-stream');
			const content = csvUnparse(data, {
				delimiter: keystone.get('csv field delimiter') || ',',
			});
			res.end(content, 'utf-8');
		};

		if (!results.length) {
			return sendCSV([]);
		}

		let data: CsvRow[];

		const firstToCSV = results.at(0)?.toCSV;
		if (firstToCSV) {
			const fnMatch = FN_ARGS.exec(firstToCSV.toString());
			const paramStr = fnMatch?.[1] ?? '';
			const deps = _.map(paramStr.split(','), function (i: string) { return i.trim(); });
			const includeRowData = (deps.includes('row'));
			const map: DepsMap = { req: req, user: req.user };

			const applyDeps = function (fn: (...args: unknown[]) => unknown, _this: MongooseDoc, _map: DepsMap) {
				const args = _.map(deps, function (key: string) { return _map[key]; });
				return fn.apply(_this, args);
			};

			if (_.last(deps) === 'callback') {
				return Promise.all(results.map(function (i: MongooseDoc) {
					return new Promise(function (resolve, reject) {
						const rowToCsv = i.toCSV;
						if (typeof rowToCsv !== 'function') {
							reject(new Error('toCSV missing on document for list ' + list.key));
							return;
						}
						const _map = _.clone(map);
						_map.callback = function (err: unknown, result: unknown) {
							if (err) {
								if (err instanceof Error) {
									reject(err);
								} else if (typeof err === 'string') {
									reject(new Error(err));
								} else if (typeof err === 'number' || typeof err === 'boolean' || typeof err === 'bigint') {
									reject(new Error(String(err)));
								} else if (typeof err === 'symbol') {
									reject(new Error(err.toString()));
								} else {
									reject(new Error(JSON.stringify(err)));
								}
							} else {
								resolve(result);
							}
						};
						if (includeRowData) { _map.row = getRowData(i); }
						applyDeps(rowToCsv, i, _map);
					});
				})).then(sendCSV as (rows: unknown[]) => void, function (err: unknown) {
					console.log('Error generating CSV for list ' + list.key);
					console.log(err);
					return res.send(keystone.wrapHTMLError('Error generating CSV', 'Please check the log for more details, or contact support.'));
				});
			} else {
				data = [];
				if (includeRowData) {
					_.forEach(results, function (i: MongooseDoc) {
						const rowToCsv = i.toCSV;
						if (typeof rowToCsv !== 'function') {
							throw new Error('toCSV missing on document for list ' + list.key);
						}
						const _map = _.clone(map);
						_map.row = getRowData(i);
						data.push(applyDeps(rowToCsv, i, _map) as CsvRow);
					});
				} else {
					_.forEach(results, function (i: MongooseDoc) {
						const rowToCsv = i.toCSV;
						if (typeof rowToCsv !== 'function') {
							throw new Error('toCSV missing on document for list ' + list.key);
						}
						data.push(applyDeps(rowToCsv, i, map) as CsvRow);
					});
				}
				return sendCSV(data);
			}
		} else {
			data = [];
			_.forEach(results, function (i: MongooseDoc) {
				data.push(getRowData(i));
			});
			return sendCSV(data);
		}

	}, function (err: unknown) {
		return res.status(500).json(err);
	});
}
