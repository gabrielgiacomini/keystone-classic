import listToArray from './listToArray.mjs';
import type { KeystoneList } from '../list.mjs';
import { getClientSafeDocumentName, hasSecretOption, isHydratedDocument, isSensitivePath } from '../security/secretFieldRedaction.mjs';

type MongooseDoc = { id?: unknown; sortOrder?: unknown; get(path: string): unknown };
type FieldWithData = { type: string; getData(doc: MongooseDoc): unknown; getExpandedData(doc: MongooseDoc): unknown };

export default function getData(this: KeystoneList, item: MongooseDoc, fields?: string | string[], expandRelationshipFields?: boolean): Record<string, unknown> {
	const data: Record<string, unknown> = { id: item.id };
	// The name is left out when the list's name field is a secret (Password-type or `secret: true`).
	const name = getClientSafeDocumentName(this, item as Record<string, unknown>);
	if (name !== undefined) data['name'] = name;
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
			if (hasSecretOption(field)) {
				// Fields declared with `secret: true` are never serialized.
				return;
			}
			if (field) {
				if (field.type === 'relationship' && expandRelationshipFields) {
					fieldData[path] = field.getExpandedData(item);
				} else {
					fieldData[path] = field.getData(item);
				}
			} else if (!isSensitivePath(self, path)) {
				// Caller-supplied paths that are not registered fields must never reach a
				// secret field value or hand back a raw (populated) document.
				const value = item.get(path);
				const values = Array.isArray(value) ? value : [value];
				if (!values.some(isHydratedDocument)) {
					fieldData[path] = value;
				}
			}
		});
		data['fields'] = fieldData;
	}
	return data;
}
