/**
 * @file Type-level tests for SelectType literal-union narrowing.
 *
 * This file is INTENTIONALLY not compiled by tsconfig.build.json (test/ is
 * excluded from the build).  It is checked by `npx tsc --noEmit` using the
 * root tsconfig.json which includes `test/**\/*`.
 *
 * `@ts-expect-error` is ONLY allowed in `test/types/` files for negative
 * type-test assertions that prove the type system catches invalid values.
 * This matches the "Patterns Allowed With Justification Comment" section of
 * .roadmap/quality-d-type-safety/00-GOAL.md.
 */

import type { KeystoneFieldOptionsForSelectType } from '../../fields/types/select/SelectType.mjs';

// --- Positive cases ---

// String literal-union: all values are valid.
const _stringOk: KeystoneFieldOptionsForSelectType<'draft' | 'published'> = {
	options: ['draft', 'published'] as const,
	default: 'draft',
};

// Numeric literal-union: values and default are valid numbers.
const _numericOk: KeystoneFieldOptionsForSelectType<1 | 2 | 3> = {
	options: [1, 2, 3] as const,
	numeric: true,
	default: 2,
};

// Object-form options: also valid.
const _objectOk: KeystoneFieldOptionsForSelectType<'a' | 'b'> = {
	options: [
		{ value: 'a', label: 'Alpha' },
		{ value: 'b', label: 'Beta' },
	],
	default: 'a',
};

// Bare string options (legacy, widened SelectValue default): accepted.
const _widened: KeystoneFieldOptionsForSelectType = {
	options: ['x', 'y', 'z'],
};

// --- Negative cases ---

// Default must be in the literal union — 'c' is NOT in 'a' | 'b'.
// The @ts-expect-error must be on the line immediately before the error.
const _badDefault: KeystoneFieldOptionsForSelectType<'a' | 'b'> = {
	options: ['a', 'b'] as const,
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error — JUSTIFIED: negative type-test — 'c' is not assignable to 'a' | 'b'
	default: 'c',
};

// Options array must only contain TValue elements — 'c' is not in 'a' | 'b'.
const _badOption: KeystoneFieldOptionsForSelectType<'a' | 'b'> = {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error — JUSTIFIED: negative type-test — 'c' is not assignable to 'a' | 'b'
	options: ['a', 'b', 'c'] as const,
};

// Prevent unused-variable warnings (values are used at type level only).
void _stringOk;
void _numericOk;
void _objectOk;
void _widened;
void _badDefault;
void _badOption;
