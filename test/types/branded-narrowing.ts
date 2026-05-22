/**
 * @file Type-level tests for branded primitive types in fields/types/branded.mts.
 *
 * This file is INTENTIONALLY not compiled by tsconfig.build.json (test/ is
 * excluded from the build). It is checked by `npx tsc --noEmit` using the
 * root tsconfig.json which includes `test/**\/*`.
 *
 * `@ts-expect-error` is ONLY allowed in `test/types/` files for negative
 * type-test assertions that prove the type system catches invalid values.
 * This matches the constraint in .roadmap/legacy-admin-typing/00-GOAL.md.
 */

import type {
	ListKey,
	ListPath,
	DocumentId,
	FieldPath,
} from '../../fields/types/branded.mjs';
import {
	asListKey,
	asListPath,
	asDocumentId,
	asFieldPath,
} from '../../fields/types/branded.mjs';

// ---------------------------------------------------------------------------
// Positive cases — legitimate usage via the minting helpers
// ---------------------------------------------------------------------------

const userKey: ListKey = asListKey('User');
const postsPath: ListPath = asListPath('posts');
const docId: DocumentId = asDocumentId('6a0a29ce5cea5214d684ab2a');
const nameField: FieldPath = asFieldPath('name.first');

void userKey;
void postsPath;
void docId;
void nameField;

// Helper return types are exactly the branded types (not plain string).
const _lk = asListKey('Post');
const _lp = asListPath('users');
const _di = asDocumentId('000000000000000000000000');
const _fp = asFieldPath('email');

void _lk;
void _lp;
void _di;
void _fp;

// ---------------------------------------------------------------------------
// Negative cases — plain strings are NOT assignable to branded types
// ---------------------------------------------------------------------------

// @ts-expect-error — JUSTIFIED: negative type-test — a plain string is not assignable to ListKey (brand mismatch)
const _badListKey: ListKey = 'User';
void _badListKey;

// @ts-expect-error — JUSTIFIED: negative type-test — a plain string is not assignable to ListPath (brand mismatch)
const _badListPath: ListPath = 'users';
void _badListPath;

// @ts-expect-error — JUSTIFIED: negative type-test — a plain string is not assignable to DocumentId (brand mismatch)
const _badDocumentId: DocumentId = '6a0a29ce5cea5214d684ab2a';
void _badDocumentId;

// @ts-expect-error — JUSTIFIED: negative type-test — a plain string is not assignable to FieldPath (brand mismatch)
const _badFieldPath: FieldPath = 'email';
void _badFieldPath;

// ---------------------------------------------------------------------------
// Negative cases — ListKey is NOT assignable to ListPath (the key regression class)
// ---------------------------------------------------------------------------

// @ts-expect-error — JUSTIFIED: negative type-test — ListKey is not assignable to ListPath (different brands prevent the keystone.lists[key] vs keystone.list(path) confusion)
const _keyAsPath: ListPath = asListKey('User');
void _keyAsPath;

// @ts-expect-error — JUSTIFIED: negative type-test — ListPath is not assignable to ListKey
const _pathAsKey: ListKey = asListPath('users');
void _pathAsKey;

// ---------------------------------------------------------------------------
// Negative cases — DocumentId is NOT a plain string
// ---------------------------------------------------------------------------

// Assigning a DocumentId to a plain string must fail (it IS a string at
// runtime but the brand makes it a subtype, not assignable *from* plain string).
// The inverse — assigning a DocumentId WHERE a string is expected — IS fine
// (branded types are subtypes of their base).

declare const _someDocId: DocumentId;
// A function that requires a plain string should accept a DocumentId fine
// (DocumentId is a subtype of string — positive test):
function _acceptsString(_s: string): void { void _s; }
_acceptsString(_someDocId); // must compile without error

// But a function that requires a DocumentId rejects a plain string:
function _requiresDocId(_id: DocumentId): void { void _id; }
// @ts-expect-error — JUSTIFIED: negative type-test — plain string is not assignable to DocumentId
_requiresDocId('some-raw-id');

// ---------------------------------------------------------------------------
// Negative case — FieldPath is not interchangeable with other brands
// ---------------------------------------------------------------------------

// @ts-expect-error — JUSTIFIED: negative type-test — ListKey is not assignable to FieldPath
const _keyAsField: FieldPath = asListKey('User');
void _keyAsField;
