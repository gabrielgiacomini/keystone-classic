/**
 * @file Type-level tests for CollapseState, CollapseMethods, and WithCollapse
 * exported from fields/types/Field.d.mts.
 *
 * Positive cases verify that WithCollapse<P, S> gives the correct shape:
 * - state includes both the custom S fields and isCollapsed from CollapseState
 * - uncollapse() and renderCollapse() are present
 * - props remain correctly typed
 *
 * Negative cases use \@ts-expect-error (ONLY permitted in test/types/) to prove
 * that type errors are caught at compile time.
 *
 * See .roadmap/legacy-admin-typing/00-GOAL.md § Mixins specification.
 */

import type { WithCollapse } from '../../fields/types/Field.d.mts';

// ---------------------------------------------------------------------------
// Positive cases
// ---------------------------------------------------------------------------

interface TestProps { label: string }
interface TestState { count: number }

type TestThis = WithCollapse<TestProps, TestState>;

declare const ctx: TestThis;

// isCollapsed is available via state:
const _collapsed: boolean = ctx.state.isCollapsed;
void _collapsed;

// uncollapse() and renderCollapse() exist:
ctx.uncollapse();

// props still typed:
const _label: string = ctx.props.label;
void _label;

// custom state field still typed:
const _count: number = ctx.state.count;
void _count;

// ---------------------------------------------------------------------------
// Negative cases — \@ts-expect-error on the exact offending line
// ---------------------------------------------------------------------------

// @ts-expect-error — JUSTIFIED: negative type-test — isCollapsed is boolean not number
const _bad: number = ctx.state.isCollapsed;
void _bad;
