import type { KeystoneList } from '../list.mjs';
import isObject from '../utils/isObject.mjs';
import { keyToLabel } from '../utils/string.mjs';

interface ColumnDescriptor {
	path: string;
	type?: string;
	label: string;
	field?: unknown;
	refList?: unknown;
	refPath?: string;
	subField?: unknown;
	populate?: { path: string; subpath: string };
	isName?: boolean;
	width?: string | false;
	[key: string]: unknown;
}

interface ColumnDefinition {
	path?: string;
	subpath?: string;
	width?: string | false;
	label?: string;
	[key: string]: unknown;
}

interface FieldColumnSource {
	path: string;
	type?: string;
	label?: string;
	col?: Record<string, unknown>;
	refList?: { namePath: string; fields: Record<string, { label?: string } | undefined> };
	[key: string]: unknown;
}

/**
 * Expands a column definition (path string or array of path strings) into fully
 * resolved column descriptor objects, automatically prepending the name column
 * if it is not already included.
 */
export default function expandColumns(this: KeystoneList, cols: string | Array<string | ColumnDefinition>): ColumnDescriptor[] {
	if (typeof cols === 'string') {
		cols = cols.split(',');
	}
	if (!Array.isArray(cols)) {
		throw new Error('List.expandColumns: cols must be an array.');
	}
	const list = this;
	const expanded: ColumnDescriptor[] = [];

	const getCol = function (def: ColumnDefinition): ColumnDescriptor | null {
		if (def.path === '__name__') {
			def.path = list.namePath;
		}
		const defPath = def.path ?? '';
		const field = list.fields[defPath] as FieldColumnSource | undefined;
		let col: ColumnDescriptor | null = null;

		if (field) {
			col = {
				field: field,
				path: field.path,
				type: field.type,
				label: def.label ?? field.label ?? keyToLabel(defPath),
			};
			if (col.type === 'relationship') {
				col.refList = field.refList;
				const refList = field.refList;
				if (refList) {
					col.refPath = def.subpath ?? refList.namePath;
					col.subField = refList.fields[col.refPath];
					col.populate = { path: field.path, subpath: col.refPath };
				}
				if (!def.label && def.subpath) {
					const subField = col.subField as { label?: string } | undefined;
					col.label = (field.label ?? '') + ': ' + (subField?.label ?? keyToLabel(def.subpath));
				}
			}
		} else if ((list.model.schema.paths as Record<string, unknown>)[defPath] || (list.model.schema.virtuals as Record<string, unknown>)[defPath]) {
			col = {
				path: defPath,
				label: def.label ?? keyToLabel(defPath),
			};
		}

		if (col) {
			col.width = def.width;
			if (col.path === list.namePath) {
				col.isName = true;
			}
			if (field?.col) {
				Object.assign(col, field.col);
			}
		}
		return col;
	};

	for (const colDef of cols) {
		let def: ColumnDefinition;
		if (typeof colDef === 'string') {
			def = {};
			let parts = (colDef).trim().split('|');
			def.width = parts[1] ?? false;
			// `String#split` always yields at least one element.
			parts = (parts[0] ?? '').split(':');
			def.path = parts[0];
			def.subpath = parts[1];
		} else if (isObject(colDef)) {
			def = colDef;
		} else {
			throw new Error('List.expandColumns: column definition must contain a path.');
		}
		if (!def.path) {
			throw new Error('List.expandColumns: column definition must contain a path.');
		}
		const col = getCol(def);
		if (col) { expanded.push(col); }
	}

		if (!expanded.some((col) => col.path === list.namePath)) {
			const nameCol = getCol({ path: list.namePath });
			if (nameCol) { expanded.unshift(nameCol); }
		}

	return expanded;
}
