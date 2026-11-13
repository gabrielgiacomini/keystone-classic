import type { KeystoneList } from '../list.mjs';
import listToArray from './listToArray.mjs';
import escapeValueForExcel from '../security/escapeValueForExcel.mjs';
import { hasSecretOption, isHydratedDocument, isSensitivePath } from '../security/secretFieldRedaction.mjs';
import type { SecretAwareList } from '../security/secretFieldRedaction.mjs';

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
	refList?: SecretAwareList;
	options: { toCSV?: string | string[] | ((this: unknown, field: CsvField, options: CsvOptions) => unknown) };
	format(item: unknown): unknown;
	getExpandedData?(item: unknown): unknown;
}

interface CsvOptions {
	fields?: string | string[];
	expandRelationshipFields?: boolean | string;
	[key: string]: unknown;
}

// Whether a value picked for a CSV cell is (or contains) a raw related document.
function isUnsafeCsvValue(value: unknown): boolean {
	return (Array.isArray(value) ? value : [value]).some(isHydratedDocument);
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
		// `toCSV` keys are read straight off the stored value. On a relationship that
		// value is the populated related document, so a key naming one of its secret
		// fields (`toCSV: 'password'` on a relationship to users) would export the hash.
		const keys = field.type === 'relationship'
			? transform.filter((key) => field.refList !== undefined && !isSensitivePath(field.refList, key))
			: transform;
		if (transform.length === 1) {
			const picked = pick(value, keys)[transform[0] ?? ''];
			// `null` leaves the column out instead of exporting the text "undefined".
			return picked === undefined || isUnsafeCsvValue(picked) ? null : picked;
		}
		const picked = pick(value, keys);
		for (const [key, entry] of Object.entries(picked)) {
			if (isUnsafeCsvValue(entry)) Reflect.deleteProperty(picked, key);
		}
		return picked;
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
			if (!field) {
				// Never resolve caller-supplied paths into secret field values or raw related documents.
				if (isSensitivePath(self, path)) return;
				const value = (item as { get(path: string): unknown }).get(path);
				const values = Array.isArray(value) ? value : [value];
				if (!values.some(isHydratedDocument)) data[path] = value;
				return;
			}
			// Fields declared with `secret: true` are never exported.
			if (hasSecretOption(field)) return;
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
