/**
 * @file Hand-authored TypeScript declaration for fields/mixins/ArrayField.mjs.
 *
 * This file provides type information for the `ArrayField` mixin, which is
 * used by DateArray, NumberArray, and TextArray field types to manage an array
 * of values (add, remove, update, render).
 *
 * The runtime implementation lives in ArrayField.mjs which is intentionally
 * left unmodified. This declaration file is loaded by TypeScript via the
 * standard `.d.mts` declaration sidecar convention.
 *
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Phase 2 Mixins specification
 */

import type React from 'react';
import type { FieldThis } from '../../fields/types/Field.d.mts';

/**
 * The shape of each item in the values array managed by the ArrayField mixin.
 */
export interface ArrayItem {
	key: string;
	value: string | number;
}

/**
 * State contributed by the ArrayField mixin.
 */
export interface ArrayFieldState {
	values: ArrayItem[];
}

/**
 * Methods contributed by the ArrayField mixin to a field component.
 * `S` must extend ArrayFieldState (the mixin contributes values to state).
 */
export interface ArrayFieldMethods<P, S extends ArrayFieldState> {
	addItem(this: FieldThis<P, S>): void;
	removeItem(this: FieldThis<P, S>, item: ArrayItem): void;
	updateItem(this: FieldThis<P, S>, item: ArrayItem, event: { value?: string | number } | React.ChangeEvent<HTMLInputElement>): void;
	valueChanged(this: FieldThis<P, S>, values: Array<string | number>): void;
	renderField(this: FieldThis<P, S>): React.ReactElement;
	renderItem(this: FieldThis<P, S>, item: ArrayItem, index: number): React.ReactElement;
	renderValue(this: FieldThis<P, S>): React.ReactElement;
	shouldCollapse(this: FieldThis<P, S>): boolean;
	addItemOnEnter(this: FieldThis<P, S>, event: React.KeyboardEvent): void;
}

/**
 * Convenience intersection for a field component that uses the ArrayField mixin.
 * Use as the `this` type in field specs that include the ArrayField mixin:
 *
 * @example
 * type TextArrayThis = WithArrayField<TextArrayProps, TextArrayState>;
 * // Then inside Field.create<TextArrayProps, TextArrayState & ArrayFieldState>({ ... })
 * // `this` is typed as FieldThis<TextArrayProps, TextArrayState & ArrayFieldState>
 * // with all ArrayField methods available.
 */
export type WithArrayField<P, S> = FieldThis<P, S & ArrayFieldState> & ArrayFieldMethods<P, S & ArrayFieldState>;

/**
 * The ArrayField mixin object whose methods are merged into array-type field
 * components. Includes `getInitialState` and `componentWillReceiveProps` which
 * are lifecycle methods not part of `ArrayFieldMethods` (they are mixin-internal
 * and not intended to be called by consumers directly).
 */
declare const ArrayField: ArrayFieldMethods<unknown, ArrayFieldState> & {
	getInitialState(this: FieldThis<unknown, ArrayFieldState>): ArrayFieldState;
	componentWillReceiveProps(this: FieldThis<unknown, ArrayFieldState>, nextProps: unknown): void;
};
export default ArrayField;
