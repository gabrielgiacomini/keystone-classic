import { expect } from 'chai';

import {
	camelcase,
	downcase,
	plural,
	titlecase,
	upcase,
} from '../string.mjs';

describe('legacy admin string utils', function () {
	it('formats counted plural templates without lodash size', function () {
		expect(plural([1, 2], '* Item', '* Items')).to.equal('2 Items');
		expect(plural({ a: true }, '* Item', '* Items')).to.equal('1 Item');
		expect(plural('2', '* Item', '* Items')).to.equal('2 Items');
	});

	it('titlecases and removes empty word parts without lodash compact', function () {
		expect(titlecase('field_name--value')).to.equal('Field Name Value');
		expect(titlecase('HTML value')).to.equal('HTML Value');
	});

	it('camelcases labels without lodash camelCase and upperFirst', function () {
		expect(camelcase('field name')).to.equal('FieldName');
		expect(camelcase('field-name', true)).to.equal('fieldName');
		expect(camelcase('API response code')).to.equal('ApiResponseCode');
	});

	it('keeps upcase and downcase legacy coercion behavior', function () {
		expect(upcase('field')).to.equal('Field');
		expect(downcase('Field')).to.equal('field');
		expect(upcase(null)).to.equal('');
		expect(downcase(undefined)).to.equal('');
	});
});
