/**
 * @file Type-level tests for the Field.create<P, S>() generic in
 * fields/types/Field.d.mts.
 *
 * Positive cases verify that the typed `this` is available inside spec
 * methods and that the return type is `React.ComponentClass<P>`.
 *
 * Negative cases use `@ts-expect-error` (ONLY permitted in test/types/) to
 * prove that type errors are caught at compile time.
 *
 * See .roadmap/legacy-admin-typing/00-GOAL.md § Foundation Specification.
 */

import Field from '../../fields/types/Field.mjs';
import type React from 'react';

// ---------------------------------------------------------------------------
// Positive cases
// ---------------------------------------------------------------------------

interface MyFieldProps {
	label: string;
	path: string;
	onChange: (change: { path: string; value: string }) => void;
	value?: string;
}

interface MyFieldState {
	isLoading: boolean;
}

const MyComponent = Field.create<MyFieldProps, MyFieldState>({
	displayName: 'MyComponent',
	statics: { type: 'MyType' },
	getInitialState() {
		return { isLoading: false };
	},
	myMethod(value: string) {
		// `this` should be typed as FieldThis<MyFieldProps, MyFieldState>
		this.props.onChange({ path: this.props.path, value });
		this.setState({ isLoading: true });
	},
	render() {
		return null;
	},
});

// MyComponent should be assignable to React.ComponentClass<MyFieldProps>
const _checkComponent: React.ComponentClass<MyFieldProps> = MyComponent;
void _checkComponent;

// Default state defaults to Record<string, unknown> — omitting S should work
interface MinimalProps { label: string }
const _MinimalComponent = Field.create<MinimalProps>({
	displayName: 'Minimal',
	render() {
		const _label: string = this.props.label;
		void _label;
		return null;
	},
});
void _MinimalComponent;

// Fully unparameterised call (both P and S default to Record<string, unknown>)
const _DefaultComponent = Field.create({
	displayName: 'DefaultComponent',
	render() {
		return null;
	},
});
void _DefaultComponent;

// setState with a function updater must compile
Field.create<MyFieldProps, MyFieldState>({
	resetLoading() {
		this.setState((_prev) => ({ isLoading: false }));
	},
});

// ---------------------------------------------------------------------------
// Negative cases — errors occur on specific lines inside spec methods.
// Each @ts-expect-error is placed directly above the offending line.
// ---------------------------------------------------------------------------

Field.create<MyFieldProps>({
	bad() {
		// @ts-expect-error — JUSTIFIED: negative type-test — `value` must be string, not number
		this.props.onChange({ path: this.props.path, value: 123 });
	},
});

Field.create<MyFieldProps>({
	bad() {
		// @ts-expect-error — JUSTIFIED: negative type-test — `foo` does not exist on MyFieldProps
		return this.props.foo;
	},
});

Field.create<MyFieldProps, MyFieldState>({
	bad() {
		// @ts-expect-error — JUSTIFIED: negative type-test — isLoading must be boolean, not string
		this.setState({ isLoading: 'yes' });
	},
});
