import bcrypt from 'bcryptjs';
import { FieldType } from '../Type.mjs';
import type { KeystoneList, FieldOptionsBase, MongooseDocument } from '../Type.mjs';
import { defer } from '../../../lib/utils/async.mjs';
import zxcvbn from 'zxcvbn';

const regexChunk: Record<string, RegExp> = {
	digitChar: /\d/,
	spChar: /[!@#\$%\^&\*()\+]/,
	asciiChar: /^[ -~]+$/,
	lowChar: /[a-z]/,
	upperChar: /[A-Z]/,
};
const detailMsg: Record<string, string> = {
	digitChar: 'enter at least one digit',
	spChar: 'enter at least one special character',
	asciiChar: 'only ASCII characters are allowed',
	lowChar: 'use at least one lower case character',
	upperChar: 'use at least one upper case character',
};
const defaultOptions = { min: 8, max: 72, workFactor: 10, rejectCommon: true };

/**
 * Stores a bcrypt-hashed password. Validates complexity (length, character
 * classes, common-password rejection) before hashing on save. Returns `true`/
 * `false` from `getData` rather than exposing the hash. Exposes `format` and
 * `compare` underscore methods.
 *
 * @param list The Keystone List this field belongs to.
 * @param path The dot-separated field path on the schema.
 * @param options Field configuration; may include `min`, `max`, `workFactor`,
 *                `rejectCommon`, and a `complexity` map of character-class flags.
 */
class PasswordType extends FieldType<KeystoneFieldOptionsForPasswordType, string> {
	/** Human-readable type name used by the Admin UI. */
	static readonly properName = 'Password';
	/** Technical type name used by Keystone internals. */
	static readonly typeName = 'password';

	declare _nativeType: StringConstructor;
	declare _underscoreMethods: string[];
	declare _fixedSize: 'full';

	/** Derived paths: `confirm` and `hash`. Set in `addToSchema`. */
	paths!: { confirm: string; hash: string };


	constructor(list: KeystoneList, path: string, options: KeystoneFieldOptionsForPasswordType) {
		const mergedOptions = Object.assign({}, defaultOptions, options, { nosort: false }) as KeystoneFieldOptionsForPasswordType;
		super(list, path, mergedOptions);
		if (this.options.complexity) {
			for (const key in this.options.complexity) {
				if ({}.hasOwnProperty.call(this.options.complexity, key)) {
					if (key in regexChunk !== key in this.options.complexity) {
						throw new Error('FieldType.Password: options.complexity - option does not exist.');
					}
					const complexityKey = key as keyof PasswordComplexityOptions;
					if (typeof this.options.complexity[complexityKey] !== 'boolean') {
						throw new Error('FieldType.Password: options.complexity - Value must be boolean.');
					}
				}
			}
		}
		if (this.options.max && this.options.max < (this.options.min ?? 0)) {
			throw new Error('FieldType.Password: options - maximum password length cannot be less than the minimum length.');
		}
	}

	/**
	 * Registers the field on the Mongoose schema. Adds the hashed-password path, a
	 * `_hash` virtual setter (bypasses bcrypt), and a pre-save hook that bcrypt-
	 * hashes new plaintext values.
	 * @param schema The Mongoose Schema to extend.
	 */
	override addToSchema(schema: import('mongoose').Schema): void {
		const field = this;
		const needs_hashing = '__' + field.path + '_needs_hashing';
		this.paths = {
			confirm: this.options.confirmPath ?? this.path + '_confirm',
			hash: this.options.hashPath ?? this.path + '_hash',
		};
		schema.path(this.path, {
			...this.options,
			type: String,
			set: function (this: MongooseDocument & Record<string, boolean>, newValue: string): string {
				this[needs_hashing] = true;
				return newValue;
			},
		});
		schema.virtual(this.paths.hash).set(function (this: MongooseDocument & Record<string, boolean>, newValue: string): void {
			this.set(field.path, newValue);
			this[needs_hashing] = false;
		});
		schema.pre('save', function (this: MongooseDocument & Record<string, boolean>, next: (err?: Error) => void): void {
			if (!this.isModified(field.path) || !this[needs_hashing]) {
				return next();
			}
			if (!this.get(field.path)) {
				this.set(field.path, undefined);
				this[needs_hashing] = false;
				return next();
			}
			const item = this;
			bcrypt.genSalt(field.options.workFactor ?? 10, function (err: Error | null, salt: string): void {
				if (err) return next(err);
				bcrypt.hash(item.get(field.path) as string, salt, function (hashErr: Error | null, hash: string): void {
					if (hashErr) return next(hashErr);
					item.set(field.path, hash);
					item[needs_hashing] = false;
					next();
				});
			});
		});
		this.bindUnderscoreMethods();
	}

	/**
	 * Builds a Mongoose query condition based on password existence.
	 * @param filter - Filter descriptor for matching documents by stored hash presence.
	 * @param filter.exists - Whether the password hash must exist.
	 *
	 * @returns Mongoose condition object keyed by the field path.
	 */
	addFilterToQuery(filter: { exists?: boolean }): Record<string, unknown> {
		const query: Record<string, unknown> = {};
		query[this.path] = (filter.exists) ? { $ne: null } : null;
		return query;
	}

	/**
	 * Returns `true` if a password hash is stored on the item, `false` otherwise.
	 * Never exposes the raw hash.
	 * @param item The Mongoose document to inspect.
	 */
	override getData(item: MongooseDocument): string {
		// Returns boolean semantics (typed as string to satisfy TValue=string; callers treat truthy/falsy)
		return item.get(this.path) ? 'true' : '';
	}

	/**
	 * Returns a random-length string of asterisks when a hash is stored, or an
	 * empty string if no password is set. Never reveals the hash or its length.
	 * @param item The Mongoose document to format.
	 */
	override format(item: MongooseDocument): string {
		if (!item.get(this.path)) return '';
		const len = Math.round(Math.random() * 4) + 6;
		let stars = '';
		for (let i = 0; i < len; i++) stars += '*';
		return stars;
	}

	/**
	 * Compares a candidate plaintext password against the stored bcrypt hash.
	 * @param item The Mongoose document containing the stored hash.
	 * @param candidate The plaintext password to test.
	 * @param callback Node-style callback called with `(null, true)` on match or
	 *                 `(null, false)` when the stored hash is empty.
	 */
	compare(item: MongooseDocument, candidate: string, callback: (err: Error | null, matched: boolean) => void): void {
		if (typeof callback !== 'function') throw new Error('Password.compare() requires a callback function.');
		const value = item.get(this.path);
		if (!value) return callback(null, false);
		bcrypt.compare(candidate, item.get(this.path) as string, callback);
	}

	/**
	 * Validates the submitted password and confirmation against all complexity
	 * rules. Calls `callback(false, detailMessage)` when invalid.
	 * @param data The submitted data object.
	 * @param callback Called with validity flag and detail message.
	 */
	override validateInput(data: Record<string, unknown>, callback: (valid: boolean, detail?: string) => void): void {
		const { min, max, complexity, rejectCommon } = this.options;
		const confirmValue = this.getValueFromData(data, '_confirm');
		const passwordValue = this.getValueFromData(data);
		const validation = validate(passwordValue, confirmValue, min ?? 8, max ?? 72, complexity, rejectCommon ?? true);
		defer(callback, validation.result, validation.detail);
	}

	/**
	 * Validates that a password value or pre-hashed value is present in `data`,
	 * or that `item` already has a stored hash.
	 * @param item The existing document being updated.
	 * @param data The submitted data object.
	 * @param callback Called with `true` when a value is present.
	 */
	override validateRequiredInput(item: MongooseDocument, data: Record<string, unknown>, callback: (valid: boolean) => void): void {
		const hashValue = this.getValueFromData(data, '_hash');
		const passwordValue = this.getValueFromData(data);
		let result = hashValue || passwordValue ? true : false;
		if (!result && passwordValue === undefined && hashValue === undefined && item.get(this.path)) result = true;
		defer(callback, result);
	}

	/**
	 * Synchronous validity check. If both the password and confirmation are
	 * present they must match. When `required`, at least a new value or existing
	 * hash must be present.
	 * @param data The submitted data object.
	 * @param required Whether the field is required.
	 * @param item The existing document checked as a fallback.
	 * @returns `true` when the input is acceptable.
	 */
	override inputIsValid(data: Record<string, unknown>, required?: boolean, item?: MongooseDocument): boolean {
		if (data[this.path] && this.paths.confirm in data) {
			return data[this.path] === data[this.paths.confirm] ? true : false;
		}
		if (data[this.path] || data[this.paths.hash] || (item?.get(this.path))) return true;
		return required ? false : true;
	}

	/**
	 * Sets the password plaintext (will be hashed on save) or the pre-hashed
	 * value (via `paths.hash`) on the document.
	 * @param item The Mongoose document to update.
	 * @param data The submitted data object.
	 * @param callback Called when the update is complete.
	 */
	override updateItem(item: MongooseDocument, data: Record<string, unknown>, callback: () => void): void {
		const hashValue = this.getValueFromData(data, '_hash');
		const passwordValue = this.getValueFromData(data);
		if (passwordValue !== undefined) {
			item.set(this.path, passwordValue);
		} else if (hashValue !== undefined) {
			item.set(this.paths.hash, hashValue);
		}
		process.nextTick(callback);
	}
}
PasswordType.prototype._nativeType = String;
PasswordType.prototype._underscoreMethods = ['format', 'compare'];
PasswordType.prototype._fixedSize = 'full';

const validate = function (pass: unknown, confirm: unknown, min: number, max: number, complexity: PasswordComplexityOptions | undefined, rejectCommon: boolean): { result: boolean; detail: string } {
	const messages: string[] = [];
	if (confirm !== undefined && pass !== confirm) {
		messages.push('Passwords must match.');
	}
	if (min && typeof pass === 'string' && pass.length < min) {
		messages.push('Password must be longer than ' + min + ' characters.');
	}
	if (max && typeof pass === 'string' && pass.length > max) {
		messages.push('Password must not be longer than ' + max + ' characters.');
	}
	if (complexity) {
		for (const prop in complexity) {
			const complexityKey = prop as keyof PasswordComplexityOptions;
			const checker = regexChunk[prop];
			const detail = detailMsg[prop];
			if (checker && complexity[complexityKey] && typeof pass === 'string') {
				if (!checker.test(pass)) {
					if (detail) messages.push(detail);
				}
			}
		}
	}
	if (pass && typeof pass === 'string' && rejectCommon && zxcvbn(pass).score < 2) {
		messages.push('Password must not be a common, frequently-used password.');
	}
	return { result: messages.length === 0, detail: messages.join(' \n') };
};

// Expose validate as a static method for external callers
(PasswordType as unknown as { validate: typeof validate }).validate = validate;

export default PasswordType;

// ---------------------------------------------------------------------------
// Public-facing type exports for the Password field type (B1f)
// ---------------------------------------------------------------------------

/** Complexity rules for the Password field type. */
export interface PasswordComplexityOptions {
	/** Require at least one digit. */
	digitChar?: boolean;
	/** Require at least one special character (!@#$%^&*()+). */
	spChar?: boolean;
	/** Restrict to ASCII characters only. */
	asciiChar?: boolean;
	/** Require at least one lowercase character. */
	lowChar?: boolean;
	/** Require at least one uppercase character. */
	upperChar?: boolean;
}

/**
 * Options bag for the Password field type constructor.
 */
export interface KeystoneFieldOptionsForPasswordType extends FieldOptionsBase {
	/** Minimum password length (default: 8). */
	min?: number;
	/** Maximum password length (default: 72). */
	max?: number;
	/** bcrypt work factor (default: 10). */
	workFactor?: number;
	/** Whether to reject commonly used passwords (default: true). */
	rejectCommon?: boolean;
	/** Map of character-class complexity flags. */
	complexity?: PasswordComplexityOptions;
	/** Path to store the confirmation field (defaults to `path + '_confirm'`). */
	confirmPath?: string;
	/** Path to store/accept the pre-hashed value (defaults to `path + '_hash'`). */
	hashPath?: string;
	/** Reserved for field registry use — binds this options bag to the Password type. */
	type?: unknown;
}

/**
 * Shape of a Password field instance (the class itself serves as the instance type).
 * Exported for backward compatibility with consumers that import this name.
 */
export type KeystoneFieldForPasswordType = PasswordType;

/**
 * Constructor type for the Password field type.
 */
export type KeystoneTypeConstructorForPasswordType = new(list: KeystoneList, path: string, options: KeystoneFieldOptionsForPasswordType) => PasswordType;
