# Keystone.js TypeScript Type Inference System

## Overview

This specification outlines an advanced TypeScript type inference system for Keystone.js that enables automatic generation of strongly-typed document interfaces from field definitions, supporting both traditional object-based and array-based workflow patterns.

## Core Concept

The system provides **automatic TypeScript type inference** for Keystone models, eliminating the need for manual interface definitions while maintaining full type safety and IDE support. The key innovation is supporting **mixed field definitions with UI organization elements** (headings) while automatically filtering them out for type generation.

## Key Features

### 1. Automatic Type Inference

- **Zero Manual Interface Definition**: Document types are automatically inferred from field definitions
- **Full TypeScript Support**: Complete IntelliSense, autocomplete, and type checking
- **Mongoose Integration**: All Mongoose document methods and properties are preserved
- **Relationship Typing**: Proper typing for single and many relationships with populated/unpopulated states

### 2. Array-Based Workflow

- **Single Source of Truth**: Define complete UI structure once in an array format
- **Mixed Content Support**: Arrays can contain field definitions, heading strings, and heading objects
- **Automatic Filtering**: Type system automatically separates fields from UI organization elements
- **Runtime Extraction**: Helper functions extract field definitions for List constructors

### 3. Heading Support

- **Simple String Headings**: Basic section headers (`"Personal Information"`)
- **Advanced Heading Objects**: Conditional sections with `dependsOn` logic
- **UI Organization**: Maintain organized Admin UI without affecting type inference
- **Type Safety**: Headings are filtered out of document types automatically

### 4. Relationship Management

- **Type-Safe References**: Relationships are properly typed with reference document types
- **Populated/Unpopulated States**: Handles both ObjectId and populated document states
- **Many Relationships**: Proper typing for array-based relationships
- **Self-References**: Support for self-referential relationships

## Architecture

### Core Type System

#### Base Types

```typescript
// Base document extending Mongoose with Keystone functionality
export type KeystoneDocument<T = Record<string, any>> = mongoose.Document & T;

// Heading objects for UI organization
export interface KeystoneGroupHeading {
	heading: string;
	dependsOn?: Record<string, any>;
}

// Array items supporting mixed content
export type KeystoneFieldArrayItem =
	| string // Simple heading
	| KeystoneGroupHeading // Advanced heading with options
	| Record<string, KeystoneFieldOptions>; // Field definitions
```

#### Type Inference Engine

```typescript
// Main inference type for object-based definitions
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

// Main inference type for array-based definitions
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
```

### Filtering System

#### Heading Detection and Removal

```typescript
// Identifies heading objects vs field definitions
type IsHeadingObject<T> = T extends { heading: string } ? true : false;

// Filters out headings from mixed objects
type FilterFieldsOnly<T extends Record<string, any>> = {
	[K in keyof T]: IsHeadingObject<T[K]> extends true ? never : T[K];
};

// Removes never values after filtering
type RemoveNeverValues<T> = {
	[K in keyof T as T[K] extends never ? never : K]: T[K];
};
```

#### Array Processing

```typescript
// Extracts field objects from arrays, filtering out strings and headings
type ExtractFieldObjectsFromArray<T extends readonly KeystoneFieldArrayItem[]> =
	{
		[K in keyof T]: T[K] extends string
			? never
			: T[K] extends KeystoneGroupHeading
			? never
			: T[K] extends Record<string, any>
			? T[K]
			: never;
	};

// Merges multiple field objects into single definition
type MergeFieldObjects<T extends readonly any[]> = UnionToIntersection<
	RemoveNeverFromTuple<T>[number]
>;
```

### Field Type Mapping

#### Basic Type Conversion

```typescript
type KeystoneFieldTypeMap = {
	[StringConstructor]: string;
	[NumberConstructor]: number;
	[BooleanConstructor]: boolean;
	[DateConstructor]: Date;
	// Custom Keystone types...
};
```

#### Relationship Type Handling

```typescript
// Single relationships (ref without many: true)
type KeystoneSingleRelationshipValue<T extends KeystoneDocument> =
	| mongoose.Types.ObjectId
	| string
	| T;

// Many relationships (ref with many: true)
type KeystoneManyRelationshipValue<T extends KeystoneDocument> =
	| mongoose.Types.ObjectId[]
	| string[]
	| T[];
```

## Workflow Patterns

### Pattern 1: Object-Based with Headings

```typescript
const userFields = {
	// Heading for UI organization
	personalSection: { heading: "Personal Information" } as KeystoneGroupHeading,
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },

	// Conditional heading
	adminSection: {
		heading: "Admin Settings",
		dependsOn: { role: "admin" },
	} as KeystoneGroupHeading,
	canManageUsers: { type: Boolean, default: false },
} as const;

// Automatic type inference filters out headings
type UserDocument = InferKeystoneDocumentFromFields<typeof userFields>;
```

### Pattern 2: Array-Based Workflow

```typescript
const postStructure = [
	// Simple string heading
	"Content",
	{
		title: { type: String, required: true },
		content: { type: String, required: true },
	},

	// Advanced heading with options
	{
		heading: "Publishing",
		dependsOn: { status: "draft" },
	} as KeystoneGroupHeading,
	{
		status: { type: String, default: "draft" },
		publishedAt: { type: Date },
	},
] as const;

// Extract field definitions for List constructor
type PostFields = ArrayToFieldDefinitions<typeof postStructure>;

// Infer document type
type PostDocument = InferKeystoneDocumentFromArray<typeof postStructure>;
```

### Pattern 3: Runtime Field Extraction

```typescript
// Helper function for runtime field extraction
function extractFieldsFromArray(structure: readonly any[]): any {
	const result = {};
	for (const item of structure) {
		if (typeof item === "string") continue; // Skip string headings
		if (typeof item === "object" && "heading" in item) continue; // Skip heading objects
		Object.assign(result, item); // Merge field definitions
	}
	return result;
}

// Usage in Keystone setup
const fields = extractFieldsFromArray(postStructure);
const Post = new keystone.List("Post", { fields });
Post.add(...postStructure); // Include headings for organized UI
```

## Benefits and Advantages

### Developer Experience

- **No Manual Interface Definition**: Types are automatically generated
- **Single Source of Truth**: One definition serves both typing and UI organization
- **Full IDE Support**: Complete IntelliSense and autocomplete
- **Error Prevention**: Compile-time type checking prevents runtime errors
- **Refactoring Safety**: Type system catches breaking changes during refactoring

### Type Safety

- **100% Type Coverage**: All fields, relationships, and Mongoose methods typed
- **Relationship Validation**: Proper typing for populated/unpopulated states
- **Optional Field Handling**: Correct optional/required field inference
- **Custom Type Support**: Extensible for custom Keystone field types

### UI Organization

- **Flexible Heading Support**: Both simple strings and advanced objects
- **Conditional Sections**: Support for `dependsOn` logic in headings
- **Clean Separation**: UI elements don't interfere with type generation
- **Backward Compatibility**: Works with existing Keystone patterns

### Maintainability

- **Centralized Definitions**: All field information in one place
- **Automatic Synchronization**: Types always match field definitions
- **Documentation Integration**: JSDoc comments and source references
- **Future-Proof**: Extensible architecture for new Keystone features

## Implementation Details

### Core Type Utilities

- **Union to Intersection Conversion**: Merges multiple field objects
- **Never Value Removal**: Cleans up filtered types
- **Tuple Processing**: Handles readonly array types correctly
- **Recursive Type Resolution**: Supports nested field structures

### Runtime Helpers

- **Field Extraction**: Runtime functions to separate fields from headings
- **Structure Validation**: Optional runtime validation of field arrays
- **Type Assertion Helpers**: Utilities for type narrowing in applications
- **Debug Functions**: Development aids for type inspection

### Extension Points

- **Custom Field Types**: Framework for adding new field type mappings
- **Validation Integration**: Hooks for runtime validation
- **Transform Functions**: Pre/post-processing of field definitions
- **Plugin Architecture**: Support for community extensions

## Migration Path

### From Manual Interfaces

1. Replace manual interface definitions with inferred types
2. Convert object-based field definitions to use heading support
3. Adopt array-based workflow for complex UI structures
4. Leverage runtime extraction helpers for List construction

### Compatibility

- **Backward Compatible**: Existing Keystone applications continue to work
- **Gradual Adoption**: Can be implemented incrementally
- **Type-Only Changes**: No runtime behavior modifications
- **Zero Dependencies**: Uses only TypeScript's type system

## Future Enhancements

### Planned Features

- **Schema Validation**: Runtime validation matching TypeScript types
- **GraphQL Integration**: Automatic GraphQL schema generation
- **Form Generation**: Automatic form generation from field definitions
- **Documentation Generation**: API documentation from type definitions

### Extensibility

- **Plugin System**: Community-contributed field type mappings
- **Custom Transformations**: User-defined type transformation rules
- **Integration Hooks**: Compatibility with other TypeScript tools
- **Performance Optimization**: Compilation speed improvements

## Conclusion

This TypeScript inference system transforms Keystone.js development by providing automatic type generation with full IDE support while maintaining UI organization capabilities. The system eliminates manual interface maintenance, reduces errors, and improves developer productivity while preserving all existing Keystone functionality.

The dual workflow support (object-based and array-based) provides flexibility for different project needs, while the automatic heading filtering ensures clean type generation without sacrificing UI organization. The result is a type-safe, maintainable, and developer-friendly approach to Keystone.js development.
