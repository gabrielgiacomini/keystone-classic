import { FieldType } from '../Type.mjs';
import type { KeystoneList, FieldOptionsBase, MongooseDocument } from '../Type.mjs';
import type { KSAdminUiFilterForTextField } from '../text/TextType.mjs';
import TextType from '../text/TextType.mjs';
import { slug } from '../../../lib/utils/string.mjs';

/**
 * Stores a URL-safe key/slug string. Automatically converts values to slugs
 * using the configured separator. Validation and filter logic are delegated to
 * TextType.
 *
 * @param list The Keystone List this field belongs to.
 * @param path The dot-separated field path on the schema.
 * @param options Field configuration (may include `separator`).
 */
class KeyType extends FieldType<KeystoneFieldOptionsForKeyType, string> {
	/** Human-readable type name used by the Admin UI. */
	static readonly properName = 'Key';
	/** Technical type name used by Keystone internals. */
	static readonly typeName = 'key';

	/** The separator character used when generating the key slug. */
	separator: string;

	declare _nativeType: StringConstructor;
	declare _defaultSize: 'medium';

	/**
	 * Converts a filter descriptor into a Mongoose query condition.
	 * Assigned from TextType.prototype at the bottom of this file.
	 */
	declare addFilterToQuery: (filter: KSAdminUiFilterForTextField) => Record<string, unknown>;

	constructor(list: KeystoneList, path: string, options: KeystoneFieldOptionsForKeyType) {
		super(list, path, options);
		this.separator = options.separator || '-';
	}

	/**
	 * Generates a URL-safe key slug from the given string using the configured separator.
	 * @param str The input string to convert.
	 * @returns The generated slug string.
	 */
	generateKey (str: string): string {
		return slug(str, this.separator);
	}

	/**
	 * Synchronous validity check. When `required`, the submitted or item data
	 * must produce a non-empty slug.
	 * @param data The submitted data object.
	 * @param required Whether the field is required.
	 * @param item The existing document checked as a fallback.
	 * @returns `true` when the value produces a valid slug (or the field is not
	 *          required); `false` when required and no valid slug can be generated.
	 */
	override inputIsValid (data: Record<string, unknown>, required?: boolean, item?: MongooseDocument): boolean {
		const raw = this.getValueFromData(data);
		if (raw === undefined && item?.get(this.path)) {
			return true;
		}
		const generatedSlug = typeof raw === 'string' ? this.generateKey(raw) : '';
		return (generatedSlug || !required) ? true : false;
	}

	/**
	 * Writes the generated key slug to the document.
	 * @param item The Mongoose document to update.
	 * @param data The submitted data object.
	 * @param callback Called when the update is complete.
	 */
	override updateItem (item: MongooseDocument, data: Record<string, unknown>, callback: () => void): void {
		const raw = this.getValueFromData(data);
		if (raw === undefined) {
			process.nextTick(callback);
			return;
		}
		const value = typeof raw === 'string' ? this.generateKey(raw) : '';
		if (item.get(this.path) !== value) {
			item.set(this.path, value);
		}
		process.nextTick(callback);
	}
}
KeyType.prototype._nativeType = String;
KeyType.prototype._defaultSize = 'medium';
// eslint-disable-next-line @typescript-eslint/unbound-method
KeyType.prototype.addFilterToQuery = TextType.prototype.addFilterToQuery;
// eslint-disable-next-line @typescript-eslint/unbound-method
KeyType.prototype.validateInput = TextType.prototype.validateInput;
// eslint-disable-next-line @typescript-eslint/unbound-method
KeyType.prototype.validateRequiredInput = TextType.prototype.validateRequiredInput;

export default KeyType;

// ---------------------------------------------------------------------------
// Public-facing type exports for the Key field type (B1e)
// ---------------------------------------------------------------------------

// Re-export for consumers who import from this module directly.
export type { KSAdminUiFilterForTextField } from '../text/TextType.mjs';

/**
 * Options bag for the Key field type constructor.
 */
export interface KeystoneFieldOptionsForKeyType extends FieldOptionsBase {
	/**
	 * The separator character used when generating the key slug.
	 * Default: '-'.
	 */
	separator?: string;
	/** Reserved for field registry use — binds this options bag to the Key type. */
	type?: unknown;
}

/**
 * Shape of a Key field instance (the object returned by `new key(...)`).
 * Validation and filter methods are inherited from TextType via prototype assignment.
 */
export interface KeystoneFieldForKeyType {
	/** The native JavaScript type constructor (String). */
	_nativeType: StringConstructor;
	/** Default Admin UI column size ('medium'). */
	_defaultSize: string;
	/** The separator character used for slug generation. */
	separator: string;
	/** Field-specific options. */
	options: KeystoneFieldOptionsForKeyType;
	/** The dot-separated field path on the schema. */
	path: string;
	/**
	 * Converts a filter descriptor into a Mongoose query condition.
	 * Inherited from TextType.
	 * @param filter Filter descriptor from the Admin UI query.
	 * @returns Mongoose condition object keyed by the field path.
	 */
	addFilterToQuery(filter: KSAdminUiFilterForTextField): Record<string, unknown>;
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
	 * Generates a URL-safe key slug from the given string using the configured separator.
	 * @param str The input string to convert.
	 * @returns The generated slug string.
	 */
	generateKey(str: string): string;
	/**
	 * Synchronous validity check. When `required`, the submitted or item data
	 * must produce a non-empty slug.
	 * @param data The submitted data object.
	 * @param required Whether the field is required.
	 * @param item The existing document checked as a fallback.
	 * @returns `true` when the input is acceptable.
	 */
	inputIsValid(data: Record<string, unknown>, required?: boolean, item?: Record<string, unknown>): boolean;
	/**
	 * Writes the generated key slug to the document.
	 * @param item The Mongoose document to update.
	 * @param data The submitted data object.
	 * @param callback Called when the update is complete.
	 */
	updateItem(item: Record<string, unknown>, data: Record<string, unknown>, callback: () => void): void;
}

/**
 * Constructor type for the Key field type.
 */
export type KeystoneTypeConstructorForKeyType = new(list: KeystoneList, path: string, options: KeystoneFieldOptionsForKeyType) => KeystoneFieldForKeyType;
