import { expect } from 'chai';
import CodeType from '../CodeType.mjs';
import TextType from '../../text/TextType.mjs';

export const initList = function (List: import('../../test-helpers.mjs').TestList) {
	List.add({
		code: { type: CodeType },
		nested: {
			code: { type: CodeType },
		},
		lang: {
			type: CodeType,
			lang: 'c',
		},
		language: {
			type: CodeType,
			lang: 'js',
		},
		codemirror: {
			type: CodeType,
			lang: 'html',
			codemirror: {
				value: 'codemirror value',
			},
		},
	});
};

export const testFieldType = function (List: import('../../test-helpers.mjs').TestList) {
	describe('updateItem', function () {
		it('should update top level fields', function (done) {
			const testItem = new List.model();
			List.fields.code!.updateItem(testItem, {
				code: 'foo(bar);',
			}, function () {
				expect(testItem.code).to.equal('foo(bar);');
				done();
			});
		});

		it('should update nested fields', function (done) {
			const testItem = new List.model();
			List.fields['nested.code']!.updateItem(testItem, {
				nested: {
					code: 'foo(bar);',
				},
			}, function () {
				expect((testItem.nested as Record<string, unknown>).code).to.equal('foo(bar);');
				done();
			});
		});

		it('should update nested fields with flat paths', function (done) {
			const testItem = new List.model();
			List.fields['nested.code']!.updateItem(testItem, {
				'nested.code': 'foo(bar);',
			}, function () {
				expect((testItem.nested as Record<string, unknown>).code).to.equal('foo(bar);');
				done();
			});
		});
	});

	it('should use the common text input validator', function () {
		expect(List.fields.code!.validateInput === TextType.prototype.validateInput).to.be.ok;
	});

	it('should use the common text required validator', function () {
		expect(List.fields.code!.validateRequiredInput === TextType.prototype.validateRequiredInput).to.be.ok;
	});

	it('should use the common text addFilterToQuery', function () {
		expect(List.fields.code!.addFilterToQuery === TextType.prototype.addFilterToQuery).to.be.ok;
	});

	describe('properties', function () {
		it('should handle a `lang` config property', function () {
			expect(List.fields.lang!.lang).to.equal('c');
		});

		it('should handle a `language` config property', function () {
			expect(List.fields.language!.lang).to.equal('js');
		});

		it('should support a `codemirror` config property', function () {
			expect(List.fields.codemirror!.codemirror).to.be.an('object');
			expect(List.fields.codemirror!.codemirror.value).to.equal('codemirror value');
		});

		it('should merge the `lang` and `codemirror` config properties', function () {
			expect(List.fields.codemirror!.editor).to.be.an('object');
			expect(List.fields.codemirror!.editor.mode).to.equal('html');
			expect(List.fields.codemirror!.editor.value).to.equal('codemirror value');
		});
	});
};
