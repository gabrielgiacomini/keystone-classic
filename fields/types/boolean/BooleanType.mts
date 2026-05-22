import { FieldType } from '../Type.mjs';
import type { KeystoneList, FieldOptionsBase, MongooseDocument } from '../Type.mjs';
import { defer } from '../../../lib/utils/async.mjs';

/**
 * Stores a boolean (`true`/`false`) value. Defaults to `false`. The admin UI
 * renders this as a checkbox. Accepts truthy strings (`"true"`) from HTML
 * form submissions.
 *
 * @param list The Keystone List this field belongs to.
 * @param path The dot-separated field path on the schema.
 * @param options Field configuration (may include `indent`).
 */
class BooleanType extends FieldType<KeystoneFieldOptionsForBooleanType, boolean> {
	/** Human-readable type name used by the Admin UI. */
	static readonly properName = 'Boolean';
	/** Technical type name used by Keystone internals. */
	static readonly typeName = 'boolean';

	/** Whether the checkbox is indented in the Admin UI form. */
	indent: boolean;

	declare _nativeType: BooleanConstructor;
	declare _properties: string[];
	declare _fixedSize: 'full';
	declare defaults: { default: boolean };

	constructor(list: KeystoneList, path: string, options: KeystoneFieldOptionsForBooleanType) {
		super(list, path, options);
		this.indent = (options.indent) ? true : false;
	}

	/**
	 * Validates that the submitted value is a boolean, number, string, null, or
	 * undefined — rejects any other type.
	 * @param data The submitted data object.
	 * @param callback Called with `true` when valid.
	 */
	override validateInput (data: Record<string, unknown>, callback: (result: boolean) => void): void {
		const value = this.getValueFromData(data);
		let result = true;
		if (value !== undefined
			&& value !== null
			&& typeof value !== 'string'
			&& typeof value !== 'number'
			&& typeof value !== 'boolean') {
			result = false;
		}
		defer(callback, result);
	}

	/**
	 * Validates that the submitted value is truthy and not the string `"false"`.
	 * @param _item The existing document (unused).
	 * @param data The submitted data object.
	 * @param callback Called with `true` when the value is considered truthy.
	 */
	override validateRequiredInput (_item: MongooseDocument, data: Record<string, unknown>, callback: (result: boolean) => void): void {
		const value = this.getValueFromData(data);
		const result = value && value !== 'false' ? true : false;
		defer(callback, result);
	}

	/**
	 * Converts a boolean filter descriptor to a Mongoose query condition.
	 * @param filter Filter descriptor; `filter.value` of `"false"` or falsy
	 *               matches documents where the field is not `true`.
	 * @returns Mongoose condition object keyed by the field path.
	 */
	addFilterToQuery (filter: KSAdminUiFilterForBooleanField): Record<string, unknown> {
		const query: Record<string, unknown> = {};
		if (!filter.value || filter.value === 'false') {
			query[this.path] = { $ne: true };
		} else {
			query[this.path] = true;
		}
		return query;
	}

	/**
	 * Synchronous validity check. When `required`, returns `true` only if the
	 * value equals `true` or the string `"true"`.
	 * @param data The submitted data object.
	 * @param required Whether to treat the field as required.
	 * @returns `true` when the input is acceptable.
	 */
	override inputIsValid (data: Record<string, unknown>, required?: boolean): boolean {
		if (required) {
			return (data[this.path] === true || data[this.path] === 'true') ? true : false;
		} else {
			return true;
		}
	}

	/**
	 * Sets the field to `true` or `false` on the document based on the submitted
	 * value. Skips the update if no value was provided.
	 * @param item The Mongoose document to update.
	 * @param data The submitted data object.
	 * @param callback Called when the update is complete.
	 */
	override updateItem (item: MongooseDocument, data: Record<string, unknown>, callback: () => void): void {
		const value = this.getValueFromData(data);
		if (typeof value === 'undefined') {
			return process.nextTick(callback);
		}
		if (!value || value === 'false') {
			if (item.get(this.path) !== false) {
				item.set(this.path, false);
			}
		} else if (!item.get(this.path)) {
			item.set(this.path, true);
		}
		process.nextTick(callback);
	}
}
BooleanType.prototype._nativeType = Boolean;
BooleanType.prototype._properties = ['indent'];
BooleanType.prototype._fixedSize = 'full';
BooleanType.prototype.defaults = { default: false };

export default BooleanType;

// ---------------------------------------------------------------------------
// Public-facing type exports for the Boolean field type (B1c)
// ---------------------------------------------------------------------------

/**
 * Admin-UI filter descriptor accepted by `BooleanType.prototype.addFilterToQuery`.
 * Truthy `value` (or the string `'true'`) filters for `true`; otherwise matches
 * documents where the field is not `true`.
 */
export interface KSAdminUiFilterForBooleanField {
	/**
	 * If truthy or `'true'`, filters for documents where the field is `true`.
	 * Otherwise filters for `false`, `null`, or `undefined` values.
	 */
	value?: boolean | string;
}

/**
 * Options bag for the Boolean field type constructor.
 */
export interface KeystoneFieldOptionsForBooleanType extends FieldOptionsBase {
	/**
	 * Indent the checkbox in the Admin UI form.
	 * Default: false.
	 */
	indent?: boolean;
	/**
	 * Default value for the field.
	 * Default: false.
	 */
	default?: boolean;
	/** Reserved for field registry use — binds this options bag to the Boolean type. */
	type?: unknown;
}

/**
 * Shape of a Boolean field instance (the object returned by `new boolean_(...)`).
 * Methods are inherited from the FieldType base class.
 */
export interface KeystoneFieldForBooleanType {
	/** The native JavaScript type constructor (Boolean). */
	_nativeType: BooleanConstructor;
	/** Properties exposed to the Admin UI (includes 'indent'). */
	_properties: string[];
	/** Fixed size for the field in the Admin UI. */
	_fixedSize: 'full';
	/** Whether the field is indented in the Admin UI. */
	indent: boolean;
	/** Field-specific options. */
	options: KeystoneFieldOptionsForBooleanType;
	/** The dot-separated field path on the schema. */
	path: string;
	/** Default values used by the FieldType base class. */
	defaults: { default: boolean };
	/**
	 * Validates that the submitted value is a boolean, number, string, null,
	 * or undefined — rejects any other type.
	 * @param data The submitted data object.
	 * @param callback Called with `true` when valid.
	 */
	validateInput(data: Record<string, unknown>, callback: (valid: boolean) => void): void;
	/**
	 * Validates that the submitted value is truthy and not the string `'false'`.
	 * @param item The existing document (unused by this implementation).
	 * @param data The submitted data object.
	 * @param callback Called with `true` when the value is considered truthy.
	 */
	validateRequiredInput(item: Record<string, unknown>, data: Record<string, unknown>, callback: (valid: boolean) => void): void;
	/**
	 * Converts a boolean filter descriptor to a Mongoose query condition.
	 * @param filter Filter descriptor from the Admin UI query.
	 * @returns Mongoose condition object keyed by the field path.
	 */
	addFilterToQuery(filter: KSAdminUiFilterForBooleanField): Record<string, unknown>;
	/**
	 * (Deprecated) Synchronous validity check. Prefer `validateInput`.
	 * @param data The submitted data object.
	 * @param required Whether the field is required.
	 * @returns `true` when the input is acceptable.
	 */
	inputIsValid(data: Record<string, unknown>, required?: boolean): boolean;
	/**
	 * Sets the field to `true` or `false` on the document based on the submitted
	 * value. Skips the update if no value was provided.
	 * @param item The Mongoose document to update.
	 * @param item.get Retrieves the current value at a dotted path (see implementation).
	 * @param item.set Assigns a value at a dotted path (see implementation).
	 * @param data The submitted data object.
	 * @param callback Called when the update is complete.
	 */
	updateItem(item: { get(path: string): unknown; set(path: string, value: unknown): void }, data: Record<string, unknown>, callback: () => void): void;
}

/**
 * Constructor type for the Boolean field type.
 */
export type KeystoneTypeConstructorForBooleanType = new(list: KeystoneList, path: string, options: KeystoneFieldOptionsForBooleanType) => KeystoneFieldForBooleanType;
