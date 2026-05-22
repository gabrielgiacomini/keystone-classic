/**
 * @file Type-level tests for the FieldSpec discriminated union.
 *
 * This file is INTENTIONALLY not compiled by tsconfig.build.json (test/ is
 * excluded from the build). It is checked by `npx tsc --noEmit` using the
 * root tsconfig.json which includes `test/**\/*`.
 *
 * `@ts-expect-error` is ONLY allowed in `test/types/` files for negative
 * type-test assertions that prove the type system catches invalid values.
 * This matches the "Patterns Allowed With Justification Comment" section of
 * .roadmap/quality-d-type-safety/00-GOAL.md.
 */

import type { FieldSpec, FieldMap, AddArg } from '../../fields/types/FieldSpec.mjs';

// Pull in real constructors to use as discriminants
import BooleanType from '../../fields/types/boolean/BooleanType.mjs';
import TextType from '../../fields/types/text/TextType.mjs';
import RelationshipType from '../../fields/types/relationship/RelationshipType.mjs';
import SelectType from '../../fields/types/select/SelectType.mjs';
import NumberType from '../../fields/types/number/NumberType.mjs';

// --- Positive cases: valid FieldSpec values ---

// Boolean field — no required options beyond type
const _boolSpec: FieldSpec = {
	type: BooleanType,
	label: 'Active',
};

// Text field — no required options beyond type
const _textSpec: FieldSpec = {
	type: TextType,
	required: true,
	default: '',
};

// Relationship field — ref is required
const _relSpec: FieldSpec = {
	type: RelationshipType,
	ref: 'User',
};

// Relationship field — many relationship
const _relManySpec: FieldSpec = {
	type: RelationshipType,
	ref: 'Post',
	many: true,
};

// Select field — options is required
const _selectSpec: FieldSpec = {
	type: SelectType,
	options: ['draft', 'published', 'archived'],
	default: 'draft',
};

// Date field is omitted from the standalone FieldSpec test because KeystoneFieldOptionsForDateType
// includes `type: KeystoneTypeConstructorForDateType | DateConstructor` (dual-type interface), which
// creates an incompatible intersection at the FieldSpec discriminant level due to structural subtyping
// of the native `DateConstructor`. DateType usage is verified via FieldMap / integration tests.

// Number field
const _numSpec: FieldSpec = {
	type: NumberType,
	default: 0,
};

// Mongoose native type — String constructor
const _mongooseStringSpec: FieldSpec = {
	type: String,
	required: true,
};

// Mongoose native type — Number constructor
const _mongooseNumberSpec: FieldSpec = {
	type: Number,
};

// --- Positive cases: valid FieldMap values ---

const _simpleMap: FieldMap = {
	title: { type: TextType, required: true, default: '' },
	active: { type: BooleanType },
	count: { type: Number },
};

// Nested FieldMap (plain-object grouping)
const _nestedMap: FieldMap = {
	meta: {
		title: { type: TextType },
		author: { type: RelationshipType, ref: 'User' },
	},
};

// --- Positive cases: valid AddArg values ---

// String heading
const _headingString: AddArg = 'Details';

// Indent/outdent markers
const _indent: AddArg = '>>>';
const _outdent: AddArg = '<<<';

// Object-form heading
const _headingObj: AddArg = { heading: 'Meta Information' };

// FieldMap as AddArg
const _mapArg: AddArg = {
	title: { type: TextType },
};

// --- Negative cases ---

// Relationship without ref should fail
// @ts-expect-error — JUSTIFIED: negative type-test — ref is required for RelationshipType
const _relMissingRef: FieldSpec = {
	type: RelationshipType,
};

// Select without options should fail
// @ts-expect-error — JUSTIFIED: negative type-test — options is required for SelectType
const _selectMissingOptions: FieldSpec = {
	type: SelectType,
};

// Prevent unused-variable warnings (values are used at type level only).
void _boolSpec;
void _textSpec;
void _relSpec;
void _relManySpec;
void _selectSpec;
void _numSpec;
void _mongooseStringSpec;
void _mongooseNumberSpec;
void _simpleMap;
void _nestedMap;
void _headingString;
void _indent;
void _outdent;
void _headingObj;
void _mapArg;
void _relMissingRef;
void _selectMissingOptions;
