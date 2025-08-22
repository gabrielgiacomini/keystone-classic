/**
 * @fileoverview
 * Demonstration of the array-based workflow for Keystone field definitions.
 * This shows how to define the complete UI structure once and use it for both
 * List creation (fields only) and .add() method (full structure with headings).
 */

import {
	InferKeystoneDocumentFromArray,
	ArrayToFieldDefinitions,
	KeystoneFieldDefinitionArray,
	KeystoneGroupHeading,
	KeystoneDocument,
} from "../../index";

// =============================================================================
// STEP 1: DEFINE THE COMPLETE UI STRUCTURE AS AN ARRAY
// =============================================================================

// This is your single source of truth for the complete UI structure
const userFieldsStructure = [
	// Personal Information Section
	"Personal Information", // Simple string heading
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		dateOfBirth: { type: Date },
		avatar: { type: String as any, ref: "Image" },
	},

	// Professional Information Section (with options)
	{
		heading: "Professional Information",
		dependsOn: { isEmployee: true },
	} as KeystoneGroupHeading,
	{
		jobTitle: { type: String },
		department: { type: String as any, ref: "Department", required: true },
		manager: { type: String as any, ref: "User" },
		salary: { type: Number },
		startDate: { type: Date, required: true },
	},

	// Account Settings Section
	"Account Settings",
	{
		isActive: { type: Boolean, default: true },
		role: { type: String, required: true },
		permissions: { type: String as any, ref: "Permission", many: true },
		lastLogin: { type: Date },
	},

	// Admin Section (conditional)
	{
		heading: "Admin Settings",
		dependsOn: { role: "admin" },
	} as KeystoneGroupHeading,
	{
		canManageUsers: { type: Boolean, default: false },
		canEditSystem: { type: Boolean, default: false },
		adminNotes: { type: String },
	},
] as const;

// =============================================================================
// STEP 2: EXTRACT FIELD DEFINITIONS FOR LIST CREATION
// =============================================================================

// Extract only the field definitions (no headings) for the List constructor
type UserFieldDefinitions = ArrayToFieldDefinitions<typeof userFieldsStructure>;

// Define reference documents for relationships
interface DepartmentDocument extends KeystoneDocument {
	name: string;
	budget: number;
}

interface PermissionDocument extends KeystoneDocument {
	name: string;
	description: string;
}

interface ImageDocument extends KeystoneDocument {
	url: string;
	filename: string;
}

type ReferenceDocuments = {
	Department: DepartmentDocument;
	Permission: PermissionDocument;
	Image: ImageDocument;
	User: UserDocument; // Self-reference
};

// =============================================================================
// STEP 3: INFER THE DOCUMENT TYPE
// =============================================================================

// Automatically infer the complete document type from the array structure
type UserDocument = InferKeystoneDocumentFromArray<
	typeof userFieldsStructure,
	ReferenceDocuments
>;

// UserDocument is now automatically:
// {
//   name: string;
//   email: string;
//   dateOfBirth?: Date;
//   avatar?: KeystoneSingleRelationshipValue<ImageDocument>;
//   jobTitle?: string;
//   department: KeystoneSingleRelationshipValue<DepartmentDocument>;
//   manager?: KeystoneSingleRelationshipValue<UserDocument>;
//   salary?: number;
//   startDate: Date;
//   isActive?: boolean;
//   role: string;
//   permissions: KeystoneManyRelationshipValue<PermissionDocument>;
//   lastLogin?: Date;
//   canManageUsers?: boolean;
//   canEditSystem?: boolean;
//   adminNotes?: string;
// } & KeystoneDocument

// =============================================================================
// STEP 4: CREATE THE KEYSTONE LIST (USING ONLY FIELD DEFINITIONS)
// =============================================================================

// In your actual Keystone setup, create the list with only field definitions:
/*
const User = new keystone.List('User', {
	fields: {} as UserFieldDefinitions,  // TypeScript knows this is just the fields
	// Other list options...
});
*/

// Or manually extract fields for runtime:
function extractFieldsFromArray<T extends KeystoneFieldDefinitionArray>(
	arr: T
): ArrayToFieldDefinitions<T> {
	const result = {} as any;

	for (const item of arr) {
		// Skip strings (simple headings)
		if (typeof item === "string") continue;

		// Skip heading objects
		if (typeof item === "object" && "heading" in item) continue;

		// Merge field definition objects
		Object.assign(result, item);
	}

	return result;
}

// Runtime usage:
const userFieldsOnly = extractFieldsFromArray(userFieldsStructure);
/*
const User = new keystone.List('User', {
	fields: userFieldsOnly,
	// Other options...
});
*/

// =============================================================================
// STEP 5: USE THE COMPLETE STRUCTURE WITH .add() METHOD
// =============================================================================

// After list creation, use the complete structure (with headings) via .add():
/*
User.add(...userFieldsStructure);
*/

// This gives you the organized Admin UI with sections while maintaining type safety

// =============================================================================
// PRACTICAL USAGE FUNCTIONS
// =============================================================================

function handleUser(user: UserDocument) {
	// ✅ All fields are properly typed
	console.log(`User: ${user.name} (${user.email})`);
	console.log(`Role: ${user.role}`);

	// ✅ Optional fields are handled correctly
	if (user.salary) {
		console.log(`Salary: $${user.salary.toLocaleString()}`);
	}

	// ✅ Relationships work with proper typing
	if (user.manager) {
		if (typeof user.manager === "object" && "name" in user.manager) {
			console.log(`Manager: ${user.manager.name}`);
		} else {
			console.log(`Manager ID: ${user.manager.toString()}`);
		}
	}

	// ✅ Many relationships
	if (user.permissions && user.permissions.length > 0) {
		console.log(`Permissions: ${user.permissions.length}`);
	}

	// ✅ All Mongoose methods available
	console.log(`User ID: ${user._id}`);
	user.markModified("lastLogin");
}

// =============================================================================
// ADVANCED EXAMPLE: COMPLEX STRUCTURE WITH MULTIPLE SECTIONS
// =============================================================================

const productFieldsStructure = [
	// Basic Product Information
	"Product Information",
	{
		name: { type: String, required: true },
		description: { type: String },
		sku: { type: String, required: true, unique: true },
		category: { type: String as any, ref: "Category", required: true },
	},

	// Pricing Section
	{ heading: "Pricing" } as KeystoneGroupHeading,
	{
		price: { type: Number, required: true },
		cost: { type: Number },
		currency: { type: String, default: "USD" },
		taxable: { type: Boolean, default: true },
	},

	// Inventory Section
	{ heading: "Inventory" } as KeystoneGroupHeading,
	{
		stockQuantity: { type: Number, default: 0 },
		lowStockThreshold: { type: Number, default: 10 },
		inStock: { type: Boolean, default: true },
		supplier: { type: String as any, ref: "Supplier" },
	},

	// SEO Section (conditional for admins)
	{
		heading: "SEO & Marketing",
		dependsOn: { userRole: "admin" },
	} as KeystoneGroupHeading,
	{
		metaTitle: { type: String },
		metaDescription: { type: String },
		keywords: { type: String },
		featured: { type: Boolean, default: false },
	},

	// Tracking Section
	"Tracking & Analytics",
	{
		views: { type: Number, default: 0 },
		sales: { type: Number, default: 0 },
		createdAt: { type: Date, default: Date.now },
		updatedAt: { type: Date, default: Date.now },
	},
] as const;

// Reference documents for product
interface CategoryDocument extends KeystoneDocument {
	name: string;
	slug: string;
}

interface SupplierDocument extends KeystoneDocument {
	name: string;
	contactEmail: string;
}

type ProductReferenceDocuments = {
	Category: CategoryDocument;
	Supplier: SupplierDocument;
};

// Infer the product document type
type ProductDocument = InferKeystoneDocumentFromArray<
	typeof productFieldsStructure,
	ProductReferenceDocuments
>;

// Extract fields for list creation
type ProductFieldDefinitions = ArrayToFieldDefinitions<
	typeof productFieldsStructure
>;

// =============================================================================
// HELPER UTILITIES FOR THE WORKFLOW
// =============================================================================

/**
 * Helper function to create a properly typed field definition array.
 * Provides better IntelliSense and ensures correct typing.
 */
function createFieldStructure<T extends KeystoneFieldDefinitionArray>(
	structure: T
): T {
	return structure;
}

/**
 * Helper to extract field definitions at runtime with proper typing.
 */
function extractFields<T extends KeystoneFieldDefinitionArray>(
	structure: T
): ArrayToFieldDefinitions<T> {
	return extractFieldsFromArray(structure);
}

/**
 * Helper to get the inferred document type from a field structure.
 * Use this for documentation or type exports.
 */
type GetDocumentType<
	T extends KeystoneFieldDefinitionArray,
	TRefs extends Record<string, KeystoneDocument> = Record<
		string,
		KeystoneDocument
	>
> = InferKeystoneDocumentFromArray<T, TRefs>;

// Usage examples:
const blogPostStructure = createFieldStructure([
	"Content",
	{
		title: { type: String, required: true },
		slug: { type: String, required: true, unique: true },
		content: { type: String, required: true },
		excerpt: { type: String },
	},

	"Publishing",
	{
		status: { type: String, default: "draft" },
		publishedAt: { type: Date },
		author: { type: String as any, ref: "User", required: true },
		tags: { type: String as any, ref: "Tag", many: true },
	},

	{
		heading: "SEO",
		dependsOn: { status: "published" },
	} as KeystoneGroupHeading,
	{
		metaTitle: { type: String },
		metaDescription: { type: String },
	},
] as const);

type BlogPostDocument = GetDocumentType<
	typeof blogPostStructure,
	{ User: UserDocument; Tag: KeystoneDocument }
>;
const blogPostFields = extractFields(blogPostStructure);

// =============================================================================
// SUMMARY OF THE WORKFLOW
// =============================================================================

/**
 * This approach gives you:
 *
 * 1. ✅ Single Source of Truth: Define your complete UI structure once
 * 2. ✅ Extract Fields: Get just field definitions for List constructor
 * 3. ✅ Automatic Types: Full TypeScript inference for your documents
 * 4. ✅ Reuse Structure: Use the same array with .add() method for organized UI
 * 5. ✅ Type Safety: All fields, relationships, and Mongoose methods properly typed
 * 6. ✅ Conditional Sections: Support for dependsOn logic in headings
 * 7. ✅ Runtime Helpers: Utilities to extract fields at runtime
 *
 * Workflow:
 * 1. Define array with mixed headings and field definitions
 * 2. Use ArrayToFieldDefinitions<> to get field-only type
 * 3. Use InferKeystoneDocumentFromArray<> to get document type
 * 4. Create List with extracted fields
 * 5. Use .add() with complete array for organized Admin UI
 */

export {
	userFieldsStructure,
	productFieldsStructure,
	blogPostStructure,
	extractFieldsFromArray,
	createFieldStructure,
	extractFields,
	handleUser,
	type UserDocument,
	type ProductDocument,
	type BlogPostDocument,
	type UserFieldDefinitions,
	type ProductFieldDefinitions,
	type GetDocumentType,
};
