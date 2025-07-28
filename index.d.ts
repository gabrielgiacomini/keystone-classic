// Core types
export * from "./types/core";
export * from "./types/field";
export * from "./types/list";
export * from "./types/ui";
export * from "./types/filters";
export * from "./types/global";

// Field types
export * from "./types/fields/text";
export * from "./types/fields/number";
export * from "./types/fields/boolean";
export * from "./types/fields/relationship";

// Re-export commonly used types with more specific names for backwards compatibility
export {
	KeystoneDocument,
	KeystoneListSchema,
	KeystoneTypeConstructor,
	KeystoneGroupFields,
	KeystoneGroupHeading,
} from "./types/core";

export { KeystoneField, KeystoneFieldOptions } from "./types/field";

export {
	KeystoneList,
	KeystoneListConstructor,
	KeystoneListOptions,
	KeystoneListMappings,
} from "./types/list";

export {
	KSAdminUIElement,
	KSAdminUiElementField,
	KSAdminUiElementHeading,
	KSAdminUiElementIndent,
	KSAdminUiElementOutdent,
} from "./types/ui";

export {
	KSAdminUiFilterForTextField,
	KSAdminUiFilterForNumberField,
	KSAdminUiFilterForBooleanField,
	KSAdminUiFilterForSelectField,
	KSAdminUiFilterForDateAndDateTimeFields,
	KSAdminUiFilterForDateArrayField,
	KSAdminUiFilterForRelationshipField,
} from "./types/filters";

export { Keystone, KeystoneGlobalOptions } from "./types/global";

// Field-specific exports
export {
	KeystoneFieldOptionsForTextType,
	KeystoneFieldForTextType,
	KeystoneTypeConstructorForTextType,
} from "./types/fields/text";

export {
	KeystoneFieldOptionsForNumberType,
	KeystoneFieldForNumberType,
	KeystoneTypeConstructorForNumberType,
} from "./types/fields/number";

export {
	KeystoneFieldOptionsForBooleanType,
	KeystoneFieldForBooleanType,
	KeystoneTypeConstructorForBooleanType,
} from "./types/fields/boolean";

export {
	KeystoneRelationshipFieldValue,
	KeystoneRelationshipFieldValueUnpopulated,
	KeystoneRelationshipFieldValuePopulated,
	KeystoneRelationshipExpandedItem,
	KeystoneRelationshipExpandedData,
	KeystoneSingleRelationshipValue,
	KeystoneManyRelationshipValue,
	KeystoneSingleRelationshipValueUnpopulated,
	KeystoneManyRelationshipValueUnpopulated,
	KeystoneSingleRelationshipValuePopulated,
	KeystoneManyRelationshipValuePopulated,
	KeystoneFieldOptionsForRelationshipType,
	KeystoneFieldForRelationshipType,
	KeystoneTypeConstructorForRelationshipType,
} from "./types/fields/relationship";

// TODO: Add remaining field type exports as more field type files are created
// export * from "./types/fields/textarea";
// export * from "./types/fields/select";
// export * from "./types/fields/date";
// export * from "./types/fields/datetime";
// export * from "./types/fields/html";
// export * from "./types/fields/url";
// export * from "./types/fields/key";
// export * from "./types/fields/color";
// export * from "./types/fields/name";
// export * from "./types/fields/money";
// export * from "./types/fields/email";
// export * from "./types/fields/password";
// export * from "./types/fields/relationship";
// export * from "./types/fields/file";
// export * from "./types/fields/arrays";
// export * from "./types/fields/location";
// export * from "./types/fields/geopoint";
// export * from "./types/fields/code";
// export * from "./types/fields/embedly";
// export * from "./types/fields/cloudinary";
