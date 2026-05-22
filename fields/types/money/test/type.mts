import { expect } from 'chai';
import MoneyType from '../MoneyType.mjs';
import NumberType from '../../number/NumberType.mjs';

export const initList = function (List: import('../../test-helpers.mjs').TestList) {
	List.add({
		money: { type: MoneyType },
		nested: {
			money: { type: MoneyType },
		},
		noFormat: { type: MoneyType, format: false },
	});
};

export const testFieldType = function (List: import('../../test-helpers.mjs').TestList) {
	describe('invalid options', function () {
		it('should throw when format is not a string', function (done) {
			try {
				List.add({
					invalidFormatOption: { type: MoneyType, format: /aregexp/ },
				});
			} catch (err: unknown) {
				expect((err as Error).message).to.eql('FieldType.Money: options.format must be a string.');
				done();
			}
		});
	});

	describe('updateItem', function () {
		it('should update top level fields', function (done) {
			const testItem = new List.model();
			List.fields.money!.updateItem(testItem, {
				money: 42,
			}, function () {
				expect(testItem.money).to.equal(42);
				done();
			});
		});

		it('should update nested fields', function (done) {
			const testItem = new List.model();
			List.fields['nested.money']!.updateItem(testItem, {
				nested: {
					money: 42,
				},
			}, function () {
				expect((testItem.nested as Record<string, unknown>).money).to.equal(42);
				done();
			});
		});

		it('should update nested fields with flat paths', function (done) {
			const testItem = new List.model();
			List.fields['nested.money']!.updateItem(testItem, {
				'nested.money': 42,
			}, function () {
				expect((testItem.nested as Record<string, unknown>).money).to.equal(42);
				done();
			});
		});
	});

	it('should use the common number input validator', function () {
		expect(List.fields.money!.validateInput === NumberType.prototype.validateInput).to.be.ok;
	});

	it('should use the common number required validator', function () {
		expect(List.fields.money!.validateRequiredInput === NumberType.prototype.validateRequiredInput).to.be.ok;
	});

	it('should use the common number addFilterToQuery', function () {
		expect(List.fields.money!.addFilterToQuery === NumberType.prototype.addFilterToQuery).to.be.ok;
	});

	describe('format', function () {
		it('should properly format', function () {
			const testItem = new List.model();
			testItem.money = 1234;
			expect((testItem._ as import('../../test-helpers.mjs').TestVirtuals).money!.format!()).to.equal('$1,234.00');
			testItem.money = -244;
			expect((testItem._ as import('../../test-helpers.mjs').TestVirtuals).money!.format!()).to.equal('-$244.00');
		});

		it('should ignore formatting if the format option is false', function () {
			const testItem = new List.model();
			testItem.noFormat = 1234;
			expect((testItem._ as import('../../test-helpers.mjs').TestVirtuals).noFormat!.format!()).to.equal(1234);
			testItem.noFormat = -244;
			expect((testItem._ as import('../../test-helpers.mjs').TestVirtuals).noFormat!.format!()).to.equal(-244);
		});
	});

	/* Deprecated inputIsValid tests */

	it('should validate numeric input', function () {
		expect(List.fields.money!.inputIsValid({
			money: 0,
		})).to.be.true;
		expect(List.fields.money!.inputIsValid({
			money: 1,
		})).to.be.true;
		expect(List.fields.money!.inputIsValid({
			money: -1,
		})).to.be.true;
		expect(List.fields.money!.inputIsValid({
			money: 1.1,
		})).to.be.true;
	});

	it('should validate string input', function () {
		expect(List.fields.money!.inputIsValid({
			money: '0',
		})).to.be.true;
		expect(List.fields.money!.inputIsValid({
			money: '1',
		})).to.be.true;
		expect(List.fields.money!.inputIsValid({
			money: '-1',
		})).to.be.true;
		expect(List.fields.money!.inputIsValid({
			money: '1.1',
		})).to.be.true;
		expect(List.fields.money!.inputIsValid({
			money: '$0',
		})).to.be.true;
		expect(List.fields.money!.inputIsValid({
			money: '$1',
		})).to.be.true;
		expect(List.fields.money!.inputIsValid({
			money: '$-1',
		})).to.be.true;
		expect(List.fields.money!.inputIsValid({
			money: '$1.1',
		})).to.be.true;
	});

	it('should validate no input', function () {
		const testItem = new List.model();
		expect(List.fields.money!.inputIsValid({})).to.be.true;
		expect(List.fields.money!.inputIsValid({}, true)).to.be.false;
		expect(List.fields.money!.inputIsValid({ money: '' })).to.be.true;
		expect(List.fields.money!.inputIsValid({ money: '' }, true)).to.be.false;
		testItem.money = 1;
		expect(List.fields.money!.inputIsValid({}, true, testItem)).to.be.true;
	});

	it('should invalidate invalid input', function () {
		expect(List.fields.money!.inputIsValid({
			money: {},
		})).to.be.false;
		expect(List.fields.money!.inputIsValid({
			money: [],
		})).to.be.false;
		expect(List.fields.money!.inputIsValid({
			money: 'a',
		})).to.be.false;
	});
};
