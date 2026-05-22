import { FieldType } from '../Type.mjs';
import type { KeystoneList, FieldOptionsBase, MongooseDocument } from '../Type.mjs';
import type { KSAdminUiFilterForTextField } from '../text/TextType.mjs';
import TextType from '../text/TextType.mjs';

/**
 * Stores a URL as a plain string. Extends FieldType with a `format` method
 * that strips the protocol prefix by default. Validation and filter logic are
 * delegated to TextType.
 *
 * @param list The Keystone List this field belongs to.
 * @param path The dot-separated field path on the schema.
 * @param options Field configuration (may include `format`).
 */
class UrlType extends FieldType<KeystoneFieldOptionsForUrlType, string> {
	/** Human-readable type name used by the Admin UI. */
	static readonly properName = 'Url';
	/** Technical type name used by Keystone internals. */
	static readonly typeName = 'url';

	declare _nativeType: StringConstructor;
	declare _underscoreMethods: string[];

	/**
	 * Converts a filter descriptor into a Mongoose query condition.
	 * Assigned from TextType.prototype at the bottom of this file.
	 */
	declare addFilterToQuery: (filter: KSAdminUiFilterForTextField) => Record<string, unknown>;

	/**
	 * Formats the stored URL value. When `options.format` is `false`, returns the
	 * raw value. When it is a function, applies it. Otherwise strips the protocol
	 * prefix (e.g. `https://`).
	 * Exposed as the `_.format` underscore method.
	 * @param item The document containing the value.
	 * @returns The formatted URL string.
	 */
	override format (item: MongooseDocument): string {
		const value = (item.get(this.path) as string | undefined) || '';
		if (this.options.format === false) {
			return value;
		} else if (typeof this.options.format === 'function') {
			return this.options.format(value);
		} else {
			return removeProtocolPrefix(value);
		}
	}
}
UrlType.prototype._nativeType = String;
UrlType.prototype._underscoreMethods = ['format'];
// eslint-disable-next-line @typescript-eslint/unbound-method
UrlType.prototype.validateInput = TextType.prototype.validateInput;
// eslint-disable-next-line @typescript-eslint/unbound-method
UrlType.prototype.validateRequiredInput = TextType.prototype.validateRequiredInput;
// eslint-disable-next-line @typescript-eslint/unbound-method
UrlType.prototype.addFilterToQuery = TextType.prototype.addFilterToQuery;

function removeProtocolPrefix(urlStr: string): string {
	return urlStr.replace(/^[a-zA-Z]+\:\/\//, '');
}

export default UrlType;

// ---------------------------------------------------------------------------
// Public-facing type exports for the Url field type (B1e)
// ---------------------------------------------------------------------------

// Re-export for consumers who import from this module directly.
export type { KSAdminUiFilterForTextField } from '../text/TextType.mjs';

/**
 * Options bag for the Url field type constructor.
 */
export interface KeystoneFieldOptionsForUrlType extends FieldOptionsBase {
	/**
	 * Custom formatter for the URL value. Pass `false` to suppress protocol
	 * stripping, or a function `(value: string) => string` for a custom transform.
	 * Default behaviour strips the protocol prefix (e.g. `https://`).
	 */
	format?: false | ((value: string) => string);
	/** Reserved for field registry use — binds this options bag to the Url type. */
	type?: unknown;
}

/**
 * Shape of a Url field instance (the object returned by `new url(...)`).
 * Validation and filter methods are inherited from TextType via prototype assignment.
 */
export interface KeystoneFieldForUrlType {
	/** The native JavaScript type constructor (String). */
	_nativeType: StringConstructor;
	/** Underscore methods added to documents (includes 'format'). */
	_underscoreMethods: string[];
	/** Field-specific options. */
	options: KeystoneFieldOptionsForUrlType;
	/** The dot-separated field path on the schema. */
	path: string;
	/**
	 * Validates the submitted string value.
	 * Inherited from TextType.
	 * @param data The submitted data object.
	 * @param callback Called with `true` when valid.
	 */
	validateInput(data: Record<string, unknown>, callback: (valid: boolean) => void): void;
	/**
	 * Validates that a non-empty value is present.
	 * Inherited from TextType.
	 * @param item The existing document being updated.
	 * @param data The submitted data object.
	 * @param callback Called with `true` when the required value is present.
	 */
	validateRequiredInput(item: Record<string, unknown>, data: Record<string, unknown>, callback: (valid: boolean) => void): void;
	/**
	 * Converts a filter descriptor into a Mongoose query condition.
	 * Inherited from TextType.
	 * @param filter Filter descriptor from the Admin UI query.
	 * @returns Mongoose condition object keyed by the field path.
	 */
	addFilterToQuery(filter: KSAdminUiFilterForTextField): Record<string, unknown>;
	/**
	 * Formats the stored URL, optionally stripping the protocol prefix.
	 * Exposed as the `_.format` underscore method.
	 * @param item The document containing the value.
	 * @param item.get Reads the value at a dot-separated field path.
	 * @returns The formatted URL string.
	 */
	format(item: { get(path: string): unknown }): string;
}

/**
 * Constructor type for the Url field type.
 */
export type KeystoneTypeConstructorForUrlType = new(list: KeystoneList, path: string, options: KeystoneFieldOptionsForUrlType) => KeystoneFieldForUrlType;
