import { expect } from 'chai';
import legacyUtils from 'keystone-utils';
import { defer } from '../../../../lib/utils/async.mts';
import { isEmail } from '../../../../lib/utils/email.mts';
import { escapeRegExp } from '../../../../lib/utils/regexp.mts';

const legacyEscapeRegExp = legacyUtils.escapeRegExp as (value: unknown) => string;

describe('typed Keystone utility replacements', function () {
	it('matches legacy email validation behavior for representative values', function () {
		const values = [
			'admin@example.com',
			'hello@mydomain.solutions',
			'UPPER.CASE+tag@example.co.uk',
			'not-an-email',
			'hello@',
			'@example.com',
			'hello@example',
			'hello@example..com',
		];

		for (const value of values) {
			expect(isEmail(value), value).to.equal(legacyUtils.isEmail(value));
		}
	});

	it('matches legacy regular expression escaping behavior', function () {
		const values: unknown[] = [
			'a-b/c[d]{e}(f)*g+h?i.j\\k^l$m|n',
			'plain text',
			'',
			0,
			null,
			{ toString: () => 'object.value' },
		];

		for (const value of values) {
			expect(escapeRegExp(value), String(value)).to.equal(legacyEscapeRegExp(value));
		}
	});

	it('defers callbacks to the next tick and forwards arguments', function (done) {
		let callbackWasSynchronous = true;

		defer(function deferred(value: string, count: number) {
			expect(callbackWasSynchronous).to.equal(false);
			expect(value).to.equal('ready');
			expect(count).to.equal(2);
			done();
		}, 'ready', 2);

		callbackWasSynchronous = false;
	});
});
