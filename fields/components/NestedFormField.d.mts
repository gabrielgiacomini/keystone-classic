/**
 * @file Hand-authored declaration for fields/components/NestedFormField.mjs
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Phase 11
 */
import type React from 'react';

export interface NestedFormFieldProps {
	/** The field input(s) rendered below the label. */
	children?: React.ReactNode;
	/** Additional CSS class names forwarded to the FormField. */
	className?: string;
	/** Text content of the field label. */
	label?: string;
	[key: string]: unknown;
}

declare const NestedFormField: React.FC<NestedFormFieldProps>;
export default NestedFormField;
