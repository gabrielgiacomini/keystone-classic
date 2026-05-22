import { expect } from 'chai';

export const initList = function (List: import('../../test-helpers.mjs').TestList) {
	List.add({
		bool: Boolean,
	});
};

export const getTestItems = function () {
	return [
		{ bool: undefined },
		{ bool: true },
		{ bool: false },
	];
};

export const testFilters = function (_List: import('../../test-helpers.mjs').TestList, filter: import('../../test-helpers.mjs').TestFilterFn) {
	it('should filter true values', function (done) {
		filter({
			bool: {
				value: 'true',
			},
		}, 'bool', function (results: import('../../test-helpers.mjs').TestDoc[]) {
			expect(results).to.eql([
				true,
			]);
			done();
		});
	});

	it('should filter falsy values', function (done) {
		filter({
			bool: {
				value: 'false',
			},
		}, 'bool', function (results: import('../../test-helpers.mjs').TestDoc[]) {
			expect(results).to.eql([
				false,
				false,
			]);
			done();
		});
	});
};
