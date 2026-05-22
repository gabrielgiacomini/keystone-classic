import { expect } from 'chai';

export const initList = function (List: import('../../test-helpers.mjs').TestList) {
	List.add({
		text: String,
		nested: {
			text: String,
		},
		maxChar: {
			type: String,
			max: 55,
		},
		minChar: {
			type: String,
			min: 10,
		},
	});
};

export const testFieldType = function (List: import('../../test-helpers.mjs').TestList) {
	describe('updateItem', function () {
		it('should update top level fields', function (done) {
			const testItem = new List.model();
			List.fields.text!.updateItem(testItem, {
				text: 'value',
			}, function () {
				expect(testItem.text).to.equal('value');
				done();
			});
		});

		it('should update nested fields', function (done) {
			const testItem = new List.model();
			List.fields['nested.text']!.updateItem(testItem, {
				nested: {
					text: 'value',
				},
			}, function () {
				expect((testItem.nested as Record<string, unknown>).text).to.equal('value');
				done();
			});
		});

		it('should truncate text with a length', function () {
			const testItem = new List.model({
				text: 'hello world',
			});
			expect((testItem._ as import('../../test-helpers.mjs').TestVirtuals).text!.crop!(8)).to.equal('hello wo');
		});

		it('should update nested fields with flat paths', function (done) {
			const testItem = new List.model();
			List.fields['nested.text']!.updateItem(testItem, {
				'nested.text': 'value',
			}, function () {
				expect((testItem.nested as Record<string, unknown>).text).to.equal('value');
				done();
			});
		});
	});

	describe('validateInput', function () {
		it('should validate string input', function (done) {
			List.fields.text!.validateInput({ text: 'a' }, function (result: unknown) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate emtpy string input', function (done) {
			List.fields.text!.validateInput({ text: '' }, function (result: unknown) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate undefined input', function (done) {
			List.fields.text!.validateInput({}, function (result: unknown) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate null input', function (done) {
			List.fields.text!.validateInput({ text: null }, function (result: unknown) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should invalidate numeric input', function (done) {
			List.fields.text!.validateInput({ text: 1 }, function (result: unknown) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate object input', function (done) {
			List.fields.text!.validateInput({ text: { things: 'stuff' } }, function (result: unknown) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate array input', function (done) {
			List.fields.text!.validateInput({ text: [1, 2, 3] }, function (result: unknown) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate Boolean input', function (done) {
			List.fields.text!.validateInput({ text: true }, function (result: unknown) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate function input', function (done) {
			List.fields.text!.validateInput({ text: function () {} }, function (result: unknown) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate regexp input', function (done) {
			List.fields.text!.validateInput({ text: /foo/ }, function (result: unknown) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate date input', function (done) {
			List.fields.text!.validateInput({ text: Date.now() }, function (result: unknown) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate string over max characters', function (done) {
			List.fields.maxChar!.validateInput({ maxChar: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit' }, function (result: unknown) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate string shorter than min characters', function (done) {
			List.fields.minChar!.validateInput({ minChar: 'Short' }, function (result: unknown) {
				expect(result).to.be.false;
				done();
			});
		});

	});

	describe('validateRequiredInput', function () {
		it('should validate input present', function (done) {
			const testItem = new List.model();
			List.fields.text!.validateRequiredInput(testItem, { text: 'a' }, function (result: unknown) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should invalidate undefined', function (done) {
			const testItem = new List.model();
			List.fields.text!.validateRequiredInput(testItem, { text: undefined }, function (result: unknown) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should validate undefined if a previous value exists', function (done) {
			const testItem = new List.model({
				text: 'a',
			});
			List.fields.text!.validateRequiredInput(testItem, { text: undefined }, function (result: unknown) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should invalidate empty string', function (done) {
			const testItem = new List.model();
			List.fields.text!.validateRequiredInput(testItem, { text: '' }, function (result: unknown) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate null', function (done) {
			const testItem = new List.model();
			List.fields.text!.validateRequiredInput(testItem, { text: null }, function (result: unknown) {
				expect(result).to.be.false;
				done();
			});
		});
	});

	describe('addFilterToQuery', function () {
		it('should return a regex with the "i" flag set', function () {
			const result = List.fields.text!.addFilterToQuery({
				value: 'abc',
			});
			expect(result.text).to.eql(/abc/i);
		});

		it('should allow case sensitive matching', function () {
			const result = List.fields.text!.addFilterToQuery({
				value: 'abc',
				caseSensitive: true,
			});
			expect(result.text).to.eql(/abc/);
		});

		it('should allow inverted matching', function () {
			const result = List.fields.text!.addFilterToQuery({
				value: 'abc',
				inverted: true,
			});
			expect(result.text).to.eql({
				$not: /abc/i,
			});
		});

		it('should allow exact matching', function () {
			const result = List.fields.text!.addFilterToQuery({
				value: 'abc',
				mode: 'exactly',
			});
			expect(result.text).to.eql(/^abc$/i);
		});

		it('should allow matching the end', function () {
			const result = List.fields.text!.addFilterToQuery({
				value: 'abc',
				mode: 'endsWith',
			});
			expect(result.text).to.eql(/abc$/i);
		});

		it('should allow matching the start', function () {
			const result = List.fields.text!.addFilterToQuery({
				value: 'abc',
				mode: 'beginsWith',
			});
			expect(result.text).to.eql(/^abc/i);
		});

		it('should allow matching empty values in exact mode', function () {
			const result = List.fields.text!.addFilterToQuery({
				mode: 'exactly',
			});
			expect(result.text).to.eql({
				$in: ['', null],
			});
		});

		it('should allow matching non-empty values in exact mode with the inverted option', function () {
			const result = List.fields.text!.addFilterToQuery({
				mode: 'exactly',
				inverted: true,
			});
			expect(result.text).to.eql({
				$nin: ['', null],
			});
		});
	});
};
