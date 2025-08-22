/**
 * @fileoverview
 * Demonstration of automatic type inference working with Keystone heading objects.
 * Shows how to organize your Admin UI with sections while maintaining full TypeScript support.
 */

import {
	InferKeystoneDocumentFromFields,
	InferKeystoneDocumentFromMixedFields,
	KeystoneGroupHeading,
	KeystoneDocument,
} from "../../index";

// =============================================================================
// BASIC EXAMPLE WITH HEADINGS
// =============================================================================

// You can now include heading objects mixed with field definitions!
const userFieldsWithHeadings = {
	// Personal Information Section
	personalSection: { heading: "Personal Information" } as KeystoneGroupHeading,
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	dateOfBirth: { type: Date },

	// Professional Information Section
	professionalSection: {
		heading: "Professional Information",
	} as KeystoneGroupHeading,
	jobTitle: { type: String },
	company: { type: String },
	salary: { type: Number },

	// Account Settings Section
	accountSection: { heading: "Account Settings" } as KeystoneGroupHeading,
	isActive: { type: Boolean, default: true },
	role: { type: String, required: true },
	permissions: { type: String as any, ref: "Permission", many: true },

	// Conditional Section (only shows when user is admin)
	adminSection: {
		heading: "Admin Settings",
		dependsOn: { role: "admin" },
	} as KeystoneGroupHeading,
	canManageUsers: { type: Boolean, default: false },
	canEditSystem: { type: Boolean, default: false },
} as const;

// ✅ Type inference automatically filters out headings and infers only the actual fields!
type UserDocumentWithHeadings = InferKeystoneDocumentFromFields<
	typeof userFieldsWithHeadings
>;

// UserDocumentWithHeadings is automatically:
// {
//   name: string;                    // from personalSection
//   email: string;                   // from personalSection
//   dateOfBirth?: Date;              // from personalSection
//   jobTitle?: string;               // from professionalSection
//   company?: string;                // from professionalSection
//   salary?: number;                 // from professionalSection
//   isActive?: boolean;              // from accountSection
//   role: string;                    // from accountSection
//   permissions: KeystoneManyRelationshipValue<KeystoneDocument>; // from accountSection
//   canManageUsers?: boolean;        // from adminSection
//   canEditSystem?: boolean;         // from adminSection
// } & KeystoneDocument
//
// Notice: personalSection, professionalSection, accountSection, adminSection are NOT included!

// =============================================================================
// ALTERNATIVE SYNTAX USING InferKeystoneDocumentFromMixedFields
// =============================================================================

// For clarity, you can also use the explicit "MixedFields" version
type UserDocumentAlternative = InferKeystoneDocumentFromMixedFields<
	typeof userFieldsWithHeadings
>;

// This produces exactly the same result as above

// =============================================================================
// COMPLEX EXAMPLE WITH RELATIONSHIPS
// =============================================================================

interface PermissionDocument extends KeystoneDocument {
	name: string;
	description: string;
}

interface DepartmentDocument extends KeystoneDocument {
	name: string;
	budget: number;
}

type ReferenceDocuments = {
	Permission: PermissionDocument;
	Department: DepartmentDocument;
	User: UserDocumentWithHeadings; // Self-reference for manager
};

const employeeFieldsWithSections = {
	// Basic Information
	basicInfo: { heading: "Basic Information" } as KeystoneGroupHeading,
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	employeeId: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },

	// Employment Details
	employment: { heading: "Employment Details" } as KeystoneGroupHeading,
	department: { type: String as any, ref: "Department", required: true },
	position: { type: String, required: true },
	manager: { type: String as any, ref: "User" },
	startDate: { type: Date, required: true },
	endDate: { type: Date },

	// Compensation (only show for HR role)
	compensation: {
		heading: "Compensation",
		dependsOn: { currentUserRole: "HR" },
	} as KeystoneGroupHeading,
	baseSalary: { type: Number },
	bonus: { type: Number },
	currency: { type: String, default: "USD" },

	// Permissions & Access
	access: { heading: "Permissions & Access" } as KeystoneGroupHeading,
	permissions: { type: String as any, ref: "Permission", many: true },
	isActive: { type: Boolean, default: true },
	lastLogin: { type: Date },
} as const;

// ✅ Full type inference with relationships, ignoring all heading objects
type EmployeeDocument = InferKeystoneDocumentFromFields<
	typeof employeeFieldsWithSections,
	ReferenceDocuments
>;

// EmployeeDocument is automatically:
// {
//   firstName: string;
//   lastName: string;
//   employeeId: string;
//   email: string;
//   department: KeystoneSingleRelationshipValue<DepartmentDocument>;
//   position: string;
//   manager?: KeystoneSingleRelationshipValue<UserDocumentWithHeadings>;
//   startDate: Date;
//   endDate?: Date;
//   baseSalary?: number;
//   bonus?: number;
//   currency?: string;
//   permissions: KeystoneManyRelationshipValue<PermissionDocument>;
//   isActive?: boolean;
//   lastLogin?: Date;
// } & KeystoneDocument

// =============================================================================
// USING THE INFERRED TYPES IN PRACTICE
// =============================================================================

function handleEmployee(employee: EmployeeDocument) {
	// ✅ All actual fields are properly typed
	console.log(`Employee: ${employee.firstName} ${employee.lastName}`);
	console.log(`ID: ${employee.employeeId}`);
	console.log(`Email: ${employee.email}`);
	console.log(`Position: ${employee.position}`);

	// ✅ Optional fields are properly typed as optional
	if (employee.baseSalary) {
		console.log(`Salary: ${employee.baseSalary} ${employee.currency || "USD"}`);
	}

	// ✅ Relationships work correctly
	if (employee.manager) {
		if (
			typeof employee.manager === "object" &&
			"firstName" in employee.manager
		) {
			// Manager is populated
			console.log(
				`Manager: ${employee.manager.firstName} ${employee.manager.lastName}`
			);
		} else {
			// Manager is just an ObjectId
			console.log(`Manager ID: ${employee.manager.toString()}`);
		}
	}

	// ✅ Many relationships work correctly
	if (employee.permissions && employee.permissions.length > 0) {
		console.log(`Permissions count: ${employee.permissions.length}`);
	}

	// ✅ All Mongoose methods available
	console.log(`Employee _id: ${employee._id}`);
	employee.markModified("lastLogin");
}

// =============================================================================
// BUILDING KEYSTONE LISTS WITH HEADINGS
// =============================================================================

// In your actual Keystone setup, you would use these field definitions directly:
/*
const Employee = new keystone.List('Employee', {
	fields: employeeFieldsWithSections,
	// Other options...
});
*/

// And the Employee.model would be correctly typed as mongoose.Model<EmployeeDocument>

// =============================================================================
// TYPE CHECKING DEMONSTRATIONS
// =============================================================================

// This demonstrates that heading objects are properly filtered out
function typeCheckDemo() {
	// ✅ These should all compile without errors - only actual fields are included

	const mockEmployee: EmployeeDocument = {} as any;

	// Actual fields from the definition work fine
	const firstName: string = mockEmployee.firstName;
	const department = mockEmployee.department; // Relationship type
	const permissions = mockEmployee.permissions; // Many relationship type

	// ❌ These would cause TypeScript errors because headings are filtered out:
	// const basicInfo = mockEmployee.basicInfo; // ❌ Property 'basicInfo' does not exist
	// const employment = mockEmployee.employment; // ❌ Property 'employment' does not exist
	// const compensation = mockEmployee.compensation; // ❌ Property 'compensation' does not exist
	// const access = mockEmployee.access; // ❌ Property 'access' does not exist

	return { firstName, department, permissions };
}

// =============================================================================
// HELPER FOR CREATING HEADED FIELD DEFINITIONS
// =============================================================================

/**
 * Helper function to create field definitions with sections.
 * Provides better IntelliSense and type safety.
 */
function createFieldsWithSections<T extends Record<string, any>>(
	fieldsAndHeadings: T
): T {
	return fieldsAndHeadings;
}

// Usage example with better IntelliSense
const productFields = createFieldsWithSections({
	basicInfo: { heading: "Product Information" } as KeystoneGroupHeading,
	name: { type: String, required: true },
	description: { type: String },
	price: { type: Number, required: true },

	inventory: { heading: "Inventory" } as KeystoneGroupHeading,
	sku: { type: String, required: true, unique: true },
	stockQuantity: { type: Number, default: 0 },
	inStock: { type: Boolean, default: true },

	metadata: { heading: "Metadata" } as KeystoneGroupHeading,
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
} as const);

type ProductDocument = InferKeystoneDocumentFromFields<typeof productFields>;

// =============================================================================
// SUMMARY
// =============================================================================

/**
 * This file demonstrates that you can now include Keystone heading objects
 * directly in your field definitions for Admin UI organization, and the type
 * inference system will automatically:
 *
 * 1. ✅ Filter out heading objects (they don't appear in the document type)
 * 2. ✅ Preserve all actual field definitions with correct typing
 * 3. ✅ Handle required vs optional fields properly
 * 4. ✅ Support relationships with proper typing
 * 5. ✅ Maintain all Mongoose Document functionality
 * 6. ✅ Provide full TypeScript autocomplete and type checking
 *
 * This gives you the best of both worlds:
 * - Organized Admin UI with sections and headings
 * - Automatic TypeScript type generation without manual interface creation
 */

export {
	type UserDocumentWithHeadings,
	type EmployeeDocument,
	type ProductDocument,
	handleEmployee,
	typeCheckDemo,
	createFieldsWithSections,
};
