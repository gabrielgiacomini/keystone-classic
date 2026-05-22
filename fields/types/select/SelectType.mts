import { FieldType } from '../Type.mjs';
import type { MongooseDocument, KeystoneList, KeystoneDocument, KeystoneField, KeystoneTypeConstructor, FieldOptionsBase } from '../Type.mjs';
import { inspect } from 'node:util';
import { defer } from '../../../lib/utils/async.mjs';
import { number } from '../../../lib/utils/number.mjs';
import { optionsMap } from '../../../lib/utils/optionsMap.mjs';
import { keyToLabel } from '../../../lib/utils/string.mjs';
import type { Schema } from 'mongoose';

// ---------------------------------------------------------------------------
// Value-type alias
// ---------------------------------------------------------------------------

/** Union of the two native types a Select field can store. */
export type SelectValue = string | number;

// ---------------------------------------------------------------------------
// Internal implementation types (not exported)
// ---------------------------------------------------------------------------

/** A single normalised option entry produced by the constructor. */
interface SelectOp {
	value: SelectValue;
	label: string;
	[key: string]: unknown;
}

function isObject(value: unknown): value is Record<string, unknown> {
	return value !== null && (typeof value === 'object' || typeof value === 'function');
}

function isNumber(value: unknown): boolean {
	return typeof value === 'number' || value instanceof Number;
}

// ---------------------------------------------------------------------------
// Public options interface (generic on TValue)
// ---------------------------------------------------------------------------

/**
 * Options accepted by the Select field constructor.
 *
 * @template TValue  The literal-union type of acceptable values.
 *                   Inferred from `options` when callers use `as const`.
 *
 * @example
 * // TValue narrows to 'draft' | 'published'
 * const spec: KeystoneFieldOptionsForSelectType<'draft' | 'published'> = {
 *   options: ['draft', 'published'] as const,
 *   default: 'draft',
 * };
 */
export interface KeystoneFieldOptionsForSelectType<TValue extends SelectValue = SelectValue>
	extends FieldOptionsBase {
	/** Available choices: discriminated-tuple values, option objects, or a legacy comma-separated string. */
	options: readonly TValue[] | readonly { value: TValue; label: string }[] | string;
	/** Store the selected value as a Number instead of a String. Default: false */
	numeric?: boolean;
	/** Include a blank/empty option in the UI. Default: true */
	emptyOption?: boolean;
	/** Admin UI rendering style ('select' or 'radio'). Default: 'select' */
	ui?: string;
	/** Path for the 'data' virtual property. Default: path + 'Data' */
	dataPath?: string;
	/** Path for the 'label' virtual property. Default: path + 'Label' */
	labelPath?: string;
	/** Path for the 'options' virtual property. Default: path + 'Options' */
	optionsPath?: string;
	/** Path for the 'map' virtual property. Default: path + 'OptionsMap' */
	optionsMapPath?: string;
	/** Default value when none is provided; must be one of the accepted TValues. */
	default?: TValue;
}

// ---------------------------------------------------------------------------
// Helper: normalise options array
// ---------------------------------------------------------------------------

/**
 * Mutates the raw `options` bag so that `options.options` is always a
 * `(string | SelectOp)[]`.  Accepts a comma-separated string for
 * backward-compatibility.
 *
 * The `options.options` type here is widened to `unknown` because at runtime
 * the caller may pass a plain string before we convert it.
 * @param options - The raw options bag to normalise.
 */
function normalizeSelectOptions(options: KeystoneFieldOptionsForSelectType): void {
	const raw = options.options as unknown;
	if (typeof raw === 'string') {
		(options as { options: unknown }).options = (raw as string).split(',');
	}
	if (!Array.isArray(options.options)) {
		throw new Error('Select fields require an options array.');
	}
	options.emptyOption = options.emptyOption ?? true;
}

// ---------------------------------------------------------------------------
// Main class
// ---------------------------------------------------------------------------

/**
 * Select field type.  Stores one of a fixed set of string or numeric values.
 *
 * The `TValue` generic narrows the `options` array element type and the
 * `default` value type at call sites that supply `as const` options arrays.
 */
class SelectType<TValue extends SelectValue = SelectValue>
	extends FieldType<KeystoneFieldOptionsForSelectType<TValue>, TValue> {

	/** Human-readable type name used by the Admin UI. */
	static readonly properName = 'Select';
	/** Technical type name used by Keystone internals. */
	static readonly typeName = 'select';

	// Instance members set by the constructor / ensureSelectState.
	ui!: string;
	numeric!: boolean;
	declare _nativeType: NumberConstructor | StringConstructor;
	declare _underscoreMethods: string[];
	declare _properties: string[];
	ops!: SelectOp[];
	emptyOption!: boolean;
	map!: Record<SelectValue, SelectOp>;
	labels!: Record<SelectValue, string>;
	values!: SelectValue[];

	/** Virtual-property paths set in addToSchema. */
	paths!: {
		data: string;
		label: string;
		options: string;
		map: string;
	};

	constructor(list: KeystoneList, path: string, options: KeystoneFieldOptionsForSelectType<TValue>) {
		normalizeSelectOptions(options as KeystoneFieldOptionsForSelectType);
		super(list, path, options);
		this.ensureState();
	}

	private ensureState(): void {
		const options = this.options;
		this.ui = options.ui ?? 'select';
		this.numeric = options.numeric ? true : false;
		this._nativeType = options.numeric ? Number : String;
		this._underscoreMethods = ['format', 'pluck'];
		this._properties = ['ops', 'numeric'];

		// The options array has been normalised to an array by normalizeSelectOptions.
		// Elements are either scalar values (string | number) or {value, label} objects.
		const optionValues = options.options as unknown as (SelectValue | SelectOp)[];
		this.ops = optionValues.map((i: SelectValue | SelectOp): SelectOp => {
			let op: SelectOp;
			if (typeof i === 'string' || typeof i === 'number') {
				op = { value: String(i).trim(), label: keyToLabel(String(i)) };
			} else if (isObject(i) && 'value' in i) {
				op = i as SelectOp;
			} else {
				const fallback = inspect(i);
				op = { label: fallback, value: fallback };
			}
			if (options.numeric && !isNumber(op.value)) {
				op.value = Number(op.value);
			}
			return op;
		});
		this.emptyOption = options.emptyOption ?? true;
		this.map = optionsMap(this.ops) as Record<SelectValue, SelectOp>;
		this.labels = optionsMap(this.ops, 'label') as Record<SelectValue, string>;
		this.values = this.ops.map(op => op.value);
	}

	override addToSchema(schema: Schema): void {
		this.ensureState();
		const field = this;
		this.paths = {
			data: this.options.dataPath ?? this.path + 'Data',
			label: this.options.labelPath ?? this.path + 'Label',
			options: this.options.optionsPath ?? this.path + 'Options',
			map: this.options.optionsMapPath ?? this.path + 'OptionsMap',
		};
		schema.path(this.path, Object.assign({}, this.options, {
			type: this._nativeType,
			enum: this.values,
			set: function (val: SelectValue | null | false | undefined): SelectValue | undefined {
				return (val === '' || val === null || val === false) ? undefined : val;
			},
		}));
		schema.virtual(this.paths.data).get(function (this: MongooseDocument) {
			return field.map[field.getDocumentValue(this)];
		});
		schema.virtual(this.paths.label).get(function (this: MongooseDocument) {
			return field.labels[field.getDocumentValue(this)];
		});
		schema.virtual(this.paths.options).get(function () {
			return field.ops;
		});
		schema.virtual(this.paths.map).get(function () {
			return field.map;
		});
		this.bindUnderscoreMethods();
	}

	/**
	 * Read the stored value from a mongoose document.
	 * @param doc - The Mongoose document.
	 * @returns The stored select value.
	 */
	private getDocumentValue(doc: MongooseDocument): SelectValue {
		return doc.get(this.path) as SelectValue;
	}

	pluck(item: MongooseDocument, property: string, _default: unknown): unknown {
		const option = item.get(this.paths.data) as SelectOp | undefined;
		return option ? option[property] : _default;
	}

	cloneOps(): SelectOp[] {
		return this.ops.map(op => Object.assign({}, op));
	}

	cloneMap(): Record<string, unknown> {
		return optionsMap(this.ops, true) as Record<string, unknown>;
	}

	addFilterToQuery(filter: KSAdminUiFilterForSelectField): Record<string, unknown> {
		const query: Record<string, unknown> = {};
		let value: SelectValue[];
		if (!Array.isArray(filter.value)) {
			value = filter.value != null ? [filter.value] : [];
		} else {
			value = filter.value;
		}
		if (value.length > 1) {
			query[this.path] = filter.inverted ? { $nin: value } : { $in: value };
		} else if (value.length === 1) {
			query[this.path] = filter.inverted ? { $ne: value[0] } : value[0];
		} else {
			query[this.path] = filter.inverted ? { $nin: ['', null] } : { $in: ['', null] };
		}
		return query;
	}

	override validateInput(data: Record<string, unknown>, callback: (result: boolean) => void): void {
		let value = this.getValueFromData(data);
		if (typeof value === 'string' && this.numeric) {
			value = number(value);
		}
		const v = value as SelectValue | undefined | null;
		const result = v === undefined || v === null || v === '' || (v in this.map);
		defer(callback, result);
	}

	override validateRequiredInput(item: MongooseDocument, data: Record<string, unknown>, callback: (result: boolean) => void): void {
		const value = this.getValueFromData(data);
		let result = false;
		if (value === undefined) {
			if (item.get(this.path)) {
				result = true;
			}
		} else if (value) {
			if (value !== '' && (value as SelectValue) in this.map) {
				result = true;
			}
		}
		defer(callback, result);
	}

	override inputIsValid(data: Record<string, unknown>, required?: boolean, item?: MongooseDocument): boolean {
		if (data[this.path]) {
			return (data[this.path] as SelectValue) in this.map;
		} else {
			return !required || (!(this.path in data) && !!item?.get(this.path));
		}
	}

	override format(item: MongooseDocument): string {
		return this.labels[this.getDocumentValue(item)] ?? '';
	}
}

export default SelectType;

// ---------------------------------------------------------------------------
// Public type exports
// ---------------------------------------------------------------------------

/** A single normalised option entry for a Select field (public alias). */
export type KeystoneFieldSelectableOption = SelectOp;

/** Filter object passed to addFilterToQuery for Select fields. */
export interface KSAdminUiFilterForSelectField {
	/** The value(s) to filter by. */
	value?: SelectValue | SelectValue[];
	/** Invert the filter logic. Default: false */
	inverted?: boolean;
}

/** Shape of a Select field instance (backward-compat alias). */
export interface KeystoneFieldForSelectType extends KeystoneField {
	ui: string;
	numeric: boolean;
	_nativeType: StringConstructor | NumberConstructor;
	_underscoreMethods: string[];
	_properties: string[];
	ops: KeystoneFieldSelectableOption[];
	emptyOption: boolean;
	map: Record<SelectValue, KeystoneFieldSelectableOption>;
	labels: Record<SelectValue, string>;
	values: SelectValue[];
	options: KeystoneFieldOptionsForSelectType;
	paths: {
		data: string;
		label: string;
		options: string;
		map: string;
	};
	addToSchema(schema: Schema): void;
	addFilterToQuery(filter: KSAdminUiFilterForSelectField): Record<string, unknown>;
	format(item: KeystoneDocument): string;
	validateInput(data: Record<string, unknown>, callback: (valid: boolean) => void): void;
	validateRequiredInput(item: KeystoneDocument, data: Record<string, unknown>, callback: (valid: boolean) => void): void;
	inputIsValid(data: Record<string, unknown>, required?: boolean, item?: KeystoneDocument): boolean;
}

/** Constructor type for Select fields (backward-compat). */
export interface KeystoneTypeConstructorForSelectType extends KeystoneTypeConstructor {
	new (
		list: KeystoneList,
		path: string,
		options: KeystoneFieldOptionsForSelectType
	): KeystoneFieldForSelectType;
	prototype: KeystoneFieldForSelectType;
	properName: 'Select';
}
