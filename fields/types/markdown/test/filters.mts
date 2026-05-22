import { expect } from 'chai';
import MarkdownType from '../MarkdownType.mjs';

export const initList = function (List: import('../../test-helpers.mjs').TestList) {
	List.add({
		markdown: MarkdownType,
		markdown2: MarkdownType,
	});
};

export const getTestItems = function () {
	return [
		{},
		{ markdown: '' },
		{ markdown: ' ' },
		{ markdown: 'abc' },
		{ markdown: 'ABCD' },
		{ markdown: 'abcd', markdown2: '123' },
		{ markdown: 'Ab Cd', markdown2: '1 2 3' },
		{ markdown: 'a/b\c@d' },
	];
};

export const testFilters = function (_List: import('../../test-helpers.mjs').TestList, filter: import('../../test-helpers.mjs').TestFilterFn) {

	describe('match', function () {

		it('should find exact string matches', function (done) {
			filter({
				markdown: {
					mode: 'exactly',
					value: 'abc',
				},
			}, 'markdown', function (results: import('../../test-helpers.mjs').TestDoc[]) {
				const normalized = normalizeResults(results);
				expect(normalized).to.eql(['abc']);
				done();
			});
		});

		it('should invert exact string matches', function (done) {
			filter({
				markdown: {
					mode: 'exactly',
					inverted: true,
					value: 'abc',
				},
			}, 'markdown', function (results: import('../../test-helpers.mjs').TestDoc[]) {
				const normalized = normalizeResults(results);
				expect(normalized).to.eql([
					undefined,
					'',
					' ',
					'ABCD',
					'abcd',
					'Ab Cd',
					'a/b\c@d',
				]);
				done();
			});
		});

		it('should find empty and null string matches', function (done) {
			filter({
				markdown: {
					mode: 'exactly',
					value: '',
				},
			}, 'markdown', function (results: import('../../test-helpers.mjs').TestDoc[]) {
				const normalized = normalizeResults(results);
				expect(normalized).to.eql([undefined, '']);
				done();
			});
		});

		it('should invert empty and null string matches', function (done) {
			filter({
				markdown: {
					mode: 'exactly',
					inverted: true,
					value: '',
				},
			}, 'markdown', function (results: import('../../test-helpers.mjs').TestDoc[]) {
				const normalized = normalizeResults(results);
				expect(normalized).to.eql([
					' ',
					'abc',
					'ABCD',
					'abcd',
					'Ab Cd',
					'a/b\c@d',
				]);
				done();
			});
		});

		it('should find whitespace matches', function (done) {
			filter({
				markdown: {
					mode: 'exactly',
					value: ' ',
				},
			}, 'markdown', function (results: import('../../test-helpers.mjs').TestDoc[]) {
				const normalized = normalizeResults(results);
				expect(normalized).to.eql([' ']);
				done();
			});
		});

		it('should work with special characters', function (done) {
			filter({
				markdown: {
					mode: 'exactly',
					value: 'a/b\c@d',
				},
			}, 'markdown', function (results: import('../../test-helpers.mjs').TestDoc[]) {
				const normalized = normalizeResults(results);
				expect(normalized).to.eql(['a/b\c@d']);
				done();
			});
		});

		it('should be case insensitive by default', function (done) {
			filter({
				markdown: {
					mode: 'exactly',
					value: 'abcd',
				},
			}, 'markdown', function (results: import('../../test-helpers.mjs').TestDoc[]) {
				const normalized = normalizeResults(results);
				expect(normalized).to.eql(['ABCD', 'abcd']);
				done();
			});
		});

		it('should allow case sensitivity', function (done) {
			filter({
				markdown: {
					caseSensitive: true,
					mode: 'exactly',
					value: 'abcd',
				},
			}, 'markdown', function (results: import('../../test-helpers.mjs').TestDoc[]) {
				const normalized = normalizeResults(results);
				expect(normalized).to.eql(['abcd']);
				done();
			});
		});

		it('should combine correctly', function (done) {
			filter({
				markdown: {
					mode: 'exactly',
					value: 'abcd',
				},
				markdown2: {
					mode: 'exactly',
					value: '123',
				},
			}, 'markdown', function (results: import('../../test-helpers.mjs').TestDoc[]) {
				const normalized = normalizeResults(results);
				expect(normalized).to.eql(['abcd']);
				done();
			});
		});
	});

	describe('beginsWith', function () {

		it('should match the start of strings', function (done) {
			filter({
				markdown: {
					mode: 'beginsWith',
					value: 'abc',
				},
			}, 'markdown', function (results: import('../../test-helpers.mjs').TestDoc[]) {
				const normalized = normalizeResults(results);
				expect(normalized).to.eql([
					'abc',
					'ABCD',
					'abcd',
				]);
				done();
			});
		});

		it('should invert correctly', function (done) {
			filter({
				markdown: {
					mode: 'beginsWith',
					inverted: true,
					value: 'abc',
				},
			}, 'markdown', function (results: import('../../test-helpers.mjs').TestDoc[]) {
				const normalized = normalizeResults(results);
				expect(normalized).to.eql([
					undefined,
					'',
					' ',
					'Ab Cd',
					'a/b\c@d',
				]);
				done();
			});
		});
	});

	describe('endsWith', function () {

		it('should match the end of strings', function (done) {
			filter({
				markdown: {
					mode: 'endsWith',
					value: 'cd',
				},
			}, 'markdown', function (results: import('../../test-helpers.mjs').TestDoc[]) {
				const normalized = normalizeResults(results);
				expect(normalized).to.eql([
					'ABCD',
					'abcd',
					'Ab Cd',
				]);
				done();
			});
		});

		it('should invert correctly', function (done) {
			filter({
				markdown: {
					mode: 'endsWith',
					inverted: true,
					value: 'cd',
				},
			}, 'markdown', function (results: import('../../test-helpers.mjs').TestDoc[]) {
				const normalized = normalizeResults(results);
				expect(normalized).to.eql([
					undefined,
					'',
					' ',
					'abc',
					'a/b\c@d',
				]);
				done();
			});
		});
	});
};

/**
 * Normalizes the results we get from filter()
 * @param {Array} results The results array of Mongoose documents.
 * @returns {Array} An array of the .md string values from each result document.
 */
function normalizeResults (results: unknown[]) {
	const normalized = [];
	for (const result of results) {
		normalized.push((result as Record<string, unknown>).md);
	}
	return normalized;
}
