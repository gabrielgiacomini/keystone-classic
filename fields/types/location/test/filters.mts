import { expect } from 'chai';
import LocationType from '../LocationType.mjs';

export const initList = function (List: import('../../test-helpers.mjs').TestList) {
	List.add({
		loc: LocationType,
	});
};

export const getTestItems = function () {
	return [
		{},
		{ loc: {
			number: 66,
			street1: 'Hofburg',
			street2: 'Schweizer Trakt',
			city: 'Vienna',
			postcode: '1010',
			country: 'Austria',
		} },
		{ loc: {
			number: 191,
			street1: 'Clarence St',
			state: 'NSW',
			suburb: 'Sydney',
			postcode: 2000,
			country: 'Australia',
		} },
		{ loc: {
			number: 61,
			street1: 'Albion Street',
			state: 'NSW',
			suburb: 'Surry Hills',
			postcode: '2010',
			country: 'Australia',
		} },
		{ loc: {
			number: 1799,
			street1: 'McAllister St',
			state: 'CA',
			city: 'San Francisco',
			postcode: '94117',
			country: 'USA',
		} },
	];
};

export const testFilters = function (_List: import('../../test-helpers.mjs').TestList, filter: import('../../test-helpers.mjs').TestFilterFn) {
	it('should filter by state', function (done) {
		filter({
			loc: {
				state: 'NSW',
			},
		}, 'loc', function (results: import('../../test-helpers.mjs').TestDoc[]) {
			expect(results.length).to.equal(2);

			expect((results[0] as Record<string, unknown>).number).to.eql('191');
			expect((results[0] as Record<string, unknown>).street1).to.eql('Clarence St');
			expect((results[0] as Record<string, unknown>).state).to.eql('NSW');
			expect((results[0] as Record<string, unknown>).suburb).to.eql('Sydney');
			expect((results[0] as Record<string, unknown>).postcode).to.eql('2000');
			expect((results[0] as Record<string, unknown>).country).to.eql('Australia');

			expect((results[1] as Record<string, unknown>).number).to.eql('61');
			expect((results[1] as Record<string, unknown>).street1).to.eql('Albion Street');
			expect((results[1] as Record<string, unknown>).state).to.eql('NSW');
			expect((results[1] as Record<string, unknown>).suburb).to.eql('Surry Hills');
			expect((results[1] as Record<string, unknown>).postcode).to.eql('2010');
			expect((results[1] as Record<string, unknown>).country).to.eql('Australia');

			done();
		});
	});

	it('should filter by country', function (done) {
		filter({
			loc: {
				country: 'Australia',
			},
		}, 'loc', function (results: import('../../test-helpers.mjs').TestDoc[]) {
			expect(results.length).to.equal(2);
			done();
		});
	});

	it('should filter by street', function (done) {
		filter({
			loc: {
				street: 'Clarence St',
			},
		}, 'loc', function (results: import('../../test-helpers.mjs').TestDoc[]) {
			expect(results.length).to.equal(1);
			done();
		});
	});

	it('should filter by city', function (done) {
		filter({
			loc: {
				city: 'Sydney',
			},
		}, 'loc', function (results: import('../../test-helpers.mjs').TestDoc[]) {
			expect(results.length).to.equal(1);
			done();
		});
	});

	it('should filter by postcode', function (done) {
		filter({
			loc: {
				code: 1010,
			},
		}, 'loc', function (results: import('../../test-helpers.mjs').TestDoc[]) {
			expect(results.length).to.equal(1);
			done();
		});
	});

	it('should filter by postcode string', function (done) {
		filter({
			loc: {
				code: '1010',
			},
		}, 'loc', function (results: import('../../test-helpers.mjs').TestDoc[]) {
			expect(results.length).to.equal(1);
			done();
		});
	});

	it('should find all elements', function (done) {
		filter({
			loc: {},
		}, 'loc', function (results: import('../../test-helpers.mjs').TestDoc[]) {
			expect(results.length).to.equal(5);
			done();
		});
	});
};
