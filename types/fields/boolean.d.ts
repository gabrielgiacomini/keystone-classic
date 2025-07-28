import { KeystoneTypeConstructor } from "../core";
import { KeystoneField, KeystoneFieldOptions } from "../field";
import { KSAdminUiFilterForBooleanField } from "../filters";

/**
 * Field options specific to Boolean fields.
 * @see /fields/types/boolean/BooleanType.js - Boolean field implementation
 */
export interface KeystoneFieldOptionsForBooleanType
	extends KeystoneFieldOptions {
	/**
	 * Indent the checkbox in the Admin UI form.
	 * Default: false
	 */
	indent?: boolean;
	/**
	 * Default value for the field.
	 * Default: false
	 */
	default?: boolean;
	/** Ensure type is specifically Boolean. */
	type: KeystoneTypeConstructorForBooleanType | BooleanConstructor;
}

/**
 * Boolean field instance interface.
 * @see /fields/types/boolean/BooleanType.js - Boolean field implementation
 */
export interface KeystoneFieldForBooleanType extends KeystoneField {
	/** The native JavaScript type constructor (Boolean). */
	_nativeType: BooleanConstructor;
	/** Properties exposed to Admin UI (includes 'indent'). */
	_properties: string[];
	/** Fixed size for the field in the Admin UI. */
	_fixedSize: "full";
	/** Whether the field is indented in the Admin UI. */
	indent: boolean;
	/** Field-specific options. */
	options: KeystoneFieldOptionsForBooleanType;
	/** Default values for the Boolean type. */
	defaults: { default: boolean };

	/**
	 * Validates that the input is valid for a boolean value (boolean, string, number, null, undefined).
	 * @param data Input data.
	 * @param callback Receives `(isValid: boolean)`.
	 */
	validateInput(data: any, callback: (valid: boolean) => void): void;

	/**
	 * Validates required input. Considers truthy values or non-'false' strings as valid.
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
	 * Updates the item, coercing input to `true` or `false`. Sets only if the value changes.
	 * @param item The Mongoose document to update.
	 * @param data The input data object.
	 * @param callback Called after update attempt. Receives `(error?: Error)`.
	 */
	updateItem(item: any, data: any, callback: (err?: Error) => void): void;

	/**
	 * (Deprecated) Synchronously checks input for a boolean value.
	 * @param data Input data.
	 * @param required Whether the field is required.
	 * @returns Whether the input is valid.
	 * @deprecated Use validateInput or validateRequiredInput instead.
	 */
	inputIsValid(data: any, required?: boolean): boolean;

	/**
	 * Adds boolean-specific filtering logic to a Mongoose query.
	 * Filters for `true` or `{$ne: true}` (false or null/undefined) based on the filter value.
	 * @param filter The filter definition.
	 * @returns A Mongoose query condition object.
	 */
	addFilterToQuery(filter: KSAdminUiFilterForBooleanField): Record<string, any>;
}

/**
 * Boolean field type constructor interface.
 * @see /fields/types/boolean/BooleanType.js - Boolean field constructor
 */
export interface KeystoneTypeConstructorForBooleanType
	extends KeystoneTypeConstructor {
	new (
		list: any,
		path: string,
		options: KeystoneFieldOptionsForBooleanType
	): KeystoneFieldForBooleanType;
	prototype: KeystoneFieldForBooleanType;
	properName: "Boolean";
}
