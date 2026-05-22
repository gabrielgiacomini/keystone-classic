/**
 * @file Hand-authored TypeScript declaration for fields/types/Field.mjs.
 *
 * This file provides type information for the legacy `Field.create()` factory
 * used by all field components in the KeystoneJS Admin UI.
 *
 * The runtime implementation lives in Field.mjs which is intentionally left
 * unmodified. This declaration file is loaded by TypeScript via the standard
 * `.d.mts` declaration sidecar convention.
 *
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Phase 1 Foundation Specification
 */

import type React from 'react';

/**
 * The `this` context available inside all methods of a `FieldSpec`.
 *
 * Generic parameters:
 *   P — the component's props interface
 *   S — the component's state interface
 */
export type FieldThis<P, S> = {
	props: Readonly<P>;
	state: Readonly<S>;
	setState(updater: Partial<S> | ((prev: Readonly<S>) => Partial<S>)): void;
	refs: Record<string, React.ReactInstance>;
	forceUpdate(callback?: () => void): void;
};

/** State contributed by the Collapse mixin. */
export interface CollapseState {
	isCollapsed: boolean;
}

/**
 * Methods contributed by Mixins.Collapse to a field component.
 * `S` must extend CollapseState (the mixin contributes isCollapsed to state).
 */
export interface CollapseMethods<P, S extends CollapseState> {
	uncollapse(this: FieldThis<P, S>): void;
	renderCollapse(this: FieldThis<P, S>): React.ReactElement | null;
}

/**
 * Convenience intersection for a field component that uses Mixins.Collapse.
 * Use as the `this` type in field specs that include the Collapse mixin:
 *
 * @example
 * type MyFieldThis = WithCollapse<MyFieldProps, MyFieldState>;
 * // Then inside Field.create<MyFieldProps, MyFieldState & CollapseState>({ ... })
 * // `this` is typed as FieldThis<MyFieldProps, MyFieldState & CollapseState>
 * // with uncollapse() and renderCollapse() available.
 */
export type WithCollapse<P, S> = FieldThis<P, S & CollapseState> & CollapseMethods<P, S & CollapseState>;

/**
 * The spec object passed to `Field.create<P, S>()`.
 *
 * All methods receive a correctly-typed `this` via `ThisType<FieldThis<P, S>>`.
 * The index signature `[key: string]: ...` is an escape hatch for custom
 * methods not enumerated here; it will be narrowed once all known methods
 * are catalogued (see Open Decision #3 in 00-GOAL.md).
 */
export interface FieldSpec<P, S> {
	displayName?: string;
	statics?: { type: string; [key: string]: unknown };
	/** propTypes preserved at runtime for React 15 prop validation. */
	// eslint-disable-next-line @typescript-eslint/no-deprecated -- React 15 field declarations still expose React.Validator.
	propTypes?: Partial<Record<keyof P, React.Validator<P[keyof P]>>>;
	getInitialState?(this: FieldThis<P, S>): S;
	getDefaultProps?(): Partial<P>;
	componentWillMount?(this: FieldThis<P, S>): void;
	componentDidMount?(this: FieldThis<P, S>): void;
	componentWillReceiveProps?(this: FieldThis<P, S>, nextProps: P): void;
	componentWillUnmount?(this: FieldThis<P, S>): void;
	renderFormInput?(this: FieldThis<P, S>): React.ReactElement | undefined;
	renderUI?(this: FieldThis<P, S>): React.ReactElement;
	render?(this: FieldThis<P, S>): React.ReactElement | null;
	/** Escape hatch for custom methods not yet enumerated above. */
	[key: string]: unknown;
}

/**
 * Creates a new React 15 field component.
 *
 * @param spec The field spec. All methods inside `spec` have `this` typed
 *             as `FieldThis<P, S>` so callers get full autocomplete on
 *             `this.props`, `this.state`, and `this.setState`.
 * @returns A `React.ComponentClass<P>` — the built class-based component.
 *
 * @example
 * ```ts
 * interface MyFieldProps { label: string; path: string; value?: string; }
 * interface MyFieldState { isLoading: boolean; }
 *
 * export default Field.create<MyFieldProps, MyFieldState>({
 *   displayName: 'MyField',
 *   getInitialState() { return { isLoading: false }; },
 *   render() {
 *     const { label, value } = this.props;   // typed
 *     return <span>{label}: {value}</span>;
 *   },
 * });
 * ```
 */
export declare function create<
	P = Record<string, unknown>,
	S = Record<string, unknown>,
>(spec: FieldSpec<P, S> & ThisType<FieldThis<P, S>>): React.ComponentClass<P>;

/**
 * The base mixin object whose methods are merged into every field created
 * by `Field.create()`. Typed as a record of named methods/values because the
 * exact shape is not needed by consumers — they inherit it via `create()`.
 */
export declare const Base: Record<string, (...args: unknown[]) => unknown>;

/**
 * Built-in mixin namespaces. `Collapse` is prepended to every field's mixins
 * array automatically by `create()`.
 */
export declare const Mixins: {
	Collapse: CollapseMethods<unknown, CollapseState> & {
		componentWillMount(this: FieldThis<unknown, CollapseState>): void;
		componentDidUpdate(this: FieldThis<unknown, CollapseState>, prevProps: unknown, prevState: CollapseState): void;
	};
};

/** Default export mirrors the named exports for CJS-style `import Field`. */
declare const Field: {
	Base: typeof Base;
	Mixins: typeof Mixins;
	create: typeof create;
};
export default Field;
