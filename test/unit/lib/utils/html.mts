import { expect } from 'chai';
import legacyUtils from 'keystone-utils';
import { encodeHTMLEntities, textToHTML } from '../../../../lib/utils/html.mts';

const legacyEncodeHTMLEntities = legacyUtils.encodeHTMLEntities as (value: unknown) => string;
const legacyTextToHTML = legacyUtils.textToHTML as (value: unknown) => string;

describe('lib/utils/html', function () {
	it('matches legacy HTML entity encoding for representative values', function () {
		const values = [
			'plain text',
			'<script>alert("x")</script>',
			"Tom & Ada's notes",
			'copyright \u00a9 euro \u20ac pi \u03c0 arrow \u2192',
			'dashes \u2013 \u2014 ellipsis \u2026 math \u2264 \u2265',
			123,
			true,
			false,
			0,
			null,
			undefined,
			{ toString: () => '<custom>' },
		];

		for (const value of values) {
			expect(encodeHTMLEntities(value), String(value)).to.equal(legacyEncodeHTMLEntities(value));
		}
	});

	it('matches legacy text-to-HTML conversion for entities and line feeds', function () {
		const values = [
			'hello\nworld',
			'<b>hello</b>\n& goodbye',
			'\u03a9\n\u03c0\n\u20ac',
			{ toString: () => 'object\n<value>' },
		];

		for (const value of values) {
			expect(textToHTML(value), String(value)).to.equal(legacyTextToHTML(value));
		}
	});
});
