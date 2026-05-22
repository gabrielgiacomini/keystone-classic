import { expect } from 'chai';
import DateType from '../DateType.mjs';
import TextType from '../../text/TextType.mjs';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
dayjs.extend(utc);
dayjs.extend(customParseFormat);

export const initList = function (List: import('../../test-helpers.mjs').TestList) {
	List.add({
		date: DateType,
		utcDate: { type: DateType, utc: true },
		utcDateForcedTZ: { type: DateType, utc: true, timezoneUtcOffsetMinutes: 330 },
		nested: {
			date: DateType,
		},
	});
};

export const testFieldType = function (List: import('../../test-helpers.mjs').TestList) {
	describe('invalid options', function () {
		it('should throw when format is not a string', function (done) {
			try {
				List.add({
					invalidFormatOption: { type: DateType, format: /aregexp/ },
				});
			} catch (err: unknown) {
				expect((err as Error).message).to.eql('FieldType.Date: options.format must be a string.');
				done();
			}
		});
	});

	describe('updateItem', function () {
		it('should normalize dates with moment', function (done) {
			const testItem = new List.model();
			List.fields.date!.updateItem(testItem, {
				date: '2015-01-01',
			}, function () {
				expect(testItem.date).to.eql((testItem._ as import('../../test-helpers.mjs').TestVirtuals).date!.moment!('2015-01-01').toDate());
				done();
			});
		});

		it('should clear the value when passed ""', function (done) {
			const testItem = new List.model({
				date: '2015-01-01',
			});
			List.fields.date!.updateItem(testItem, {
				date: '',
			}, function () {
				expect(testItem.date).to.be.null;
				done();
			});
		});

		it('should clear the value when passed null', function (done) {
			const testItem = new List.model({
				date: '2015-01-01',
			});
			List.fields.date!.updateItem(testItem, {
				date: null,
			}, function () {
				expect(testItem.date).to.be.null;
				done();
			});
		});

		it('should not clear the value when a value exists and passed undefined', function (done) {
			const testItem = new List.model({
				date: '2015-01-01',
			});
			List.fields.date!.updateItem(testItem, {
				date: undefined,
			}, function () {
				expect(testItem.date).to.not.be.null;
				done();
			});
		});
	});

	describe('getData', function () {
		it('Retrieval of date set in current timezone', function (done) {
			const testItem = new List.model();
			List.fields.date!.updateItem(testItem, {
				date: dayjs('2015-01-01', 'YYYY-MM-DD'),
			}, function () {
				expect(List.fields.date!.getData(testItem)).to.eql(new Date(2015, 0, 1));
				done();
			});
		});

		it('Retrieval of UTC date', function (done) {
			const testItem = new List.model();
			List.fields.utcDate!.updateItem(testItem, {
				utcDate: dayjs.utc('2015-01-01', 'YYYY-MM-DD'),
			}, function () {
				expect(List.fields.utcDate!.getData(testItem)).to.eql(new Date(Date.UTC(2015, 0, 1)));
				done();
			});
		});

		it('Retrieval of fixable GMT date corrupted with timezone offset', function (done) {
			const testItem = new List.model();
			const timeToCompareInTimezone = dayjs.utc('2015-01-01', 'YYYY-MM-DD').add(-List.fields.utcDateForcedTZ!.timezoneUtcOffsetMinutes, 'minutes');
			List.fields.utcDateForcedTZ!.updateItem(testItem, {
				utcDateForcedTZ: timeToCompareInTimezone, // Creates time in whatever timezone the test is run in or utcDateForcedTZ is configured to
			}, function () {
				expect(List.fields.utcDateForcedTZ!.getData(testItem)).to.eql(new Date(Date.UTC(2015, 0, 1)));
				done();
			});
		});

		it('Retrieval of non-fixable GMT date corrupted with timezone offset', function (done) {
			const testItem = new List.model();
			const timeToCompareInTimezone = dayjs.utc('2015-01-01', 'YYYY-MM-DD').add(-540, 'minutes');
			List.fields.utcDateForcedTZ!.updateItem(testItem, {
				utcDateForcedTZ: timeToCompareInTimezone, // Creates time in whatever timezone the test is run in or utcDateForcedTZ is configured to
			}, function () {
				expect(List.fields.utcDateForcedTZ!.getData(testItem)).to.eql(timeToCompareInTimezone.toDate());
				done();
			});
		});

	});

	describe('validateInput', function () {
		it('should validate date strings', function (done) {
			List.fields.date!.validateInput({ date: '2015-01-01' }, function (result: unknown) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate JS "Date"s', function (done) {
			List.fields.date!.validateInput({ date: new Date(2015, 1, 1) }, function (result: unknown) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate epoch times', function (done) {
			List.fields.date!.validateInput({ date: 1458269216968 }, function (result: unknown) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate empty strings', function (done) {
			List.fields.date!.validateInput({ date: '' }, function (result: unknown) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate null', function (done) {
			List.fields.date!.validateInput({ date: null }, function (result: unknown) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate undefined', function (done) {
			List.fields.date!.validateInput({ date: undefined }, function (result: unknown) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should invalidate random strings', function (done) {
			List.fields.date!.validateInput({ date: 'a' }, function (result: unknown) {
				expect(result).to.be.false;
				done();
			});
		});


		it('should invalidate objects', function (done) {
			List.fields.date!.validateInput({ date: { things: 'stuff' } }, function (result: unknown) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate arrays', function (done) {
			List.fields.date!.validateInput({ date: ['a', 'b'] }, function (result: unknown) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate Booleans', function (done) {
			List.fields.date!.validateInput({ date: true }, function (result: unknown) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate function', function (done) {
			List.fields.date!.validateInput({ date: function () {} }, function (result: unknown) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate regexp', function (done) {
			List.fields.date!.validateInput({ date: /foo/ }, function (result: unknown) {
				expect(result).to.be.false;
				done();
			});
		});
	});

	it('should use the common text validateRequiredInput method', function () {
		expect(List.fields.date!.validateRequiredInput === TextType.prototype.validateRequiredInput).to.be.ok;
	});

	describe('addFilterToQuery', function () {
		it('should filter a specific date', function () {
			const result = List.fields.date!.addFilterToQuery({
				value: '2015-01-01',
			});
			expect(result.date).to.eql({
				$gte: dayjs('2015-01-01').startOf('day').toDate(),
				$lte: dayjs('2015-01-01').endOf('day').toDate(),
			});
		});

		it('should filter after a specific date', function () {
			const result = List.fields.date!.addFilterToQuery({
				mode: 'after',
				value: '2015-01-01',
			});
			expect(result.date).to.eql({
				$gt: dayjs('2015-01-01').endOf('day').toDate(),
			});
		});

		it('should filter before a specific date', function () {
			const result = List.fields.date!.addFilterToQuery({
				mode: 'before',
				value: '2015-01-01',
			});
			expect(result.date).to.eql({
				$lt: dayjs('2015-01-01').startOf('day').toDate(),
			});
		});

		it('should filter between two specified dates', function () {
			const result = List.fields.date!.addFilterToQuery({
				mode: 'between',
				after: '2015-01-01',
				before: '2016-01-01',
			});
			expect(result.date).to.eql({
				$gte: dayjs('2015-01-01').startOf('day').toDate(),
				$lte: dayjs('2016-01-01').endOf('day').toDate(),
			});
		});

		it('should support inverted filtering', function () {
			const result = List.fields.date!.addFilterToQuery({
				value: '2015-01-01',
				inverted: true,
			});
			expect(result.date).to.eql({
				$not: {
					$gte: dayjs('2015-01-01').startOf('day').toDate(),
					$lte: dayjs('2015-01-01').endOf('day').toDate(),
				},
			});
		});

		it('should not filter anything in between mode if no value is specified', function () {
			const result = List.fields.date!.addFilterToQuery({
				mode: 'between',
			});
			expect(result.date).to.be.undefined;
		});

		it('should not filter anything in between mode without an after date', function () {
			const result = List.fields.date!.addFilterToQuery({
				mode: 'between',
				before: '2015-01-01',
			});
			expect(result.date).to.be.undefined;
		});

		it('should not filter anything in between mode without a before date', function () {
			const result = List.fields.date!.addFilterToQuery({
				mode: 'between',
				after: '2015-01-01',
			});
			expect(result.date).to.be.undefined;
		});

		it('should not filter anything in between mode with an invalid after date', function () {
			const result = List.fields.date!.addFilterToQuery({
				mode: 'between',
				after: 'notadate',
			});
			expect(result.date).to.be.undefined;
		});

		it('should not filter anything in between mode with an invalid before date', function () {
			const result = List.fields.date!.addFilterToQuery({
				mode: 'between',
				before: 'notadate',
			});
			expect(result.date).to.be.undefined;
		});
	});

	describe('format', function () {
		it('should return an empty string if no date exists', function () {
			const testItem = new List.model();
			expect((testItem._ as import('../../test-helpers.mjs').TestVirtuals).date!.format!()).to.equal('');
		});

		it('should parse date input and return a moment object', function () {
			const m = List.fields.date!.parse('2016-02-27') as { format(str: string): string };
			expect(m.format('YYYY-MM-DD')).to.equal('2016-02-27');
		});

		it('should format the date value using moment', function () {
			const testItem = new List.model();
			testItem.date = new Date(2013, 11, 4);
			expect((testItem._ as import('../../test-helpers.mjs').TestVirtuals).date!.format!()).to.equal('4th Dec 2013');
			expect((testItem._ as import('../../test-helpers.mjs').TestVirtuals).date!.format!('YYYYMMDD')).to.equal('20131204');
		});

		it('should return a dayjs object set to the field value', function () {
			const testItem = new List.model();
			testItem.date = new Date(2013, 11, 4);
			expect(dayjs.isDayjs((testItem._ as import('../../test-helpers.mjs').TestVirtuals).date!.moment!())).to.be.ok;
			expect((testItem._ as import('../../test-helpers.mjs').TestVirtuals).date!.moment!().format('YYYYMMDD')).to.equal('20131204');
		});
	});
};
