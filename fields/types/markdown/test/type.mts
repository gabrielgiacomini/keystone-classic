import { expect } from 'chai';
import MarkdownType from '../MarkdownType.mjs';
import TextType from '../../text/TextType.mjs';

export const initList = function (List: import('../../test-helpers.mjs').TestList) {
	List.add({
		markdown: { type: MarkdownType },
		nested: {
			markdown: { type: MarkdownType },
		},
	});
};

export const testFieldType = function (List: import('../../test-helpers.mjs').TestList) {
	describe('updateItem', function () {
		it('should update top level fields', function (done) {
			const testItem = new List.model();
			List.fields.markdown!.updateItem(testItem, {
				markdown: 'foobar',
			}, function () {
				expect(((testItem.markdown as Record<string, unknown>).html as string)).to.equal('<p>foobar</p>\n');
				done();
			});
		});

		it('should update nested fields', function (done) {
			const testItem = new List.model();
			List.fields['nested.markdown']!.updateItem(testItem, {
				nested: {
					markdown: 'foobar',
				},
			}, function () {
				expect(((testItem.nested as Record<string, unknown>).markdown as Record<string, unknown>).html).to.equal('<p>foobar</p>\n');
				done();
			});
		});

		it('should update nested fields with flat paths', function (done) {
			const testItem = new List.model();
			List.fields['nested.markdown']!.updateItem(testItem, {
				'nested.markdown': 'foobar',
			}, function () {
				expect(((testItem.nested as Record<string, unknown>).markdown as Record<string, unknown>).html).to.equal('<p>foobar</p>\n');
				done();
			});
		});

		for (const { name, payload } of [
			{ name: 'script', payload: '<xmp><script>alert(1)</script></xmp>' },
			{ name: 'image onerror', payload: '<xmp><img src=x onerror=alert(1)></xmp>' },
		]) {
			it(`should strip disallowed xmp raw-text ${name} payloads before rendering html`, function (done) {
				const testItem = new List.model();
				List.fields.markdown!.updateItem(testItem, {
					markdown: payload,
				}, function () {
					expect(((testItem.markdown as Record<string, unknown>).md as string)).to.equal('');
					expect(((testItem.markdown as Record<string, unknown>).html as string)).to.equal('');
					done();
				});
			});
		}
	});

	it('should use the common text input validator', function () {
		expect(List.fields.markdown!.validateInput === TextType.prototype.validateInput).to.be.ok;
	});

	it('should use the common text required validator', function () {
		expect(List.fields.markdown!.validateRequiredInput === TextType.prototype.validateRequiredInput).to.be.ok;
	});

	describe('addFilterToQuery', function () {
		it('should return a regex with the "i" flag set', function () {
			const result = List.fields.markdown!.addFilterToQuery({
				value: 'abc',
			});
			expect(result['markdown.md']).to.eql(/abc/i);
		});

		it('should allow case sensitive matching', function () {
			const result = List.fields.markdown!.addFilterToQuery({
				value: 'abc',
				caseSensitive: true,
			});
			expect(result['markdown.md']).to.eql(/abc/);
		});

		it('should allow inverted matching', function () {
			const result = List.fields.markdown!.addFilterToQuery({
				value: 'abc',
				inverted: true,
			});
			expect(result['markdown.md']).to.eql({
				$not: /abc/i,
			});
		});

		it('should allow exact matching', function () {
			const result = List.fields.markdown!.addFilterToQuery({
				value: 'abc',
				mode: 'exactly',
			});
			expect(result['markdown.md']).to.eql(/^abc$/i);
		});

		it('should allow matching the end', function () {
			const result = List.fields.markdown!.addFilterToQuery({
				value: 'abc',
				mode: 'endsWith',
			});
			expect(result['markdown.md']).to.eql(/abc$/i);
		});

		it('should allow matching the start', function () {
			const result = List.fields.markdown!.addFilterToQuery({
				value: 'abc',
				mode: 'beginsWith',
			});
			expect(result['markdown.md']).to.eql(/^abc/i);
		});

		it('should allow matching empty values in exact mode', function () {
			const result = List.fields.markdown!.addFilterToQuery({
				mode: 'exactly',
			});
			expect(result['markdown.md']).to.eql({
				$in: ['', null],
			});
		});

		it('should allow matching non-empty values in exact mode with the inverted option', function () {
			const result = List.fields.markdown!.addFilterToQuery({
				mode: 'exactly',
				inverted: true,
			});
			expect(result['markdown.md']).to.eql({
				$nin: ['', null],
			});
		});
	});
};
