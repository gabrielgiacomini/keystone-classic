import * as mongoose from "mongoose";

/**
 * Base document type for all Keystone models.
 * Extends Mongoose Document with additional Keystone functionality.
 * @see /lib/list/list.js - Base list implementation
 */
export type KeystoneDocument<T = Record<string, any>> = mongoose.Document & T;

/**
 * Mongoose schema interface specifically for Keystone lists.
 * @see /lib/list/list.js - List schema implementation
 */
export interface KeystoneListSchema<
	T extends KeystoneDocument = KeystoneDocument
> extends mongoose.Schema<T> {
	/**
	 * Schema methods with properly typed `this` context.
	 * When methods are defined, TypeScript will know the correct type for `this` in method implementations.
	 * @example
	 * ```typescript
	 * interface UserDoc extends KeystoneDocument {
	 *   name: string;
	 *   email: string;
	 * }
	 *
	 * const userList = new keystone.List<UserDoc>('User', {
	 *   schema: {
	 *     methods: {
	 *       getDisplayName(this: UserDoc) {
	 *         return this.name; // TypeScript knows this.name exists
	 *       }
	 *     }
	 *   }
	 * });
	 * ```
	 */
	methods: { [methodName: string]: (this: T, ...args: any[]) => any };
}

// Forward declarations to avoid circular dependencies
export interface KeystoneList<T extends KeystoneDocument = KeystoneDocument> {}
export interface KeystoneField {}
export interface KeystoneFieldOptions {}

/**
 * Base interface for field type constructors.
 * @see /fields/types/Type.js - Base field type implementation
 */
export interface KeystoneTypeConstructor {
	/** Creates an instance of the field type. */
	new (
		list: KeystoneList<any>,
		path: string,
		options: KeystoneFieldOptions
	): KeystoneField;
	/** The prototype holds methods shared by field instances of this type. */
	prototype: KeystoneField;
	/** Canonical name of the field type (e.g., 'Text', 'Relationship'). Used internally. */
	properName?: string;
	/** Technical name (often JS class name, e.g., 'TextType'). Used for `list.fieldTypes`. */
	name?: string; // JS constructor name
}

/**
 * Represents an object defining one or more fields, potentially nested.
 * @see ./fields/types/Type.js
 */
export type KeystoneGroupFields = {
	[key: string]:
		| KeystoneFieldOptions
		| KeystoneTypeConstructor
		| StringConstructor
		| NumberConstructor
		| BooleanConstructor
		| DateConstructor
		| KeystoneGroupFields;
};

/**
 * Represents an object defining a heading in the Admin UI form.
 * @see ./fields/types/Type.js
 */
export interface KeystoneGroupHeading {
	/** The text of the heading. */
	heading: string;
	/** Control heading visibility in the Admin UI based on other field values. */
	dependsOn?: Record<string, any>;
	[key: string]: any;
}

// Forward declarations for circular dependencies are handled in their respective files
