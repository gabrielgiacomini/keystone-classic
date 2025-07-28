import { KeystoneDocument, KeystoneTypeConstructor } from "../core";
import { KeystoneField, KeystoneFieldOptions } from "../field";
import { KSAdminUiFilterForNumberField } from "../filters";

/**
 * Field options specific to Number fields.
 * @see /fields/types/number/NumberType.js - Number field implementation
 */
export interface KeystoneFieldOptionsForNumberType
	extends KeystoneFieldOptions {
	/**
	 * Numeral.js format string (e.g., '0,0.00', '$0,0.00') or `false` to disable formatting.
	 * See http://numeraljs.com/ for format options.
	 * Default: '0,0[.][000000000000]'
	 */
	format?: string | false;
	/** Ensure type is specifically Number. */
	type: KeystoneTypeConstructorForNumberType | NumberConstructor;
}

/**
 * Number field instance interface.
 * @see /fields/types/number/NumberType.js - Number field implementation
 */
export interface KeystoneFieldForNumberType extends KeystoneField {
	/** The native JavaScript type constructor (Number). */
	_nativeType: NumberConstructor;
	/** Fixed size for the field in the Admin UI. */
	_fixedSize: "small";
	/** Underscore methods added to documents (includes 'format'). */
	_underscoreMethods: string[];
	/** Field-specific options. */
	options: KeystoneFieldOptionsForNumberType;
	/** The numeral.js format string to use, or false if formatting is disabled. */
	formatString?: string | false;

	/**
	 * Validates that the input is a valid number or can be converted to one. Empty strings are considered valid.
	 * @param data Input data.
	 * @param callback Receives `(isValid: boolean)`.
	 */
	validateInput(data: any, callback: (valid: boolean) => void): void;

	/**
	 * Validates required number input. Checks for the presence of a numeric value.
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
	 * Updates the item with a valid number value, or null if the input is invalid.
	 * @param item The Mongoose document to update.
	 * @param data The input data object.
	 * @param callback Called after update attempt. Receives `(error?: Error)`.
	 */
	updateItem(item: any, data: any, callback: (err?: Error) => void): void;

	/**
	 * (Deprecated) Synchronously checks if input data for the field is a valid number.
	 * @param data Input data.
	 * @param required Whether the field is required.
	 * @param item Optional Mongoose document for context.
	 * @returns Whether the input is valid.
	 * @deprecated Use validateInput or validateRequiredInput instead.
	 */
	inputIsValid(data: any, required?: boolean, item?: any): boolean;

	/**
	 * Adds number-specific filtering logic to a Mongoose query.
	 * Supports 'equals', 'between', 'gt', 'lt' modes, and inversion.
	 * @param filter The filter definition.
	 * @returns A Mongoose query condition object.
	 */
	addFilterToQuery(filter: KSAdminUiFilterForNumberField): Record<string, any>;

	/**
	 * Formats the field's numeric value using numeral.js.
	 * Exposed as `item._.fieldPath.format(...)`.
	 * @param item The Keystone document.
	 * @param format Optional numeral.js format string (overrides field option).
	 * @returns The formatted string, or an empty string for non-numeric values (except 0).
	 */
	format(item: KeystoneDocument, format?: string): string;
}

/**
 * Number field type constructor interface.
 * @see /fields/types/number/NumberType.js - Number field constructor
 */
export interface KeystoneTypeConstructorForNumberType
	extends KeystoneTypeConstructor {
	new (
		list: any,
		path: string,
		options: KeystoneFieldOptionsForNumberType
	): KeystoneFieldForNumberType;
	prototype: KeystoneFieldForNumberType;
	properName: "Number";
}
