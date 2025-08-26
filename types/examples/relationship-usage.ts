/**
 * @fileoverview
 * Examples demonstrating how to use Keystone relationship field types.
 * This file shows practical usage patterns for both single and many relationships,
 * in both populated and unpopulated states.
 */

import * as mongoose from "mongoose";
import {
	KeystoneDocument,
	KeystoneSingleRelationshipValue,
	KeystoneManyRelationshipValue,
	KeystoneSingleRelationshipValueUnpopulated,
	KeystoneManyRelationshipValueUnpopulated,
	KeystoneSingleRelationshipValuePopulated,
	KeystoneManyRelationshipValuePopulated,
	KeystoneRelationshipExpandedItem,
	KeystoneList,
	KeystoneFieldOptionsForRelationshipType,
} from "../../index";

// Example document types
interface UserDocument extends KeystoneDocument {
	name: string;
	email: string;
}

interface PostDocument extends KeystoneDocument {
	title: string;
	content: string;
	// Single relationship - can be ObjectId or populated User
	author: KeystoneSingleRelationshipValue<UserDocument>;
	// Many relationship - can be ObjectId[] or populated User[]
	contributors: KeystoneManyRelationshipValue<UserDocument>;
}

interface CategoryDocument extends KeystoneDocument {
	name: string;
	description: string;
}

interface BlogPostDocument extends KeystoneDocument {
	title: string;
	slug: string;
	content: string;
	// Single relationship (unpopulated state)
	author: KeystoneSingleRelationshipValueUnpopulated;
	// Many relationship (unpopulated state)
	categories: KeystoneManyRelationshipValueUnpopulated;
}

interface PopulatedBlogPostDocument extends KeystoneDocument {
	title: string;
	slug: string;
	content: string;
	// Single relationship (populated state)
	author: KeystoneSingleRelationshipValuePopulated<UserDocument>;
	// Many relationship (populated state)
	categories: KeystoneManyRelationshipValuePopulated<CategoryDocument>;
}

// Example usage functions

/**
 * Example function working with unpopulated relationships.
 * This is typical when fetching data directly from MongoDB without populate().
 */
function handleUnpopulatedPost(post: BlogPostDocument): void {
	// author is mongoose.Types.ObjectId | null
	if (post.author) {
		console.log("Author ID:", post.author.toString());
		// To get the actual user, you'd need to populate or fetch separately
	}

	// categories is mongoose.Types.ObjectId[]
	if (post.categories.length > 0) {
		console.log(
			"Category IDs:",
			post.categories.map((id) => id.toString())
		);
	}
}

/**
 * Example function working with populated relationships.
 * This is typical when using populate() in Mongoose queries.
 */
function handlePopulatedPost(post: PopulatedBlogPostDocument): void {
	// author is UserDocument | null
	if (post.author) {
		console.log("Author name:", post.author.name);
		console.log("Author email:", post.author.email);
	}

	// categories is CategoryDocument[]
	if (post.categories.length > 0) {
		post.categories.forEach((category) => {
			console.log("Category:", category.name, "-", category.description);
		});
	}
}

/**
 * Example function that can handle both populated and unpopulated relationships.
 * This demonstrates the flexible KeystoneSingleRelationshipValue type.
 */
function handleFlexiblePost(post: PostDocument): void {
	// TypeScript will require type checking since author can be ObjectId or UserDocument
	if (post.author) {
		if (typeof post.author === "object" && "name" in post.author) {
			// It's populated - post.author is UserDocument
			console.log("Author name:", post.author.name);
		} else {
			// It's unpopulated - post.author is mongoose.Types.ObjectId
			console.log("Author ID:", post.author.toString());
		}
	}

	// Similar approach for many relationships
	if (post.contributors.length > 0) {
		const firstContributor = post.contributors[0];
		if (typeof firstContributor === "object" && "name" in firstContributor) {
			// Array contains UserDocument objects (populated)
			post.contributors.forEach((contributor) => {
				if (typeof contributor === "object" && "name" in contributor) {
					console.log("Contributor:", contributor.name);
				}
			});
		} else {
			// Array contains ObjectIds (unpopulated)
			console.log(
				"Contributor IDs:",
				post.contributors.map((id) =>
					typeof id === "object" ? id.toString() : id
				)
			);
		}
	}
}

/**
 * Example function working with expanded relationship data.
 * This demonstrates the data returned by getExpandedData() method.
 */
function handleExpandedData(
	singleExpanded: KeystoneRelationshipExpandedItem | undefined,
	manyExpanded: KeystoneRelationshipExpandedItem[]
): void {
	// Single relationship expanded data
	if (singleExpanded) {
		console.log(`Single: ${singleExpanded.name} (${singleExpanded.id})`);
	}

	// Many relationship expanded data
	manyExpanded.forEach((item) => {
		console.log(`Many: ${item.name} (${item.id})`);
	});
}

/**
 * Example of type-safe field definition for Keystone List.
 */
const PostListFieldExample = {
	title: { type: String, required: true },
	content: { type: String },
	// Single relationship field
	author: {
		type: "Relationship" as const,
		ref: "User",
		required: true,
	},
	// Many relationship field
	categories: {
		type: "Relationship" as const,
		ref: "Category",
		many: true,
	},
	// Many relationship with filters
	contributors: {
		type: "Relationship" as const,
		ref: "User",
		many: true,
		filters: { role: "contributor" },
	},
};

// Type assertions to demonstrate the types work correctly
const unpopulatedAuthor: KeystoneSingleRelationshipValueUnpopulated =
	new mongoose.Types.ObjectId();
const populatedAuthor: KeystoneSingleRelationshipValuePopulated<UserDocument> =
	{
		_id: new mongoose.Types.ObjectId(),
		name: "John Doe",
		email: "john@example.com",
	} as UserDocument;

const unpopulatedCategories: KeystoneManyRelationshipValueUnpopulated = [
	new mongoose.Types.ObjectId(),
	new mongoose.Types.ObjectId(),
];

const populatedCategories: KeystoneManyRelationshipValuePopulated<CategoryDocument> =
	[
		{
			_id: new mongoose.Types.ObjectId(),
			name: "Technology",
			description: "Tech posts",
		} as CategoryDocument,
		{
			_id: new mongoose.Types.ObjectId(),
			name: "Programming",
			description: "Programming tutorials",
		} as CategoryDocument,
	];

// This demonstrates type safety - TypeScript will catch errors
// const invalidRelationship: KeystoneSingleRelationshipValue = "not-an-objectid"; // ❌ Type error
// const invalidMany: KeystoneManyRelationshipValue = "also-invalid"; // ❌ Type error

// =============================================================================
// TYPE INFERENCE VERIFICATION
// =============================================================================

// Mock Keystone instance for constructor
const keystone = {
	List: KeystoneList,
};

// Define a User list to be referenced
const User = new keystone.List("User", {
	fields: {
		name: { type: String, required: true },
		email: { type: String, required: true },
	},
} as const);

// Define a Post list that references the User list
const Post = new keystone.List("Post", {
	fields: {
		title: { type: String, required: true },
		// Test single relationship inference
		author: {
			type: "Relationship" as const,
			ref: "User",
			required: true,
		} as KeystoneFieldOptionsForRelationshipType,
		// Test many relationship inference
		contributors: {
			type: "Relationship" as const,
			ref: "User",
			many: true,
		} as KeystoneFieldOptionsForRelationshipType,
	},
} as const);

// Verification functions
function verifyPostDocument() {
	// If type inference is working, this function will compile without errors
	const postInstance: (typeof Post)["DocumentType"] = {} as any;

	// `title` should be inferred as `string`
	const title: string = postInstance.title;
	// `author` should be inferred as a single relationship to User
	const author: KeystoneSingleRelationshipValue<typeof User.DocumentType> =
		postInstance.author;
	// `contributors` should be inferred as a many relationship to User
	const contributors: KeystoneManyRelationshipValue<typeof User.DocumentType> =
		postInstance.contributors;

	// Example of using the typed relationships
	if (author && "name" in author) {
		const authorName: string = author.name;
		console.log(authorName);
	}

	if (contributors.length > 0 && "name" in contributors[0]) {
		const contributorName: string = contributors[0].name;
		console.log(contributorName);
	}

	console.log(title);
}

// This line is just to satisfy TypeScript that the function is used.
if (false) {
	verifyPostDocument();
}
