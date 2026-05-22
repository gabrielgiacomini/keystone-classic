import { expect } from 'chai';
import NumberType from '../NumberType.mjs';

export const initList = function (List: import('../../test-helpers.mjs').TestList) {
	List.add({
		number: { type: NumberType },
		nested: {
			number: { type: NumberType },
		},
	});
};

export const testFieldType = function (List: import('../../test-helpers.mjs').TestList) {
	describe('invalid options', function () {
		it('should throw when no options are passed', function (done) {
			try {
				List.add({
					noFormatString: { type: NumberType, format: /regexp/ },
				});
			} catch (err: unknown) {
				expect((err as Error).message).to.eql('FieldType.Number: options.format must be a string.');
				done();
			}
		});
	});

	describe('updateItem', function () {
		it('should update top level fields', function (done) {
			const testItem = new List.model();
			List.fields.number!.updateItem(testItem, {
				number: 42,
			}, function () {
				expect(testItem.number).to.equal(42);
				done();
			});
		});

		it('should update nested fields', function (done) {
			const testItem = new List.model();
			List.fields['nested.number']!.updateItem(testItem, {
				nested: {
					number: 42,
				},
			}, function () {
				expect((testItem.nested as Record<string, unknown>).number).to.equal(42);
				(testItem.nested as Record<string, unknown>).number = undefined;
				done();
			});
		});

		it('should update nested fields with flat paths', function (done) {
			const testItem = new List.model();
			List.fields['nested.number']!.updateItem(testItem, {
				'nested.number': 42,
			}, function () {
				expect((testItem.nested as Record<string, unknown>).number).to.equal(42);
				(testItem.nested as Record<string, unknown>).number = undefined;
				done();
			});
		});

		it('should null value with empty string', function (done) {
			const testItem = new List.model();
			testItem.number = 1;
			List.fields.number!.updateItem(testItem, {
				number: '',
			}, function () {
				expect(testItem.number).to.be.null;
				done();
			});
		});

		it('should null value when null', function (done) {
			const testItem = new List.model();
			testItem.number = 1;
			List.fields.number!.updateItem(testItem, {
				number: null,
			}, function () {
				expect(testItem.number).to.be.null;
				done();
			});
		});

		it('should not null value when undefined', function (done) {
			const testItem = new List.model();
			testItem.number = 1;
			List.fields.number!.updateItem(testItem, {
				number: undefined,
			}, function () {
				expect(testItem.number).to.equal(1);
				done();
			});
		});

		it('should convert string values', function (done) {
			const testItem = new List.model({
				number: 1,
			});
			List.fields.number!.updateItem(testItem, {
				number: '50.50',
			}, function () {
				expect(testItem.number).to.equal(50.50);
				done();
			});
		});
	});

	describe('validateInput', function () {
		it('should validate numeric input', function (done) {
			List.fields.number!.validateInput({ number: 1 }, function (result: unknown) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate undefined input', function (done) {
			List.fields.number!.validateInput({}, function (result: unknown) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate null input', function (done) {
			List.fields.number!.validateInput({ number: null }, function (result: unknown) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate empty string input', function (done) {
			List.fields.number!.validateInput({ number: '' }, function (result: unknown) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate numeric string input', function (done) {
			List.fields.number!.validateInput({ number: '1' }, function (result: unknown) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should invalidate string input', function (done) {
			List.fields.number!.validateInput({ number: 'a' }, function (result: unknown) {
				expect(result).to.be.false;
				done();
			});
		});


		it('should invalidate object input', function (done) {
			List.fields.number!.validateInput({ number: { things: 'stuff' } }, function (result: unknown) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate array input', function (done) {
			List.fields.number!.validateInput({ number: [1, 2, 3] }, function (result: unknown) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate Boolean input', function (done) {
			List.fields.number!.validateInput({ number: true }, function (result: unknown) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate function input', function (done) {
			List.fields.number!.validateInput({ number: function () {} }, function (result: unknown) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate regexp input', function (done) {
			List.fields.number!.validateInput({ number: /foo/ }, function (result: unknown) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate date input', function (done) {
			List.fields.number!.validateInput({ number: new Date() }, function (result: unknown) {
				expect(result).to.be.false;
				done();
			});
		});
	});

	describe('validateRequiredInput', function () {
		it('should validate numeric input', function (done) {
			const testItem = new List.model();
			List.fields.number!.validateRequiredInput(testItem, { number: 1 }, function (result: unknown) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate numeric string input', function (done) {
			const testItem = new List.model();
			List.fields.number!.validateRequiredInput(testItem, { number: '1' }, function (result: unknown) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should invalidate undefined input', function (done) {
			const testItem = new List.model();
			List.fields.number!.validateRequiredInput(testItem, {}, function (result: unknown) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should validate undefined input if data exists', function (done) {
			const testItem = new List.model({
				number: 1,
			});
			List.fields.number!.validateRequiredInput(testItem, {}, function (result: unknown) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should invalidate null input', function (done) {
			const testItem = new List.model();
			List.fields.number!.validateRequiredInput(testItem, { number: null }, function (result: unknown) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate empty string input', function (done) {
			const testItem = new List.model();
			List.fields.number!.validateRequiredInput(testItem, { number: '' }, function (result: unknown) {
				expect(result).to.be.false;
				done();
			});
		});
	});

	describe('addFilterToQuery', function () {
		it('should filter for a specific number', function () {
			const result = List.fields.number!.addFilterToQuery({
				value: 10,
			});
			expect(result.number).to.eql(10);
		});

		it('should filter greater than a specific number', function () {
			const result = List.fields.number!.addFilterToQuery({
				value: 0,
				mode: 'gt',
			});
			expect(result.number).to.eql({
				$gt: 0,
			});
		});

		it('should filter less than a specific number', function () {
			const result = List.fields.number!.addFilterToQuery({
				value: 10,
				mode: 'lt',
			});
			expect(result.number).to.eql({
				$lt: 10,
			});
		});

		it('should support inverted less than', function () {
			const result = List.fields.number!.addFilterToQuery({
				value: 10,
				mode: 'lt',
				inverted: true,
			});
			expect(result.number).to.eql({
				$gt: 10,
			});
		});

		it('should support inverted greater than', function () {
			const result = List.fields.number!.addFilterToQuery({
				value: 10,
				mode: 'gt',
				inverted: true,
			});
			expect(result.number).to.eql({
				$lt: 10,
			});
		});

		it('should filter for existance', function () {
			const result = List.fields.number!.addFilterToQuery({
				mode: 'equals',
			});
			expect(result.number).to.eql({
				$in: ['', null],
			});
		});

		it('should filter for non-existance', function () {
			const result = List.fields.number!.addFilterToQuery({
				mode: 'equals',
				inverted: true,
			});
			expect(result.number).to.eql({
				$nin: ['', null],
			});
		});

		it('should filter between two numbers', function () {
			const result = List.fields.number!.addFilterToQuery({
				mode: 'between',
				value: {
					min: 0,
					max: 10,
				},
			});
			expect(result.number).to.eql({
				$gte: 0,
				$lte: 10,
			});
		});

		it('should filter exluding a range between two numbers', function () {
			const result = List.fields.number!.addFilterToQuery({
				mode: 'between',
				value: {
					min: 0,
					max: 10,
				},
				inverted: true,
			});
			expect(result).to.eql({
				$or: [
					{ number: { $gt: 10 } },
					{ number: { $lt: 0 } },
				],
			});
		});

		it('should filter between two number strings', function () {
			const result = List.fields.number!.addFilterToQuery({
				mode: 'between',
				value: {
					min: '0',
					max: '10',
				},
			});
			expect(result.number).to.eql({
				$gte: 0,
				$lte: 10,
			});
		});

		it('should not filter if the value is NaN', function () {
			const result = List.fields.number!.addFilterToQuery({
				value: NaN,
			});
			expect(result.number).to.be.undefined;
		});

		it('should not filter between two numbers if one is NaN', function () {
			const result = List.fields.number!.addFilterToQuery({
				mode: 'between',
				value: {
					min: NaN,
					max: 10,
				},
			});
			expect(result.number).to.be.undefined;
		});
	});

	/* Deprecated inputIsValid method tests */

	it('should validate numeric input', function () {
		expect(List.fields.number!.inputIsValid({
			number: 0,
		})).to.be.true;
		expect(List.fields.number!.inputIsValid({
			number: 1,
		})).to.be.true;
		expect(List.fields.number!.inputIsValid({
			number: -1,
		})).to.be.true;
		expect(List.fields.number!.inputIsValid({
			number: 1.1,
		})).to.be.true;
	});

	it('should validate string input', function () {
		expect(List.fields.number!.inputIsValid({
			number: '0',
		})).to.be.true;
		expect(List.fields.number!.inputIsValid({
			number: '1',
		})).to.be.true;
		expect(List.fields.number!.inputIsValid({
			number: '-1',
		})).to.be.true;
		expect(List.fields.number!.inputIsValid({
			number: '1.1',
		})).to.be.true;
	});

	it('should validate no input', function () {
		expect(List.fields.number!.inputIsValid({})).to.be.true;
		expect(List.fields.number!.inputIsValid({}, true)).to.be.false;
		const testItem = new List.model({
			number: 1,
		});
		expect(List.fields.number!.inputIsValid({}, true, testItem)).to.be.true;
	});

	it('should validate empty strings', function () {
		expect(List.fields.number!.inputIsValid({
			number: '',
		})).to.be.true;
		expect(List.fields.number!.inputIsValid({
			number: '',
		}, true)).to.be.false;
		const testItem = new List.model({
			number: 1,
		});
		expect(List.fields.number!.inputIsValid({
			number: '',
		}, true, testItem)).to.be.false;
	});

	it('should invalidate invalid input', function () {
		expect(List.fields.number!.inputIsValid({
			number: {},
		})).to.be.false;
		expect(List.fields.number!.inputIsValid({
			number: [],
		})).to.be.false;
		expect(List.fields.number!.inputIsValid({
			number: 'a',
		})).to.be.false;
	});
};
