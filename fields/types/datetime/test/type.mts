import { expect } from 'chai';
import TextType from '../../text/TextType.mjs';
import DateType from '../../date/DateType.mjs';
import DatetimeType from '../DatetimeType.mjs';

export const initList = function (List: import('../../test-helpers.mjs').TestList) {
	List.add({
		datetime: DatetimeType,
		customFormat: {
			type: DatetimeType,
			parseFormat: 'DD.MM.YY h:m a',
		},
		nested: {
			datetime: DatetimeType,
		},
	});
};

export const testFieldType = function (List: import('../../test-helpers.mjs').TestList) {
	describe('invalid options', function () {
		it('should throw when format is not a string', function (done) {
			try {
				List.add({
					invalidFormatOption: { type: DatetimeType, format: /aregexp/ },
				});
			} catch (err: unknown) {
				expect((err as Error).message).to.eql('FieldType.DateTime: options.format must be a string.');
				done();
			}
		});
	});

	describe('updateItem', function () {
		it('should update the date', function (done) {
			const testItem = new List.model();
			List.fields.datetime!.updateItem(testItem, {
				datetime: '2015-01-01 01:01:01 am',
			}, function () {
				expect((testItem.datetime as Date).toDateString()).to.equal('Thu Jan 01 2015');
				done();
			});
		});

		it('should null value with empty string', function (done) {
			const testItem = new List.model();
			testItem.datetime = '2014-12-31T14:01:01.000Z';
			List.fields.datetime!.updateItem(testItem, {
				datetime: '',
			}, function () {
				expect(testItem.datetime).to.be.null;
				done();
			});
		});

		it('should null value when null', function (done) {
			const testItem = new List.model();
			testItem.datetime = '2014-12-31T14:01:01.000Z';
			List.fields.datetime!.updateItem(testItem, {
				datetime: null,
			}, function () {
				expect(testItem.datetime).to.be.null;
				done();
			});
		});

		it('should not null value when undefined', function (done) {
			const testItem = new List.model();
			testItem.datetime = '2015-01-01 01:01:01 am';
			List.fields.datetime!.updateItem(testItem, {
				datetime: undefined,
			}, function () {
				expect((testItem.datetime as Date).toDateString()).to.equal('Thu Jan 01 2015');
				done();
			});
		});
	});

	describe('getInputFromData', function () {
		it('should get input from data', function () {
			const value = List.fields.datetime!.getInputFromData({
				datetime: '2016-02-25 04:45:00',
			});
			expect(value).to.equal('2016-02-25 04:45:00');
		});

		it('should get nested input from data', function () {
			const value = List.fields['nested.datetime']!.getInputFromData({
				nested: { datetime: '2016-02-25 04:45:00' },
			});
			expect(value).to.equal('2016-02-25 04:45:00');
		});

		it('should get flat nested input from data', function () {
			const value = List.fields['nested.datetime']!.getInputFromData({
				'nested.datetime': '2016-02-25 04:45:00',
			});
			expect(value).to.equal('2016-02-25 04:45:00');
		});

		it('should get split input from data', function () {
			const value = List.fields.datetime!.getInputFromData({
				datetime_date: '2016-02-25',
				datetime_time: '04:45:00',
			});
			expect(value).to.equal('2016-02-25 04:45:00');
		});

		it('should get nested split input from data', function () {
			const value = List.fields['nested.datetime']!.getInputFromData({
				nested: {
					datetime_date: '2016-02-25',
					datetime_time: '04:45:00',
				},
			});
			expect(value).to.equal('2016-02-25 04:45:00');
		});

		it('should get flat nested split input from data', function () {
			const value = List.fields['nested.datetime']!.getInputFromData({
				'nested.datetime_date': '2016-02-25',
				'nested.datetime_time': '04:45:00',
			});
			expect(value).to.equal('2016-02-25 04:45:00');
		});
	});

	describe('validateInput', function () {
		it('should validate emtpy string input', function (done) {
			List.fields.datetime!.validateInput({ datetime: '' }, function (result: unknown) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate undefined input', function (done) {
			List.fields.datetime!.validateInput({}, function (result: unknown) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate null input', function (done) {
			List.fields.datetime!.validateInput({ datetime: null }, function (result: unknown) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate numeric input', function (done) {
			List.fields.datetime!.validateInput({ datetime: 1 }, function (result: unknown) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate JS Date input', function (done) {
			List.fields.datetime!.validateInput({ datetime: Date.now() }, function (result: unknown) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate a date time string in the default format', function (done) {
			List.fields.datetime!.validateInput({
				datetime: '2016-02-25 04:45:00 am',
			}, function (result: unknown) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate a date time string in a custom format when specified', function (done) {
			List.fields.customFormat!.validateInput({
				customFormat: '25.02.16 04:45 am',
			}, function (result: unknown) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should invalidate a date time string in a different format', function (done) {
			List.fields.datetime!.validateInput({
				datetime: '25.02.16 04:45 am',
			}, function (result: unknown) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate a date time string in the default format when a custom one is specified', function (done) {
			List.fields.customFormat!.validateInput({
				customFormat: '2016-02-25 04:45:00 am',
			}, function (result: unknown) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate object input', function (done) {
			List.fields.datetime!.validateInput({ datetime: { things: 'stuff' } }, function (result: unknown) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate array input', function (done) {
			List.fields.datetime!.validateInput({ datetime: [1, 2, 3] }, function (result: unknown) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate Boolean input', function (done) {
			List.fields.datetime!.validateInput({ datetime: true }, function (result: unknown) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate function input', function (done) {
			List.fields.datetime!.validateInput({ datetime: function () {} }, function (result: unknown) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate regexp input', function (done) {
			List.fields.datetime!.validateInput({ datetime: /foo/ }, function (result: unknown) {
				expect(result).to.be.false;
				done();
			});
		});
	});

	it('should use a datetime-specific required validator for split inputs', function () {
		expect(List.fields.datetime!.validateRequiredInput === TextType.prototype.validateRequiredInput).not.to.be.ok;
	});

	it('should use the date parse method', function () {
		expect(List.fields.datetime!.parse === DateType.prototype.parse).to.be.ok;
	});

	it('should use a datetime-specific updateItem method for split inputs', function () {
		expect(List.fields.datetime!.updateItem === DateType.prototype.updateItem).not.to.be.ok;
	});
};
