/**
 * @fileoverview
 * Demonstration that KeystoneDocument properly inherits all Mongoose Document methods and properties.
 * This file shows that you get full Mongoose functionality with Keystone documents.
 */

import { KeystoneDocument, InferKeystoneDocumentFromFields } from "../../index";
import * as mongoose from "mongoose";

// =============================================================================
// BASIC KEYSTONE DOCUMENT WITH MONGOOSE METHODS
// =============================================================================

// Define a simple document type using type inference
const userFields = {
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	age: { type: Number },
	isActive: { type: Boolean, default: true },
	createdAt: { type: Date, default: Date.now },
} as const;

type UserDocument = InferKeystoneDocumentFromFields<typeof userFields>;

// =============================================================================
// DEMONSTRATING MONGOOSE DOCUMENT METHODS AND PROPERTIES
// =============================================================================

async function demonstrateMongooseMethods(user: UserDocument) {
	// ✅ MONGOOSE PROPERTIES - All available on KeystoneDocument

	// _id property (ObjectId)
	console.log("User ID:", user._id.toString());
	console.log("User ID (ObjectId):", user._id);

	// isNew property (boolean)
	if (user.isNew) {
		console.log("This is a new document");
	}

	// errors property (validation errors)
	if (user.errors) {
		console.log("Validation errors:", user.errors);
	}

	// ✅ MONGOOSE METHODS - All available on KeystoneDocument

	// save() method
	try {
		const savedUser = await user.save();
		console.log("User saved:", savedUser._id);
	} catch (error) {
		console.error("Save failed:", error);
	}

	// populate() method
	const populatedUser = await user.populate("someReference");
	console.log("Populated user:", populatedUser);

	// toJSON() method
	const jsonUser = user.toJSON();
	console.log("User as JSON:", jsonUser);

	// toObject() method
	const plainUser = user.toObject();
	console.log("User as plain object:", plainUser);

	// isModified() method
	const nameModified = user.isModified("name");
	console.log("Name field modified:", nameModified);

	// markModified() method
	user.markModified("age");
	console.log("Age field marked as modified");

	// get() method
	const userName = user.get("name");
	console.log("User name via get():", userName);

	// set() method
	user.set("age", 30);
	console.log("Age set via set() method");

	// remove() method (deprecated in newer Mongoose versions, but still typed)
	// await user.remove();

	// deleteOne() method (newer alternative to remove)
	// await user.deleteOne();

	// ✅ CUSTOM FIELD ACCESS - Your defined fields work too
	console.log("User name (direct access):", user.name);
	console.log("User email:", user.email);
	console.log("User age:", user.age);
	console.log("User active status:", user.isActive);
	console.log("Created at:", user.createdAt);
}

// =============================================================================
// RELATIONSHIP DOCUMENTS WITH MONGOOSE METHODS
// =============================================================================

// Define relationship documents
interface CategoryDocument extends KeystoneDocument {
	name: string;
	slug: string;
}

const postFields = {
	title: { type: String, required: true },
	content: { type: String },
	author: { type: String as any, ref: "User", required: true },
	categories: { type: String as any, ref: "Category", many: true },
	publishedAt: { type: Date },
} as const;

type PostDocument = InferKeystoneDocumentFromFields<
	typeof postFields,
	{
		User: UserDocument;
		Category: CategoryDocument;
	}
>;

async function demonstrateRelationshipMethods(post: PostDocument) {
	// ✅ All Mongoose methods work on documents with relationships too

	console.log("Post ID:", post._id.toString());

	// Populate specific fields
	await post.populate("author");
	await post.populate("categories");

	// Populate multiple fields at once
	await post.populate("author").populate("categories");

	// Populate with specific fields selection
	await post.populate("author", "name email");

	// Check if fields are populated
	console.log(
		"Author populated:",
		mongoose.isValidObjectId(post.author) ? "No" : "Yes"
	);

	// Save after modifications
	post.set("title", "Updated Title");
	await post.save();

	// Convert to JSON (handles populated fields correctly)
	const postJson = post.toJSON();
	console.log("Post with relationships as JSON:", postJson);
}

// =============================================================================
// MODEL-LEVEL OPERATIONS (These would work with proper Mongoose models)
// =============================================================================

// Mock model for demonstration (in real usage, this would be your Keystone model)
declare const UserModel: mongoose.Model<UserDocument>;

async function demonstrateModelOperations() {
	// ✅ Standard Mongoose model operations work with inferred types

	// Find operations return properly typed documents
	const user = await UserModel.findById("507f1f77bcf86cd799439011");
	if (user) {
		// user is properly typed as UserDocument with all Mongoose methods
		console.log("Found user:", user.name);
		await user.save(); // TypeScript knows save() is available
	}

	// Create operations
	const newUser = new UserModel({
		name: "John Doe",
		email: "john@example.com",
		age: 30,
	});

	// All Mongoose methods available
	console.log("Is new user:", newUser.isNew);
	await newUser.save();

	// Query operations
	const users = await UserModel.find({ isActive: true });
	users.forEach((user) => {
		// Each user has all Mongoose methods
		console.log("User ID:", user._id.toString());
		user.markModified("lastSeen");
	});
}

// =============================================================================
// TYPE CHECKING DEMONSTRATIONS
// =============================================================================

// This function demonstrates that TypeScript properly recognizes all Mongoose methods
function typeCheckingDemo(doc: UserDocument) {
	// ✅ TypeScript should provide autocomplete for all these Mongoose methods:

	// Properties
	const id: mongoose.Types.ObjectId = doc._id;
	const isNew: boolean = doc.isNew;

	// Methods that return promises
	const savePromise = doc.save(); // Returns Promise<UserDocument>
	const populatePromise = doc.populate("someField"); // Returns Promise<UserDocument>

	// Methods that return the document
	const setResult: UserDocument = doc.set("name", "New Name");

	// Methods that return other types
	const getValue: any = doc.get("name");
	const isModified: boolean = doc.isModified("name");
	const jsonVersion: any = doc.toJSON();
	const objectVersion: any = doc.toObject();

	// Void methods
	doc.markModified("age"); // returns void

	// Custom fields (from your schema)
	const name: string = doc.name; // required field
	const age: number | undefined = doc.age; // optional field

	return {
		id,
		isNew,
		name,
		age,
		// These demonstrate that all types are properly inferred
		savePromise,
		populatePromise,
		setResult,
		getValue,
		isModified,
		jsonVersion,
		objectVersion,
	};
}

// =============================================================================
// SUMMARY
// =============================================================================

/**
 * This file demonstrates that KeystoneDocument properly inherits ALL Mongoose Document
 * methods and properties, including:
 *
 * PROPERTIES:
 * - _id: ObjectId
 * - isNew: boolean
 * - errors: any
 *
 * METHODS:
 * - save(): Promise<this>
 * - populate(): Promise<this>
 * - toJSON(): any
 * - toObject(): any
 * - get(path): any
 * - set(path, value): this
 * - isModified(path?): boolean
 * - markModified(path): void
 * - remove(): Promise<this> (deprecated)
 * - deleteOne(): Promise<this>
 * - And many more...
 *
 * You get all of this automatically when using InferKeystoneDocumentFromFields!
 */

export {
	demonstrateMongooseMethods,
	demonstrateRelationshipMethods,
	demonstrateModelOperations,
	typeCheckingDemo,
	type UserDocument,
	type PostDocument,
};
