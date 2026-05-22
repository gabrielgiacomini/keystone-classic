import { expect } from 'chai';
import UrlType from '../UrlType.mjs';
import TextType from '../../text/TextType.mjs';

function customFormat (url: unknown) {
	return String(url).toUpperCase();
}

export const initList = function (List: import('../../test-helpers.mjs').TestList) {
	List.add({
		url: UrlType,
		nested: {
			url: UrlType,
		},
		customFormat: { type: UrlType, format: customFormat },
	});
};

export const testFieldType = function (List: import('../../test-helpers.mjs').TestList) {
	describe('updateItem', function () {
		it('should update top level fields', function (done) {
			const testItem = new List.model();
			List.fields.url!.updateItem(testItem, {
				url: 'value',
			}, function () {
				expect(testItem.url).to.equal('value');
				done();
			});
		});

		it('should update nested fields', function (done) {
			const testItem = new List.model();
			List.fields['nested.url']!.updateItem(testItem, {
				nested: {
					url: 'value',
				},
			}, function () {
				expect((testItem.nested as Record<string, unknown>).url).to.equal('value');
				done();
			});
		});

		it('should update nested fields with flat paths', function (done) {
			const testItem = new List.model();
			List.fields['nested.url']!.updateItem(testItem, {
				'nested.url': 'value',
			}, function () {
				expect((testItem.nested as Record<string, unknown>).url).to.equal('value');
				done();
			});
		});
	});

	it('should use the common text input validator', function () {
		expect(List.fields.url!.validateInput === TextType.prototype.validateInput).to.be.ok;
	});

	it('should use the common text required validator', function () {
		expect(List.fields.url!.validateRequiredInput === TextType.prototype.validateRequiredInput).to.be.ok;
	});

	it('should use the common text addFilterToQuery method', function () {
		expect(List.fields.url!.addFilterToQuery === TextType.prototype.addFilterToQuery).to.be.ok;
	});

	describe('format', function () {
		it('should strip the protocol when formatting', function (done) {
			const testItem = new List.model();
			List.fields.url!.updateItem(testItem, {
				url: 'http://www.keystonejs.com',
			}, function () {
				expect((testItem._ as import('../../test-helpers.mjs').TestVirtuals).url!.format!()).to.equal('www.keystonejs.com');
				done();
			});
		});

		it('should call custom format methods', function (done) {
			const testItem = new List.model();
			List.fields.customFormat!.updateItem(testItem, {
				customFormat: 'http://www.keystonejs.com',
			}, function () {
				expect((testItem._ as import('../../test-helpers.mjs').TestVirtuals).customFormat!.format!()).to.equal('HTTP://WWW.KEYSTONEJS.COM');
				done();
			});
		});
	});
};
