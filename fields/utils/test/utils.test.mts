import { expect } from 'chai';
import addPresenceToQuery from 'keystone/fields/utils/addPresenceToQuery';
import evalDependsOn from 'keystone/fields/utils/evalDependsOn';

export const testUtils = function () {
	describe('addPresenceToQuery', function () {
		it('should add $elemMatch if the presence is some', function () {
			const someFilter = { somepath: 'somefilter' };
			const result = addPresenceToQuery('some', someFilter);
			expect(result).to.eql({ $elemMatch: someFilter });
		});

		it('should add $not if the presence is none', function () {
			const someFilter = { somepath: 'somefilter' };
			const result = addPresenceToQuery('none', someFilter);
			expect(result).to.eql({ $not: someFilter });
		});

		it('should not change anything if no presence is passed', function () {
			const someFilter = { somepath: 'somefilter' };
			const result = addPresenceToQuery('', someFilter);
			expect(result).to.eql(someFilter);
		});

		it('should not change anything if an invalid presence is passed', function () {
			const someFilter = { somepath: 'somefilter' };
			const result = addPresenceToQuery('invalidstuffhere', someFilter);
			expect(result).to.eql(someFilter);
		});
	});

	describe('evalDependsOn', function () {
		it('should return true if dependsOn is not an object', function () {
			expect(evalDependsOn()).to.be.true;
		});

		it('should return true if dependsOn is an empty object', function () {
			expect(evalDependsOn({})).to.be.true;
		});

		it('should return true if the current field depends on another field, and that field has the value we want', function () {
			expect(evalDependsOn({ name: 'Max' }, { name: 'Max' })).to.be.true;
		});

		it('should return false if the current field depends on another field, and that field does not have the value we want', function () {
			expect(evalDependsOn({ name: 'Max' }, { name: 'Jed' })).to.be.false;
		});

		it('should return false if the current field depends on another field, and that field is undefined', function () {
			expect(evalDependsOn({ name: 'Max' }, { notname: 'Max' })).to.be.false;
		});
	});
};
