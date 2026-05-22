import { expect } from 'chai';
import legacyUtils from 'keystone-utils';
import { number } from '../../../../lib/utils/number.mts';

describe('lib/utils/number', function () {
	it('matches legacy number parsing behavior for representative values', function () {
		const values: unknown[] = [
			'1,432',
			'$1,432.50',
			'-10.25',
			'abc',
			'',
			0,
			12.3,
			null,
			undefined,
			'1e3',
			'1-2',
		];

		for (const value of values) {
			const actual = number(value);
			const expected = legacyUtils.number(value as string | number);
			if (Number.isNaN(expected)) {
				expect(actual, String(value)).to.satisfy(Number.isNaN);
			} else {
				expect(actual, String(value)).to.equal(expected);
			}
		}
	});
});
