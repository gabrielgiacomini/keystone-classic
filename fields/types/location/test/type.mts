import { expect } from 'chai';
import LocationType from '../LocationType.mjs';

export const initList = function (List: import('../../test-helpers.mjs').TestList) {
	List.add({
		locationBasic: { type: LocationType },
		locationCustomRequired: { type: LocationType, required: ['state', 'country'] },
	});
};

export const testFieldType = function (List: import('../../test-helpers.mjs').TestList) {
	describe('updateItem', function () {
		describe('flat paths', function () {
			it('should update the number', function (done) {
				const testItem = new List.model();
				List.fields.locationBasic!.updateItem(testItem, {
					'locationBasic.number': 'number',
				}, function () {
					expect((testItem.locationBasic as Record<string, unknown>).number).to.equal('number');
					done();
				});
			});

			it('should update the name', function (done) {
				const testItem = new List.model();
				List.fields.locationBasic!.updateItem(testItem, {
					'locationBasic.name': 'name',
				}, function () {
					expect((testItem.locationBasic as Record<string, unknown>).name).to.equal('name');
					done();
				});
			});

			it('should update the street1', function (done) {
				const testItem = new List.model();
				List.fields.locationBasic!.updateItem(testItem, {
					'locationBasic.street1': 'street1',
				}, function () {
					expect((testItem.locationBasic as Record<string, unknown>).street1).to.equal('street1');
					done();
				});
			});

			it('should update the street2', function (done) {
				const testItem = new List.model();
				List.fields.locationBasic!.updateItem(testItem, {
					'locationBasic.street2': 'street2',
				}, function () {
					expect((testItem.locationBasic as Record<string, unknown>).street2).to.equal('street2');
					done();
				});
			});

			it('should update the suburb', function (done) {
				const testItem = new List.model();
				List.fields.locationBasic!.updateItem(testItem, {
					'locationBasic.suburb': 'suburb',
				}, function () {
					expect((testItem.locationBasic as Record<string, unknown>).suburb).to.equal('suburb');
					done();
				});
			});

			it('should update the state', function (done) {
				const testItem = new List.model();
				List.fields.locationBasic!.updateItem(testItem, {
					'locationBasic.state': 'state',
				}, function () {
					expect((testItem.locationBasic as Record<string, unknown>).state).to.equal('state');
					done();
				});
			});

			it('should update the postcode', function (done) {
				const testItem = new List.model();
				List.fields.locationBasic!.updateItem(testItem, {
					'locationBasic.postcode': 'postcode',
				}, function () {
					expect((testItem.locationBasic as Record<string, unknown>).postcode).to.equal('postcode');
					done();
				});
			});

			it('should update the country', function (done) {
				const testItem = new List.model();
				List.fields.locationBasic!.updateItem(testItem, {
					'locationBasic.country': 'country',
				}, function () {
					expect((testItem.locationBasic as Record<string, unknown>).country).to.equal('country');
					done();
				});
			});

			it('should update the geo', function (done) {
				const testItem = new List.model();
				List.fields.locationBasic!.updateItem(testItem, {
					'locationBasic.geo': [3.14, 1.59],
				}, function () {
					expect(((testItem.locationBasic as Record<string, unknown>).geo as number[])[0]).to.equal(3.14);
					expect(((testItem.locationBasic as Record<string, unknown>).geo as number[])[1]).to.equal(1.59);
					done();
				});
			});
		});

		describe('nested paths', function () {
			it('should update the number', function (done) {
				const testItem = new List.model();
				List.fields.locationBasic!.updateItem(testItem, {
					locationBasic: {
						number: 'number',
					},
				}, function () {
					expect((testItem.locationBasic as Record<string, unknown>).number).to.equal('number');
					done();
				});
			});

			it('should update the name', function (done) {
				const testItem = new List.model();
				List.fields.locationBasic!.updateItem(testItem, {
					locationBasic: {
						name: 'name',
					},
				}, function () {
					expect((testItem.locationBasic as Record<string, unknown>).name).to.equal('name');
					done();
				});
			});

			it('should update the street1', function (done) {
				const testItem = new List.model();
				List.fields.locationBasic!.updateItem(testItem, {
					locationBasic: {
						street1: 'street1',
					},
				}, function () {
					expect((testItem.locationBasic as Record<string, unknown>).street1).to.equal('street1');
					done();
				});
			});

			it('should update the street2', function (done) {
				const testItem = new List.model();
				List.fields.locationBasic!.updateItem(testItem, {
					locationBasic: {
						street2: 'street2',
					},
				}, function () {
					expect((testItem.locationBasic as Record<string, unknown>).street2).to.equal('street2');
					done();
				});
			});

			it('should update the suburb', function (done) {
				const testItem = new List.model();
				List.fields.locationBasic!.updateItem(testItem, {
					locationBasic: {
						suburb: 'suburb',
					},
				}, function () {
					expect((testItem.locationBasic as Record<string, unknown>).suburb).to.equal('suburb');
					done();
				});
			});

			it('should update the state', function (done) {
				const testItem = new List.model();
				List.fields.locationBasic!.updateItem(testItem, {
					locationBasic: {
						state: 'state',
					},
				}, function () {
					expect((testItem.locationBasic as Record<string, unknown>).state).to.equal('state');
					done();
				});
			});

			it('should update the postcode', function (done) {
				const testItem = new List.model();
				List.fields.locationBasic!.updateItem(testItem, {
					locationBasic: {
						postcode: 'postcode',
					},
				}, function () {
					expect((testItem.locationBasic as Record<string, unknown>).postcode).to.equal('postcode');
					done();
				});
			});

			it('should update the country', function (done) {
				const testItem = new List.model();
				List.fields.locationBasic!.updateItem(testItem, {
					locationBasic: {
						country: 'country',
					},
				}, function () {
					expect((testItem.locationBasic as Record<string, unknown>).country).to.equal('country');
					done();
				});
			});

			it('should update the geo', function (done) {
				const testItem = new List.model();
				List.fields.locationBasic!.updateItem(testItem, {
					locationBasic: {
						geo: [3.14, 1.59],
					},
				}, function () {
					expect(((testItem.locationBasic as Record<string, unknown>).geo as number[])[0]).to.equal(3.14);
					expect(((testItem.locationBasic as Record<string, unknown>).geo as number[])[1]).to.equal(1.59);
					done();
				});
			});
		});

		it('should remove the location.geo path without valid values', function (done) {
			const testItem = new List.model();
			List.fields.locationBasic!.updateItem(testItem, {
				'locationBasic.geo': ['151.2099', '-33.865143'],
			}, function () {
				expect(((testItem.locationBasic as Record<string, unknown>).geo as number[])[0]).to.equal(151.2099);
				expect(((testItem.locationBasic as Record<string, unknown>).geo as number[])[1]).to.equal(-33.865143);

				List.fields.locationBasic!.updateItem(testItem, {
					'locationBasic.geo_lat': '',
					'locationBasic.geo_lng': '',
				}, function () {
					expect((testItem.locationBasic as Record<string, unknown>).geo).to.be.undefined;
					done();
				});
			});
		});
	});

	describe('validateInput', function () {

	});

	describe('kmFrom()', function () {
		it('should return a number', function () {
			const testItem = new List.model();

			testItem.locationBasic = {
				geo: [151.2093, -33.8688],
			};
			const diff = (testItem._ as import('../../test-helpers.mjs').TestVirtuals).locationBasic!.kmFrom!([151, -33]);
			expect(diff).to.eql(98.5390186615803);
		});
	});

	describe('milesFrom()', function () {
		it('should return a number', function () {
			const testItem = new List.model();

			testItem.locationBasic = {
				geo: [151.2093, -33.8688],
			};
			const diff = (testItem._ as import('../../test-helpers.mjs').TestVirtuals).locationBasic!.milesFrom!([151, -33]);
			expect(diff).to.eql(61.23308348472711);
		});
	});

	describe('addFilterToQuery', function () {
		it('should allow to filter by street', function () {
			const result = List.fields.locationBasic!.addFilterToQuery({
				street: 'Broadway',
			});
			expect(result['locationBasic.street1']).to.eql(/Broadway/i);
		});

		it('should allow to filter by city', function () {
			const result = List.fields.locationBasic!.addFilterToQuery({
				city: 'NYC',
			});
			expect(result['locationBasic.suburb']).to.eql(/NYC/i);
		});

		it('should allow to filter by state', function () {
			const result = List.fields.locationBasic!.addFilterToQuery({
				state: 'New York',
			});
			expect(result['locationBasic.state']).to.eql(/New York/i);
		});

		it('should allow to filter by code', function () {
			const result = List.fields.locationBasic!.addFilterToQuery({
				code: 10023,
			});
			expect(result['locationBasic.postcode']).to.eql(/10023/i);
		});

		it('should allow to filter by country', function () {
			const result = List.fields.locationBasic!.addFilterToQuery({
				country: 'USA',
			});
			expect(result['locationBasic.country']).to.eql(/USA/i);
		});

		it('should support inverted mode', function () {
			const result = List.fields.locationBasic!.addFilterToQuery({
				country: 'USA',
				inverted: true,
			});
			expect(result['locationBasic.country']).to.eql({
				$not: /USA/i,
			});
		});
	});


	/* Deprecated inputIsValid method tests */

	it('should validate required fields', function () {
		const testItem = new List.model();
		expect(List.fields.locationBasic!.inputIsValid({
			'locationBasic.street1': 'street1',
			'locationBasic.suburb': '',
		}, true, testItem)).to.be.false;
		expect(List.fields.locationBasic!.inputIsValid({
			'locationBasic.street1': 'street1',
			'locationBasic.suburb': 'suburb',
		}, true, testItem)).to.be.true;
		expect(List.fields.locationBasic!.inputIsValid({
			locationBasic: {
				street1: 'street1',
				suburb: 'suburb',
			},
		}, true, testItem)).to.be.true;
		expect(List.fields.locationCustomRequired!.inputIsValid({
			'locationCustomRequired.street1': 'street1',
			'locationCustomRequired.suburb': 'suburb',
		}, true, testItem)).to.be.false;
		expect(List.fields.locationCustomRequired!.inputIsValid({
			'locationCustomRequired.state': 'state',
			'locationCustomRequired.country': 'country',
		}, true, testItem)).to.be.true;
	});
};
