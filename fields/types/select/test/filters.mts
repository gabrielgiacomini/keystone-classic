import { expect } from 'chai';
import SelectType from '../SelectType.mjs';

export const initList = function (List: import('../../test-helpers.mjs').TestList) {
	List.add({
		textSelect: { type: SelectType, options: 'one, two, three' },
		numericSelect: { type: SelectType, numeric: true, options: [
			{ value: 0, label: 'Zero' },
			{ value: 1, label: 'One' },
			{ value: 2, label: 'Two' },
		] },
	});
};

export const getTestItems = function () {
	return [
		{},
		{ textSelect: '', numericSelect: 0 },
		{ textSelect: 'one', numericSelect: 1 },
		{ textSelect: 'two', numericSelect: 2 },
		{ textSelect: 'three' },
	];
};

export const testFilters = function (_List: import('../../test-helpers.mjs').TestList, filter: import('../../test-helpers.mjs').TestFilterFn) {

	describe('text values', function () {

		it('should find exact text matches', function (done) {
			filter({
				textSelect: {
					value: 'one',
				},
			}, 'textSelect', function (results: import('../../test-helpers.mjs').TestDoc[]) {
				expect(results).to.eql(['one']);
				done();
			});
		});

		it('should invert exact text matches', function (done) {
			filter({
				textSelect: {
					inverted: true,
					value: 'one',
				},
			}, 'textSelect', function (results: import('../../test-helpers.mjs').TestDoc[]) {
				expect(results).to.eql([undefined, undefined, 'two', 'three']);
				done();
			});
		});

		it('should find multiple text matches', function (done) {
			filter({
				textSelect: {
					value: ['one', 'two'],
				},
			}, 'textSelect', function (results: import('../../test-helpers.mjs').TestDoc[]) {
				expect(results).to.eql(['one', 'two']);
				done();
			});
		});

		it('should invert multiple text matches', function (done) {
			filter({
				textSelect: {
					inverted: true,
					value: ['one', 'two'],
				},
			}, 'textSelect', function (results: import('../../test-helpers.mjs').TestDoc[]) {
				expect(results).to.eql([undefined, undefined, 'three']);
				done();
			});
		});

		it('should find empty text matches', function (done) {
			filter({
				textSelect: {
					value: '',
				},
			}, 'textSelect', function (results: import('../../test-helpers.mjs').TestDoc[]) {
				expect(results).to.eql([undefined, undefined]);
				done();
			});
		});

		it('should invert empty text matches', function (done) {
			filter({
				textSelect: {
					inverted: true,
					value: '',
				},
			}, 'textSelect', function (results: import('../../test-helpers.mjs').TestDoc[]) {
				expect(results).to.eql(['one', 'two', 'three']);
				done();
			});
		});

	});

	describe('numeric values', function () {

		it('should find exact numeric matches', function (done) {
			filter({
				numericSelect: {
					value: 1,
				},
			}, 'numericSelect', function (results: import('../../test-helpers.mjs').TestDoc[]) {
				expect(results).to.eql([1]);
				done();
			});
		});

		it('should invert exact numeric matches', function (done) {
			filter({
				numericSelect: {
					inverted: true,
					value: 1,
				},
			}, 'numericSelect', function (results: import('../../test-helpers.mjs').TestDoc[]) {
				expect(results).to.eql([undefined, 0, 2, undefined]);
				done();
			});
		});

		it('should find multiple numeric matches', function (done) {
			filter({
				numericSelect: {
					value: [1, 2],
				},
			}, 'numericSelect', function (results: import('../../test-helpers.mjs').TestDoc[]) {
				expect(results).to.eql([1, 2]);
				done();
			});
		});

		it('should invert multiple numeric matches', function (done) {
			filter({
				numericSelect: {
					inverted: true,
					value: [1, 2],
				},
			}, 'numericSelect', function (results: import('../../test-helpers.mjs').TestDoc[]) {
				expect(results).to.eql([undefined, 0, undefined]);
				done();
			});
		});

		it('should find empty numeric matches', function (done) {
			filter({
				numericSelect: {
					value: '',
				},
			}, 'numericSelect', function (results: import('../../test-helpers.mjs').TestDoc[]) {
				expect(results).to.eql([undefined, undefined]);
				done();
			});
		});

		it('should invert empty numeric matches', function (done) {
			filter({
				numericSelect: {
					inverted: true,
					value: '',
				},
			}, 'numericSelect', function (results: import('../../test-helpers.mjs').TestDoc[]) {
				expect(results).to.eql([0, 1, 2]);
				done();
			});
		});

	});

	describe('combined values', function () {

		it('should find combined text and numeric matches', function (done) {
			filter({
				textSelect: {
					value: 'one',
				},
				numericSelect: {
					value: 1,
				},
			}, 'textSelect', function (results: import('../../test-helpers.mjs').TestDoc[]) {
				expect(results).to.eql(['one']);
				done();
			});
		});

		it('should combine with inverted matches', function (done) {
			filter({
				textSelect: {
					value: 'one',
				},
				numericSelect: {
					inverted: true,
					value: 2,
				},
			}, 'textSelect', function (results: import('../../test-helpers.mjs').TestDoc[]) {
				expect(results).to.eql(['one']);
				done();
			});
		});

		it('should combine with inverted negating matches', function (done) {
			filter({
				textSelect: {
					value: 'one',
				},
				numericSelect: {
					inverted: true,
					value: 1,
				},
			}, 'textSelect', function (results: import('../../test-helpers.mjs').TestDoc[]) {
				expect(results).to.eql([]);
				done();
			});
		});

	});
};
