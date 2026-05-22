import { expect } from 'chai';
import TextArrayType from '../TextArrayType.mjs';

/** Minimal interface for a single TextArray field instance. */
interface TextArrayField {
	validateInput(data: Record<string, unknown>, callback: (result: boolean) => void): void;
	validateRequiredInput(item: TextArrayTestItem, data: Record<string, unknown>, callback: (result: boolean) => void): void;
	updateItem(item: TextArrayTestItem, data: Record<string, unknown>, callback: () => void): void;
	addFilterToQuery(filter: Record<string, unknown>): Record<string, unknown>;
	inputIsValid(data: Record<string, unknown>, required?: boolean, item?: TextArrayTestItem): boolean;
}

/** Named fields registered on the List by initList. */
interface TextArrayTestFields {
	textarr: TextArrayField;
	'nested.textarr': TextArrayField;
	customSeparator: TextArrayField;
}

/** Minimal document shape produced by `new List.model(...)` in these tests. */
interface TextArrayTestItem {
	textarr: string[] | undefined;
	nested: { textarr: string[] | undefined };
	customSeparator: string[] | undefined;
	_: {
		textarr: { format(separator?: string): string };
		customSeparator: { format(separator?: string): string };
	};
	get(path: string): unknown;
	set(path: string, value: unknown): void;
}

/** Minimal shape of the Keystone List passed to initList / testFieldType. */
interface TextArrayTestList {
	add(fields: Record<string, unknown>): void;
	model: new (data?: Record<string, unknown>) => TextArrayTestItem;
	fields: TextArrayTestFields;
}

export const initList = function (List: TextArrayTestList) {
	List.add({
		textarr: TextArrayType,
		nested: {
			textarr: TextArrayType,
		},
		customSeparator: { type: TextArrayType, separator: ' * ' },
	});
};

export const testFieldType = function (List: TextArrayTestList) {
	it('should default to an empty array', function () {
		const testItem = new List.model();
		expect(testItem.get('textarr')).to.eql([]);
	});

	describe('validateInput', function () {
		it('should validate top level fields', function (done) {
			List.fields.textarr!.validateInput({
				textarr: ['a', 'b'],
			}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate nested fields', function (done) {
			List.fields.textarr!.validateInput({
				nested: {
					textarr: ['a', 'b'],
				},
			}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate nested fields with flat paths', function (done) {
			List.fields.textarr!.validateInput({
				'nested.textarr': ['a', 'b'],
			}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		// A single string will be coerced to an array, so we let it pass
		it('should validate a single string value', function (done) {
			List.fields.textarr!.validateInput({
				textarr: 'a',
			}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		// An empty array clears the value, so we let it pass
		it('should validate an empty array', function (done) {
			List.fields.textarr!.validateInput({ textarr: [] }, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		// A blank string clears the value, so we let it pass
		it('should validate a blank string', function (done) {
			List.fields.textarr!.validateInput({ textarr: '' }, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		// null clears the value, so we let it pass
		it('should validate null', function (done) {
			List.fields.textarr!.validateInput({ textarr: null }, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		// undefined doesn't change anything, so we let it pass
		it('should validate undefined', function (done) {
			List.fields.textarr!.validateInput({
				textarr: undefined,
			}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should invalidate false', function (done) {
			List.fields.textarr!.validateInput({ textarr: false }, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate true', function (done) {
			List.fields.textarr!.validateInput({ textarr: true }, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate a number', function (done) {
			List.fields.textarr!.validateInput({ textarr: 1 }, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate an array of numbers', function (done) {
			List.fields.textarr!.validateInput({
				textarr: [1, 2, 3],
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate an array with a numbers', function (done) {
			List.fields.textarr!.validateInput({
				textarr: ['a', 2, 'b'],
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});
	});

	describe('validateRequiredInput', function () {
		it('should validate an array of strings', function (done) {
			const testItem = new List.model();
			List.fields.textarr!.validateRequiredInput(testItem, {
				textarr: ['a', 'b'],
			}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate a nested array of strings', function (done) {
			const testItem = new List.model();
			List.fields['nested.textarr']!.validateRequiredInput(testItem, {
				nested: {
					textarr: ['a', 'b'],
				},
			}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate a nested array of strings with a flat paths', function (done) {
			List.fields.textarr!.validateInput({
				'nested.textarr': ['a', 'b'],
			}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should invalidate an empty string', function (done) {
			const testItem = new List.model();
			List.fields.textarr!.validateRequiredInput(testItem, {
				textarr: '',
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate undefined', function (done) {
			const testItem = new List.model();
			List.fields.textarr!.validateRequiredInput(testItem, {
				textarr: undefined,
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should validate undefined if a value exists', function (done) {
			const testItem = new List.model({
				textarr: ['a'],
			});
			List.fields.textarr!.validateRequiredInput(testItem, {
				textarr: undefined,
			}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should invalidate null', function (done) {
			const testItem = new List.model();
			List.fields.textarr!.validateRequiredInput(testItem, {
				textarr: null,
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate an array with an empty string', function (done) {
			const testItem = new List.model();
			List.fields.textarr!.validateRequiredInput(testItem, {
				textarr: [''],
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate an array with empty strings', function (done) {
			const testItem = new List.model();
			List.fields.textarr!.validateRequiredInput(testItem, {
				textarr: ['a', 'b', ''],
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});
	});

	describe('updateItem', function () {
		it('should update top level fields', function (done) {
			const testItem = new List.model();
			List.fields.textarr!.updateItem(testItem, {
				textarr: ['a', 'b'],
			}, function () {
				expect(testItem.textarr).to.eql(['a', 'b']);
				done();
			});
		});

		it('should update nested fields', function (done) {
			const testItem = new List.model();
			List.fields['nested.textarr']!.updateItem(testItem, {
				nested: {
					textarr: ['a', 'b'],
				},
			}, function () {
				expect((testItem.nested as Record<string, unknown>).textarr).to.eql(['a', 'b']);
				done();
			});
		});

		it('should update nested fields with flat paths', function (done) {
			const testItem = new List.model();
			List.fields['nested.textarr']!.updateItem(testItem, {
				'nested.textarr': ['a', 'b'],
			}, function () {
				expect((testItem.nested as Record<string, unknown>).textarr).to.eql(['a', 'b']);
				done();
			});
		});

		it('should update nested fields non-empty arrays to empty arrays when the data is empty', function (done) {
			const testItem = new List.model();
			List.fields['nested.textarr']!.updateItem(testItem, {
				'nested.textarr': ['a', 'b'],
			}, function () {
				List.fields['nested.textarr']!.updateItem(testItem, {}, function () {
					expect((testItem.nested as Record<string, unknown>).textarr).to.eql([]);
					done();
				});
			});
		});

		it('should update non-empty arrays to empty arrays when the data is empty', function (done) {
			const testItem = new List.model();
			List.fields.textarr!.updateItem(testItem, {
				textarr: ['a', 'b'],
			}, function () {
				List.fields.textarr!.updateItem(testItem, {}, function () {
					expect(testItem.textarr).to.eql([]);
					done();
				});
			});
		});

		it('should update empty arrays', function (done) {
			const testItem = new List.model();
			List.fields.textarr!.updateItem(testItem, {
				textarr: [],
			}, function () {
				expect(testItem.textarr).to.eql([]);
				done();
			});
		});

		it('should default on null', function (done) {
			const testItem = new List.model();
			List.fields.textarr!.updateItem(testItem, {
				textarr: null,
			}, function () {
				expect(testItem.textarr).to.eql([]);
				done();
			});
		});

		it('should allow a single string value', function (done) {
			const testItem = new List.model();
			List.fields.textarr!.updateItem(testItem, {
				textarr: 'a',
			}, function () {
				expect(testItem.textarr).to.eql(['a']);
				done();
			});
		});

		it('should convert truthy values with toString methods to strings', function (done) {
			const testItem = new List.model();
			const time = new Date();
			List.fields.textarr!.updateItem(testItem, {
				textarr: [1, 'a', true, false, null, undefined, [], {}, time],
			}, function () {
				expect(testItem.textarr).to.eql(['1', 'a', 'true', '[object Object]', String(time)]);
				done();
			});
		});
	});

	describe('addFilterToQuery', function () {
		describe('"some" present', function () {
			it('should return a regex with the "i" flag set', function () {
				const result = List.fields.textarr!.addFilterToQuery({
					presence: 'some',
					value: 'abc',
				});
				expect(result.textarr).to.eql({
					$elemMatch: {
						$regex: /abc/i,
					},
				});
			});

			it('should allow case sensitive matching', function () {
				const result = List.fields.textarr!.addFilterToQuery({
					presence: 'some',
					value: 'abc',
					caseSensitive: true,
				});
				expect(result.textarr).to.eql({
					$elemMatch: {
						$regex: /abc/,
					},
				});
			});

			it('should allow exact matching', function () {
				const result = List.fields.textarr!.addFilterToQuery({
					presence: 'some',
					value: 'abc',
					mode: 'exactly',
				});
				expect(result.textarr).to.eql({
					$elemMatch: {
						$regex: /^abc$/i,
					},
				});
			});

			it('should allow matching the end', function () {
				const result = List.fields.textarr!.addFilterToQuery({
					presence: 'some',
					value: 'abc',
					mode: 'endsWith',
				});
				expect(result.textarr).to.eql({
					$elemMatch: {
						$regex: /abc$/i,
					},
				});
			});

			it('should allow matching the start', function () {
				const result = List.fields.textarr!.addFilterToQuery({
					presence: 'some',
					value: 'abc',
					mode: 'beginsWith',
				});
				expect(result.textarr).to.eql({
					$elemMatch: {
						$regex: /^abc/i,
					},
				});
			});

			it('should allow matching empty values', function () {
				const result = List.fields.textarr!.addFilterToQuery({
					presence: 'some',
				});
				expect(result.textarr).to.eql({
					$size: 0,
				});
			});
		});

		describe('"none" present', function () {
			it('should return a regex with the "i" flag set', function () {
				const result = List.fields.textarr!.addFilterToQuery({
					presence: 'none',
					value: 'abc',
				});
				expect(result.textarr).to.eql({
					$not: /abc/i,
				});
			});

			it('should allow case sensitive matching', function () {
				const result = List.fields.textarr!.addFilterToQuery({
					presence: 'none',
					value: 'abc',
					caseSensitive: true,
				});
				expect(result.textarr).to.eql({
					$not: /abc/,
				});
			});

			it('should allow exact matching', function () {
				const result = List.fields.textarr!.addFilterToQuery({
					presence: 'none',
					value: 'abc',
					mode: 'exactly',
				});
				expect(result.textarr).to.eql({
					$not: /^abc$/i,
				});
			});

			it('should allow matching the end', function () {
				const result = List.fields.textarr!.addFilterToQuery({
					presence: 'none',
					value: 'abc',
					mode: 'endsWith',
				});
				expect(result.textarr).to.eql({
					$not: /abc$/i,
				});
			});

			it('should allow matching the start', function () {
				const result = List.fields.textarr!.addFilterToQuery({
					presence: 'none',
					value: 'abc',
					mode: 'beginsWith',
				});
				expect(result.textarr).to.eql({
					$not: /^abc/i,
				});
			});

			it('should allow matching non-empty values', function () {
				const result = List.fields.textarr!.addFilterToQuery({
					presence: 'none',
				});
				expect(result.textarr).to.eql({
					$not: {
						$size: 0,
					},
				});
			});
		});

		// Presence undefined should behave exactly like presence === 'some'
		describe('no presence option', function () {
			it('should return a regex with the "i" flag set', function () {
				const result = List.fields.textarr!.addFilterToQuery({
					value: 'abc',
				});
				expect(result.textarr).to.eql({
					$elemMatch: {
						$regex: /abc/i,
					},
				});
			});

			it('should allow case sensitive matching', function () {
				const result = List.fields.textarr!.addFilterToQuery({
					value: 'abc',
					caseSensitive: true,
				});
				expect(result.textarr).to.eql({
					$elemMatch: {
						$regex: /abc/,
					},
				});
			});

			it('should allow exact matching', function () {
				const result = List.fields.textarr!.addFilterToQuery({
					value: 'abc',
					mode: 'exactly',
				});
				expect(result.textarr).to.eql({
					$elemMatch: {
						$regex: /^abc$/i,
					},
				});
			});

			it('should allow matching the end', function () {
				const result = List.fields.textarr!.addFilterToQuery({
					value: 'abc',
					mode: 'endsWith',
				});
				expect(result.textarr).to.eql({
					$elemMatch: {
						$regex: /abc$/i,
					},
				});
			});

			it('should allow matching the start', function () {
				const result = List.fields.textarr!.addFilterToQuery({
					value: 'abc',
					mode: 'beginsWith',
				});
				expect(result.textarr).to.eql({
					$elemMatch: {
						$regex: /^abc/i,
					},
				});
			});

			it('should allow matching empty values in exact mode', function () {
				const result = List.fields.textarr!.addFilterToQuery({});
				expect(result.textarr).to.eql({
					$size: 0,
				});
			});
		});
	});

	describe('format', function () {
		it('should use the default separator for formatting', function () {
			const testItem = new List.model({
				textarr: ['one', 'two', 'three'],
			});
			expect((testItem._ as import('../../test-helpers.mjs').TestVirtuals).textarr!.format!()).to.equal('one | two | three');
		});

		it('should use the provided separator for formatting', function () {
			const testItem = new List.model({
				textarr: ['one', 'two', 'three'],
			});
			expect((testItem._ as import('../../test-helpers.mjs').TestVirtuals).textarr!.format!(', ')).to.equal('one, two, three');
		});

		it('should use the specified separator for formatting', function () {
			const testItem = new List.model({
				customSeparator: ['one', 'two', 'three'],
			});
			expect((testItem._ as import('../../test-helpers.mjs').TestVirtuals).customSeparator!.format!()).to.equal('one * two * three');
		});
	});

	/* Deprecated inputIsValid Tests */

	it('should validate input', function () {
		expect(List.fields.textarr!.inputIsValid({
			textarr: ['a'],
		})).to.be.true;
		expect(List.fields.textarr!.inputIsValid({
			textarr: ['a', 'b'],
		})).to.be.true;
	});

	it('should validate no input', function () {
		const testItem = new List.model();
		expect(List.fields.textarr!.inputIsValid({})).to.be.true;
		expect(List.fields.textarr!.inputIsValid({}, true)).to.be.false;
		testItem.textarr = ['a'];
		expect(List.fields.textarr!.inputIsValid({}, true, testItem)).to.be.true;
	});

	it('should validate length when required', function () {
		expect(List.fields.textarr!.inputIsValid({
			textarr: [],
		}, true)).to.be.false;
	});

	it('should invalidate arrays with complex values', function () {
		expect(List.fields.textarr!.inputIsValid({
			textarr: [[]],
		}, true)).to.be.false;
	});
};
