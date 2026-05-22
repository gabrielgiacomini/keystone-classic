import { expect } from 'chai';
import type { KeystoneList } from 'keystone';
import getDocumentName from 'keystone/lib/list/getDocumentName';

describe('List.getDocumentName', function () {
	it('reads the mapped name path and optionally encodes HTML entities', function () {
		const list = {
			namePath: 'title',
		} as unknown as KeystoneList;
		const doc = {
			get(path: string) {
				return path === 'title' ? '<Ada & Bob>' : undefined;
			},
		};

		expect(getDocumentName.call(list, doc)).to.equal('<Ada & Bob>');
		expect(getDocumentName.call(list, doc, true)).to.equal('&lt;Ada &amp; Bob&gt;');
	});

	it('uses the configured name field formatter before escaping', function () {
		const list = {
			nameField: {
				format() {
					return 'Tom & Ada';
				},
			},
			namePath: 'title',
		} as unknown as KeystoneList;
		const doc = {
			get() {
				return 'Ignored';
			},
		};

		expect(getDocumentName.call(list, doc, true)).to.equal('Tom &amp; Ada');
	});
});
