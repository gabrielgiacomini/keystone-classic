import * as mongoose from "mongoose";
import { KeystoneDocument, KeystoneTypeConstructor } from "../core";
import { KeystoneField, KeystoneFieldOptions } from "../field";
import { KSAdminUiFilterForRelationshipField } from "../filters";

/**
 * Represents the value of a relationship field in its unpopulated state.
 * Contains MongoDB ObjectId references.
 */
export type KeystoneRelationshipFieldValueUnpopulated<
	TMany extends boolean = boolean
> = TMany extends true
	? mongoose.Types.ObjectId[]
	: mongoose.Types.ObjectId | null;

/**
 * Represents the value of a relationship field in its populated state.
 * Contains the full referenced documents.
 */
export type KeystoneRelationshipFieldValuePopulated<
	TMany extends boolean = boolean,
	TDoc extends KeystoneDocument = KeystoneDocument
> = TMany extends true ? TDoc[] : TDoc | null;

/**
 * Represents the value of a relationship field that can be either populated or unpopulated.
 * This is the most common type for relationship field values in Keystone documents.
 */
export type KeystoneRelationshipFieldValue<
	TMany extends boolean = boolean,
	TDoc extends KeystoneDocument = KeystoneDocument
> =
	| KeystoneRelationshipFieldValueUnpopulated<TMany>
	| KeystoneRelationshipFieldValuePopulated<TMany, TDoc>;

/**
 * Represents the expanded data returned by getExpandedData() method.
 * Contains id and name properties for display purposes.
 */
export interface KeystoneRelationshipExpandedItem {
	/** The ObjectId as a string */
	id: string;
	/** The display name from getDocumentName() */
	name: string;
}

/**
 * Type for expanded relationship data, handling both single and many relationships.
 */
export type KeystoneRelationshipExpandedData<TMany extends boolean = boolean> =
	TMany extends true
		? KeystoneRelationshipExpandedItem[]
		: KeystoneRelationshipExpandedItem | undefined;

/**
 * Field options specific to Relationship fields.
 * @see /fields/types/relationship/RelationshipType.js - Relationship field implementation
 */
export interface KeystoneFieldOptionsForRelationshipType
	extends KeystoneFieldOptions {
	/** Ensure type is specifically Relationship */
	type: KeystoneTypeConstructorForRelationshipType;
	/** The List key to relate to (required) */
	ref: string;
	/** Whether this is a many-to-many relationship */
	many?: boolean;
	/** Filters to apply to the reference list */
	filters?: Record<string, any>;
	/** Whether to allow creating related items inline */
	createInline?: boolean;
	/** Path for the refList virtual. Default: path + 'RefList' */
	refListPath?: string;
}

/**
 * Relationship field instance interface.
 * @see /fields/types/relationship/RelationshipType.js - Relationship field implementation
 */
export interface KeystoneFieldForRelationshipType extends KeystoneField {
	/** Whether this is a many-to-many relationship */
	many: boolean;
	/** Filters to apply to the reference list */
	filters: Record<string, any>;
	/** Whether to allow creating related items inline */
	createInline: boolean;
	/** Default size for the field in the Admin UI */
	_defaultSize: "full";
	/** The native Mongoose type (ObjectId) */
	_nativeType: typeof mongoose.Schema.Types.ObjectId;
	/** Underscore methods added to documents */
	_underscoreMethods: string[];
	/** Properties exposed to Admin UI */
	_properties: string[];
	/** Field-specific options */
	options: KeystoneFieldOptionsForRelationshipType;
	/** Paths for virtual fields */
	paths: {
		/** Path for the refList virtual */
		refList: string;
	};

	/**
	 * Gets properties to pass to the React field component.
	 * @returns Properties object with refList info.
	 */
	getProperties(): {
		refList: {
			singular: string;
			plural: string;
			path: string;
			key: string;
		};
	};

	/**
	 * Gets expanded data for related items.
	 * Returns objects with id and name for display purposes.
	 * @param item The Mongoose document.
	 * @returns Array of objects with id and name for many relationships, or single object for one-to-one.
	 */
	getExpandedData(item: any): KeystoneRelationshipExpandedData<boolean>;

	/**
	 * Formats the field value as a string.
	 * @param item The Mongoose document.
	 * @returns Comma-separated IDs for many relationships, or single ID for one-to-one.
	 */
	format(item: any): string;

	/**
	 * Gets the field's data from an Item, as used by the React components.
	 * @param item The Mongoose document.
	 * @returns ObjectId or array of ObjectIds (unpopulated state).
	 */
	getData(item: any): KeystoneRelationshipFieldValueUnpopulated<boolean>;

	/**
	 * Validates input data for the relationship field.
	 * @param data Input data.
	 * @param callback Receives `(isValid: boolean)`.
	 */
	validateInput(data: any, callback: (valid: boolean) => void): void;

	/**
	 * Validates required relationship input.
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
	 * Updates the item's relationship field based on input data.
	 * Throws error if the relationship is populated.
	 * @param item The Mongoose document to update.
	 * @param data The input data object.
	 * @param callback Called after update attempt. Receives `(error?: Error)`.
	 */
	updateItem(item: any, data: any, callback: (err?: Error) => void): void;

	/**
	 * Adds relationship-specific filtering logic to a Mongoose query.
	 * @param filter The filter definition.
	 * @returns A Mongoose query condition object.
	 */
	addFilterToQuery(
		filter: KSAdminUiFilterForRelationshipField
	): Record<string, any>;

	/**
	 * Whether the field has any filters defined.
	 */
	readonly hasFilters: boolean;

	/**
	 * Returns true if the relationship configuration is valid.
	 */
	readonly isValid: boolean;

	/**
	 * Returns the Related List instance.
	 */
	readonly refList: any; // KeystoneList but avoiding circular import
}

/**
 * Relationship field type constructor interface.
 * @see /fields/types/relationship/RelationshipType.js - Relationship field constructor
 */
export interface KeystoneTypeConstructorForRelationshipType
	extends KeystoneTypeConstructor {
	new (
		list: any,
		path: string,
		options: KeystoneFieldOptionsForRelationshipType
	): KeystoneFieldForRelationshipType;
	prototype: KeystoneFieldForRelationshipType;
	properName: "Relationship";
}

// Type helpers for better developer experience

/**
 * Helper type for single relationship field values.
 * @template TDoc - The type of the referenced document
 */
export type KeystoneSingleRelationshipValue<
	TDoc extends KeystoneDocument = KeystoneDocument
> = KeystoneRelationshipFieldValue<false, TDoc>;

/**
 * Helper type for many relationship field values.
 * @template TDoc - The type of the referenced document
 */
export type KeystoneManyRelationshipValue<
	TDoc extends KeystoneDocument = KeystoneDocument
> = KeystoneRelationshipFieldValue<true, TDoc>;

/**
 * Helper type for unpopulated single relationship field values.
 */
export type KeystoneSingleRelationshipValueUnpopulated =
	KeystoneRelationshipFieldValueUnpopulated<false>;

/**
 * Helper type for unpopulated many relationship field values.
 */
export type KeystoneManyRelationshipValueUnpopulated =
	KeystoneRelationshipFieldValueUnpopulated<true>;

/**
 * Helper type for populated single relationship field values.
 * @template TDoc - The type of the referenced document
 */
export type KeystoneSingleRelationshipValuePopulated<
	TDoc extends KeystoneDocument = KeystoneDocument
> = KeystoneRelationshipFieldValuePopulated<false, TDoc>;

/**
 * Helper type for populated many relationship field values.
 * @template TDoc - The type of the referenced document
 */
export type KeystoneManyRelationshipValuePopulated<
	TDoc extends KeystoneDocument = KeystoneDocument
> = KeystoneRelationshipFieldValuePopulated<true, TDoc>;
