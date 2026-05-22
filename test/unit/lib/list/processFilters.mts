import { expect } from 'chai';
import processFilters from 'keystone/lib/list/processFilters';

describe('list processFilters', function () {
	it('parses inverse, exact, type, operator, and multi-value filter tokens', function () {
		const list = {
			fields: {
				count: { path: 'count' },
				state: { path: 'state' },
				title: { path: 'title' },
			},
		};

		const filters = processFilters.call(
			list as unknown as import('keystone').KeystoneList,
			'title:!:=:$text:Launch;state:$select:draft:published;count:gt:10',
		);

		expect(filters.title).to.deep.include({
			exact: true,
			inverse: true,
			key: 'title',
			operator: null,
			path: 'title',
			type: 'text',
			value: 'Launch',
		});
		expect(filters.title?.field).to.equal(list.fields.title);
		expect(filters.state).to.deep.include({
			exact: false,
			inverse: false,
			key: 'state',
			operator: null,
			path: 'state',
			type: 'select',
		});
		expect(filters.state?.value).to.deep.equal(['draft', 'published']);
		expect(filters.count).to.deep.include({
			key: 'count',
			operator: 'gt',
			value: '10',
		});
	});
});
