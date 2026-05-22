import { expect } from 'chai';
import 'keystone';
import Email from 'keystone/lib/email';

describe('Email', function () {
	it('should require options to be passed in', function () {
		expect(Email).to.throw(/requires a templateName or options argument/);
	});
});
