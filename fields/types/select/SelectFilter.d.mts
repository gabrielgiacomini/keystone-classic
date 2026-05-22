/**
 * @file Hand-authored TypeScript declaration for fields/types/select/SelectFilter.mjs.
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Audit pass (Recipe B)
 */
import type React from 'react';

/** A single select option as used by the field descriptor. */
export interface SelectOption {
	label: string;
	value: string;
}

/** The filter value shape for the SelectFilter. */
export interface SelectFilterValue {
	/** Whether to invert the filter (does NOT match). */
	inverted: boolean;
	/** Array of selected option values. */
	value: string[];
}

/** The field descriptor shape expected by SelectFilter. */
export interface SelectFilterField {
	/** Display label for the field. */
	label?: string;
	/** Available options for the select field. */
	ops: SelectOption[];
}

/** Props accepted by the SelectFilter component. */
export interface SelectFilterProps {
	/** The current filter value. */
	filter: SelectFilterValue;
	/** The field descriptor. */
	field: SelectFilterField;
	/** Callback invoked when the filter value changes. */
	onChange: (value: SelectFilterValue) => void;
}

/** Renders a popout list of options with invert toggle for filtering select fields. */
declare const SelectFilter: React.ComponentClass<SelectFilterProps> & {
	getDefaultValue: () => SelectFilterValue;
};

export default SelectFilter;
