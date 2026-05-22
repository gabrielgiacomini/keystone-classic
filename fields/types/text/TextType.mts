import { FieldType } from '../Type.mjs';
import type { KeystoneList, FieldOptionsBase, MongooseDocument } from '../Type.mjs';
import { defer } from '../../../lib/utils/async.mjs';
import { escapeRegExp } from '../../../lib/utils/regexp.mjs';
import { cropString } from '../../../lib/utils/string.mjs';

/**
 * Stores and manages single-line plain text. Supports optional `min`/`max`
 * character-length validation and exposes a `crop` underscore method for
 * truncating the stored value in templates.
 *
 * @param list The Keystone List this field belongs to.
 * @param path The dot-separated field path on the schema.
 * @param options Field configuration (may include `min`, `max`, `monospace`).
 */
class TextType extends FieldType<KeystoneFieldOptionsForTextType, string> {
	/** Human-readable type name used by the Admin UI. */
	static readonly properName = 'Text';
	/** Technical type name used by Keystone internals. */
	static readonly typeName = 'text';

	declare _nativeType: StringConstructor;
	declare _properties: string[];
	declare _underscoreMethods: string[];

	/**
	 * Validates that the submitted value is a string and, if configured, within
	 * the `min`/`max` length bounds.
	 * @param data The submitted data object.
	 * @param callback Called with `true` when valid.
	 */
	override validateInput (data: Record<string, unknown>, callback: (result: boolean) => void): void {
		const max = this.options.max;
		const min = this.options.min;
		const value = this.getValueFromData(data);
		let result = value === undefined || value === null || typeof value === 'string';
		if (max && typeof value === 'string') {
			result = value.length < max;
		}
		if (min && typeof value === 'string') {
			result = value.length > min;
		}
		defer(callback, result);
	}

	/**
	 * Validates that a non-empty value is present in `data` or already on `item`.
	 * @param item The existing document being updated.
	 * @param data The submitted data object.
	 * @param callback Called with `true` when the required value is present.
	 */
	override validateRequiredInput (item: MongooseDocument, data: Record<string, unknown>, callback: (result: boolean) => void): void {
		const value = this.getValueFromData(data);
		let result = !!value;
		if (value === undefined && item.get(this.path)) {
			result = true;
		}
		defer(callback, result);
	}

	/**
	 * Converts a filter descriptor into a Mongoose query condition for this field.
	 * Supports modes: `beginsWith`, `endsWith`, `exactly`, and substring (default),
	 * with optional case-sensitivity and inversion.
	 * @param filter Filter descriptor from the admin UI query.
	 * @returns Mongoose condition object keyed by the field path.
	 */
	addFilterToQuery (filter: KSAdminUiFilterForTextField): Record<string, unknown> {
		const query: Record<string, unknown> = {};
		if (filter.mode === 'exactly' && !filter.value) {
			query[this.path] = filter.inverted ? { $nin: ['', null] } : { $in: ['', null] };
			return query;
		}
		let value: string | RegExp = escapeRegExp(filter.value ?? '');
		if (filter.mode === 'beginsWith') {
			value = '^' + value;
		} else if (filter.mode === 'endsWith') {
			value = value + '$';
		} else if (filter.mode === 'exactly') {
			value = '^' + value + '$';
		}
		value = new RegExp(value, filter.caseSensitive ? '' : 'i');
		query[this.path] = filter.inverted ? { $not: value } : value;
		return query;
	}

	/**
	 * Truncates the stored value to `length` characters, appending `append` if
	 * the string was shortened. Exposed as the `_.crop` underscore method.
	 * @param item The document containing the value.
	 * @param length Maximum character length.
	 * @param append String to append when truncated (e.g. `'…'`).
	 * @param preserveWords When true, avoids breaking mid-word.
	 * @returns The (possibly truncated) string.
	 */
	crop (item: MongooseDocument, length: number, append?: string, preserveWords?: boolean): string {
		return cropString(item.get(this.path), length, append, preserveWords);
	}
}
TextType.prototype._nativeType = String;
TextType.prototype._properties = ['monospace'];
TextType.prototype._underscoreMethods = ['crop'];

export default TextType;

// ---------------------------------------------------------------------------
// Public-facing type exports for the Text field type (B1c)
// ---------------------------------------------------------------------------

/**
 * Admin-UI filter descriptor accepted by `TextType.prototype.addFilterToQuery`.
 * Supports substring, prefix, suffix, and exact-match modes with optional
 * case-sensitivity and inversion.
 */
export interface KSAdminUiFilterForTextField {
	/**
	 * Filter mode. Defaults to substring ('contains') if omitted.
	 * - 'exactly': Exact string match
	 * - 'beginsWith': String starts with value
	 * - 'endsWith': String ends with value
	 * - Any other string: treated as substring / contains (default when omitted).
	 */
	mode?: string;
	/** The string value to filter by. */
	value?: string;
	/** Perform a case-sensitive match. Default: false (case-insensitive). */
	caseSensitive?: boolean;
	/** Invert the filter logic. Default: false. */
	inverted?: boolean;
}

/**
 * Options bag for the Text field type constructor.
 */
export interface KeystoneFieldOptionsForTextType extends FieldOptionsBase {
	/** Minimum character length; validated on save. */
	min?: number;
	/** Maximum character length; validated on save. */
	max?: number;
	/** Render input using a monospace font in the Admin UI. */
	monospace?: boolean;
	/** Reserved for field registry use — binds this options bag to the Text type. */
	type?: unknown;
}

/**
 * Shape of a Text field instance (the object returned by `new text(...)`).
 * Methods are inherited from the FieldType base class.
 */
export interface KeystoneFieldForTextType {
	/** The native JavaScript type constructor (String). */
	_nativeType: StringConstructor;
	/** Properties exposed to the Admin UI (includes 'monospace'). */
	_properties: string[];
	/** Underscore methods added to documents (includes 'crop'). */
	_underscoreMethods: string[];
	/** Field-specific options. */
	options: KeystoneFieldOptionsForTextType;
	/** The dot-separated field path on the schema. */
	path: string;
	/**
	 * Validates input string length based on `min`/`max` options.
	 * @param data The submitted data object.
	 * @param callback Called with `true` when valid.
	 */
	validateInput(data: Record<string, unknown>, callback: (valid: boolean) => void): void;
	/**
	 * Validates that a non-empty value is present.
	 * @param item The existing document being updated.
	 * @param data The submitted data object.
	 * @param callback Called with `true` when the required value is present.
	 */
	validateRequiredInput(item: Record<string, unknown>, data: Record<string, unknown>, callback: (valid: boolean) => void): void;
	/**
	 * Converts a filter descriptor into a Mongoose query condition.
	 * @param filter Filter descriptor from the Admin UI query.
	 * @returns Mongoose condition object keyed by the field path.
	 */
	addFilterToQuery(filter: KSAdminUiFilterForTextField): Record<string, unknown>;
	/**
	 * Truncates the stored value to `length` characters.
	 * Exposed as the `_.crop` underscore method.
	 * @param item The document containing the value.
	 * @param item.get Reads the value at a dot-separated field path.
	 * @param length Maximum character length.
	 * @param append String to append when truncated.
	 * @param preserveWords When true, avoids breaking mid-word.
	 * @returns The (possibly truncated) string.
	 */
	crop(item: { get(path: string): unknown }, length: number, append?: string, preserveWords?: boolean): string;
}

/**
 * Constructor type for the Text field type.
 */
export type KeystoneTypeConstructorForTextType = new(list: KeystoneList, path: string, options: KeystoneFieldOptionsForTextType) => KeystoneFieldForTextType;
