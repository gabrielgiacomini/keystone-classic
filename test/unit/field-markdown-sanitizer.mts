import { expect } from 'chai';
import keystone from 'keystone';
import MarkdownType from '../../dist/fields/types/markdown/MarkdownType.mjs';

interface KsInternal {
	init(): void;
	List: new(key: string, opts?: Record<string, unknown>) => KsList;
}

interface KsList {
	add(fields: Record<string, unknown>): void;
	register(): void;
	model: new() => Record<string, unknown>;
	fields: Record<string, {
		updateItem(item: unknown, data: Record<string, unknown>, callback: () => void): void;
	}>;
}

function ks(): KsInternal {
	return keystone as unknown as KsInternal;
}

ks().init();

const List = new (ks().List)('MarkdownSanitizerRegressionTest', { nocreate: true });
List.add({
	markdown: { type: MarkdownType },
});
List.register();

describe('Markdown field sanitizer', function () {
	for (const { name, payload } of [
		{ name: 'script', payload: '<xmp><script>alert(1)</script></xmp>' },
		{ name: 'image onerror', payload: '<xmp><img src=x onerror=alert(1)></xmp>' },
	]) {
		it(`strips disallowed xmp raw-text ${name} payloads before rendering html`, function (done) {
			const testItem = new List.model();
			List.fields.markdown!.updateItem(testItem, {
				markdown: payload,
			}, function () {
				const value = testItem.markdown as Record<string, unknown>;
				expect(value.md).to.equal('');
				expect(value.html).to.equal('');
				done();
			});
		});
	}
});
