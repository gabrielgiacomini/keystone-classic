import type { Request, Response } from 'express';

type SerializablePrimitive = string | number | boolean | null;
type MetadataRecord = Record<string, unknown>;

const NON_METADATA_KEYS = new Set([
	'collection',
	'db',
	'model',
	'mongoose',
	'schema',
]);

interface AdminList {
	getOptions(): MetadataRecord;
	expandColumns(cols: unknown): MetadataRecord[];
}

interface KeystoneWithAdminMeta {
	lists: Record<string, AdminList>;
	nav: unknown;
	getOrphanedLists(): Array<{ key?: unknown; label?: unknown; path?: unknown }>;
}

type SerializableValue = SerializablePrimitive | SerializableValue[] | MetadataRecord;

// eslint-disable-next-line sonarjs/function-return-type -- recursive JSON cloning intentionally filters unsupported values with `undefined`.
function cloneSerializable(value: unknown, seen = new WeakSet()): SerializableValue | undefined {
	if (value === undefined) {
		return undefined;
	}
	if (isSerializablePrimitive(value)) {
		return value;
	}
	if (typeof value === 'function' || typeof value === 'symbol') {
		return undefined;
	}
	if (Array.isArray(value)) {
		return value
			.map((item: unknown) => cloneSerializable(item, seen))
			.filter((item): item is SerializableValue => item !== undefined);
	}
	if (!isRecord(value)) {
		return undefined;
	}
	if (seen.has(value)) {
		return undefined;
	}
	seen.add(value);
	const clone: MetadataRecord = {};
	for (const key of Object.keys(value)) {
		if (NON_METADATA_KEYS.has(key)) {
			continue;
		}
		const clonedValue = cloneSerializable(value[key], seen);
		if (clonedValue !== undefined) {
			clone[key] = clonedValue;
		}
	}
	seen.delete(value);
	return clone;
}

function isRecord(value: unknown): value is MetadataRecord {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isSerializablePrimitive(value: unknown): value is SerializablePrimitive {
	return value === null
		|| typeof value === 'string'
		|| typeof value === 'number'
		|| typeof value === 'boolean';
}

function getRefListKey(refList: unknown): string | undefined {
	if (typeof refList === 'string') {
		return refList;
	}
	if (isRecord(refList) && typeof refList['key'] === 'string') {
		return refList['key'];
	}
	return undefined;
}

function normalizeField(field: MetadataRecord): void {
	if (field['type'] !== undefined && field['fieldType'] === undefined) {
		field['fieldType'] = field['type'];
	}
	if (field['ops'] !== undefined && field['options'] === undefined) {
		field['options'] = field['ops'];
	}
	if (field['refList'] !== undefined) {
		const refListKey = getRefListKey(field['refList']);
		if (refListKey !== undefined) {
			field['refList'] = refListKey;
		}
	}
}

function normalizeFields(listOptions: MetadataRecord): void {
	const fields = listOptions['fields'];
	if (!isRecord(fields)) {
		return;
	}
	for (const path of Object.keys(fields)) {
		const field = fields[path];
		if (isRecord(field)) {
			normalizeField(field);
		}
	}
}

function serializeColumn(column: MetadataRecord): Record<string, SerializablePrimitive> {
	const serialized: Record<string, SerializablePrimitive> = {};
	for (const key of Object.keys(column)) {
		const value = column[key];
		if (key === 'refList') {
			const refListKey = getRefListKey(value);
			if (refListKey !== undefined) {
				serialized['refList'] = refListKey;
			}
		} else if (isSerializablePrimitive(value)) {
			serialized[key] = value;
		}
	}
	return serialized;
}

function serializeColumns(list: AdminList, defaultColumns: unknown): Array<Record<string, SerializablePrimitive>> {
	const columns = defaultColumns === undefined || defaultColumns === null || defaultColumns === ''
		? 'id'
		: cloneSerializable(defaultColumns);
	const expandedColumns = list.expandColumns(columns);
	return expandedColumns.map(serializeColumn);
}

function serializeList(list: AdminList): MetadataRecord {
	const listOptions = cloneSerializable(list.getOptions()) as MetadataRecord;
	normalizeFields(listOptions);
	listOptions['columns'] = serializeColumns(list, listOptions['defaultColumns']);
	return listOptions;
}

function serializeLists(listsByKey: Record<string, AdminList>): Record<string, MetadataRecord> {
	const lists: Record<string, MetadataRecord> = {};
	for (const key of Object.keys(listsByKey)) {
		const list = listsByKey[key];
		if (list !== undefined) {
			lists[key] = serializeList(list);
		}
	}
	return lists;
}

function serializeOrphanedList(list: { key?: unknown; label?: unknown; path?: unknown }): MetadataRecord {
	return {
		key: cloneSerializable(list.key),
		label: cloneSerializable(list.label),
		path: cloneSerializable(list.path),
	};
}

function buildAdminMeta(keystone: KeystoneWithAdminMeta): MetadataRecord {
	return {
		lists: serializeLists(keystone.lists),
		nav: cloneSerializable(keystone.nav),
		orphanedLists: keystone.getOrphanedLists().map(serializeOrphanedList),
	};
}

/**
 * Returns admin metadata needed by the JSON-driven Admin UI.
 */
export default function metaGet(req: Request, res: Response): void {
	const keystone = req.keystone as KeystoneWithAdminMeta | undefined;
	if (keystone === undefined) {
		res.status(500).json({ error: 'keystone context missing' });
		return;
	}
	res.json(buildAdminMeta(keystone));
}
