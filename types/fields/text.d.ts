import { KeystoneDocument, KeystoneTypeConstructor } from "../core";
import { KeystoneField, KeystoneFieldOptions } from "../field";
import { KSAdminUiFilterForTextField } from "../filters";

/**
 * Field options specific to Text fields.
 * @see /fields/types/text/TextType.js - Text field implementation
 */
export interface KeystoneFieldOptionsForTextType extends KeystoneFieldOptions {
	/** Minimum length allowed. Validates on save. */
	min?: number;
	/** Maximum length allowed. Validates on save. */
	max?: number;
	/** Render input using a monospace font in Admin UI. */
	monospace?: boolean;
	/** Ensure type is specifically Text or String. */
	type: KeystoneTypeConstructorForTextType | StringConstructor;
}

/**
 * Text field instance interface.
 * @see /fields/types/text/TextType.js - Text field implementation
 */
export interface KeystoneFieldForTextType extends KeystoneField {
	/** The native JavaScript type constructor (String). */
	_nativeType: StringConstructor;
	/** Properties exposed to Admin UI (includes 'monospace'). */
	_properties: string[];
	/** Underscore methods added to documents (includes 'crop'). */
	_underscoreMethods: string[];
	/** Field-specific options. */
	options: KeystoneFieldOptionsForTextType;

	/**
	 * Validates input string length based on min/max options.
	 * @param data Input data.
	 * @param callback Receives `(isValid: boolean)`.
	 */
	validateInput(data: any, callback: (valid: boolean) => void): void;

	/**
	 * Validates required text input. Checks for non-empty strings.
	 * @param item Existing item data.
	 * @param data Input data.
	 * @param callback Receives `(isValid: boolean)`.
	 */
	validateRequiredInput(
		item: any,
		data: any,
		callback: (valid: boolean) => void
	): void;

	/**
	 * Adds text-specific filtering logic to a Mongoose query.
	 * Supports 'exactly', 'beginsWith', 'endsWith', 'contains' (default) modes,
	 * case sensitivity, and inversion.
	 * @param filter The filter definition.
	 * @returns A Mongoose query condition object.
	 */
	addFilterToQuery(filter: KSAdminUiFilterForTextField): Record<string, any>;

	/**
	 * Crops the field's string value from an item to the specified length.
	 * Exposed as `item._.fieldPath.crop(...)`.
	 * @param item The Keystone document.
	 * @param length The target length.
	 * @param append String to append if cropped (defaults to '...').
	 * @param preserveWords If true, doesn't cut words in half.
	 * @returns The cropped string.
	 */
	crop(
		item: KeystoneDocument,
		length: number,
		append?: string,
		preserveWords?: boolean
	): string;
}

/**
 * Text field type constructor interface.
 * @see /fields/types/text/TextType.js - Text field constructor
 */
export interface KeystoneTypeConstructorForTextType
	extends KeystoneTypeConstructor {
	new (
		list: any,
		path: string,
		options: KeystoneFieldOptionsForTextType
	): KeystoneFieldForTextType;
	prototype: KeystoneFieldForTextType;
	properName: "Text";
}
