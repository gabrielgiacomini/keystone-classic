import { FieldType } from '../Type.mjs';
import type { KeystoneList, FieldOptionsBase, MongooseDocument, FieldSize } from '../Type.mjs';
import keystone from '../../../index.mjs';
import definePrototypeGetters from '../../utils/definePrototypeGetters.mjs';
import { defer } from '../../../lib/utils/async.mjs';
import type { Schema } from 'mongoose';
import type { Filters } from '../FieldSpec.mjs';

// ---------------------------------------------------------------------------
// ListKey: the union of all registered list keys plus any other string.
// When `KeystoneLists` is empty (keystone4-ts itself, no consumer types loaded),
// `keyof KeystoneLists` resolves to `never`, so the type widens to `string`.
// When consumers populate the interface, IntelliSense suggests known keys while
// still accepting arbitrary strings via the `string & {}` opaque intersection.
// ---------------------------------------------------------------------------
type ListKey = keyof KeystoneLists | (string & {});

/**
 * Shape of a Mongoose document as used by Relationship field methods.
 * Extends `MongooseDocument` (from the base FieldType module) with the
 * `populated()` method and `id` property that Relationship methods need.
 */
interface MongooseItem extends MongooseDocument {
	populated(path: string): boolean;
	id?: string;
}

/**
 * Options accepted by the Relationship field type.
 *
 * @template TRef  The key of the referenced list. Defaults to `ListKey` (any
 *                 registered list key or arbitrary string). When consumers
 *                 supply a literal (e.g. `'User'`), TypeScript narrows the
 *                 `ref` property to that specific key.
 */
export interface KeystoneFieldOptionsForRelationshipType<
	TRef extends ListKey = ListKey,
> extends FieldOptionsBase {
	ref: TRef;
	refListPath?: string;
	many?: boolean;
	filters?: Filters<TRef>;
	createInline?: boolean;
	index?: boolean;
	unique?: boolean;
}

/**
 * @deprecated Use {@link KeystoneFieldOptionsForRelationshipType} instead.
 * Kept for backward compatibility with code that imports `RelationshipOptions`.
 */
export type RelationshipOptions<TRef extends ListKey = ListKey> =
	KeystoneFieldOptionsForRelationshipType<TRef>;

/** Shape of the filter descriptor passed to `addFilterToQuery`. */
export interface KSAdminUiFilterForRelationshipField {
	value: string[] | string | undefined;
	inverted?: boolean;
}

/**
 * @deprecated Use {@link KSAdminUiFilterForRelationshipField} instead.
 * Kept for backward compatibility.
 */
export type RelationshipFilter = KSAdminUiFilterForRelationshipField;

/** Minimal shape of the refList object returned by `keystone.list()`. */
interface RefListInfo {
	singular: string;
	plural: string;
	path: string;
	key: string;
	getDocumentName(item: MongooseItem): string;
}

// ---------------------------------------------------------------------------
// RelationshipType class
// ---------------------------------------------------------------------------

class RelationshipType<
	TRef extends ListKey = ListKey,
> extends FieldType<KeystoneFieldOptionsForRelationshipType<TRef>, string | string[]> {
	static readonly properName = 'Relationship';
	static readonly typeName = 'relationship';

	// Instance members set in constructor or by ensureRelationshipState()
	many!: boolean;
	filters!: Filters<TRef> | undefined;
	createInline!: boolean;
	declare _defaultSize: FieldSize | undefined;
	declare _nativeType: unknown;
	declare _underscoreMethods: string[];
	declare _properties: string[];
	declare paths: { refList: string };

	// Prototype getter targets — set via definePrototypeGetters below.
	// `declare` keeps TypeScript aware without emitting initialisers that would
	// shadow the prototype getters.
	declare isValid: boolean;
	declare refList: RefListInfo;
	declare hasFilters: boolean;

	constructor(list: KeystoneList, path: string, options: KeystoneFieldOptionsForRelationshipType<TRef>) {
		super(list, path, options);
		this.many = options.many ? true : false;
		this.filters = options.filters;
		this.createInline = options.createInline ? true : false;
		this._defaultSize = 'full';
		this._nativeType = keystone.mongoose.Schema.Types.ObjectId;
		this._underscoreMethods = ['format', 'getExpandedData'];
		this._properties = ['isValid', 'many', 'filters', 'createInline'];
	}

	getProperties(): { refList: Omit<RefListInfo, 'getDocumentName'> } {
		const refList = this.refList;
		return {
			refList: {
				singular: refList.singular,
				plural: refList.plural,
				path: refList.path,
				key: refList.key,
			},
		};
	}

	getExpandedData(item: MongooseItem): { id: string; name: string }[] | { id: string; name: string } | undefined {
		const value = item.get(this.path);
		type Expanded = { id: string; name: string }[] | { id: string; name: string } | undefined;
		let result: Expanded;
		if (this.many) {
			if (!value || !Array.isArray(value)) {
				result = [];
			} else {
				result = (value as MongooseItem[]).map(expandRelatedItemData.bind(this)).filter(truthy) as { id: string; name: string }[];
			}
		} else {
			result = expandRelatedItemData.call(this, value as MongooseItem);
		}
		return result;
	}

	override addToSchema(schema: Schema): void {
		const field = this;
		// NOTE: do NOT use `this._nativeType` or `this.many` here — `addToSchema`
		// is called from the base `FieldType` constructor (via `super()`), which
		// runs *before* the `RelationshipType` constructor body executes.  At the
		// time this method runs both `this._nativeType` and `this.many` are still
		// `undefined`, so we must read from `this.options` (set by the base-class
		// constructor) and reference `keystone.mongoose` directly.
		const def = {
			type: keystone.mongoose.Schema.Types.ObjectId,
			ref: this.options.ref,
			index: (this.options.index ? true : false),
			required: (this.options.required ? true : false),
			unique: (this.options.unique ? true : false),
		};
		this.paths = { refList: this.options.refListPath || this.path + 'RefList' };
		const isMany = this.options.many ? true : false;
		schema.path(this.path, isMany ? [def] : def);
		schema.virtual(this.paths.refList).get(function () {
			return keystone.lists[field.options.ref as string];
		});
		this.bindUnderscoreMethods();
	}

	override getData(item: MongooseItem): string | string[] {
		const value = item.get(this.path);
		return this.many ? (Array.isArray(value) ? (value as string[]) : []) : (value as string);
	}

	addFilterToQuery(filter: KSAdminUiFilterForRelationshipField | string): Record<string, unknown> {
		const query: Record<string, unknown> = {};
		// Defensive: if a plain string id is passed (e.g. from legacy client-side
		// code that formats relationship filters as a bare id), normalise it to the
		// expected { value: string } shape so strict-mode ESM does not throw when
		// trying to set `filter.value` on a string primitive.
		let f: KSAdminUiFilterForRelationshipField;
		if (typeof filter === 'string') {
			f = { value: filter };
		} else {
			f = filter;
		}
		if (!Array.isArray(f.value)) {
			if (typeof f.value === 'string' && f.value) {
				f = { ...f, value: [f.value] };
			} else {
				f = { ...f, value: [] };
			}
		}
		if ((f.value as string[]).length) {
			query[this.path] = f.inverted ? { $nin: f.value } : { $in: f.value };
		} else {
			if (this.many) {
				query[this.path] = f.inverted ? { $not: { $size: 0 } } : { $size: 0 };
			} else {
				query[this.path] = f.inverted ? { $ne: null } : null;
			}
		}
		return query;
	}

	override format(item: MongooseItem): string {
		const value = item.get(this.path);
		return this.many ? (value as string[]).join(', ') : unknownRelationshipScalarToString(value);
	}

	override validateInput(data: Record<string, unknown>, callback: (valid: boolean) => void): void {
		let value: unknown = this.getValueFromData(data);
		let result = false;
		if (value === undefined || value === null || value === '') {
			result = true;
		} else {
			if (this.many) {
				if (!Array.isArray(value) && typeof value === 'string' && value.length) value = [value];
				if (Array.isArray(value)) result = true;
			} else {
				if (typeof value === 'string' && value.length) result = true;
				if (typeof value === 'object' && 'id' in value) result = true;
			}
		}
		defer(callback, result);
	}

	override validateRequiredInput(item: MongooseItem, data: Record<string, unknown>, callback: (valid: boolean) => void): void {
		let value: unknown = this.getValueFromData(data);
		let result = false;
		if (value === undefined) {
			if (this.many) {
				if ((item.get(this.path) as unknown[]).length) result = true;
			} else {
				if (item.get(this.path)) result = true;
			}
		} else if (this.many) {
			if (!Array.isArray(value) && typeof value === 'string' && value.length) value = [value];
			if (Array.isArray(value) && value.length) result = true;
		} else {
			if (value) result = true;
		}
		defer(callback, result);
	}

	override inputIsValid(data: Record<string, unknown>, required?: boolean, item?: MongooseItem): boolean {
		if (!required) return true;
		if (!(this.path in data) && item) {
			const existing = item.get(this.path);
			if ((this.many && Array.isArray(existing) && existing.length) || (!this.many && existing)) return true;
		}
		if (typeof data[this.path] === 'string') {
			return ((data[this.path] as string).trim()) ? true : false;
		} else {
			return (data[this.path]) ? true : false;
		}
	}

	override updateItem(item: MongooseItem, data: Record<string, unknown>, callback: () => void): void {
		if (item.populated(this.path)) {
			throw new Error('fieldTypes.relationship.updateItem() Error - You cannot update populated relationships.');
		}
		const value: unknown = this.getValueFromData(data);
		if (value === undefined) return process.nextTick(callback);

		if (this.many) {
			const arr = item.get(this.path);
			const _old = (arr as unknown[]).map(function (i: unknown) { return String(i); });
			let _new: unknown = value;
			if (!Array.isArray(_new)) _new = unknownRelationshipScalarToString(_new).split(',');
			_new = (_new as unknown[]).filter(Boolean);
			if (!arraysEqual(_old, _new as unknown[])) item.set(this.path, _new);
		} else {
			if (value && value !== item.get(this.path)) {
				item.set(this.path, value);
			} else if (!value && item.get(this.path)) {
				item.set(this.path, null);
			}
		}
		process.nextTick(callback);
	}
}

function expandRelatedItemData (this: RelationshipType, item: MongooseItem | null | undefined): { id: string; name: string } | undefined {
	if (!item || !item.id) return undefined;
	return { id: item.id, name: this.refList.getDocumentName(item) };
}

function truthy (value: unknown): boolean { return !!value; }

function arraysEqual(left: unknown[], right: unknown[]): boolean {
	return left.length === right.length && left.every((value, index) => value === right[index]);
}

/**
 * Coerce an unknown relationship scalar to a display/update string without relying on `String(object)` for plain objects.
 */
function unknownRelationshipScalarToString (value: unknown): string {
	if (value === null || value === undefined || value === '') return '';
	if (typeof value === 'string') return value;
	if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') return String(value);
	if (typeof value === 'symbol') return value.toString();
	if (typeof value === 'function') return value.toString();
	if (typeof value === 'object') {
		const asText = (value as { toString(): string }).toString();
		return asText === '[object Object]' ? '' : asText;
	}
	return '';
}

definePrototypeGetters(RelationshipType, {
	isValid: function (this: RelationshipType) {
		return keystone.lists[this.options.ref as string] ? true : false;
	},
	refList: function (this: RelationshipType) {
		return keystone.lists[this.options.ref as string];
	},
	hasFilters: function (this: RelationshipType) {
		return (this.filters && Object.keys(this.filters).length) ? true : false;
	},
});

export default RelationshipType;

// ---------------------------------------------------------------------------
// Backward-compat alias
// ---------------------------------------------------------------------------

/**
 * Backward-compatible alias for {@link RelationshipType}.
 * Prefer importing `RelationshipType` directly.
 */
export type KeystoneFieldForRelationshipType = RelationshipType;

/**
 * Constructor type for the Relationship field type.
 */
export type KeystoneTypeConstructorForRelationshipType = new<TRef extends ListKey = ListKey>(
	list: KeystoneList,
	path: string,
	options: KeystoneFieldOptionsForRelationshipType<TRef>,
) => RelationshipType<TRef>;
