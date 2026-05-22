/**
 * @file Type-level tests for Filters<TRef> narrowing.
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

import type { Filters } from '../../fields/types/FieldSpec.mjs';
import type { KeystoneList } from '../../lib/list.mjs';
import type EmailType from '../../fields/types/email/EmailType.mjs';
import type NameType from '../../fields/types/name/NameType.mjs';

// ---------------------------------------------------------------------------
// Scenario 1 — When KeystoneLists has no `fields` property on a key,
// Filters<TRef> falls back to Record<string, unknown>, accepting any filter.
// (In keystone4-ts itself, KeystoneLists is empty so all TRef falls to the
// `Record<string, unknown>` branch.)
// ---------------------------------------------------------------------------

// 'UnknownList' is not in KeystoneLists — accepts anything
const _fallbackFilter: Filters<'UnknownList'> = { anything: true };
void _fallbackFilter;

const _fallbackFilter2: Filters<'AnyString'> = { foo: 'bar', baz: 42 };
void _fallbackFilter2;

// ---------------------------------------------------------------------------
// Scenario 2 — With a list that carries a `fields` property, Filters narrows
// to Partial<{ [P in keyof TTargetFields]: unknown }>.
//
// We register a typed list in KeystoneLists using the full KeystoneList<K, TFields>
// generic so the `fields` property is present for the duck-type check.
// ---------------------------------------------------------------------------

declare global {
	interface KeystoneLists {
		TypedUserList: KeystoneList<'TypedUserList', {
			name: { type: typeof NameType };
			email: { type: typeof EmailType; required: true };
		}>;
	}
}

// Filters<'TypedUserList'> narrows to Partial<{ name: unknown; email: unknown }>
// Known field keys are accepted:
const _okFilter1: Filters<'TypedUserList'> = { email: 'test@example.com' };
void _okFilter1;

const _okFilter2: Filters<'TypedUserList'> = { name: 'Alice', email: 'x' };
void _okFilter2;

const _okFilter3: Filters<'TypedUserList'> = {};  // empty is valid (Partial<...>)
void _okFilter3;

// ---------------------------------------------------------------------------
// Negative case — unknown field key is a compile error when narrowed.
// TypeScript's excess property check catches the unknown key on a fresh
// object literal assigned to the narrowed Partial<{ name, email }> type.
// ---------------------------------------------------------------------------

const _badFilter: Filters<'TypedUserList'> = {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error — JUSTIFIED: negative type-test — 'typo' is not a key of TypedUserList.fields
	typo: 'x',
};
void _badFilter;
