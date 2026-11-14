import listToArray from './listToArray.mjs';
import type { KeystoneList } from '../list.mjs';
import { holdsHydratedDocument, isSensitivePath } from '../security/passwordFieldRedaction.mjs';

type MongooseDoc = { id?: unknown; sortOrder?: unknown; get(path: string): unknown };
type FieldWithData = { type: string; getData(doc: MongooseDoc): unknown; getExpandedData(doc: MongooseDoc): unknown };

export default function getData(this: KeystoneList, item: MongooseDoc, fields?: string | string[], expandRelationshipFields?: boolean): Record<string, unknown> {
	const data: Record<string, unknown> = {
		id: item.id,
		name: this.getDocumentName(item as Record<string, unknown>),
	};
	const autokey = this.autokey as (undefined | { path: string });
	if (autokey) {
		data[autokey.path] = item.get(autokey.path);
	}
	if (this.options.sortable) {
		data['sortOrder'] = item.sortOrder;
	}
	fields ??= Object.keys(this.fields);
	if (fields) {
		if (typeof fields === 'string') {
			fields = listToArray(fields);
		}
		if (!Array.isArray(fields)) {
			throw new Error('List.getData: fields must be undefined, a string, or an array.');
		}
		const fieldData: Record<string, unknown> = {};
		const self = this;
		fields.forEach(function (path: string) {
			const field = self.fields[path] as (FieldWithData | undefined);
			if (field) {
				if (field.type === 'relationship' && expandRelationshipFields) {
					fieldData[path] = field.getExpandedData(item);
				} else {
					fieldData[path] = field.getData(item);
				}
			} else if (!isSensitivePath(self, path, (resolvedPath) => item.get(resolvedPath))) {
				// Caller-supplied paths that are not registered fields must never reach a
				// Password-type value or hand back a raw (populated) document.
				const value = item.get(path);
				if (!holdsHydratedDocument(value)) {
					fieldData[path] = value;
				}
			}
		});
		data['fields'] = fieldData;
	}
	return data;
}
