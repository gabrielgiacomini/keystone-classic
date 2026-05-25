import { expect } from 'chai';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import type {
	LegacyColumnProps,
	LegacyFieldProps,
	LegacyFilterProps,
} from '../../../../../admin/shared/fields/legacyAdapters.ts';
import {
	legacyColumnToModernColumn,
	legacyComponentsToModernFieldSet,
	legacyFieldToModernField,
	legacyFilterToModernFilter,
	registerLegacyFieldComponents,
} from '../../../../../dist/admin/shared/fields/legacyAdapters.js';
import {
	getFieldComponents,
	registry,
} from '../../../../../dist/admin/shared/fields/registry.js';

const textMeta = {
	fieldType: 'text',
	label: 'Title',
	path: 'title',
} as const;

describe('admin shared legacy field adapters', function () {
	it('adapts legacy Field props and unwraps legacy change payloads', function () {
		let receivedProps: LegacyFieldProps | undefined;
		const receivedValues: unknown[] = [];
		function LegacyField(props: LegacyFieldProps) {
			receivedProps = props;
			props.onChange({ path: props.path, value: 'changed title' });
			return React.createElement('span', null, String(props.value));
		}

		const Field = legacyFieldToModernField(LegacyField);
		const html = renderToStaticMarkup(React.createElement(Field, {
			fieldName: 'title',
			label: 'Title',
			value: 'Original title',
			onChange(value: unknown) {
				receivedValues.push(value);
			},
			isRequired: true,
			isReadonly: false,
			errors: ['Required'],
			meta: textMeta,
		}));

		expect(html).to.equal('<span>Original title</span>');
		expect(receivedProps?.path).to.equal('title');
		expect(receivedProps?.type).to.equal('text');
		expect(receivedProps?.required).to.equal(true);
		expect(receivedProps?.errors).to.deep.equal(['Required']);
		expect(receivedValues).to.deep.equal(['changed title']);
	});

	it('adapts legacy upload-style Field payloads without unwrapping plain values', function () {
		const receivedValues: unknown[] = [];
		const uploadValue = { filename: 'contract.pdf', size: 1024 };
		function LegacyUploadField(props: LegacyFieldProps) {
			props.onChange(uploadValue);
			return React.createElement('span', null, 'upload');
		}

		const Field = legacyFieldToModernField(LegacyUploadField);
		renderToStaticMarkup(React.createElement(Field, {
			fieldName: 'attachment',
			label: 'Attachment',
			value: null,
			onChange(value: unknown) {
				receivedValues.push(value);
			},
			isRequired: false,
			isReadonly: false,
			errors: [],
			meta: { fieldType: 'file', label: 'Attachment', path: 'attachment' },
		}));

		expect(receivedValues).to.deep.equal([uploadValue]);
	});

	it('adapts legacy Filter props and preserves filter value changes', function () {
		let receivedProps: LegacyFilterProps | undefined;
		const changedValues: unknown[] = [];
		function LegacyFilter(props: LegacyFilterProps) {
			receivedProps = props;
			props.onChange({ mode: 'contains', value: 'abc' });
			return React.createElement('span', null, 'filter');
		}

		const Filter = legacyFilterToModernFilter(LegacyFilter);
		renderToStaticMarkup(React.createElement(Filter, {
			fieldName: 'title',
			value: { mode: 'contains', value: '' },
			onChange(value: unknown) {
				changedValues.push(value);
			},
			meta: textMeta,
		}));

		expect(receivedProps?.field.path).to.equal('title');
		expect(receivedProps?.field.type).to.equal('text');
		expect(receivedProps?.filter).to.deep.equal({ mode: 'contains', value: '' });
		expect(changedValues).to.deep.equal([{ mode: 'contains', value: 'abc' }]);
	});

	it('adapts legacy Column props into legacy row data shape', function () {
		let receivedProps: LegacyColumnProps | undefined;
		function LegacyColumn(props: LegacyColumnProps) {
			receivedProps = props;
			return React.createElement('span', null, String(props.data.fields[props.col.path as string]));
		}

		const Column = legacyColumnToModernColumn(LegacyColumn);
		const html = renderToStaticMarkup(React.createElement(Column, {
			fieldName: 'title',
			value: 'Column title',
			meta: textMeta,
		}));

		expect(html).to.equal('<span>Column title</span>');
		expect(receivedProps?.col.path).to.equal('title');
		expect(receivedProps?.col.type).to.equal('text');
		expect(receivedProps?.data.fields).to.deep.equal({ title: 'Column title' });
	});

	it('adapts relationship-like legacy Column props with field metadata', function () {
		let receivedProps: LegacyColumnProps | undefined;
		function LegacyRelationshipColumn(props: LegacyColumnProps) {
			receivedProps = props;
			const field = props.col.field as Record<string, unknown>;
			return React.createElement('a', null, `${String(field.refList)}:${String(props.data.fields[props.col.path as string])}`);
		}

		const Column = legacyColumnToModernColumn(LegacyRelationshipColumn);
		const html = renderToStaticMarkup(React.createElement(Column, {
			fieldName: 'author',
			value: 'user-1',
			meta: {
				fieldType: 'relationship',
				label: 'Author',
				path: 'author',
				refList: 'User',
				many: false,
			},
		}));

		expect(html).to.equal('<a>User:user-1</a>');
		expect(receivedProps?.col.field).to.deep.include({
			path: 'author',
			type: 'relationship',
			refList: 'User',
		});
	});

	it('builds a modern component set from legacy components', function () {
		function LegacyField() {
			return React.createElement('span', null, 'field');
		}
		function LegacyFilter() {
			return React.createElement('span', null, 'filter');
		}
		LegacyFilter.getDefaultValue = () => ({ mode: 'contains', value: '' });
		function LegacyColumn() {
			return React.createElement('span', null, 'column');
		}

		const set = legacyComponentsToModernFieldSet({
			Field: LegacyField,
			Filter: LegacyFilter,
			Column: LegacyColumn,
		});

		expect(set.defaultFilterValue).to.deep.equal({ mode: 'contains', value: '' });
		expect(renderToStaticMarkup(React.createElement(set.Field, {
			fieldName: 'title',
			label: 'Title',
			value: 'x',
			onChange() {},
			isRequired: false,
			isReadonly: false,
			errors: [],
			meta: textMeta,
		}))).to.equal('<span>field</span>');
	});

	it('registers legacy component sets under custom field type names', function () {
		const customType = '__legacy_custom_text__';
		function LegacyField() {
			return React.createElement('span', null, 'field');
		}
		function LegacyFilter() {
			return React.createElement('span', null, 'filter');
		}
		function LegacyColumn() {
			return React.createElement('span', null, 'column');
		}

		try {
			const set = registerLegacyFieldComponents(customType, {
				Field: LegacyField,
				Filter: LegacyFilter,
				Column: LegacyColumn,
				defaultFilterValue: '',
			});

			expect(getFieldComponents(customType)).to.equal(set);
			expect(renderToStaticMarkup(React.createElement(set.Column, {
				fieldName: 'customTitle',
				value: 'x',
				meta: textMeta,
			}))).to.equal('<span>column</span>');
		} finally {
			Reflect.deleteProperty(registry, customType);
		}
	});
});
