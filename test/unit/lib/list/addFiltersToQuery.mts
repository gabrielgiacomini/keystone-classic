import { expect } from 'chai';
import addFiltersToQuery from 'keystone/lib/list/addFiltersToQuery';

describe('list addFiltersToQuery', function () {
	it('combines multiple field $or filters with $and so neither condition is lost', function () {
		const list = {
			fields: {
				state: {
					path: 'state',
					addFilterToQuery() {
						return { $or: [{ state: 'draft' }, { state: 'review' }] };
					},
				},
				title: {
					path: 'title',
					addFilterToQuery() {
						return { $or: [{ title: /launch/i }, { slug: /launch/i }] };
					},
				},
				ignored: {
					path: 'ignored',
				},
			},
		};

		const query = addFiltersToQuery.call(
			list as unknown as import('keystone').KeystoneList,
			{
				state: { value: 'draft' },
				title: { value: 'launch' },
			},
		);

		expect(query).to.deep.equal({
			$and: [
				{ $or: [{ state: 'draft' }, { state: 'review' }] },
				{ $or: [{ title: /launch/i }, { slug: /launch/i }] },
			],
		});
	});
});
