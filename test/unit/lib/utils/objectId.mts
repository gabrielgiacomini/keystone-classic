import { expect } from 'chai';
import legacyUtils from 'keystone-utils';
import { isValidObjectId } from '../../../../lib/utils/objectId.mts';

describe('lib/utils/objectId', function () {
	it('matches legacy ObjectId validation for representative string values', function () {
		const values = [
			'507f1f77bcf86cd799439011',
			'000000000000000000000000',
			'123456789012',
			'507f1f77bcf86cd79943901z',
			'abcdefghijkl',
			'short',
			'',
		];

		for (const value of values) {
			expect(isValidObjectId(value), value).to.equal(legacyUtils.isValidObjectId(value));
		}
	});
});
