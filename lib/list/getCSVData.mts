import type { KeystoneList } from '../list.mjs';
import listToArray from './listToArray.mjs';
import escapeValueForExcel from '../security/escapeValueForExcel.mjs';

function pick(source: unknown, keys: string[]): Record<string, unknown> {
	if (source === null || typeof source === 'undefined') return {};
	const sourceObj = Object(source) as Record<string, unknown>;
	const picked: Record<string, unknown> = {};
	keys.forEach(function (key) {
		if (key in sourceObj) picked[key] = sourceObj[key];
	});
	return picked;
}

interface CsvField {
	path: string;
	type?: string;
	many?: boolean;
	label?: string;
	options: { toCSV?: string | string[] | ((this: unknown, field: CsvField, options: CsvOptions) => unknown) };
	format(item: unknown): unknown;
	getExpandedData?(item: unknown): unknown;
}

interface CsvOptions {
	fields?: string | string[];
	expandRelationshipFields?: boolean | string;
	[key: string]: unknown;
}

function transformFieldValue(field: CsvField, item: unknown, options: CsvOptions): unknown {
	const transform = typeof field.options.toCSV === 'string'
		? listToArray(field.options.toCSV)
		: field.options.toCSV;
	if (typeof transform === 'function') {
		return transform.call(item, field, options);
	}
	if (Array.isArray(transform)) {
		const value = (item as Record<string, unknown>)[field.path];
		if (transform.length === 1) {
			return (value as Record<string, unknown>)[transform[0] ?? ''];
		} else {
			return pick(value, transform);
		}
	}
	return field.format(item);
}

export default function getCSVData(this: KeystoneList, item: unknown, options?: CsvOptions): Record<string, unknown> {
	const opts: CsvOptions = options ?? {};
	if (opts.fields === undefined) {
		opts.fields = Object.keys(this.fields);
	}
	const data: Record<string, unknown> = { id: String((item as { id?: unknown }).id) };
	if (this.autokey) {
		const autokeyPath = (this.autokey as { path: string }).path;
		data[autokeyPath] = (item as { get(path: string): unknown }).get(autokeyPath);
	}
	if (opts.fields) {
		if (typeof opts.fields === 'string') {
			opts.fields = listToArray(opts.fields);
		}
		if (!Array.isArray(opts.fields)) {
			throw new Error('List.getCSV: options.fields must be undefined, a string, or an array.');
		}
		const self = this;
		opts.fields.forEach(function (path: string) {
			const field = self.fields[path] as CsvField | undefined;
			if (!field) { data[path] = (item as { get(path: string): unknown }).get(path); return; }
			if (field.type !== 'relationship' || !opts.expandRelationshipFields) {
				data[path] = transformFieldValue(field, item, opts); return;
			}
			const expanded = field.getExpandedData ? field.getExpandedData(item) : undefined;
			if (field.many) {
				data[path] = (Array.isArray(expanded) ? expanded : []).map(function (i: unknown) {
					const row = i as { name?: string; id?: string };
					return row.name ? row.name + ' (' + row.id + ')' : row.id;
				}).join(', ');
			} else if (typeof expanded === 'object' && expanded !== null) {
				const row = expanded as { name?: unknown; id?: unknown };
				data[path] = row.name;
				data[path + 'Id'] = row.id;
			}
		});
	}
		const itemObj = item as { getCSVData?: (data: Record<string, unknown>, opts: CsvOptions) => Record<string, unknown> | null };
	if (typeof itemObj.getCSVData === 'function') {
		const ext = itemObj.getCSVData(data, opts);
		if (ext !== null && typeof ext === 'object') {
			Object.entries(ext).forEach(function ([key, value]) {
				if (value === undefined) { Reflect.deleteProperty(data, key); }
				else { data[key] = value; }
			});
		}
	}
	const rtn: Record<string, unknown> = {};
	Object.entries(data).forEach(function ([prop, value]) {
		if (Array.isArray(value)) {
			rtn[prop] = JSON.stringify(value);
		} else if (value !== null && typeof value === 'object') {
			Object.entries(value).forEach(function ([i, v]) {
				const suffix = i.slice(0, 1).toUpperCase() + i.slice(1);
				rtn[prop + suffix] = (typeof v === 'object') ? JSON.stringify(v) : v;
			});
		} else if (value !== null) {
			rtn[prop] = value;
		}
	});
	Object.entries(rtn).forEach(([prop, value]) => {
		rtn[prop] = escapeValueForExcel(value as string | number | boolean);
	});
	return rtn;
}
