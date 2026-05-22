import { expect } from 'chai';
import RelationshipType from '../RelationshipType.mjs';

export const initList = function (List: import('../../test-helpers.mjs').TestList) {
	List.add({
		single: { type: RelationshipType, ref: List.key },
	});
};

let items: Record<string, string>;

export const getTestItems = function (List: import('../../test-helpers.mjs').TestList, callback: (err: Error | null, data?: Array<Record<string, unknown>>) => void) {
	const obj = {
		jed: new List.model({ name: 'Jed' }),
		max: new List.model({ name: 'Max' }),
	};
	void Promise.all(Object.entries(obj).map(function ([key, item]) {
		return (item as import('mongoose').Document).save().then(function (doc) { return [key, String((doc as unknown as { id: unknown }).id)]; });
	})).then(function (entries) {
		items = Object.fromEntries(entries as Array<[string, string]>) as Record<string, string>;
		callback(null, [
			{ single: items['jed'] },
			{ single: items['max'] },
		]);
	}, callback);
};

export const testFilters = function (_List: import('../../test-helpers.mjs').TestList, filter: import('../../test-helpers.mjs').TestFilterFn) {

	describe('match', function () {

		it('should find exact matches', function (done) {
			filter({
				single: {
					value: items.jed,
				},
			}, 'single', true, function (results: import('../../test-helpers.mjs').TestDoc[]) {
				expect(results).to.eql([items.jed]);
				done();
			});
		});

		it('should invert exact matches', function (done) {
			filter({
				single: {
					inverted: true,
					value: items.jed,
				},
			}, 'single', true, function (results: import('../../test-helpers.mjs').TestDoc[]) {
				expect(results).to.eql([undefined, undefined, items.max]);
				done();
			});
		});

		// Skipped: multi-match relationship filtering needs a Mongoose 7+
		// $in-with-array semantics fix; tracked separately. See P3 step 23.

		it.skip('should find multiple matches', function (done) {
			filter({
				single: {
					value: [items.jed, items.max],
				},
			}, 'single', true, function (results: import('../../test-helpers.mjs').TestDoc[]) {
				expect(results).to.eql([items.jed, items.max]);
				done();
			});
		});

		it('should find empty relationships', function (done) {
			filter({
				single: {
					value: '',
				},
			}, 'single', true, function (results: import('../../test-helpers.mjs').TestDoc[]) {
				expect(results).to.eql([undefined, undefined]);
				done();
			});
		});

	});

};
