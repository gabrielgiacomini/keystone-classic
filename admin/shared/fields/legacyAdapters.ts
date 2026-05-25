import React from 'react';
import type {
	ColumnProps,
	FieldComponentSet,
	FieldMeta,
	FieldProps,
	FilterProps,
} from './types.js';
import { registerField } from './registry.js';

type LegacyComponent<TProps> = React.ComponentType<TProps> & {
	getDefaultValue?: (field?: unknown) => unknown;
};

export interface LegacyFieldProps {
	field?: Record<string, unknown>;
	path: string;
	label: string;
	type: string;
	value: unknown;
	onChange: (value: unknown) => void;
	noedit?: boolean;
	required?: boolean;
	errors?: string[];
	[key: string]: unknown;
}

export interface LegacyFilterProps {
	field: Record<string, unknown>;
	filter: unknown;
	onChange: (value: unknown) => void;
	[key: string]: unknown;
}

export interface LegacyColumnProps {
	col: Record<string, unknown>;
	data: { id?: string; fields: Record<string, unknown>; [key: string]: unknown };
	linkTo?: string;
	[key: string]: unknown;
}

export interface LegacyFieldComponentSet {
	Field: LegacyComponent<LegacyFieldProps>;
	Filter: LegacyComponent<LegacyFilterProps>;
	Column: LegacyComponent<LegacyColumnProps>;
	defaultFilterValue?: unknown;
}

function legacyFieldMeta(meta: FieldMeta): Record<string, unknown> {
	return {
		...meta,
		type: meta.fieldType,
	};
}

function unwrapLegacyFieldChange(payload: unknown): unknown {
	if (
		typeof payload === 'object'
		&& payload !== null
		&& 'value' in payload
	) {
		return (payload as { value: unknown }).value;
	}
	return payload;
}

export function legacyFieldToModernField(
	LegacyField: LegacyComponent<LegacyFieldProps>,
): React.ComponentType<FieldProps<unknown>> {
	function LegacyFieldAdapter(props: FieldProps<unknown>) {
		const field = legacyFieldMeta(props.meta);
		return React.createElement(LegacyField, {
			...field,
			field,
			path: props.fieldName,
			label: props.label,
			type: props.meta.fieldType,
			value: props.value,
			onChange: (value: unknown) => {
				props.onChange(unwrapLegacyFieldChange(value));
			},
			noedit: props.isReadonly,
			required: props.isRequired,
			errors: props.errors,
		});
	}
	LegacyFieldAdapter.displayName = `LegacyFieldAdapter(${LegacyField.displayName || LegacyField.name || 'Field'})`;
	return LegacyFieldAdapter;
}

export function legacyFilterToModernFilter(
	LegacyFilter: LegacyComponent<LegacyFilterProps>,
): React.ComponentType<FilterProps<unknown>> {
	function LegacyFilterAdapter(props: FilterProps<unknown>) {
		return React.createElement(LegacyFilter, {
			field: legacyFieldMeta(props.meta),
			filter: props.value,
			onChange: props.onChange,
		});
	}
	LegacyFilterAdapter.displayName = `LegacyFilterAdapter(${LegacyFilter.displayName || LegacyFilter.name || 'Filter'})`;
	return LegacyFilterAdapter;
}

export function legacyColumnToModernColumn(
	LegacyColumn: LegacyComponent<LegacyColumnProps>,
): React.ComponentType<ColumnProps<unknown>> {
	function LegacyColumnAdapter(props: ColumnProps<unknown>) {
		const field = legacyFieldMeta(props.meta);
		return React.createElement(LegacyColumn, {
			col: {
				field,
				label: props.meta.label,
				path: props.fieldName,
				type: props.meta.fieldType,
			},
			data: {
				fields: {
					[props.fieldName]: props.value,
				},
			},
		});
	}
	LegacyColumnAdapter.displayName = `LegacyColumnAdapter(${LegacyColumn.displayName || LegacyColumn.name || 'Column'})`;
	return LegacyColumnAdapter;
}

export function legacyComponentsToModernFieldSet(
	components: LegacyFieldComponentSet,
): FieldComponentSet<unknown, unknown> {
	return {
		Field: legacyFieldToModernField(components.Field),
		Filter: legacyFilterToModernFilter(components.Filter),
		Column: legacyColumnToModernColumn(components.Column),
		defaultFilterValue: components.defaultFilterValue
			?? components.Filter.getDefaultValue?.()
			?? null,
	};
}

/**
 * Registers a legacy custom field component set with the modern registry.
 *
 * This is the supported bridge for custom field authors during the convergence
 * window: existing legacy `Field`, `Filter`, and `Column` components can be
 * adapted into the modern admin registry without depending on `FieldTypes` or
 * runtime bundling for the built-in admin shell.
 */
export function registerLegacyFieldComponents(
	typeName: string,
	components: LegacyFieldComponentSet,
): FieldComponentSet<unknown, unknown> {
	const set = legacyComponentsToModernFieldSet(components);
	registerField(typeName, set);
	return set;
}
