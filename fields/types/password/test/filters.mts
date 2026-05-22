import { expect } from 'chai';
import PasswordType from '../PasswordType.mjs';

export const initList = function (List: import('../../test-helpers.mjs').TestList) {
	List.add({
		password: PasswordType,
	});
};

export const getTestItems = function () {
	return [
		{},
		{ password: '' },
		{ password: ' ' },
		{ password: null },
		{ password: 'abc123' },
		{ password: 'ABC123' },
	];
};

export const testFilters = function (_List: import('../../test-helpers.mjs').TestList, filter: import('../../test-helpers.mjs').TestFilterFn) {
	it('should filter for existance', function (done) {
		filter({
			password: {
				exists: true,
			},
		}, 'password', function (results: import('../../test-helpers.mjs').TestDoc[]) {
			expect(results.length).to.eql(3);
			// Make sure the passwords are hashed by checking that the length
			// of the returned strings is above the longest password specified
			// above
			expect((results[0] as Record<string, unknown>).length).to.be.greaterThan(6);
			expect((results[1] as Record<string, unknown>).length).to.be.greaterThan(6);
			expect((results[2] as Record<string, unknown>).length).to.be.greaterThan(6);
			done();
		});
	});

	it('should filter for non-existance', function (done) {
		filter({
			password: {
				exists: false,
			},
		}, 'password', function (results: import('../../test-helpers.mjs').TestDoc[]) {
			expect(results.length).to.eql(3);
			expect(results[0]).to.be.undefined;
			expect(results[1]).to.be.undefined;
			expect(results[2]).to.be.undefined;
			done();
		});
	});
};
