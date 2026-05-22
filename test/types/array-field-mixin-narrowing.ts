/**
 * @file Type-level tests for ArrayItem, ArrayFieldState, ArrayFieldMethods,
 * and WithArrayField exported from fields/mixins/ArrayField.d.mts.
 *
 * Positive cases verify that WithArrayField<P, S> gives the correct shape:
 * - state includes both the custom S fields and values from ArrayFieldState
 * - addItem(), removeItem(), and other mixin methods are present
 * - props remain correctly typed
 *
 * Negative cases use \@ts-expect-error (ONLY permitted in test/types/) to prove
 * that type errors are caught at compile time.
 *
 * See .roadmap/legacy-admin-typing/00-GOAL.md § Mixins specification.
 */

import type { WithArrayField, ArrayItem } from '../../fields/mixins/ArrayField.d.mts';

// ---------------------------------------------------------------------------
// Positive cases
// ---------------------------------------------------------------------------

interface TestProps { label: string }
interface TestState { count: number }

type TestThis = WithArrayField<TestProps, TestState>;

declare const ctx: TestThis;
declare const item: ArrayItem;

// values is available via state as ArrayItem[]:
const _values: ArrayItem[] = ctx.state.values;
void _values;

// addItem() exists:
ctx.addItem();

// removeItem() exists:
ctx.removeItem(item);

// props still typed:
const _label: string = ctx.props.label;
void _label;

// custom state field still typed:
const _count: number = ctx.state.count;
void _count;

// ---------------------------------------------------------------------------
// Negative cases — \@ts-expect-error on the exact offending line
// ---------------------------------------------------------------------------

// @ts-expect-error — JUSTIFIED: negative type-test — values is ArrayItem[] not string
const _bad: string = ctx.state.values;
void _bad;
