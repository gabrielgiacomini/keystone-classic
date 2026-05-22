import { expect } from 'chai';
import NumberArrayType from '../NumberArrayType.mjs';

/** Minimal document shape produced by `new List.model(...)` in these tests. */
interface NumberArrayTestItem {
	numarr: number[];
	nested: { numarr: number[] };
	get(path: string): unknown;
	set(path: string, value: unknown): void;
}

/** Minimal interface for a single NumberArray field instance. */
interface NumberArrayField {
	validateInput(data: Record<string, unknown>, callback: (result: boolean) => void): void;
	validateRequiredInput(item: NumberArrayTestItem, data: Record<string, unknown>, callback: (result: boolean) => void): void;
	updateItem(item: NumberArrayTestItem, data: Record<string, unknown>, callback: () => void): void;
	addFilterToQuery(filter: Record<string, unknown>): Record<string, unknown>;
	inputIsValid(data: Record<string, unknown>, required?: boolean, item?: NumberArrayTestItem): boolean;
}

/** Named fields registered on the List by initList. */
interface NumberArrayTestFields {
	numarr: NumberArrayField;
	'nested.numarr': NumberArrayField;
}

/** Minimal shape of the Keystone List passed to initList / testFieldType. */
interface NumberArrayTestList {
	add(fields: Record<string, unknown>): void;
	model: new (data?: Record<string, unknown>) => NumberArrayTestItem;
	fields: NumberArrayTestFields;
}

export const initList = function (List: NumberArrayTestList) {
	List.add({
		numarr: { type: NumberArrayType },
		nested: {
			numarr: { type: NumberArrayType },
		},
	});
};

export const testFieldType = function (List: NumberArrayTestList) {
	describe('invalid options', function () {
		it('should throw when no options are passed', function (done) {
			try {
				List.add({
					noFormatString: { type: NumberArrayType, format: /regexp/ },
				});
			} catch (err: unknown) {
				expect((err as Error).message).to.eql('FieldType.NumberArray: options.format must be a string.');
				done();
			}
		});
	});

	it('should default to an empty array', function () {
		const testItem = new List.model();
		expect(testItem.get('numarr')).to.eql([]);
	});

	describe('validateInput', function () {
		it('should validate top level fields', function (done) {
			List.fields.numarr!.validateInput({
				numarr: [1, 2, 3],
			}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate nested fields', function (done) {
			List.fields['nested.numarr']!.validateInput({
				nested: {
					numarr: [1, 2, 3],
				},
			}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate nested fields with flat paths', function (done) {
			List.fields['nested.numarr']!.validateInput({
				'nested.numarr': [1, 2, 3],
			}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		// A single number will be coerced to an array, so we let it pass
		it('should validate a number', function (done) {
			List.fields.numarr!.validateInput({
				numarr: 1,
			}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		// An empty array clears the value, so we let it pass
		it('should validate an empty array', function (done) {
			List.fields.numarr!.validateInput({
				numarr: [],
			}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		// A blank string clears the value, so we let it pass
		it('should validate a blank string', function (done) {
			List.fields.numarr!.validateInput({
				numarr: '',
			}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		// null clears the value, so we let it pass
		it('should validate null', function (done) {
			List.fields.numarr!.validateInput({
				numarr: null,
			}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		// undefined doesn't change anything, so we let it pass
		it('should validate undefined', function (done) {
			List.fields.numarr!.validateInput({
				numarr: undefined,
			}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate a number string', function (done) {
			List.fields.numarr!.validateInput({
				numarr: '1',
			}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate an array of number strings', function (done) {
			List.fields.numarr!.validateInput({
				numarr: ['1', '2', '3'],
			}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate a mixed array of number strings and numbers', function (done) {
			List.fields.numarr!.validateInput({
				numarr: ['1', 2, '3', 4],
			}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should invalidate false', function (done) {
			List.fields.numarr!.validateInput({
				numarr: false,
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate true', function (done) {
			List.fields.numarr!.validateInput({
				numarr: true,
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate a string', function (done) {
			List.fields.numarr!.validateInput({
				numarr: 'aaa',
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate an array with a single string', function (done) {
			List.fields.numarr!.validateInput({
				numarr: ['aaa'],
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate an array with string somewhere', function (done) {
			List.fields.numarr!.validateInput({
				numarr: [1, 2, 'aaa', 4],
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});
	});

	describe('validateRequiredInput', function () {
		it('should validate an array of numbers', function (done) {
			const testItem = new List.model();
			List.fields.numarr!.validateRequiredInput(testItem, {
				numarr: [1, 2, 3],
			}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate a nested array of numbers', function (done) {
			const testItem = new List.model();
			List.fields['nested.numarr']!.validateRequiredInput(testItem, {
				nested: {
					numarr: [1, 2],
				},
			}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate a nested array of numbers with a flat paths', function (done) {
			List.fields.numarr!.validateInput({
				'nested.numarr': [1, 2],
			}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should invalidate an empty string', function (done) {
			const testItem = new List.model();
			List.fields.numarr!.validateRequiredInput(testItem, {
				numarr: '',
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate undefined', function (done) {
			const testItem = new List.model();
			List.fields.numarr!.validateRequiredInput(testItem, {
				numarr: undefined,
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should validate undefined if a value exists', function (done) {
			const testItem = new List.model({
				numarr: [1],
			});
			List.fields.numarr!.validateRequiredInput(testItem, {
				numarr: undefined,
			}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should invalidate null', function (done) {
			const testItem = new List.model();
			List.fields.numarr!.validateRequiredInput(testItem, {
				numarr: null,
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate an array with an empty string', function (done) {
			const testItem = new List.model();
			List.fields.numarr!.validateRequiredInput(testItem, {
				numarr: [''],
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate an array with empty strings', function (done) {
			const testItem = new List.model();
			List.fields.numarr!.validateRequiredInput(testItem, {
				numarr: [1, '', 2, '3'],
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});
	});

	describe('updateItem', function () {
		it('should update top level fields', function (done) {
			const testItem = new List.model();
			List.fields.numarr!.updateItem(testItem, {
				numarr: [1, 2, 3, 42],
			}, function () {
				expect(testItem.numarr).to.eql([1, 2, 3, 42]);
				done();
			});
		});

		it('should update nested fields', function (done) {
			const testItem = new List.model();
			List.fields['nested.numarr']!.updateItem(testItem, {
				nested: {
					numarr: [1, 2, 3, 42],
				},
			}, function () {
				expect((testItem.nested as Record<string, unknown>).numarr).to.eql([1, 2, 3, 42]);
				done();
			});
		});

		it('should update nested fields with flat paths', function (done) {
			const testItem = new List.model();
			List.fields['nested.numarr']!.updateItem(testItem, {
				'nested.numarr': [1, 2, 3, 42],
			}, function () {
				expect((testItem.nested as Record<string, unknown>).numarr).to.eql([1, 2, 3, 42]);
				done();
			});
		});

		it('should update empty arrays', function (done) {
			const testItem = new List.model();
			List.fields.numarr!.updateItem(testItem, {
				numarr: [],
			}, function () {
				expect(testItem.numarr).to.eql([]);
				done();
			});
		});

		it('should delete all items of the array if the data object is undefined', function (done) {
			const testItem = new List.model();
			List.fields.numarr!.updateItem(testItem, {
				numarr: [1, 2, 3, 42],
			}, function () {
				List.fields.numarr!.updateItem(testItem, {
					numarr: undefined,
				}, function () {
					expect(testItem.numarr).to.eql([]);
					done();
				});
			});
		});

		it('should default on null', function (done) {
			const testItem = new List.model();
			List.fields.numarr!.updateItem(testItem, {
				numarr: null,
			}, function () {
				expect(testItem.numarr).to.eql([]);
				done();
			});
		});

		it('should allow a single numeric value', function (done) {
			const testItem = new List.model();
			List.fields.numarr!.updateItem(testItem, {
				numarr: 1,
			}, function () {
				expect(testItem.numarr).to.eql([1]);
				done();
			});
		});

		it('should convert strings to numbers', function (done) {
			const testItem = new List.model();
			List.fields.numarr!.updateItem(testItem, {
				numarr: '1',
			}, function () {
				expect(testItem.numarr).to.eql([1]);
				done();
			});
		});

		it('should allow decimals', function (done) {
			const testItem = new List.model();
			List.fields.numarr!.updateItem(testItem, {
				numarr: [0.1, '0.2'],
			}, function () {
				expect(testItem.numarr).to.eql([0.1, 0.2]);
				done();
			});
		});

		it('should ignore non-numeric strings and complex values', function (done) {
			const testItem = new List.model();
			List.fields.numarr!.updateItem(testItem, {
				numarr: ['1', 'two', {}, 42],
			}, function () {
				expect(testItem.numarr).to.eql([1, 42]);
				done();
			});
		});
	});

	describe('addFilterToQuery', function () {
		describe('"some" present', function () {
			it('should filter for a specific number', function () {
				const result = List.fields.numarr!.addFilterToQuery({
					presence: 'some',
					value: 10,
				});
				expect(result.numarr).to.eql({
					$elemMatch: {
						$eq: 10,
					},
				});
			});

			it('should filter greater than a specific number', function () {
				const result = List.fields.numarr!.addFilterToQuery({
					presence: 'some',
					value: 0,
					mode: 'gt',
				});
				expect(result.numarr).to.eql({
					$elemMatch: {
						$gt: 0,
					},
				});
			});

			it('should filter less than a specific number', function () {
				const result = List.fields.numarr!.addFilterToQuery({
					presence: 'some',
					value: 10,
					mode: 'lt',
				});
				expect(result.numarr).to.eql({
					$elemMatch: {
						$lt: 10,
					},
				});
			});

			it('should filter for existance', function () {
				const result = List.fields.numarr!.addFilterToQuery({
					presence: 'some',
				});
				expect(result.numarr).to.eql({
					$size: 0,
				});
			});

			it('should filter between two numbers', function () {
				const result = List.fields.numarr!.addFilterToQuery({
					presence: 'some',
					mode: 'between',
					value: {
						min: 0,
						max: 10,
					},
				});
				expect(result.numarr).to.eql({
					$elemMatch: {
						$gte: 0,
						$lte: 10,
					},
				});
			});

			it('should filter between two number strings', function () {
				const result = List.fields.numarr!.addFilterToQuery({
					presence: 'some',
					mode: 'between',
					value: {
						min: '0',
						max: '10',
					},
				});
				expect(result.numarr).to.eql({
					$elemMatch: {
						$gte: 0,
						$lte: 10,
					},
				});
			});

			it('should not filter if the value is NaN', function () {
				const result = List.fields.numarr!.addFilterToQuery({
					presence: 'some',
					value: NaN,
				});
				expect(result.numarr).to.be.undefined;
			});

			it('should not filter between two numbers if one is NaN', function () {
				const result = List.fields.numarr!.addFilterToQuery({
					presence: 'some',
					mode: 'between',
					value: {
						min: NaN,
						max: 10,
					},
				});
				expect(result.numarr).to.be.undefined;
			});
		});

		describe('"none" present', function () {
			it('should filter for a non-existing specific number', function () {
				const result = List.fields.numarr!.addFilterToQuery({
					presence: 'none',
					value: 10,
				});
				expect(result.numarr).to.eql({
					$not: {
						$eq: 10,
					},
				});
			});

			it('should filter greater than a specific number', function () {
				const result = List.fields.numarr!.addFilterToQuery({
					presence: 'none',
					value: 0,
					mode: 'gt',
				});
				expect(result.numarr).to.eql({
					$not: {
						$gt: 0,
					},
				});
			});

			it('should filter less than a specific number', function () {
				const result = List.fields.numarr!.addFilterToQuery({
					presence: 'none',
					value: 10,
					mode: 'lt',
				});
				expect(result.numarr).to.eql({
					$not: {
						$lt: 10,
					},
				});
			});

			it('should filter for existance', function () {
				const result = List.fields.numarr!.addFilterToQuery({
					presence: 'none',
				});
				expect(result.numarr).to.eql({
					$not: {
						$size: 0,
					},
				});
			});

			it('should filter between two numbers', function () {
				const result = List.fields.numarr!.addFilterToQuery({
					presence: 'none',
					mode: 'between',
					value: {
						min: 0,
						max: 10,
					},
				});
				expect(result.numarr).to.eql({
					$not: {
						$gte: 0,
						$lte: 10,
					},
				});
			});

			it('should filter between two number strings', function () {
				const result = List.fields.numarr!.addFilterToQuery({
					presence: 'none',
					mode: 'between',
					value: {
						min: '0',
						max: '10',
					},
				});
				expect(result.numarr).to.eql({
					$not: {
						$gte: 0,
						$lte: 10,
					},
				});
			});

			it('should not filter if the value is NaN', function () {
				const result = List.fields.numarr!.addFilterToQuery({
					presence: 'none',
					value: NaN,
				});
				expect(result.numarr).to.be.undefined;
			});

			it('should not filter between two numbers if one is NaN', function () {
				const result = List.fields.numarr!.addFilterToQuery({
					presence: 'none',
					mode: 'between',
					value: {
						min: NaN,
						max: 10,
					},
				});
				expect(result.numarr).to.be.undefined;
			});
		});

		// Should default to the "some" behaviour
		describe('no presence option specified', function () {
			it('should filter for a specific number', function () {
				const result = List.fields.numarr!.addFilterToQuery({
					value: 10,
				});
				expect(result.numarr).to.eql({
					$elemMatch: {
						$eq: 10,
					},
				});
			});

			it('should filter greater than a specific number', function () {
				const result = List.fields.numarr!.addFilterToQuery({
					value: 0,
					mode: 'gt',
				});
				expect(result.numarr).to.eql({
					$elemMatch: {
						$gt: 0,
					},
				});
			});

			it('should filter less than a specific number', function () {
				const result = List.fields.numarr!.addFilterToQuery({
					value: 10,
					mode: 'lt',
				});
				expect(result.numarr).to.eql({
					$elemMatch: {
						$lt: 10,
					},
				});
			});

			it('should filter for existance', function () {
				const result = List.fields.numarr!.addFilterToQuery({
					mode: 'equals',
				});
				expect(result.numarr).to.eql({
					$size: 0,
				});
			});

			it('should filter between two numbers', function () {
				const result = List.fields.numarr!.addFilterToQuery({
					mode: 'between',
					value: {
						min: 0,
						max: 10,
					},
				});
				expect(result.numarr).to.eql({
					$elemMatch: {
						$gte: 0,
						$lte: 10,
					},
				});
			});

			it('should filter between two number strings', function () {
				const result = List.fields.numarr!.addFilterToQuery({
					mode: 'between',
					value: {
						min: '0',
						max: '10',
					},
				});
				expect(result.numarr).to.eql({
					$elemMatch: {
						$gte: 0,
						$lte: 10,
					},
				});
			});

			it('should not filter if the value is NaN', function () {
				const result = List.fields.numarr!.addFilterToQuery({
					value: NaN,
				});
				expect(result.numarr).to.be.undefined;
			});

			it('should not filter between two numbers if one is NaN', function () {
				const result = List.fields.numarr!.addFilterToQuery({
					mode: 'between',
					value: {
						min: NaN,
						max: 10,
					},
				});
				expect(result.numarr).to.be.undefined;
			});
		});
	});

	/* Deprecated inputIsValid tests */

	it('should validate input', function () {
		expect(List.fields.numarr!.inputIsValid({
			numarr: [1],
		})).to.be.true;
		expect(List.fields.numarr!.inputIsValid({
			numarr: [1, 2],
		})).to.be.true;
	});

	it('should validate no input', function () {
		const testItem = new List.model();
		expect(List.fields.numarr!.inputIsValid({})).to.be.true;
		expect(List.fields.numarr!.inputIsValid({}, true)).to.be.false;
		testItem.numarr = [1];
		expect(List.fields.numarr!.inputIsValid({}, true, testItem)).to.be.true;
	});

	it('should validate length when required', function () {
		expect(List.fields.numarr!.inputIsValid({
			numarr: [],
		}, true)).to.be.false;
	});

	it('should validate arrays with numeric string values', function () {
		expect(List.fields.numarr!.inputIsValid({
			numarr: ['1'],
		})).to.be.true;
	});

	it('should invalidate arrays with non-numeric string values', function () {
		expect(List.fields.numarr!.inputIsValid({
			numarr: ['a'],
		})).to.be.false;
	});

	it('should invalidate arrays with complex values', function () {
		expect(List.fields.numarr!.inputIsValid({
			numarr: [[]],
		}, true)).to.be.false;
	});
};
