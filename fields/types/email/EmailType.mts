import crypto from 'node:crypto';
import { FieldType } from '../Type.mjs';
import type { KeystoneList, FieldOptionsBase, MongooseDocument } from '../Type.mjs';
import type { KSAdminUiFilterForTextField } from '../text/TextType.mjs';
import TextType from '../text/TextType.mjs';
import { defer } from '../../../lib/utils/async.mjs';
import { isEmail } from '../../../lib/utils/email.mjs';

/**
 * Stores an email address as a lower-cased string. Validates RFC-style email
 * format on input. Exposes a `gravatarUrl` underscore method that returns the
 * Gravatar image URL for the stored address.
 *
 * @param list The Keystone List this field belongs to.
 * @param path The dot-separated field path on the schema.
 * @param options Field configuration passed through to `FieldType`.
 */
class EmailType extends FieldType<KeystoneFieldOptionsForEmailType, string> {
	/** Human-readable type name used by the Admin UI. */
	static readonly properName = 'Email';
	/** Technical type name used by Keystone internals. */
	static readonly typeName = 'email';

	declare _nativeType: StringConstructor;
	declare _underscoreMethods: string[];
	declare typeDescription: string;

	/**
	 * Converts a filter descriptor into a Mongoose query condition.
	 * Assigned from TextType.prototype at the bottom of this file.
	 */
	declare addFilterToQuery: (filter: KSAdminUiFilterForTextField) => Record<string, unknown>;

	/**
	 * Builds a Gravatar URL for the email stored on `item`.
	 * @param item The document containing the email value.
	 * @param size Image size in pixels (1–2048; defaults to 80).
	 * @param defaultImage Fallback image URL or Gravatar default key (e.g. `'identicon'`).
	 * @param rating Maximum content rating (`'g'`, `'pg'`, `'r'`, `'x'`; defaults to `'g'`).
	 * @returns The Gravatar URL, or an empty string if the stored value is not a string.
	 */
	gravatarUrl (item: MongooseDocument, size: string, defaultImage: string, rating: string): string {
		const value = item.get(this.path);
		if (typeof value !== 'string') {
			return '';
		}
		return [
			'//www.gravatar.com/avatar/',
			crypto.createHash('md5').update(value.toLowerCase().trim()).digest('hex'),
			'?s=' + (/^(?:[1-9]\d{0,2}|1\d{3}|20[0-3]\d|204[0-8])$/.test(size) ? size : 80),
			'&d=' + (defaultImage ? encodeURIComponent(defaultImage) : 'identicon'),
			'&r=' + (/^(?:g|pg|r|x)$/i.test(rating) ? rating.toLowerCase() : 'g'),
		].join('');
	}

	/**
	 * Validates that the submitted value is a valid email address (or absent).
	 * @param data The submitted data object.
	 * @param callback Called with `true` when valid.
	 */
	override validateInput (data: Record<string, unknown>, callback: (result: boolean) => void): void {
		const input = this.getValueFromData(data);
		const result = input === undefined || input === null || input === ''
			? true
			: (typeof input === 'string' && isEmail(input));
		defer(callback, result);
	}

	/**
	 * Synchronous validity check. Returns `false` when a value is present but
	 * not a valid email. When `required` and no value is provided, checks the
	 * existing item value.
	 * @param data The submitted data object.
	 * @param required Whether the field is required.
	 * @param item The existing document, checked when `data` has no value.
	 * @returns `true` when the input is acceptable.
	 */
	override inputIsValid (data: Record<string, unknown>, required?: boolean, item?: MongooseDocument): boolean {
		const value = this.getValueFromData(data);
		if (typeof value === 'string' && value) {
			return isEmail(value);
		} else {
			return (!required || (item?.get(this.path) ? true : false)) ? true : false;
		}
	}

	/**
	 * Lower-cases the submitted email value and saves it to the document if it
	 * differs from the current stored value.
	 * @param item The Mongoose document to update.
	 * @param data The submitted data object.
	 * @param callback Called when the update is complete.
	 */
	override updateItem (item: MongooseDocument, data: Record<string, unknown>, callback: () => void): void {
		let newValue = this.getValueFromData(data);
		if (typeof newValue === 'string') {
			newValue = newValue.toLowerCase();
		}
		if (newValue !== undefined && newValue !== item.get(this.path)) {
			item.set(this.path, newValue);
		}
		process.nextTick(callback);
	}
}
EmailType.prototype._nativeType = String;
EmailType.prototype._underscoreMethods = ['gravatarUrl'];
EmailType.prototype.typeDescription = 'email address';
// eslint-disable-next-line @typescript-eslint/unbound-method
EmailType.prototype.addFilterToQuery = TextType.prototype.addFilterToQuery;
// eslint-disable-next-line @typescript-eslint/unbound-method
EmailType.prototype.validateRequiredInput = TextType.prototype.validateRequiredInput;

export default EmailType;

// ---------------------------------------------------------------------------
// Public-facing type exports for the Email field type (B1f)
// ---------------------------------------------------------------------------

// Re-export for consumers who import from this module directly.
export type { KSAdminUiFilterForTextField } from '../text/TextType.mjs';

/**
 * Options bag for the Email field type constructor.
 */
export interface KeystoneFieldOptionsForEmailType extends FieldOptionsBase {
	/** Reserved for field registry use — binds this options bag to the Email type. */
	type?: unknown;
}

/**
 * Shape of an Email field instance (the object returned by `new email(...)`).
 * Validation and filter methods are inherited from TextType via prototype assignment.
 */
export interface KeystoneFieldForEmailType {
	/** The native JavaScript type constructor (String). */
	_nativeType: StringConstructor;
	/** Underscore methods added to documents (includes 'gravatarUrl'). */
	_underscoreMethods: string[];
	/** Human-readable description of this field type. */
	typeDescription: string;
	/** Field-specific options. */
	options: KeystoneFieldOptionsForEmailType;
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
	 * Builds a Gravatar URL for the email stored on `item`.
	 * Exposed as the `_.gravatarUrl` underscore method.
	 * @param item The document containing the email value.
	 * @param item.get Method to retrieve a value at a given path from the document.
	 * @param size Image size in pixels (1–2048; defaults to 80).
	 * @param defaultImage Fallback image URL or Gravatar default key.
	 * @param rating Maximum content rating ('g', 'pg', 'r', 'x'; defaults to 'g').
	 * @returns The Gravatar URL, or an empty string if the value is not a string.
	 */
	gravatarUrl(item: { get(path: string): unknown }, size: string, defaultImage: string, rating: string): string;
	/**
	 * Validates that the submitted value is a valid email address (or absent).
	 * @param data The submitted data object.
	 * @param callback Called with `true` when valid.
	 */
	validateInput(data: Record<string, unknown>, callback: (result: boolean) => void): void;
	/**
	 * Validates that a non-empty value is present.
	 * Inherited from TextType.
	 * @param item The existing document being updated.
	 * @param data The submitted data object.
	 * @param callback Called with `true` when the required value is present.
	 */
	validateRequiredInput(item: Record<string, unknown>, data: Record<string, unknown>, callback: (valid: boolean) => void): void;
	/**
	 * Synchronous validity check — returns `false` when a value is present but
	 * not a valid email.
	 * @param data The submitted data object.
	 * @param required Whether the field is required.
	 * @param item The existing document, checked when `data` has no value.
	 * @returns `true` when the input is acceptable.
	 */
	inputIsValid(data: Record<string, unknown>, required?: boolean, item?: Record<string, unknown>): boolean;
	/**
	 * Lower-cases the submitted email value and saves it to the document.
	 * @param item The Mongoose document to update.
	 * @param item.get Retrieves the current value at a dotted path (see implementation).
	 * @param item.set Assigns a value at a dotted path (see implementation).
	 * @param data The submitted data object.
	 * @param callback Called when the update is complete.
	 */
	updateItem(item: { get(path: string): unknown; set(path: string, value: unknown): void }, data: Record<string, unknown>, callback: () => void): void;
}

/**
 * Constructor type for the Email field type.
 */
export type KeystoneTypeConstructorForEmailType = new(list: KeystoneList, path: string, options: KeystoneFieldOptionsForEmailType) => KeystoneFieldForEmailType;
