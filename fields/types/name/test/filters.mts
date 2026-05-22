import { expect } from 'chai';
import NameType from '../NameType.mjs';

export const initList = function (List: import('../../test-helpers.mjs').TestList) {
	List.add({
		name: NameType,
	});
};

/**
 * Returns an array of test item fixtures for the Name field filter tests.
 * @returns {Array<object>} An array of plain objects with `name` properties covering empty, whitespace, mixed-case, and special-character values.
 */
export function getTestItems () {
	return [
		{
			name: {},
		},
		{
			name: {
				first: '',
				last: '',
			},
		},
		{
			name: {
				first: ' ',
				last: ' ',
			},
		},
		{
			name: {
				first: 'abc',
				last: 'def',
			},
		},
		{
			name: {
				first: 'ABCD',
				last: 'EFGH',
			},
		},
		{
			name: {
				first: 'abcd',
				last: 'efgh',
			},
		},
		{
			name: {
				first: 'Ab Cd',
				last: 'Ef Gh',
			},
		},
		{
			name: {
				first: 'a/b\c@d',
				last: 'e/f\g@h',
			},
		},
	];
};

export const testFilters = function (_List: import('../../test-helpers.mjs').TestList, filter: import('../../test-helpers.mjs').TestFilterFn) {
	it('should find the first name', function (done) {
		filter({
			name: {
				mode: 'exactly',
				value: 'abc',
			},
		}, 'name', function (results: import('../../test-helpers.mjs').TestDoc[]) {
			expect(results.length).to.equal(1);
			expect((results[0] as Record<string, unknown>).first).to.eql('abc');
			expect((results[0] as Record<string, unknown>).last).to.eql('def');
			done();
		});
	});

	it('should find the last name', function (done) {
		filter({
			name: {
				mode: 'exactly',
				value: 'def',
			},
		}, 'name', function (results: import('../../test-helpers.mjs').TestDoc[]) {
			expect(results.length).to.equal(1);
			expect((results[0] as Record<string, unknown>).first).to.eql('abc');
			expect((results[0] as Record<string, unknown>).last).to.eql('def');
			done();
		});
	});

	it('should support inverted filtering', function (done) {
		filter({
			name: {
				mode: 'exactly',
				value: 'abc',
				inverted: true,
			},
		}, 'name', function (results: import('../../test-helpers.mjs').TestDoc[]) {
			expect(results.length).to.equal(getTestItems().length - 1);
			done();
		});
	});

	it('should find beginsWith matches', function (done) {
		filter({
			name: {
				mode: 'beginsWith',
				value: 'ab',
			},
		}, 'name', function (results: import('../../test-helpers.mjs').TestDoc[]) {
			expect(results.length).to.equal(4);
			expect((results[0] as Record<string, unknown>).first).to.eql('abc');
			expect((results[0] as Record<string, unknown>).last).to.eql('def');
			expect((results[1] as Record<string, unknown>).first).to.eql('ABCD');
			expect((results[1] as Record<string, unknown>).last).to.eql('EFGH');
			expect((results[2] as Record<string, unknown>).first).to.eql('abcd');
			expect((results[2] as Record<string, unknown>).last).to.eql('efgh');
			expect((results[3] as Record<string, unknown>).first).to.eql('Ab Cd');
			expect((results[3] as Record<string, unknown>).last).to.eql('Ef Gh');
			done();
		});
	});

	it('should support case sensitive filtering', function (done) {
		filter({
			name: {
				mode: 'beginsWith',
				value: 'ab',
				caseSensitive: true,
			},
		}, 'name', function (results: import('../../test-helpers.mjs').TestDoc[]) {
			expect(results.length).to.equal(2);
			expect((results[0] as Record<string, unknown>).first).to.eql('abc');
			expect((results[0] as Record<string, unknown>).last).to.eql('def');
			expect((results[1] as Record<string, unknown>).first).to.eql('abcd');
			expect((results[1] as Record<string, unknown>).last).to.eql('efgh');
			done();
		});
	});

	it('should find endsWith matches', function (done) {
		filter({
			name: {
				mode: 'endsWith',
				value: 'c',
			},
		}, 'name', function (results: import('../../test-helpers.mjs').TestDoc[]) {
			expect(results.length).to.equal(1);
			expect((results[0] as Record<string, unknown>).first).to.eql('abc');
			expect((results[0] as Record<string, unknown>).last).to.eql('def');
			done();
		});
	});

	it('should find empty values', function (done) {
		filter({
			name: {
				mode: 'exactly',
			},
		}, 'name', function (results: import('../../test-helpers.mjs').TestDoc[]) {
			expect(results.length).to.equal(2);
			done();
		});
	});

	it('should find non-empty values', function (done) {
		filter({
			name: {
				mode: 'exactly',
				inverted: true,
			},
		}, 'name', function (results: import('../../test-helpers.mjs').TestDoc[]) {
			expect(results.length).to.equal(getTestItems().length - 2);
			done();
		});
	});
};
