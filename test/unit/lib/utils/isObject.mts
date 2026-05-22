import { expect } from 'chai';
import isObject from '../../../../lib/utils/isObject.mts';

describe('lib/utils/isObject', function () {
	it('matches the legacy keystone-utils object shape', function () {
		class CustomObject {
			readonly value = true;
		}

		expect(isObject({})).to.equal(true);
		expect(isObject(new CustomObject())).to.equal(true);
		expect(isObject(Object.create(null))).to.equal(true);
		expect(isObject([])).to.equal(false);
		expect(isObject(null)).to.equal(false);
		expect(isObject(new Date())).to.equal(false);
		expect(isObject('value')).to.equal(false);
	});
});
