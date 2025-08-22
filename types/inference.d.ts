import * as mongoose from "mongoose";
import {
	KeystoneDocument,
	KeystoneTypeConstructor,
	KeystoneGroupFields,
} from "./core";
import { KeystoneFieldOptions } from "./field";
import {
	KeystoneRelationshipFieldValue,
	KeystoneFieldOptionsForRelationshipType,
} from "./fields/relationship";

// =============================================================================
// TYPE INFERENCE FOR KEYSTONE FIELD DEFINITIONS WITH HEADINGS SUPPORT
// =============================================================================

/**
 * Helper type to identify heading objects vs field definitions.
 * Heading objects have a required 'heading' property.
 */
type IsHeadingObject<T> = T extends { heading: string } ? true : false;

/**
 * Filter out heading objects from a mixed fields object, keeping only actual field definitions.
 */
type FilterFieldsOnly<T extends Record<string, any>> = {
	[K in keyof T]: IsHeadingObject<T[K]> extends true ? never : T[K];
};

/**
 * Remove never values from an object type (cleanup after filtering).
 */
type RemoveNeverValues<T> = {
	[K in keyof T as T[K] extends never ? never : K]: T[K];
};

/**
 * Extract only the actual field definitions from a mixed object that may contain headings.
 */
type ExtractFieldDefinitions<T extends Record<string, any>> = RemoveNeverValues<
	FilterFieldsOnly<T>
>;

// =============================================================================
// ARRAY-BASED FIELD DEFINITIONS (FOR .add() METHOD WORKFLOW)
// =============================================================================

/**
 * Represents a single item in a Keystone field definition array.
 * Can be a heading string, heading object, or field definitions object.
 */
export type KeystoneFieldArrayItem =
	| string // Simple heading like 'User', 'Permissions'
	| import("./core").KeystoneGroupHeading // Heading object with options
	| Record<
			string,
			| KeystoneFieldOptions
			| KeystoneTypeConstructor
			| StringConstructor
			| NumberConstructor
			| BooleanConstructor
			| DateConstructor
	  >; // Field definitions object

/**
 * Array of mixed field definitions and headings, as used with List.add() method.
 * This represents the complete UI structure including sections and fields.
 */
export type KeystoneFieldDefinitionArray = readonly KeystoneFieldArrayItem[];

/**
 * Extract only field definition objects from a KeystoneFieldDefinitionArray.
 * Filters out strings and heading objects, keeping only field definitions.
 */
type ExtractFieldObjectsFromArray<T extends readonly KeystoneFieldArrayItem[]> =
	{
		[K in keyof T]: T[K] extends string
			? never
			: T[K] extends import("./core").KeystoneGroupHeading
			? never
			: T[K] extends Record<string, any>
			? T[K]
			: never;
	};

/**
 * Utility type to convert union types to intersection types.
 * This helps merge multiple field objects into a single combined object.
 */
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
	k: infer I
) => void
	? I
	: never;

/**
 * Remove never values from a tuple type.
 */
type RemoveNeverFromTuple<T extends readonly any[]> = {
	[K in keyof T]: T[K] extends never ? {} : T[K];
};

/**
 * Merge multiple field definition objects into a single object.
 * Takes an array of field objects and combines them into one.
 */
type MergeFieldObjects<T extends readonly any[]> = UnionToIntersection<
	RemoveNeverFromTuple<T>[number]
>;

/**
 * Convert a KeystoneFieldDefinitionArray to a single merged field definitions object.
 * This extracts all field definitions and combines them, ready for type inference.
 */
export type ArrayToFieldDefinitions<T extends KeystoneFieldDefinitionArray> =
	MergeFieldObjects<ExtractFieldObjectsFromArray<T>> extends Record<string, any>
		? MergeFieldObjects<ExtractFieldObjectsFromArray<T>>
		: Record<string, any>;

/**
 * Infer document type from a KeystoneFieldDefinitionArray.
 * This is the main type for the array-based workflow.
 */
export type InferKeystoneDocumentFromArray<
	TArray extends KeystoneFieldDefinitionArray,
	TRefDocuments extends Record<string, KeystoneDocument> = Record<
		string,
		KeystoneDocument
	>
> = InferKeystoneDocumentFromFields<
	ArrayToFieldDefinitions<TArray>,
	TRefDocuments
>;

/**
 * Maps Keystone field types to their corresponding TypeScript types.
 */
type KeystoneFieldTypeToTSType<
	TFieldDef,
	TRefDocuments extends Record<string, KeystoneDocument> = Record<
		string,
		KeystoneDocument
	>
> =
	// Handle relationship fields
	TFieldDef extends { type: any; ref: infer TRef; many: true }
		? TRef extends keyof TRefDocuments
			? KeystoneRelationshipFieldValue<true, TRefDocuments[TRef]>
			: KeystoneRelationshipFieldValue<true, KeystoneDocument>
		: TFieldDef extends { type: any; ref: infer TRef }
		? TRef extends keyof TRefDocuments
			? KeystoneRelationshipFieldValue<false, TRefDocuments[TRef]>
			: KeystoneRelationshipFieldValue<false, KeystoneDocument>
		: // Handle native JS constructors
		TFieldDef extends { type: StringConstructor }
		? string
		: TFieldDef extends { type: NumberConstructor }
		? number
		: TFieldDef extends { type: BooleanConstructor }
		? boolean
		: TFieldDef extends { type: DateConstructor }
		? Date
		: // Handle direct constructor assignment (shorthand)
		TFieldDef extends StringConstructor
		? string
		: TFieldDef extends NumberConstructor
		? number
		: TFieldDef extends BooleanConstructor
		? boolean
		: TFieldDef extends DateConstructor
		? Date
		: // Default fallback for Keystone field types
		TFieldDef extends { type: KeystoneTypeConstructor }
		? any
		: TFieldDef extends KeystoneTypeConstructor
		? any
		: // Ultimate fallback
		  any;

/**
 * Determines if a field is required based on its definition.
 */
type IsFieldRequired<TFieldDef> = TFieldDef extends { required: true }
	? true
	: TFieldDef extends { required: boolean }
	? false
	: false;

/**
 * Converts a single field definition to a TypeScript property.
 */
type ConvertFieldToProperty<
	TFieldDef,
	TRefDocuments extends Record<string, KeystoneDocument> = Record<
		string,
		KeystoneDocument
	>
> = IsFieldRequired<TFieldDef> extends true
	? KeystoneFieldTypeToTSType<TFieldDef, TRefDocuments>
	: KeystoneFieldTypeToTSType<TFieldDef, TRefDocuments> | undefined;

/**
 * Main type that converts Keystone field definitions to a TypeScript interface.
 * This is the magic that enables automatic type inference!
 * Now supports mixed objects with both field definitions and heading objects.
 */
export type InferKeystoneDocumentFromFields<
	TFields extends Record<string, any>,
	TRefDocuments extends Record<string, KeystoneDocument> = Record<
		string,
		KeystoneDocument
	>
> = KeystoneDocument & {
	[K in keyof ExtractFieldDefinitions<TFields>]: ConvertFieldToProperty<
		ExtractFieldDefinitions<TFields>[K],
		TRefDocuments
	>;
};

/**
 * Alternative type that works with mixed field definitions including headings.
 * Use this when you have heading objects mixed in with your field definitions.
 */
export type InferKeystoneDocumentFromMixedFields<
	TMixedFields extends Record<string, any>,
	TRefDocuments extends Record<string, KeystoneDocument> = Record<
		string,
		KeystoneDocument
	>
> = InferKeystoneDocumentFromFields<
	ExtractFieldDefinitions<TMixedFields>,
	TRefDocuments
>;

// =============================================================================
// ENHANCED LIST CONSTRUCTOR WITH TYPE INFERENCE
// =============================================================================

/**
 * Enhanced List constructor interface that provides automatic type inference.
 * This allows you to get full TypeScript support without manually defining document interfaces!
 */
export interface KeystoneListConstructorWithInference {
	/**
	 * Creates a new Keystone List with automatic TypeScript type inference.
	 * The document type is automatically inferred from the field definitions!
	 *
	 * @template TFields - The field definitions object
	 * @template TRefDocuments - Map of referenced document types for relationships
	 * @param key - The unique key/name for the list
	 * @param options - Configuration options including field definitions
	 * @returns A new KeystoneList with the inferred document type
	 *
	 * @example
	 * ```typescript
	 * // Define your referenced document types
	 * interface UserDocument extends KeystoneDocument {
	 *   name: string;
	 *   email: string;
	 * }
	 *
	 * interface CategoryDocument extends KeystoneDocument {
	 *   name: string;
	 * }
	 *
	 * type RefDocs = {
	 *   User: UserDocument;
	 *   Category: CategoryDocument;
	 * };
	 *
	 * // Create list with automatic type inference
	 * const Posts = new keystone.List('Post', {
	 *   fields: {
	 *     title: { type: String, required: true },
	 *     content: { type: String },
	 *     published: { type: Boolean, default: false },
	 *     publishedAt: { type: Date },
	 *     author: { type: Types.Relationship, ref: 'User', required: true },
	 *     categories: { type: Types.Relationship, ref: 'Category', many: true }
	 *   }
	 * } as const) as KeystoneListWithInference<typeof Posts['fields'], RefDocs>;
	 *
	 * // Now Posts.model has the correct inferred type:
	 * // {
	 * //   title: string;
	 * //   content?: string;
	 * //   published?: boolean;
	 * //   publishedAt?: Date;
	 * //   author: KeystoneRelationshipFieldValue<false, UserDocument>;
	 * //   categories: KeystoneRelationshipFieldValue<true, CategoryDocument>;
	 * // }
	 * ```
	 */
	new <
		TFields extends Record<string, any>,
		TRefDocuments extends Record<string, KeystoneDocument> = Record<
			string,
			KeystoneDocument
		>
	>(
		key: string,
		options: {
			fields?: TFields;
			[key: string]: any;
		}
	): KeystoneListWithInference<TFields, TRefDocuments>;
}

/**
 * Enhanced KeystoneList type with automatic document type inference.
 */
export type KeystoneListWithInference<
	TFields extends Record<string, any>,
	TRefDocuments extends Record<string, KeystoneDocument> = Record<
		string,
		KeystoneDocument
	>
> = import("./list").KeystoneList<KeystoneDocument> & {
	/** The Mongoose model with the correctly inferred document type */
	model: mongoose.Model<
		InferKeystoneDocumentFromFields<TFields, TRefDocuments>
	>;
	/** The inferred document type for this list */
	DocumentType: InferKeystoneDocumentFromFields<TFields, TRefDocuments>;
};

// =============================================================================
// HELPER TYPES FOR EASIER USAGE
// =============================================================================

/**
 * Helper type to extract the document type from a Keystone List.
 * Use this when you need to reference the document type elsewhere.
 *
 * @example
 * ```typescript
 * const Posts = new keystone.List('Post', { fields: { title: String } });
 * type PostDocument = ExtractDocumentType<typeof Posts>;
 * ```
 */
export type ExtractDocumentType<TList> =
	TList extends KeystoneListWithInference<any, any>
		? TList["DocumentType"]
		: TList extends import("./list").KeystoneList<
				infer TDoc extends KeystoneDocument
		  >
		? TDoc
		: never;

/**
 * Utility type for defining field definitions with better IntelliSense.
 * Use this to get better type hints when defining your fields.
 *
 * @example
 * ```typescript
 * const postFields: KeystoneFieldDefinitions = {
 *   title: { type: String, required: true },
 *   author: { type: Types.Relationship, ref: 'User' }
 * } as const;
 *
 * const Posts = new keystone.List('Post', { fields: postFields });
 * ```
 */
export type KeystoneFieldDefinitions = Record<
	string,
	| KeystoneFieldOptions
	| KeystoneTypeConstructor
	| StringConstructor
	| NumberConstructor
	| BooleanConstructor
	| DateConstructor
>;

/**
 * Advanced helper for creating lists with full type safety and inference.
 * This provides the most ergonomic way to create typed Keystone lists.
 *
 * @example
 * ```typescript
 * interface UserDocument extends KeystoneDocument {
 *   name: string;
 *   email: string;
 * }
 *
 * const Posts = createTypedKeystoneList({
 *   key: 'Post',
 *   fields: {
 *     title: { type: String, required: true },
 *     content: { type: String },
 *     author: { type: Types.Relationship, ref: 'User' as const }
 *   },
 *   refDocuments: {} as { User: UserDocument }
 * });
 *
 * // Posts.model now has the correctly inferred type!
 * ```
 */
export declare function createTypedKeystoneList<
	TFields extends Record<string, any>,
	TRefDocuments extends Record<string, KeystoneDocument> = Record<
		string,
		KeystoneDocument
	>
>(config: {
	key: string;
	fields: TFields;
	refDocuments?: TRefDocuments;
	options?: Omit<import("./list").KeystoneListOptions, "fields">;
}): KeystoneListWithInference<TFields, TRefDocuments>;

// =============================================================================
// TYPE-ONLY HELPERS FOR COMMON PATTERNS
// =============================================================================

/**
 * Helper for creating relationship field definitions with proper typing.
 */
export type RelationshipField<
	TRef extends string,
	TMany extends boolean = false
> = {
	type: KeystoneTypeConstructor;
	ref: TRef;
} & (TMany extends true ? { many: true } : {});

/**
 * Helper for creating required field definitions.
 */
export type RequiredField<T> = T & { required: true };

/**
 * Type-safe field definition helpers.
 * Use these for better IntelliSense and type safety when defining fields.
 */
export declare namespace FieldHelpers {
	/** Creates a required text field */
	const requiredText: { type: StringConstructor; required: true };
	/** Creates an optional text field */
	const text: { type: StringConstructor };
	/** Creates a required number field */
	const requiredNumber: { type: NumberConstructor; required: true };
	/** Creates an optional number field */
	const number: { type: NumberConstructor };
	/** Creates a boolean field with default false */
	const boolean: { type: BooleanConstructor; default: false };
	/** Creates a date field */
	const date: { type: DateConstructor };
	/** Creates a required date field */
	const requiredDate: { type: DateConstructor; required: true };

	/** Creates a single relationship field */
	function relationship<TRef extends string>(
		ref: TRef
	): RelationshipField<TRef, false>;

	/** Creates a required single relationship field */
	function requiredRelationship<TRef extends string>(
		ref: TRef
	): RelationshipField<TRef, false> & { required: true };

	/** Creates a many relationship field */
	function manyRelationship<TRef extends string>(
		ref: TRef
	): RelationshipField<TRef, true>;
}
