import { expect } from 'chai';
import EmailType from '../EmailType.mjs';
import TextType from '../../text/TextType.mjs';

export const initList = function (List: import('../../test-helpers.mjs').TestList) {
	List.add({
		email: { type: EmailType },
		nested: {
			email: { type: EmailType },
		},
	});
};

export const createData = function (_List: import('../../test-helpers.mjs').TestList) {

};

export const testFilters = function (_List: import('../../test-helpers.mjs').TestList) {

};

export const testFieldType = function (List: import('../../test-helpers.mjs').TestList) {
	describe('updateItem', function () {
		it('should update top level fields', function (done) {
			const testItem = new List.model();
			List.fields.email!.updateItem(testItem, {
				email: 'sebastian@thinkmill.com.au',
			}, function () {
				expect(testItem.email).to.equal('sebastian@thinkmill.com.au');
				done();
			});
		});

		it('should update nested fields', function (done) {
			const testItem = new List.model();
			List.fields['nested.email']!.updateItem(testItem, {
				nested: {
					email: 'sebastian@thinkmill.com.au',
				},
			}, function () {
				expect((testItem.nested as Record<string, unknown>).email).to.equal('sebastian@thinkmill.com.au');
				done();
			});
		});

		it('should update nested fields with flat paths', function (done) {
			const testItem = new List.model();
			List.fields['nested.email']!.updateItem(testItem, {
				'nested.email': 'sebastian@thinkmill.com.au',
			}, function () {
				expect((testItem.nested as Record<string, unknown>).email).to.equal('sebastian@thinkmill.com.au');
				done();
			});
		});
	});

	describe('validateInput', function () {
		it('should validate a common email', function (done) {
			List.fields.email!.validateInput({ email: 'hello@gmail.com' }, function (result: unknown) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate an email with a longer TLD', function (done) {
			List.fields.email!.validateInput({ email: 'hello@mydomain.solutions' }, function (result: unknown) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate emtpy string input', function (done) {
			List.fields.email!.validateInput({ email: '' }, function (result: unknown) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate undefined input', function (done) {
			List.fields.email!.validateInput({}, function (result: unknown) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate null input', function (done) {
			List.fields.email!.validateInput({ email: null }, function (result: unknown) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should invalidate random string input', function (done) {
			List.fields.email!.validateInput({ email: 'asdf123' }, function (result: unknown) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate emails without a domain', function (done) {
			List.fields.email!.validateInput({ email: 'hello@' }, function (result: unknown) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate emails without an identifier', function (done) {
			List.fields.email!.validateInput({ email: '@gmail.com' }, function (result: unknown) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate emails without a TLD', function (done) {
			List.fields.email!.validateInput({ email: 'hello@gmail' }, function (result: unknown) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate numeric input', function (done) {
			List.fields.email!.validateInput({ email: 1 }, function (result: unknown) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate object input', function (done) {
			List.fields.email!.validateInput({ email: { things: 'stuff' } }, function (result: unknown) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate array input', function (done) {
			List.fields.email!.validateInput({ email: [1, 2, 3] }, function (result: unknown) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate Boolean input', function (done) {
			List.fields.email!.validateInput({ email: true }, function (result: unknown) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate function input', function (done) {
			List.fields.email!.validateInput({ email: function () {} }, function (result: unknown) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate regexp input', function (done) {
			List.fields.email!.validateInput({ email: /foo/ }, function (result: unknown) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate date input', function (done) {
			List.fields.email!.validateInput({ email: Date.now() }, function (result: unknown) {
				expect(result).to.be.false;
				done();
			});
		});
	});

	it('should use the common text required validator', function () {
		expect(List.fields.email!.validateRequiredInput === TextType.prototype.validateRequiredInput).to.be.ok;
	});

	it('should use the common text addFilterToQuery method', function () {
		expect(List.fields.email!.addFilterToQuery === TextType.prototype.addFilterToQuery).to.be.ok;
	});

	describe('gravatarUrl', function () {
		let testItem: import('mongoose').Document & Record<string, unknown>;

		beforeEach(function () {
			testItem = new List.model();
			testItem.email = 'sebastian@thinkmill.com.au';
		});

		it('should return an empty string if no email is specified', function () {
			const testItem2 = new List.model();
			expect((testItem2._ as import('../../test-helpers.mjs').TestVirtuals).email!.gravatarUrl!()).to.equal('');
		});

		it('should return the correct url when an email is specified', function () {
			expect((testItem._ as import('../../test-helpers.mjs').TestVirtuals).email!.gravatarUrl!()).to.equal('//www.gravatar.com/avatar/45eed6685108e64b67f79fb056d95a64?s=80&d=identicon&r=g');
		});

		it('should handle the size option', function () {
			expect((testItem._ as import('../../test-helpers.mjs').TestVirtuals).email!.gravatarUrl!(50)).to.equal('//www.gravatar.com/avatar/45eed6685108e64b67f79fb056d95a64?s=50&d=identicon&r=g');
		});

		it('should handle the defaultImg option', function () {
			expect((testItem._ as import('../../test-helpers.mjs').TestVirtuals).email!.gravatarUrl!(null, 'https://avatars1.githubusercontent.com/u/853712')).to.equal('//www.gravatar.com/avatar/45eed6685108e64b67f79fb056d95a64?s=80&d=https%3A%2F%2Favatars1.githubusercontent.com%2Fu%2F853712&r=g');
		});

		it('should handle the rating option', function () {
			expect((testItem._ as import('../../test-helpers.mjs').TestVirtuals).email!.gravatarUrl!(null, null, 'pg')).to.equal('//www.gravatar.com/avatar/45eed6685108e64b67f79fb056d95a64?s=80&d=identicon&r=pg');
		});
	});

	/* Deprecated inputIsValid method tests */

	it('should properly validate invalid emails', function () {
		expect(List.fields.email!.inputIsValid({ email: false }, true)).to.be.false;
		expect(List.fields.email!.inputIsValid({ email: null }, true)).to.be.false;
		expect(List.fields.email!.inputIsValid({ email: undefined }, true)).to.be.false;
		expect(List.fields.email!.inputIsValid({ email: '' }, true)).to.be.false;
		expect(List.fields.email!.inputIsValid({ email: 'false' }, true)).to.be.false;
		expect(List.fields.email!.inputIsValid({ email: true }, true)).to.be.false;
		expect(List.fields.email!.inputIsValid({ email: 'true' }, true)).to.be.false;
	});

	it('should properly validate valid emails', function () {
		expect(List.fields.email!.inputIsValid({ email: 'example@example.com' })).to.be.true;
	});
};
