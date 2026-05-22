/**
 * @file Type-level tests for RelationshipType `ref: keyof KeystoneLists` narrowing.
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

import type { KeystoneFieldOptionsForRelationshipType } from '../../fields/types/relationship/RelationshipType.mjs';

// ---------------------------------------------------------------------------
// Scenario 1 — Without a populated KeystoneLists, any string is accepted.
// (In the keystone4-ts package itself, KeystoneLists is empty so ListKey
// resolves to `string & {}`, which accepts any string.)
// ---------------------------------------------------------------------------

const _fallback: KeystoneFieldOptionsForRelationshipType = {
	ref: 'AnyList',
};

const _fallbackMany: KeystoneFieldOptionsForRelationshipType = {
	ref: 'Post',
	many: true,
};

// ---------------------------------------------------------------------------
// Scenario 2 — With a populated KeystoneLists, narrowing kicks in.
// We augment `KeystoneLists` locally in this module to simulate a consumer
// who has declared their list registry.
// ---------------------------------------------------------------------------
declare global {
	interface KeystoneLists {
		User: { key: 'User' };
		Post: { key: 'Post' };
	}
}

// Known keys are accepted:
const _user: KeystoneFieldOptionsForRelationshipType<'User'> = {
	ref: 'User',
};

const _post: KeystoneFieldOptionsForRelationshipType<'Post'> = {
	ref: 'Post',
	many: true,
	filters: { status: 'published' },
	createInline: true,
};

// The generic defaults to `ListKey` — still accepts known keys or bare strings
// (the `string & {}` branch):
const _widened: KeystoneFieldOptionsForRelationshipType = {
	ref: 'User',
};

const _alsoWidened: KeystoneFieldOptionsForRelationshipType = {
	ref: 'Comment', // 'Comment' is not in KeystoneLists, but ListKey allows any string
};

// ---------------------------------------------------------------------------
// Negative cases — narrowed to a specific key, wrong ref is a compile error.
// ---------------------------------------------------------------------------

// Providing a ref that is not 'User' when the type is narrowed to 'User':
const _wrongRef: KeystoneFieldOptionsForRelationshipType<'User'> = {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error — JUSTIFIED: negative type-test — 'Comment' is not assignable to 'User'
	ref: 'Comment',
};

// Providing a ref that is not 'Post' when the type is narrowed to 'Post':
const _wrongRef2: KeystoneFieldOptionsForRelationshipType<'Post'> = {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error — JUSTIFIED: negative type-test — 'User' is not assignable to 'Post'
	ref: 'User',
};

// Prevent unused-variable warnings (values are used at type level only).
void _fallback;
void _fallbackMany;
void _user;
void _post;
void _widened;
void _alsoWidened;
void _wrongRef;
void _wrongRef2;
