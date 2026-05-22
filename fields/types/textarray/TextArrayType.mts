import { FieldType } from '../Type.mjs';
import type { KeystoneList, FieldOptionsBase, MongooseDocument } from '../Type.mjs';
import addPresenceToQuery from '../../utils/addPresenceToQuery.mjs';
import { defer } from '../../../lib/utils/async.mjs';
import { escapeRegExp } from '../../../lib/utils/regexp.mjs';

class TextArrayType extends FieldType<KeystoneFieldOptionsForTextArrayType, string[]> {
	/** Human-readable type name used by the Admin UI. */
	static readonly properName = 'TextArray';
	/** Technical type name used by Keystone internals. */
	static readonly typeName = 'textarray';

	declare _nativeType: [StringConstructor];
	declare _underscoreMethods: string[];

	/** Separator string used when joining array values for display. */
	separator: string;

	constructor(list: KeystoneList, path: string, options: KeystoneFieldOptionsForTextArrayType) {
		super(list, path, options);
		this.separator = options.separator ?? ' | ';
	}

	override format(item: MongooseDocument, separator?: string): string {
		return (item.get(this.path) as string[]).join(separator ?? this.separator);
	}

	addFilterToQuery(filter: KSAdminUiFilterForTextArrayField): Record<string, unknown> {
		const query: Record<string, unknown> = {};
		const presence = filter.presence ?? 'some';
		if (!filter.value) {
			query[this.path] = presence === 'some' ? { $size: 0 } : { $not: { $size: 0 } };
			return query;
		}
		let value: string | RegExp = escapeRegExp(filter.value);
		if (filter.mode === 'beginsWith') {
			value = '^' + value;
		} else if (filter.mode === 'endsWith') {
			value = value + '$';
		} else if (filter.mode === 'exactly') {
			value = '^' + value + '$';
		}
		value = new RegExp(value, filter.caseSensitive ? '' : 'i');
		if (presence === 'none') {
			query[this.path] = addPresenceToQuery(presence, value as unknown as Record<string, unknown>);
		} else {
			query[this.path] = addPresenceToQuery(presence, { $regex: value });
		}
		return query;
	}

	override validateInput(data: Record<string, unknown>, callback: (result: boolean) => void): void {
		let value = this.getValueFromData(data);
		let result = true;
		if (value !== undefined && value !== null && value !== '') {
			if (!Array.isArray(value)) value = [value];
			for (const val of value as unknown[]) {
				if (typeof val !== 'string') { result = false; break; }
			}
		}
		defer(callback, result);
	}

	override validateRequiredInput(item: MongooseDocument, data: Record<string, unknown>, callback: (result: boolean) => void): void {
		const value = this.getValueFromData(data);
		let result = false;
		if (value === undefined) {
			if ((item.get(this.path) as string[] | undefined)?.length) result = true;
		}
		if (typeof value === 'string') {
			if (value !== '') result = true;
		} else if (Array.isArray(value)) {
			let invalidContent = false;
			for (const val of value) {
				if (typeof val !== 'string' || val === '') { invalidContent = true; break; }
			}
			if (!invalidContent) result = true;
		}
		defer(callback, result);
	}

	override inputIsValid(data: Record<string, unknown>, required?: boolean, item?: MongooseDocument): boolean {
		const value = this.getValueFromData(data);
		if (required) {
			if (value === undefined && (item?.get(this.path) as string[] | undefined)?.length) return true;
			if (value === undefined || !Array.isArray(value) || (typeof value !== 'string') && (typeof value !== 'number')) return false;
			if ((value as unknown[]).length === 0) return false;
		}
		return (value === undefined || Array.isArray(value) || (typeof value === 'string') || (typeof value === 'number'));
	}

	override updateItem(item: MongooseDocument, data: Record<string, unknown>, callback: () => void): void {
		let value = this.getValueFromData(data);
		if (value === undefined || value === null || value === '') value = [];
		if (!Array.isArray(value)) value = [value];
		const normalized = (value as unknown[]).map(function (str: unknown) {
			if (!str) return str;
			if (typeof str === 'number' || typeof str === 'boolean' || typeof str === 'bigint') {
				str = String(str);
			} else if ((typeof str === 'object' || typeof str === 'function') && 'toString' in str) {
				str = (str as { toString(): string }).toString();
			}
			return str;
		}).filter(function (str: unknown) {
			return (typeof str === 'string' && str);
		}) as string[];
		item.set(this.path, normalized);
		process.nextTick(callback);
	}
}
TextArrayType.prototype._nativeType = [String];
TextArrayType.prototype._underscoreMethods = ['format'];

export default TextArrayType;

// ---------------------------------------------------------------------------
// Public-facing type exports for the TextArray field type (Phase 2)
// ---------------------------------------------------------------------------

/**
 * Admin-UI filter descriptor accepted by `TextArrayType.prototype.addFilterToQuery`.
 */
export interface KSAdminUiFilterForTextArrayField {
	/** Filter mode: 'beginsWith', 'endsWith', 'exactly', or substring (default). */
	mode?: string;
	/** The string value to filter by. */
	value?: string;
	/** Whether to perform a case-sensitive match. Default: false. */
	caseSensitive?: boolean;
	/** Presence mode: 'some', 'none', or 'every'. Default: 'some'. */
	presence?: string;
}

/**
 * Options bag for the TextArray field type constructor.
 */
export interface KeystoneFieldOptionsForTextArrayType extends FieldOptionsBase {
	/** Separator string used when joining array values for display. Default: ' | '. */
	separator?: string;
	/** Reserved for field registry use — binds this options bag to the TextArray type. */
	type?: unknown;
}

/**
 * Shape of a TextArray field instance (the class itself serves as the instance type).
 * Exported for backward compatibility with consumers that import this name.
 */
export type KeystoneFieldForTextArrayType = TextArrayType;

/**
 * Constructor type for the TextArray field type.
 */
export type KeystoneTypeConstructorForTextArrayType = new(list: KeystoneList, path: string, options: KeystoneFieldOptionsForTextArrayType) => TextArrayType;
