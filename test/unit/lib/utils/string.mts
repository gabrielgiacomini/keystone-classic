import { expect } from 'chai';
import legacyUtils from 'keystone-utils';
import {
	cropString,
	downcase,
	keyToLabel,
	keyToPath,
	keyToProperty,
	plural,
	singular,
	slug,
} from '../../../../lib/utils/string.mts';

describe('lib/utils/string', function () {
	it('matches legacy cropString behavior for representative values', function () {
		const values: Array<{
			value: unknown;
			length: number;
			append?: string | boolean | null;
			preserveWords?: boolean;
		}> = [
			{ value: 'short', length: 10 },
			{ value: 'launch announcement', length: 6 },
			{ value: 'launch announcement', length: 6, append: '...' },
			{ value: 'launch announcement', length: 6, append: '...', preserveWords: true },
			{ value: 'launch announcement', length: 6, append: true },
			{ value: '', length: 3, append: '...' },
			{ value: null, length: 3, append: '...' },
			{ value: { toString: () => 'object string value' }, length: 6, append: '...' },
			{ value: 12345, length: 3, append: '...' },
		];

		for (const testCase of values) {
			const expected = legacyUtils.cropString(
				testCase.value as string,
				testCase.length,
				testCase.append as string,
				testCase.preserveWords,
			);
			const actual = cropString(testCase.value, testCase.length, testCase.append, testCase.preserveWords);
			expect(actual, String(testCase.value)).to.equal(expected);
		}
	});

	it('matches legacy keyToLabel behavior for representative field paths', function () {
		const values: unknown[] = [
			'one',
			'oneTwo',
			'one_two',
			'oneTwoThree',
			'oneTWOThree',
			'one twoThree',
			'oneTwo.three',
			'oneTwo3four',
			'oneTwo-threeFour',
			'id',
			'someId',
			'status:code',
			'caféPrice',
			{ toString: () => 'customValue' },
			null,
			undefined,
		];

		for (const value of values) {
			expect(keyToLabel(value), String(value)).to.equal(legacyUtils.keyToLabel(value as string));
		}
	});

	it('matches legacy slug behavior for field key inputs used by bundled field types', function () {
		const cases: Array<{ value: unknown; separator?: string }> = [
			{ value: 'A b ç' },
			{ value: 'A b c', separator: '$' },
			{ value: 'A b c', separator: undefined },
			{ value: 'Already--Separated' },
			{ value: 'Café déjà vu' },
			{ value: 'one/two.three' },
			{ value: '()' },
			{ value: ' ' },
		];

		for (const testCase of cases) {
			expect(slug(testCase.value, testCase.separator), String(testCase.value)).to.equal(
				legacyUtils.slug(testCase.value as string, testCase.separator),
			);
		}
	});

	it('matches legacy singular and plural behavior for list labels and counted messages', function () {
		const words = [
			'Post',
			'Posts',
			'Category',
			'Categories',
			'Person',
			'People',
			'Status',
			'Boss',
			'News',
			'FAQ',
			'Field Sample',
			'field_sample',
			'Company',
			'fish',
			'child',
			'',
		];

		for (const word of words) {
			expect(singular(word), `singular ${word}`).to.equal(legacyUtils.singular(word));
			expect(plural(word), `plural ${word}`).to.equal(legacyUtils.plural(word));
		}

		const countCases: Array<{ count: unknown; singularTemplate: string; pluralTemplate?: string }> = [
			{ count: 1, singularTemplate: '* update' },
			{ count: 2, singularTemplate: '* update' },
			{ count: '2', singularTemplate: '* update' },
			{ count: [1, 2, 3], singularTemplate: '* item' },
			{ count: { one: true, two: true }, singularTemplate: '* item' },
			{ count: 1, singularTemplate: '* relationship', pluralTemplate: '* relationships' },
			{ count: 2, singularTemplate: '* relationship', pluralTemplate: '* relationships' },
			{ count: 0, singularTemplate: '* relationship', pluralTemplate: '* relationships' },
		];

		for (const testCase of countCases) {
			expect(plural(testCase.count, testCase.singularTemplate, testCase.pluralTemplate), String(testCase.count)).to.equal(
				legacyUtils.plural(testCase.count as number, testCase.singularTemplate, testCase.pluralTemplate),
			);
		}
	});

	it('matches legacy downcase, keyToPath, and keyToProperty behavior for list and relationship names', function () {
		const values: unknown[] = [
			'faq',
			'FAQs',
			'theFAQs',
			'oneTwo',
			'One_two',
			'one2three',
			'id',
			'SomeId',
			'FieldSample',
			'Status',
			{ toString: () => 'customValue' },
			null,
			undefined,
		];

		for (const value of values) {
			expect(downcase(value), `downcase ${String(value)}`).to.equal(legacyUtils.downcase(value as string));
			expect(keyToPath(value), `keyToPath ${String(value)}`).to.equal(legacyUtils.keyToPath(value as string));
			expect(keyToPath(value, true), `keyToPath plural ${String(value)}`).to.equal(legacyUtils.keyToPath(value as string, true));
			expect(keyToProperty(value), `keyToProperty ${String(value)}`).to.equal(legacyUtils.keyToProperty(value as string));
			expect(keyToProperty(value, true), `keyToProperty plural ${String(value)}`).to.equal(legacyUtils.keyToProperty(value as string, true));
		}
	});
});
