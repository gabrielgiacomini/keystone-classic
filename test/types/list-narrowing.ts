/**
 * @file Type-level tests for generic KeystoneList<TKey, TFields> narrowing.
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

import type { KeystoneList, ListKey } from '../../lib/list.mjs';
import type { FieldInstanceFor } from '../../fields/types/FieldSpec.mjs';
import type EmailType from '../../fields/types/email/EmailType.mjs';
import type NameType from '../../fields/types/name/NameType.mjs';
import type TextType from '../../fields/types/text/TextType.mjs';

// ---------------------------------------------------------------------------
// Auxiliary: FieldInstanceFor resolves to the correct concrete type
// ---------------------------------------------------------------------------

type _EmailCheck = FieldInstanceFor<{ type: typeof EmailType }>;

// FieldInstanceFor should produce the concrete field instance types
declare const _emailInst: _EmailCheck;
// @ts-expect-error — JUSTIFIED: negative type-test — FieldInstanceFor<EmailSpec> is EmailType, not NameType
const _nameFromEmail: NameType = _emailInst;
void _nameFromEmail;

// ---------------------------------------------------------------------------
// Core: KeystoneList<TKey, TFields> with concrete TFields
// ---------------------------------------------------------------------------

// A narrowed list type with an explicit TFields map.
// Uses the generic directly (no KeystoneLists augmentation needed for this test).
type UserList = KeystoneList<'User', {
	name: { type: typeof NameType };
	email: { type: typeof EmailType; required: true };
}>;

declare const userList: UserList;

// fields.name should resolve to NameType
const _nameField: NameType = userList.fields.name;

// fields.email should resolve to EmailType
const _emailField: EmailType = userList.fields.email;

// The key property should carry the 'User' literal
const _key: 'User' = userList.key;

void _nameField;
void _emailField;
void _key;

// ---------------------------------------------------------------------------
// Conservative default: KeystoneList without explicit TFields still compiles
// ---------------------------------------------------------------------------

declare const untypedList: KeystoneList;

// Untyped list: fields[path] is accessible without compile error.
const _untypedField = untypedList.fields['someField'];
void _untypedField;

// ---------------------------------------------------------------------------
// KeystoneList default TKey resolves to ListKey
// ---------------------------------------------------------------------------

declare const anyList: KeystoneList;
const _anyKey: ListKey = anyList.key;
void _anyKey;

// ---------------------------------------------------------------------------
// ListKey includes known keys when KeystoneLists is populated
// (relationship-narrowing.ts declares User: {key: 'User'} and Post: {key: 'Post'}
// in the same compilation unit — ListKey union includes those keys)
// ---------------------------------------------------------------------------

const _knownKey: ListKey = 'User';
const _knownKey2: ListKey = 'Post';
void _knownKey;
void _knownKey2;

// Verify FieldInstanceFor<TextType spec> resolves to TextType
type _TextCheck = FieldInstanceFor<{ type: typeof TextType }>;
declare const _textInst: _TextCheck;
const _textAssign: TextType = _textInst;
void _textAssign;

// ---------------------------------------------------------------------------
// list.model typing — DocumentFor<TFields> integration
// ---------------------------------------------------------------------------

// userList is declared above as KeystoneList<'User', { name: ...; email: ... }>
// model.findOne with a valid field should typecheck (positive test)
const _findResult = userList.model.findOne({ email: 'test@example.com' });
void _findResult;

// Note: Mongoose's FilterQuery always accepts arbitrary string keys via
// RootQuerySelector<T>[key: string]: any (for dot-notation nested queries),
// so misspelled field keys in findOne() filters cannot be caught at compile
// time. The type safety benefit is on the *document* side (result type).

// DocumentFor<TFields> itself is strictly typed — assigning a field to the
// wrong type IS a compile error (negative test on the document shape):
import type { DocumentFor } from '../../fields/types/FieldSpec.mjs';

type _UserDoc = DocumentFor<{
	name: { type: typeof NameType };
	email: { type: typeof EmailType; required: true };
}>;

// email field on the document is string — assigning a number is a compile error
declare const _userDoc: _UserDoc;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error — JUSTIFIED: negative type-test — _userDoc.email is string, not number
const _emailAsNumber: number = _userDoc.email;
void _emailAsNumber;

// ---------------------------------------------------------------------------
// Phase 3 final verification: keystone.list<K>(K) returns KeystoneLists[K]
// with full TFields info from the registered list type.
//
// We verify the signature shape directly: given a KeystoneLists augmentation
// declaring 'TestUser' → KeystoneList<'TestUser', {...}>, calling
// keystone.list('TestUser') must return that precise type.
// We use a unique key 'TestUser' to avoid colliding with other test files.
// ---------------------------------------------------------------------------

type TestUserListType = KeystoneList<'TestUser', {
	name: { type: typeof NameType };
	email: { type: typeof EmailType };
}>;

declare global {
	interface KeystoneLists {
		// 'TestUser' is a test-only key — does not conflict with other files.
		TestUser: TestUserListType;
	}
}

declare const _ksForPhase3: import('../../index.mjs').Keystone;
// keystone.list('TestUser') must return KeystoneLists['TestUser'] = TestUserListType
const _userListFromKs = _ksForPhase3.list('TestUser');
// The returned list carries TFields — fields.email resolves to EmailType
const _emailFieldFromKs: EmailType = _userListFromKs.fields.email;
// model is typed over DocumentFor<TFields>
const _modelFromKs = _userListFromKs.model;
void _emailFieldFromKs;
void _modelFromKs;

// ---------------------------------------------------------------------------
// DoD item 10: list.fields[path].format(doc) — parameter typed as doc shape
//
// `FieldType.format(item: MongooseDocument)` accepts any value that satisfies
// the MongooseDocument interface (get/set/isModified/toObject methods).
// When accessed through a populated KeystoneLists registry, the resolved
// field instance (`EmailType`) still carries the same `format(item)` signature.
//
// Positive test: a valid MongooseDocument satisfies the parameter.
// Negative test: an object missing the required Mongoose methods does NOT
// satisfy MongooseDocument — passing it to format() is a compile error.
// ---------------------------------------------------------------------------

import type { MongooseDocument } from '../../fields/types/Type.mjs';

// Positive: a conforming MongooseDocument value is accepted by format().
// _userListFromKs was derived from keystone.list('TestUser') above, carrying
// TFields = { name: NameType spec; email: EmailType spec }.
declare const _validMongooseDoc: MongooseDocument;
const _formattedValue: unknown = _userListFromKs.fields.email.format(_validMongooseDoc);
void _formattedValue;

// Negative: a plain object with only the data fields (no Mongoose methods)
// does NOT satisfy MongooseDocument — format() rejects it at compile time.
declare const _plainDoc: { name: string; email: string };
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error — JUSTIFIED: negative type-test — plain { name, email } object lacks MongooseDocument methods (get/set/isModified/toObject); not assignable to MongooseDocument
const _badFormat: unknown = _userListFromKs.fields.email.format(_plainDoc);
void _badFormat;

// ---------------------------------------------------------------------------
// Prevent unused import warnings
// ---------------------------------------------------------------------------
void _emailInst;
