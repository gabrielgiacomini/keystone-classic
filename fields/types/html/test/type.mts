import { expect } from 'chai';
import HtmlType from '../HtmlType.mjs';
import TextType from '../../text/TextType.mjs';

export const initList = function (List: import('../../test-helpers.mjs').TestList) {
	List.add({
		html: { type: HtmlType },
		nested: {
			html: { type: HtmlType },
		},
	});
};

export const createData = function (_List: import('../../test-helpers.mjs').TestList) {

};

export const testFilters = function (_List: import('../../test-helpers.mjs').TestList) {

};

export const testFieldType = function (List: import('../../test-helpers.mjs').TestList) {
	describe('updateItem', function () {
		it('should update top level fields', function (done) {
			const testItem = new List.model();
			List.fields.html!.updateItem(testItem, {
				html: 'foobar',
			}, function () {
				expect(testItem.html).to.equal('foobar');
				done();
			});
		});

		it('should update nested fields', function (done) {
			const testItem = new List.model();
			List.fields['nested.html']!.updateItem(testItem, {
				nested: {
					html: 'foobar',
				},
			}, function () {
				expect((testItem.nested as Record<string, unknown>).html).to.equal('foobar');
				done();
			});
		});

		it('should update nested fields with flat paths', function (done) {
			const testItem = new List.model();
			List.fields['nested.html']!.updateItem(testItem, {
				'nested.html': 'foobar',
			}, function () {
				expect((testItem.nested as Record<string, unknown>).html).to.equal('foobar');
				done();
			});
		});
	});

	it('should use the common text input validator', function () {
		expect(List.fields.html!.validateInput === TextType.prototype.validateInput).to.be.ok;
	});

	it('should use the common text required validator', function () {
		expect(List.fields.html!.validateRequiredInput === TextType.prototype.validateRequiredInput).to.be.ok;
	});

	it('should use the common text addFilterToQuery method', function () {
		expect(List.fields.html!.addFilterToQuery === TextType.prototype.addFilterToQuery).to.be.ok;
	});
};
