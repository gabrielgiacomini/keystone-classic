import { expect } from 'chai';
import NumberArrayType from '../NumberArrayType.mjs';

/** Minimal List shape needed by initList. */
interface NumArrFilterList {
	add(fields: Record<string, unknown>): void;
}

/** Results callback receives the mapped numarr values for each matched item. */
type FilterCallback = (results: number[][]) => void;

/** The filter helper passed to testFilters by field-filters.mts. */
type FilterFn = (
	filters: Record<string, unknown>,
	prop: string,
	callback: FilterCallback,
) => void;

export const initList = function (List: NumArrFilterList) {
	List.add({
		numarr: NumberArrayType,
	});
};

export const getTestItems = function () {
	return [
		{},
		{ numarr: [] },
		{ numarr: [''] },
		{ numarr: ['', ''] },
		{ numarr: [' '] },
		{ numarr: [-1, 0, 1] },
		{ numarr: [0, 1, 2] },
		{ numarr: [1, 2, 3] },
		{ numarr: [2, 3, 4] },
		{ numarr: [3, 4, 5] },
		{ numarr: [10, 12, 14] },
	];
};

export const testFilters = function (_List: NumArrFilterList, filter: FilterFn) {
	describe('no presence specified', function () {
		it('should filter for a number', function (done) {
			filter({
				numarr: {
					value: 2,
				},
			}, 'numarr', function (results: number[][]) {
				expect(results).to.eql([
					[0, 1, 2],
					[1, 2, 3],
					[2, 3, 4],
				]);
				done();
			});
		});

		it('should filter for a number string', function (done) {
			filter({
				numarr: {
					value: '2',
				},
			}, 'numarr', function (results: number[][]) {
				expect(results).to.eql([
					[0, 1, 2],
					[1, 2, 3],
					[2, 3, 4],
				]);
				done();
			});
		});

		it('should filter for a negative number', function (done) {
			filter({
				numarr: {
					value: -1,
				},
			}, 'numarr', function (results: number[][]) {
				expect(results).to.eql([
					[-1, 0, 1],
				]);
				done();
			});
		});

		it('should filter for a boolean number', function (done) {
			filter({
				numarr: {
					value: 0,
				},
			}, 'numarr', function (results: number[][]) {
				expect(results).to.eql([
					[-1, 0, 1],
					[0, 1, 2],
				]);
				done();
			});
		});

		it('should filter all arrays with values between two numbers', function (done) {
			filter({
				numarr: {
					mode: 'between',
					value: {
						min: -1,
						max: 2,
					},
				},
			}, 'numarr', function (results: number[][]) {
				expect(results).to.eql([
					[-1, 0, 1],
					[0, 1, 2],
					[1, 2, 3],
					[2, 3, 4],
				]);
				done();
			});
		});

		it('should filter all arrays with values greater than a number', function (done) {
			filter({
				numarr: {
					mode: 'gt',
					value: 4,
				},
			}, 'numarr', function (results: number[][]) {
				expect(results).to.eql([
					[3, 4, 5],
					[10, 12, 14],
				]);
				done();
			});
		});

		it('should filter all arrays with values less than a number', function (done) {
			filter({
				numarr: {
					mode: 'lt',
					value: 2,
				},
			}, 'numarr', function (results: number[][]) {
				expect(results).to.eql([
					[-1, 0, 1],
					[0, 1, 2],
					[1, 2, 3],
				]);
				done();
			});
		});

		it('should filter for all empty arrays', function (done) {
			filter({
				numarr: {},
			}, 'numarr', function (results: number[][]) {
				expect(results.length).to.eql(5);
				done();
			});
		});
	});

	describe('"none" present', function () {
		it('should filter all arrays not containing a number', function (done) {
			filter({
				numarr: {
					presence: 'none',
					value: 2,
				},
			}, 'numarr', function (results: number[][]) {
				expect(results.length).to.eql(8);
				done();
			});
		});

		it('should filter all arrays with values not between two numbers', function (done) {
			filter({
				numarr: {
					presence: 'none',
					mode: 'between',
					value: {
						min: -1,
						max: 2,
					},
				},
			}, 'numarr', function (results: number[][]) {
				expect(results.length).to.eql(7);
				done();
			});
		});

		it('should filter all arrays with values not greater than a number', function (done) {
			filter({
				numarr: {
					presence: 'none',
					mode: 'gt',
					value: 4,
				},
			}, 'numarr', function (results: number[][]) {
				expect(results.length).to.eql(9);
				done();
			});
		});

		it('should filter all arrays with values not less than a number', function (done) {
			filter({
				numarr: {
					presence: 'none',
					mode: 'lt',
					value: 2,
				},
			}, 'numarr', function (results: number[][]) {
				expect(results.length).to.eql(8);
				done();
			});
		});

		it('should filter for all non-empty arrays', function (done) {
			filter({
				numarr: {
					presence: 'none',
				},
			}, 'numarr', function (results: number[][]) {
				expect(results.length).to.eql(6);
				done();
			});
		});
	});

	// Should behave exactly like no presence specified
	describe('"some" present', function () {
		it('should filter for a number', function (done) {
			filter({
				numarr: {
					value: 2,
				},
			}, 'numarr', function (results: number[][]) {
				expect(results).to.eql([
					[0, 1, 2],
					[1, 2, 3],
					[2, 3, 4],
				]);
				done();
			});
		});

		it('should filter for a number string', function (done) {
			filter({
				numarr: {
					value: '2',
				},
			}, 'numarr', function (results: number[][]) {
				expect(results).to.eql([
					[0, 1, 2],
					[1, 2, 3],
					[2, 3, 4],
				]);
				done();
			});
		});

		it('should filter for a negative number', function (done) {
			filter({
				numarr: {
					value: -1,
				},
			}, 'numarr', function (results: number[][]) {
				expect(results).to.eql([
					[-1, 0, 1],
				]);
				done();
			});
		});

		it('should filter for a boolean number', function (done) {
			filter({
				numarr: {
					value: 0,
				},
			}, 'numarr', function (results: number[][]) {
				expect(results).to.eql([
					[-1, 0, 1],
					[0, 1, 2],
				]);
				done();
			});
		});

		it('should filter all arrays with values between two numbers', function (done) {
			filter({
				numarr: {
					mode: 'between',
					value: {
						min: -1,
						max: 2,
					},
				},
			}, 'numarr', function (results: number[][]) {
				expect(results).to.eql([
					[-1, 0, 1],
					[0, 1, 2],
					[1, 2, 3],
					[2, 3, 4],
				]);
				done();
			});
		});

		it('should filter all arrays with values greater than a number', function (done) {
			filter({
				numarr: {
					mode: 'gt',
					value: 4,
				},
			}, 'numarr', function (results: number[][]) {
				expect(results).to.eql([
					[3, 4, 5],
					[10, 12, 14],
				]);
				done();
			});
		});

		it('should filter all arrays with values less than a number', function (done) {
			filter({
				numarr: {
					mode: 'lt',
					value: 2,
				},
			}, 'numarr', function (results: number[][]) {
				expect(results).to.eql([
					[-1, 0, 1],
					[0, 1, 2],
					[1, 2, 3],
				]);
				done();
			});
		});

		it('should filter for all empty arrays', function (done) {
			filter({
				numarr: {},
			}, 'numarr', function (results: number[][]) {
				expect(results.length).to.eql(5);
				done();
			});
		});
	});
};
