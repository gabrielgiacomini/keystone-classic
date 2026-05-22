/**
 * @file Hand-authored declaration for fields/components/Checkbox.mjs
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Phase 11
 */
import type React from 'react';

export interface CheckboxProps {
	/** Whether the checkbox is currently checked. */
	checked?: boolean;
	/** The element type used to render the checkbox button. Defaults to `'button'`. */
	component?: React.ElementType;
	/** Called with the new boolean value when the checkbox is toggled. */
	onChange?: (checked: boolean) => void;
	/** When true, the checkbox is non-interactive (read-only display). */
	readonly?: boolean;
	[key: string]: unknown;
}

declare const Checkbox: React.ComponentClass<CheckboxProps>;
export default Checkbox;
