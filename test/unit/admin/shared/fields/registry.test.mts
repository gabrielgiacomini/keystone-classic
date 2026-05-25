import { expect } from 'chai';
import React from 'react';

import {
	assertAllFieldsRegistered,
	getFieldComponents,
	getUnregisteredFieldTypes,
	registerField,
	registry,
} from '../../../../../admin/shared/fields/registry.ts';
import type { FieldComponentSet } from '../../../../../admin/shared/fields/types.ts';

function NullComponent(): null {
	return null;
}

describe('admin shared field registry', function () {
	it('falls back for unknown field types and reports unregistered built-in fields', function () {
		const originalWarn = console.warn;
		const warnings: string[] = [];
		console.warn = (message?: unknown) => {
			warnings.push(String(message));
		};
		try {
			const components = getFieldComponents('__custom__');
			expect(components.Field).to.be.a('function');
			expect(getUnregisteredFieldTypes()).to.include('text');
			expect(() => assertAllFieldsRegistered()).to.throw('Missing field component registrations');
		} finally {
			console.warn = originalWarn;
		}
		expect(warnings).to.deep.equal([
			'[FieldRegistry] Unknown field type "__custom__". Falling back to stub components.',
		]);
	});

	it('registers component sets by field type', function () {
		const previousTextSet = registry.text;
		expect(previousTextSet).to.not.equal(undefined);
		const set: FieldComponentSet<unknown, unknown> = {
			Field: NullComponent,
			Filter: NullComponent,
			Column: NullComponent,
			defaultFilterValue: null,
		};

		try {
			registerField('text', set);
			expect(getFieldComponents('text')).to.equal(set);
			expect(React.isValidElement(React.createElement(set.Field, {
				fieldName: 'title',
				label: 'Title',
				value: '',
				onChange() {},
				isRequired: false,
				isReadonly: false,
				errors: [],
				meta: { fieldType: 'text', label: 'Title', path: 'title' },
			}))).to.equal(true);
		} finally {
			registry.text = previousTextSet as FieldComponentSet<unknown, unknown>;
		}
	});

	it('registers custom component sets without affecting built-in completeness checks', function () {
		const customType = '__custom_text__';
		const set: FieldComponentSet<unknown, unknown> = {
			Field: NullComponent,
			Filter: NullComponent,
			Column: NullComponent,
			defaultFilterValue: null,
		};

		try {
			registerField(customType, set);
			expect(getFieldComponents(customType)).to.equal(set);
			expect(getUnregisteredFieldTypes()).to.not.include(customType);
		} finally {
			Reflect.deleteProperty(registry, customType);
		}
	});
});
