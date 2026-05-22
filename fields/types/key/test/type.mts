import { expect } from 'chai';
import KeyType from '../KeyType.mjs';
import TextType from '../../text/TextType.mjs';

export const initList = function (List: import('../../test-helpers.mjs').TestList) {
	List.add({
		key: { type: KeyType },
		customSeparator: { type: KeyType, separator: '$' },
		nested: {
			key: { type: KeyType },
		},
	});
};

export const testFieldType = function (List: import('../../test-helpers.mjs').TestList) {
	describe('updateItem', function () {
		it('should update top level fields', function (done) {
			const testItem = new List.model();
			List.fields.key!.updateItem(testItem, {
				key: 'foobar',
			}, function () {
				expect(testItem.key).to.equal('foobar');
				done();
			});
		});

		it('should update nested fields', function (done) {
			const testItem = new List.model();
			List.fields['nested.key']!.updateItem(testItem, {
				nested: {
					key: 'foobar',
				},
			}, function () {
				expect((testItem.nested as Record<string, unknown>).key).to.equal('foobar');
				done();
			});
		});

		it('should update nested fields with flat paths', function (done) {
			const testItem = new List.model();
			List.fields['nested.key']!.updateItem(testItem, {
				'nested.key': 'foobar',
			}, function () {
				expect((testItem.nested as Record<string, unknown>).key).to.equal('foobar');
				done();
			});
		});

		it('should update the item with a slugified value', function (done) {
			const testItem = new List.model();
			List.fields.key!.updateItem(testItem, {
				key: 'A b ç',
			}, function () {
				expect(testItem.key).to.equal('a-b-c');
				done();
			});
		});

		it('should use the separator option for the slugified value', function (done) {
			const testItem = new List.model();
			List.fields.customSeparator!.updateItem(testItem, {
				customSeparator: 'A b ç',
			}, function () {
				expect(testItem.customSeparator).to.equal('a$b$c');
				testItem.customSeparator = undefined;
				done();
			});
		});
	});

	it('should use the common text validateInput method', function () {
		expect(List.fields.key!.validateInput === TextType.prototype.validateInput).to.be.ok;
	});

	it('should use the common text validateRequiredInput method', function () {
		expect(List.fields.key!.validateRequiredInput === TextType.prototype.validateRequiredInput).to.be.ok;
	});

	it('should use the common text addFilterToQuery method', function () {
		expect(List.fields.key!.addFilterToQuery === TextType.prototype.addFilterToQuery).to.be.ok;
	});

	describe('generateKey', function () {
		it('should return a slug of the provided string', function () {
			expect(List.fields.key!.generateKey('A b ç')).to.equal('a-b-c');
		});

		it('should use the seperator option', function () {
			expect(List.fields.customSeparator!.generateKey('A b c')).to.equal('a$b$c');
		});
	});

	/* Deprecated inputIsValid method tests */

	it('should invalidate input with stripped characters', function () {
		const testItem = new List.model();
		expect(List.fields.key!.inputIsValid({
			key: '()',
		}, true, testItem)).to.be.false;
	});

	it('should invalidate input with just whitespace', function () {
		const testItem = new List.model();
		expect(List.fields.key!.inputIsValid({
			key: ' ',
		}, true, testItem)).to.be.false;
	});

	it('should validate input with non-key characters', function () {
		const testItem = new List.model();
		expect(List.fields.key!.inputIsValid({
			key: 'A b',
		}, true, testItem)).to.be.true;
	});
};
