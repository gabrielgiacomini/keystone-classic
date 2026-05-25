import { expect } from 'chai';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import {
	getFieldComponents,
	registry,
} from '../../../../../dist/admin/shared/fields/registry.js';
import {
	registerCustomFieldComponents,
	registerLegacyCustomFieldComponents,
	registerRuntimeCustomFieldComponents,
} from '../../../../../dist/admin/shared/fields/customFields.js';
import type { FieldComponentSet } from '../../../../../admin/shared/fields/types.ts';
import type { LegacyFieldComponentSet } from '../../../../../admin/shared/fields/legacyAdapters.ts';

function NullComponent(): null {
	return null;
}

describe('admin shared custom field registration', function () {
	afterEach(function () {
		delete registry.__modernCustomText__;
		delete registry.__legacyCustomText__;
		delete registry.__runtimeModernText__;
		delete registry.__runtimeLegacyText__;
		delete (globalThis as { window?: unknown }).window;
		delete (globalThis as { Keystone?: unknown }).Keystone;
	});

	it('registers modern custom field component sets by runtime type name', function () {
		const set: FieldComponentSet<unknown, unknown> = {
			Field: NullComponent,
			Filter: NullComponent,
			Column: NullComponent,
			defaultFilterValue: null,
		};

		const registered = registerCustomFieldComponents({ __modernCustomText__: set });

		expect(registered).to.deep.equal(['__modernCustomText__']);
		expect(getFieldComponents('__modernCustomText__')).to.equal(set);
	});

	it('registers legacy custom field component sets through the compatibility adapter', function () {
		const legacySet: LegacyFieldComponentSet = {
			Field() {
				return React.createElement('span', null, 'legacy field');
			},
			Filter() {
				return React.createElement('span', null, 'legacy filter');
			},
			Column() {
				return React.createElement('span', null, 'legacy column');
			},
			defaultFilterValue: '',
		};

		const registered = registerLegacyCustomFieldComponents({ __legacyCustomText__: legacySet });
		const set = getFieldComponents('__legacyCustomText__');

		expect(registered).to.deep.equal(['__legacyCustomText__']);
		expect(renderToStaticMarkup(React.createElement(set.Field, {
			fieldName: 'customTitle',
			label: 'Custom Title',
			value: 'x',
			onChange() {},
			isRequired: false,
			isReadonly: false,
			errors: [],
			meta: { fieldType: 'text', label: 'Custom Title', path: 'customTitle' },
		}))).to.equal('<span>legacy field</span>');
	});

	it('registers custom fields from the window Keystone runtime bootstrap', function () {
		const modernSet: FieldComponentSet<unknown, unknown> = {
			Field: NullComponent,
			Filter: NullComponent,
			Column: NullComponent,
			defaultFilterValue: null,
		};
		const legacySet: LegacyFieldComponentSet = {
			Field() {
				return React.createElement('span', null, 'runtime legacy field');
			},
			Filter: NullComponent,
			Column: NullComponent,
			defaultFilterValue: '',
		};
		(globalThis as { window?: unknown }).window = {
			Keystone: {
				fieldComponents: { __runtimeModernText__: modernSet },
				legacyFieldComponents: { __runtimeLegacyText__: legacySet },
			},
		};

		const registered = registerRuntimeCustomFieldComponents();

		expect(registered).to.deep.equal({
			modern: ['__runtimeModernText__'],
			legacy: ['__runtimeLegacyText__'],
		});
		expect(getFieldComponents('__runtimeModernText__')).to.equal(modernSet);
		expect(renderToStaticMarkup(React.createElement(getFieldComponents('__runtimeLegacyText__').Field, {
			fieldName: 'runtimeTitle',
			label: 'Runtime Title',
			value: 'x',
			onChange() {},
			isRequired: false,
			isReadonly: false,
			errors: [],
			meta: { fieldType: 'text', label: 'Runtime Title', path: 'runtimeTitle' },
		}))).to.equal('<span>runtime legacy field</span>');
	});
});
