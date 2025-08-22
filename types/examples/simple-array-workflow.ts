/**
 * @fileoverview
 * Simple example of the array-based workflow for Keystone field definitions.
 * Shows the essential pattern without complex examples.
 */

import {
	InferKeystoneDocumentFromArray,
	ArrayToFieldDefinitions,
	KeystoneGroupHeading,
	KeystoneDocument,
} from "../../index";

// =============================================================================
// 📋 STEP 1: DEFINE YOUR COMPLETE UI STRUCTURE
// =============================================================================

const postFieldsStructure = [
	// Content Section
	"Content",
	{
		title: { type: String, required: true },
		slug: { type: String, required: true, unique: true },
		content: { type: String, required: true },
		excerpt: { type: String },
	},

	// Publishing Section
	{ heading: "Publishing" } as KeystoneGroupHeading,
	{
		status: { type: String, default: "draft" },
		publishedAt: { type: Date },
		featured: { type: Boolean, default: false },
	},

	// Relationships Section
	"Relationships",
	{
		author: { type: String as any, ref: "User", required: true },
		categories: { type: String as any, ref: "Category", many: true },
	},
] as const;

// =============================================================================
// 🔧 STEP 2: EXTRACT TYPES
// =============================================================================

// Get just the field definitions (for List constructor)
type PostFieldDefinitions = ArrayToFieldDefinitions<typeof postFieldsStructure>;

// Define reference document types
interface UserDocument extends KeystoneDocument {
	name: string;
	email: string;
}

interface CategoryDocument extends KeystoneDocument {
	name: string;
	slug: string;
}

// Infer the document type with relationships
type PostDocument = InferKeystoneDocumentFromArray<
	typeof postFieldsStructure,
	{
		User: UserDocument;
		Category: CategoryDocument;
	}
>;

// =============================================================================
// 🚀 STEP 3: USE IN YOUR KEYSTONE SETUP
// =============================================================================

// Extract fields at runtime for List constructor
function extractFields(structure: readonly any[]): any {
	const result = {};
	for (const item of structure) {
		if (typeof item === "string") continue;
		if (typeof item === "object" && "heading" in item) continue;
		Object.assign(result, item);
	}
	return result;
}

// Your Keystone setup:
const postFields = extractFields(postFieldsStructure);

/*
// Create List with just field definitions
const Post = new keystone.List('Post', {
	fields: postFields,  // ✅ Only field definitions, no headings
	// Other options...
});

// Add the complete structure (with headings) for organized Admin UI
Post.add(...postFieldsStructure);  // ✅ Includes headings for sections
*/

// =============================================================================
// ✅ RESULT: FULLY TYPED DOCUMENT
// =============================================================================

function handlePost(post: PostDocument) {
	// All fields are properly typed with IntelliSense
	console.log(`Title: ${post.title}`); // string (required)
	console.log(`Status: ${post.status}`); // string | undefined (optional)
	console.log(`Featured: ${post.featured}`); // boolean | undefined (optional)

	// Relationships handle populated/unpopulated states
	if (post.author) {
		if (typeof post.author === "object" && "name" in post.author) {
			console.log(`Author: ${post.author.name}`); // Populated
		} else {
			console.log(`Author ID: ${post.author}`); // ObjectId
		}
	}

	// All Mongoose methods available
	post.save();
	console.log(`Post ID: ${post._id}`);
}

// =============================================================================
// 📝 SUMMARY
// =============================================================================

/**
 * Perfect workflow:
 *
 * 1. 📋 Define complete UI structure once (array with headings + fields)
 * 2. 🔧 Extract field definitions for List constructor
 * 3. 🤖 Get automatic TypeScript types for your documents
 * 4. 🚀 Use complete structure with .add() for organized Admin UI
 * 5. ✅ Enjoy full type safety throughout your application
 *
 * Benefits:
 * - Single source of truth for your UI structure
 * - No manual interface definitions needed
 * - Organized Admin UI with sections
 * - Full TypeScript support everywhere
 * - All Mongoose methods and properties available
 */

export {
	postFieldsStructure,
	extractFields,
	handlePost,
	type PostDocument,
	type PostFieldDefinitions,
};
