import { expect } from 'chai';
import TextareaType from '../TextareaType.mjs';
import TextType from '../../text/TextType.mjs';

export const initList = function (List: import('../../test-helpers.mjs').TestList) {
	List.add({
		text: TextareaType,
		nested: {
			text: TextareaType,
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
				(testItem.nested as Record<string, unknown>).text = undefined;
				done();
			});
		});

		it('should update nested fields with flat paths', function (done) {
			const testItem = new List.model();
			List.fields['nested.text']!.updateItem(testItem, {
				'nested.text': 'value',
			}, function () {
				expect((testItem.nested as Record<string, unknown>).text).to.equal('value');
				(testItem.nested as Record<string, unknown>).text = undefined;
				done();
			});
		});
	});

	it('should use the common text input validator', function () {
		expect(List.fields.text!.validateInput === TextType.prototype.validateInput).to.be.ok;
	});

	it('should use the common text required validator', function () {
		expect(List.fields.text!.validateRequiredInput === TextType.prototype.validateRequiredInput).to.be.ok;
	});

	it('should use the common text addFilterToQuery method', function () {
		expect(List.fields.text!.addFilterToQuery === TextType.prototype.addFilterToQuery).to.be.ok;
	});

	describe('format', function () {
		it('should format to HTML', function () {
			const testItem = new List.model({
				text: 'hello\nworld',
			});
			expect((testItem._ as import('../../test-helpers.mjs').TestVirtuals).text!.format!()).to.equal('hello<br>world');
		});
	});

	describe('crop', function () {
		it('should truncate text with a length', function () {
			const testItem = new List.model({
				text: 'helloworld',
			});
			expect((testItem._ as import('../../test-helpers.mjs').TestVirtuals).text!.crop!(7)).to.equal('hellowo');
		});

		it('should truncate text with a length and custom append string', function () {
			const testItem = new List.model({
				text: 'helloworld',
			});
			expect((testItem._ as import('../../test-helpers.mjs').TestVirtuals).text!.crop!(7, '$')).to.equal('hellowo$');
		});

		it('should truncate text with and preserve words with a length, custom append string', function () {
			const testItem = new List.model({
				text: 'hello world something',
			});
			expect((testItem._ as import('../../test-helpers.mjs').TestVirtuals).text!.crop!(7, '...', true)).to.equal('hello world...');
		});
	});
};
