import type { AddArg, FieldMap } from '../../fields/types/FieldSpec.mjs';
import type { KeystoneList } from '../list.mjs';
import isObject from '../utils/isObject.mjs';

/**
 *
 * @param {...any} args
 */
export default function add(
	this: KeystoneList,
	...args: AddArg[]
): KeystoneList {
	const self = this;

	const addObj = function (obj: FieldMap, prefix: string) {
		const keys = Object.keys(obj);
		for (const key of keys) {
			const val = obj[key];
			if (!val) {
				throw new Error(
					'Invalid value for schema path `' + prefix + key + '` in `' + self.key + '`.\n'
					+ 'Did you misspell the field type?\n'
				);
			}
			// Nesting detection: a plain object without a `type` property (or where `type.type`
			// exists) is treated as a nested schema group rather than a field spec.
			const asRecord = val as Record<string, unknown>;
			const isPlainObject = isObject(val)
				&& (!asRecord['constructor'] || (asRecord['constructor'] as { name?: string }).name === 'Object')
				&& (!asRecord['type'] || (asRecord['type'] as Record<string, unknown>)['type'] !== undefined);
			if (isPlainObject) {
				const nested = val as FieldMap;
				if (Object.keys(nested).length) {
					(self.schema as unknown as { nested: Record<string, boolean> }).nested[prefix + key] = true;
					addObj(nested, prefix + key + '.');
				} else {
					addField(prefix + key, nested);
				}
			} else {
				addField(prefix + key, val);
			}
		}
	};

	const addField = function (path: string, options: unknown) {
		if (self.isReserved(path)) {
			throw new Error('Path ' + path + ' on list ' + self.key + ' is a reserved path');
		}
		self.uiElements.push({ type: 'field', field: self.field(path, options) });
	};

	args.forEach(function (def) {
		self.schemaFields.push(def);
		if (typeof def === 'string') {
			if (def === '>>>') {
				self.uiElements.push({ type: 'indent' });
			} else if (def === '<<<') {
				self.uiElements.push({ type: 'outdent' });
			} else {
				self.uiElements.push({ type: 'heading', heading: def, options: {} });
			}
		} else {
			if ('heading' in def && typeof def.heading === 'string') {
				self.uiElements.push({ type: 'heading', heading: def.heading, options: def });
			} else {
				addObj(def as FieldMap, '');
			}
		}
	});

	return this;
}
