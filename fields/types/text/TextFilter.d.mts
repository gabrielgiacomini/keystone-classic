/**
 * @file Hand-authored TypeScript declaration for fields/types/text/TextFilter.mjs.
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Audit pass (Recipe B)
 */
import type React from 'react';

/** Valid filter mode values for the TextFilter. */
export type TextFilterMode = 'contains' | 'exactly' | 'beginsWith' | 'endsWith';

/** The filter value shape for the TextFilter. */
export interface TextFilterValue {
	mode: TextFilterMode;
	inverted: boolean;
	value: string;
}

/** Props accepted by the TextFilter component. */
export interface TextFilterProps {
	/** The current filter value. */
	filter: TextFilterValue;
	/** The field descriptor — used for label in the placeholder. */
	field: Record<string, unknown>;
	/** Callback invoked when the filter value changes. */
	onChange: (value: TextFilterValue) => void;
}

/** Renders a text filter UI (mode select + invert toggle + text input). */
declare const TextFilter: React.ComponentClass<TextFilterProps> & {
	getDefaultValue: () => TextFilterValue;
};

export default TextFilter;
