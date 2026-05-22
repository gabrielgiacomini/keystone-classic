/**
 * @file Hand-authored declaration for fields/components/DateInput.mjs
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Phase 11
 */
import type React from 'react';

export interface DateChangeEvent {
	value: string;
}

export interface DateInputProps {
	/** Date format string (moment.js style). Defaults to `'YYYY-MM-DD'`. */
	format?: string;
	/** HTML name attribute for the underlying form input. */
	name?: string;
	/** Called when the selected date changes. */
	onChange: (event: DateChangeEvent) => void;
	/** The field path used as the input id. */
	path?: string;
	/** The current date value as a formatted string. */
	value?: string;
}

declare const DateInput: React.ComponentClass<DateInputProps>;
export default DateInput;
