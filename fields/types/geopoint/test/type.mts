import { expect } from 'chai';
import GeoPointType from '../GeoPointType.mjs';

/** Shape of a Keystone document item used in geopoint-field tests. */
interface GeoPointItem {
	geo?: number[];
	nested: {
		geo?: number[];
	};
	get(path: string): unknown;
	set(path: string, value: unknown): void;
}

/** The geopoint field exposed via `List.fields.geo!` or `List.fields['nested.geo']!`. */
interface GeoPointField {
	updateItem(item: GeoPointItem, data: Record<string, unknown>, callback: () => void): void;
	validateInput(data: Record<string, unknown>, callback: (result: boolean) => void): void;
	validateRequiredInput(item: GeoPointItem, data: Record<string, unknown>, callback: (result: boolean) => void): void;
	addFilterToQuery(filter: Record<string, unknown>): Record<string, unknown>;
}

/** Named fields registered on the List by initList. */
interface GeoPointTestFields {
	geo: GeoPointField;
	'nested.geo': GeoPointField;
}

/** Minimal shape of the Keystone List passed to initList / testFieldType. */
interface GeoPointTestList {
	add(schema: Record<string, unknown>): void;
	model: new (data?: Record<string, unknown>) => GeoPointItem;
	fields: GeoPointTestFields;
}

export const initList = function (List: GeoPointTestList) {
	List.add({
		geo: { type: GeoPointType },
		nested: {
			geo: { type: GeoPointType },
		},
	});
};

export const testFieldType = function (List: GeoPointTestList) {
	describe('updateItem', function () {
		it('should update top level fields', function (done) {
			const testItem = new List.model();
			List.fields.geo!.updateItem(testItem, {
				geo: [1, 2],
			}, function () {
				expect(testItem.geo).to.eql([1, 2]);
				testItem.geo = undefined;
				done();
			});
		});

		it('should update nested fields', function (done) {
			const testItem = new List.model();
			List.fields['nested.geo']!.updateItem(testItem, {
				nested: {
					geo: [1, 2],
				},
			}, function () {
				expect((testItem.nested as Record<string, unknown>).geo).to.eql([1, 2]);
				(testItem.nested as Record<string, unknown>).geo = undefined;
				done();
			});
		});

		it('should update nested fields with flat paths', function (done) {
			const testItem = new List.model();
			List.fields['nested.geo']!.updateItem(testItem, {
				'nested.geo': [1, 2],
			}, function () {
				expect((testItem.nested as Record<string, unknown>).geo).to.eql([1, 2]);
				(testItem.nested as Record<string, unknown>).geo = undefined;
				done();
			});
		});
	});

	describe('validateInput', function () {
		it('should validate numeric array input with two items', function (done) {
			List.fields.geo!.validateInput({
				geo: [1, 2],
			}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate correctly formatted string input', function (done) {
			List.fields.geo!.validateInput({
				geo: '3.1, 4.5',
			}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate empty string input', function (done) {
			List.fields.geo!.validateInput({
				geo: '',
			}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate undefined input', function (done) {
			List.fields.geo!.validateInput({}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate null input', function (done) {
			List.fields.geo!.validateInput({
				geo: null,
			}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate string array input with empty string values', function (done) {
			List.fields.geo!.validateInput({
				geo: ['', ''],
			}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should invalidate string array input with more than two items', function (done) {
			List.fields.geo!.validateInput({
				geo: ['', '', ''],
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate string array input with less than two items', function (done) {
			List.fields.geo!.validateInput({
				geo: [''],
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate numeric array input with more than two items', function (done) {
			List.fields.geo!.validateInput({
				geo: [1, 2, 3],
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate numeric array input with less than two items', function (done) {
			List.fields.geo!.validateInput({
				geo: [1],
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate random string input', function (done) {
			List.fields.geo!.validateInput({
				geo: 'asdf',
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate object input', function (done) {
			List.fields.geo!.validateInput({
				geo: { things: 'stuff' },
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate array input', function (done) {
			List.fields.geo!.validateInput({
				geo: [1, 2, 3],
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate Boolean input', function (done) {
			List.fields.geo!.validateInput({
				geo: true,
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate function input', function (done) {
			List.fields.geo!.validateInput({
				geo: function () {},
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate regexp input', function (done) {
			List.fields.geo!.validateInput({
				geo: /foo/,
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate date input', function (done) {
			List.fields.geo!.validateInput({
				geo: new Date(),
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});
	});

	describe('validateRequiredInput', function () {
		it('should validate an array with two items as input', function (done) {
			const testItem = new List.model();
			List.fields.geo!.validateRequiredInput(testItem, {
				geo: [2, 3],
			}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate a well-formatted string as input', function (done) {
			const testItem = new List.model();
			List.fields.geo!.validateRequiredInput(testItem, {
				geo: '3.14, 1.59',
			}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should invalidate undefined', function (done) {
			const testItem = new List.model();
			List.fields.geo!.validateRequiredInput(testItem, {
				geo: undefined,
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should validate undefined if a previous value exists', function (done) {
			const testItem = new List.model({
				geo: [3.14, 1.5],
			});
			List.fields.geo!.validateRequiredInput(testItem, {
				geo: undefined,
			}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should invalidate empty string', function (done) {
			const testItem = new List.model();
			List.fields.geo!.validateRequiredInput(testItem, {
				geo: '',
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate null', function (done) {
			const testItem = new List.model();
			List.fields.geo!.validateRequiredInput(testItem, {
				geo: null,
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});
	});

	describe('addFilterToQuery', function () {
		it('should filter for a latitude and a longitude with a maximum distance', function () {
			const result = List.fields.geo!.addFilterToQuery({
				lat: 33,
				lon: 151,
				distance: {
					mode: 'max',
					value: 100,
				},
			});

			expect(result.geo).to.eql({
				$near: {
					$geometry: {
						type: 'Point',
						coordinates: [151, 33],
					},
					$maxDistance: 100000,
				},
			});
		});

		it('should filter for a latitude and a longitude with a minimum distance', function () {
			const result = List.fields.geo!.addFilterToQuery({
				lat: 31,
				lon: 151,
				distance: {
					mode: 'min',
					value: 100,
				},
			});

			expect(result.geo).to.eql({
				$near: {
					$geometry: {
						type: 'Point',
						coordinates: [151, 31],
					},
					$minDistance: 100000,
				},
			});
		});

		it('should default to max distance', function () {
			const result = List.fields.geo!.addFilterToQuery({
				lat: 31,
				lon: 151,
				distance: {
					mode: undefined,
					value: 100,
				},
			});

			expect(result.geo).to.eql({
				$near: {
					$geometry: {
						type: 'Point',
						coordinates: [151, 31],
					},
					$maxDistance: 100000,
				},
			});
		});

		it('should default to a 500km radius', function () {
			const result = List.fields.geo!.addFilterToQuery({
				lat: 31,
				lon: 151,
				distance: {
					mode: 'max',
					value: undefined,
				},
			});

			expect(result.geo).to.eql({
				$near: {
					$geometry: {
						type: 'Point',
						coordinates: [151, 31],
					},
					$maxDistance: 500000,
				},
			});
		});

		it('should not filter anything if the latitude is undefined', function () {
			const result = List.fields.geo!.addFilterToQuery({
				lat: undefined,
				lon: 151,
			});

			expect(result.geo).to.be.undefined;
		});

		it('should not filter anything if the longitude is undefined', function () {
			const result = List.fields.geo!.addFilterToQuery({
				lat: 31,
				lon: undefined,
			});

			expect(result.geo).to.be.undefined;
		});
	});
};
