import { expect } from 'chai';
import keystone from 'keystone';
import keystoneUtils from 'keystone/lib/utils/keystoneUtils';
import legacyUtils from 'keystone-utils';

type UtilityMap = Record<string, unknown>;

const legacy = legacyUtils as UtilityMap;
const local = keystoneUtils as unknown as UtilityMap;

function callUtils(source: UtilityMap, name: string, ...args: unknown[]): unknown {
	const fn = source[name];
	if (typeof fn !== 'function') {
		throw new Error(name + ' is not callable');
	}
	return (fn as (...fnArgs: unknown[]) => unknown)(...args);
}

describe('lib/utils/keystoneUtils', function () {
	it('exposes the legacy keystone-utils public key surface', function () {
		const sortByLocale = (left: string, right: string) => left.localeCompare(right);
		expect(Object.keys(local).sort(sortByLocale)).to.deep.equal(Object.keys(legacy).sort(sortByLocale));
	});

	it('is exposed as the root keystone.utils compatibility object', function () {
		expect(keystone.utils).to.equal(keystoneUtils);
		expect(keystone.utils.keyToLabel('fieldName')).to.equal('Field Name');
	});

	it('matches deterministic legacy utility behavior for representative values', function () {
		const cases: Array<[string, unknown[]]> = [
			['isFunction', [function noop() {}]],
			['isObject', [{ value: true }]],
			['isObject', [[]]],
			['isArray', [[]]],
			['isDate', [new Date('2026-05-21T00:00:00.000Z')]],
			['isString', ['value']],
			['isNumber', [42]],
			['isEmail', ['editor@example.com']],
			['isDataURL', ['data:image/png;base64,abc=']],
			['isValidObjectId', ['507f1f77bcf86cd799439011']],
			['number', ['$1,432.50']],
			['escapeRegExp', ['a+b[c]']],
			['escapeString', ['a\'b"c\\d']],
			['stripDiacritics', ['\u00C0\u00E9']],
			['transliterate', ['\u041F\u0440\u0438\u0432\u0435\u0442']],
			['slug', ['One_two']],
			['singular', ['People']],
			['plural', [2, '* item', '* items']],
			['upcase', ['field']],
			['downcase', ['Field']],
			['titlecase', ['fieldName']],
			['camelcase', ['field name', true]],
			['decodeHTMLEntities', ['Tom &amp; Jerry']],
			['encodeHTMLEntities', ['Tom & Jerry']],
			['textToHTML', ['Tom & Jerry\nNext']],
			['htmlToText', ['<p>Tom&nbsp;&amp;&nbsp;Jerry</p>']],
			['cropString', ['hello world', 5, '...']],
			['cropHTMLString', ['<p>hello world</p>', 5, '...']],
			['keyToLabel', ['fieldName']],
			['keyToPath', ['FieldName', true]],
			['keyToProperty', ['FieldName', true]],
			['calculateDistance', [[0, 0], [1, 1]]],
			['kmBetween', [[0, 0], [1, 1]]],
			['milesBetween', [[0, 0], [1, 1]]],
			['stringify', [{ value: 'line\nnext' }]],
			['htmlStringify', [{ value: 'demo' }]],
		];

		for (const [name, args] of cases) {
			expect(callUtils(local, name, ...args), name).to.deep.equal(callUtils(legacy, name, ...args));
		}
	});

	it('matches mutable options and optionsMap behavior', function () {
		const localDefaults = { enabled: false };
		const legacyDefaults = { enabled: false };

		expect(keystoneUtils.options(localDefaults, { enabled: true, label: 'Demo' })).to.equal(localDefaults);
		expect(callUtils(legacy, 'options', legacyDefaults, { enabled: true, label: 'Demo' })).to.equal(legacyDefaults);
		expect(localDefaults).to.deep.equal(legacyDefaults);
		expect(keystoneUtils.optionsMap([{ value: 'draft', label: 'Draft' }], true)).to.deep.equal(
			callUtils(legacy, 'optionsMap', [{ value: 'draft', label: 'Draft' }], true),
		);
	});

	it('preserves randomString shape without requiring deterministic output', function () {
		const generated = keystoneUtils.randomString(8, 'ab');

		expect(generated).to.have.length(8);
		expect(generated).to.match(/^[ab]+$/);
		expect(keystoneUtils.randomString.default).to.equal((legacy['randomString'] as { default: string }).default);
		expect(keystoneUtils.randomString.safe).to.equal((legacy['randomString'] as { safe: string }).safe);
	});
});
