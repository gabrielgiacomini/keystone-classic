import { FieldType } from '../Type.mjs';
import type { KeystoneList, FieldOptionsBase } from '../Type.mjs';
import type { KSAdminUiFilterForTextField } from '../text/TextType.mjs';
import TextType from '../text/TextType.mjs';

/**
 * Stores a CSS colour value as a plain string. Validation and filter logic
 * are delegated to TextType. The Admin UI renders a colour picker.
 *
 * @param list The Keystone List this field belongs to.
 * @param path The dot-separated field path on the schema.
 * @param options Field configuration passed through to `FieldType`.
 */
class ColorType extends FieldType<KeystoneFieldOptionsForColorType, string> {
	/** Human-readable type name used by the Admin UI. */
	static readonly properName = 'Color';
	/** Technical type name used by Keystone internals. */
	static readonly typeName = 'color';

	declare _nativeType: StringConstructor;

	/**
	 * Converts a filter descriptor into a Mongoose query condition.
	 * Assigned from TextType.prototype at the bottom of this file.
	 */
	declare addFilterToQuery: (filter: KSAdminUiFilterForTextField) => Record<string, unknown>;
}
ColorType.prototype._nativeType = String;
// eslint-disable-next-line @typescript-eslint/unbound-method
ColorType.prototype.validateInput = TextType.prototype.validateInput;
// eslint-disable-next-line @typescript-eslint/unbound-method
ColorType.prototype.validateRequiredInput = TextType.prototype.validateRequiredInput;
// eslint-disable-next-line @typescript-eslint/unbound-method
ColorType.prototype.addFilterToQuery = TextType.prototype.addFilterToQuery;

export default ColorType;

// ---------------------------------------------------------------------------
// Public-facing type exports for the Color field type (B1e)
// ---------------------------------------------------------------------------

// Re-export for consumers who import from this module directly.
export type { KSAdminUiFilterForTextField } from '../text/TextType.mjs';

/**
 * Options bag for the Color field type constructor.
 */
export interface KeystoneFieldOptionsForColorType extends FieldOptionsBase {
	/** Reserved for field registry use — binds this options bag to the Color type. */
	type?: unknown;
}

/**
 * Shape of a Color field instance (the object returned by `new color(...)`).
 * Validation and filter methods are inherited from TextType via prototype assignment.
 */
export interface KeystoneFieldForColorType {
	/** The native JavaScript type constructor (String). */
	_nativeType: StringConstructor;
	/** Field-specific options. */
	options: KeystoneFieldOptionsForColorType;
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
}

/**
 * Constructor type for the Color field type.
 */
export type KeystoneTypeConstructorForColorType = new(list: KeystoneList, path: string, options: KeystoneFieldOptionsForColorType) => KeystoneFieldForColorType;
