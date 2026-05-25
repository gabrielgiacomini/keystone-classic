import { FieldType } from '../Type.mjs';
import type { KeystoneList, FieldOptionsBase, MongooseDocument } from '../Type.mjs';
import type { KSAdminUiFilterForNumberField } from '../number/NumberType.mjs';
import NumberType from '../number/NumberType.mjs';
import { formatNumber } from '../../../lib/utils/numberFormat.mjs';

function formatUnknownFieldValue(value: unknown): unknown {
	if (value === null || value === undefined) return '';
	if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') return value;
	if (value instanceof Date) return value.toString();
	return Object.prototype.toString.call(value);
}

class MoneyType extends FieldType<KeystoneFieldOptionsForMoneyType, number> {
	/** Human-readable type name used by the Admin UI. */
	static readonly properName = 'Money';
	/** Technical type name used by Keystone internals. */
	static readonly typeName = 'money';

	declare _nativeType: NumberConstructor;
	declare _underscoreMethods: string[];
	declare _properties: string[];
	declare _fixedSize: 'small';

	/** The numeral.js format string in use, or `false` when formatting is disabled. */
	_formatString: string | false;

	constructor(list: KeystoneList, path: string, options: KeystoneFieldOptionsForMoneyType) {
		if (options.currency) {
			throw new Error('The currency option from money has been deprecated. Provide a formatString instead');
		}
		super(list, path, options);
		this._formatString = (options.format === false) ? false : (options.format ?? '$0,0.00');
		if (this._formatString && typeof this._formatString !== 'string') {
			throw new Error('FieldType.Money: options.format must be a string.');
		}
	}

	override format (item: MongooseDocument, format?: string): unknown {
		if (format || this._formatString) {
			const value = item.get(this.path);
			return (typeof value === 'number') ? formatNumber(value, format || this._formatString) : '';
		} else {
			const raw = item.get(this.path);
			return formatUnknownFieldValue(raw);
		}
	}

	/**
	 * Validates the submitted numeric value. Assigned from NumberType.prototype.
	 */
	declare validateInput: (data: Record<string, unknown>, callback: (result: boolean) => void) => void;
	/**
	 * Validates that a non-empty numeric value is present. Assigned from NumberType.prototype.
	 */
	declare validateRequiredInput: (item: MongooseDocument, data: Record<string, unknown>, callback: (result: boolean) => void) => void;
	/**
	 * Updates the item from submitted data. Assigned from NumberType.prototype.
	 */
	declare updateItem: (item: MongooseDocument, data: Record<string, unknown>, callback: () => void) => void;
	/**
	 * Returns false when the value is invalid for a required field. Assigned from NumberType.prototype.
	 */
	declare inputIsValid: (data: Record<string, unknown>, required?: boolean, item?: MongooseDocument) => boolean;
	/**
	 * Converts a filter descriptor into a Mongoose query condition. Assigned from NumberType.prototype.
	 */
	declare addFilterToQuery: (filter: KSAdminUiFilterForNumberField) => Record<string, unknown>;
}
MoneyType.prototype._nativeType = Number;
MoneyType.prototype._underscoreMethods = ['format'];
MoneyType.prototype._properties = ['currency'];
MoneyType.prototype._fixedSize = 'small';
// eslint-disable-next-line @typescript-eslint/unbound-method
MoneyType.prototype.validateInput = NumberType.prototype.validateInput;
// eslint-disable-next-line @typescript-eslint/unbound-method
MoneyType.prototype.validateRequiredInput = NumberType.prototype.validateRequiredInput;
// eslint-disable-next-line @typescript-eslint/unbound-method
MoneyType.prototype.updateItem = NumberType.prototype.updateItem;
// eslint-disable-next-line @typescript-eslint/unbound-method
MoneyType.prototype.inputIsValid = NumberType.prototype.inputIsValid;
// eslint-disable-next-line @typescript-eslint/unbound-method
MoneyType.prototype.addFilterToQuery = NumberType.prototype.addFilterToQuery;

export default MoneyType;

// ---------------------------------------------------------------------------
// Public-facing type exports for the Money field type (B1f)
// ---------------------------------------------------------------------------

// Re-export for consumers who import from this module directly.
export type { KSAdminUiFilterForNumberField } from '../number/NumberType.mjs';

/**
 * Options bag for the Money field type constructor.
 */
export interface KeystoneFieldOptionsForMoneyType extends FieldOptionsBase {
	/**
	 * Numeral.js format string (e.g. `'$0,0.00'`).
	 * Pass `false` to disable formatting entirely.
	 * Defaults to `'$0,0.00'`.
	 */
	format?: string | false;
	/** Reserved for field registry use — binds this options bag to the Money type. */
	type?: unknown;
}

/**
 * Minimal document shape for reading field values when formatting Money fields.
 * Matches Mongoose-style documents with a path-based `get` accessor.
 * @see fields/types/money/MoneyType.mts — runtime `MoneyType.prototype.format` / underscore `_.format`
 * @see {@link KeystoneFieldForMoneyType.format}
 */
export interface KeystoneMoneyFormatItem {
	get(path: string): unknown;
}

/**
 * Shape of a Money field instance (the object returned by `new money(...)`).
 * Validation and filter methods are inherited from NumberType via prototype assignment.
 */
export interface KeystoneFieldForMoneyType {
	/** The native JavaScript type constructor (Number). */
	_nativeType: NumberConstructor;
	/** Underscore methods added to documents (includes 'format'). */
	_underscoreMethods: string[];
	/** Field-specific options. */
	options: KeystoneFieldOptionsForMoneyType;
	/** The dot-separated field path on the schema. */
	path: string;
	/**
	 * Validates the submitted numeric value.
	 * Inherited from NumberType.
	 * @param data The submitted data object.
	 * @param callback Called with `true` when valid.
	 */
	validateInput(data: Record<string, unknown>, callback: (valid: boolean) => void): void;
	/**
	 * Validates that a non-empty numeric value is present.
	 * Inherited from NumberType.
	 * @param item The existing document being updated.
	 * @param data The submitted data object.
	 * @param callback Called with `true` when the required value is present.
	 */
	validateRequiredInput(item: Record<string, unknown>, data: Record<string, unknown>, callback: (valid: boolean) => void): void;
	/**
	 * Converts a filter descriptor into a Mongoose query condition.
	 * Inherited from NumberType.
	 * @param filter Filter descriptor from the Admin UI query.
	 * @returns Mongoose condition object keyed by the field path.
	 */
	addFilterToQuery(filter: KSAdminUiFilterForNumberField): Record<string, unknown>;
	/**
	 * Formats the stored numeric value using numeral.js.
	 * Exposed as the `_.format` underscore method.
	 * @param item The document containing the value.
	 * @param format Optional numeral.js format string to override the default.
	 * @returns The formatted currency string, or the raw value if no format is set.
	 */
	format(item: KeystoneMoneyFormatItem, format?: string): unknown;
}

/**
 * Constructor type for the Money field type.
 */
export type KeystoneTypeConstructorForMoneyType = new(list: KeystoneList, path: string, options: KeystoneFieldOptionsForMoneyType) => KeystoneFieldForMoneyType;
