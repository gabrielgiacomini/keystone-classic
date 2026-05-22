import { expect } from 'chai';
import type { KeystoneList } from 'keystone';
import addSearchToQuery from 'keystone/lib/list/addSearchToQuery';
import getSearchFilters from 'keystone/lib/list/getSearchFilters';

function regexpSource(value: unknown): string {
	expect(value).to.be.instanceOf(RegExp);
	return (value as RegExp).source;
}

describe('list search and admin filters', function () {
	it('escapes literal search text when building addSearchToQuery regex filters', function () {
		const list = {
			options: {},
			searchFields: [{ path: 'title' }],
			autokey: null,
			mappings: { name: 'title' },
			fields: { title: { type: 'text' } },
		};

		const query = addSearchToQuery.call(list as unknown as KeystoneList, 'launch (v2).*');

		expect(regexpSource(query.title)).to.equal('launch \\(v2\\)\\.\\*');
	});

	it('keeps ObjectId search support when no configured text field matches', function () {
		const id = '507f1f77bcf86cd799439011';
		const list = {
			options: {},
			searchFields: [],
			autokey: null,
			mappings: { name: null },
			fields: {},
		};

		const query = addSearchToQuery.call(list as unknown as KeystoneList, id);

		expect(query).to.deep.equal({ _id: id });
	});

	it('escapes exact admin text filters', function () {
		const list = {
			options: {},
			get() {
				return [];
			},
			autokey: null,
			mappings: { name: null },
			fields: {},
			key: 'Post',
		};

		const filters = getSearchFilters.call(list as unknown as KeystoneList, '', {
			title: {
				key: 'title',
				value: 'launch (v2).*',
				field: { type: 'text' },
				exact: true,
			},
		});

		expect(regexpSource(filters.title)).to.equal('^launch \\(v2\\)\\.\\*$');
	});

	it('parses money range filters with the local legacy-compatible number helper', function () {
		const list = {
			options: {},
			get() {
				return [];
			},
			autokey: null,
			mappings: { name: null },
			fields: {},
			key: 'Invoice',
		};

		const filters = getSearchFilters.call(list as unknown as KeystoneList, '', {
			total: {
				key: 'total',
				value: ['$1,000.50', '$2,000'],
				field: { type: 'money' },
				operator: 'bt',
			},
		});

		expect(filters.total).to.deep.equal({ $gte: 1000.5, $lte: 2000 });
	});
});
