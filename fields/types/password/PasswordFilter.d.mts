/**
 * @file Hand-authored TypeScript declaration for fields/types/password/PasswordFilter.mjs.
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Audit pass (Recipe B)
 */
import type React from 'react';

/** The filter value shape for the PasswordFilter. */
export interface PasswordFilterValue {
	/** Whether the password field is set. */
	exists: boolean;
}

/** Props accepted by the PasswordFilter component. */
export interface PasswordFilterProps {
	/** The current filter value. */
	filter: PasswordFilterValue;
	/** Callback invoked when the filter value changes. */
	onChange: (value: PasswordFilterValue) => void;
}

/** Renders a segmented control to filter by whether the password is set. */
declare const PasswordFilter: React.ComponentClass<PasswordFilterProps> & {
	getDefaultValue: () => PasswordFilterValue;
};

export default PasswordFilter;
