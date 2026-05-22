/* eslint-disable sonarjs/no-hardcoded-passwords */
import { expect } from 'chai';
import PasswordType from '../PasswordType.mjs';

/** Minimal document shape produced by `new List.model(...)` in these tests. */
interface PasswordTestItem {
	password: string | null | undefined;
	get(path: string): unknown;
	set(path: string, value: unknown): void;
}

/** Minimal interface for a single Password field instance. */
interface PasswordField {
	updateItem(item: PasswordTestItem, data: Record<string, unknown>, callback: () => void): void;
	validateInput(data: Record<string, unknown>, callback: (result: boolean, detail: string) => void): void;
	validateRequiredInput(item: PasswordTestItem, data: Record<string, unknown>, callback: (result: boolean) => void): void;
	addFilterToQuery(filter: Record<string, unknown>): Record<string, unknown>;
}

/** Named fields registered on the List by initList. */
interface PasswordTestFields {
	password: PasswordField;
	minChar: PasswordField;
	maxFalse: PasswordField;
	digitChar: PasswordField;
	spChar: PasswordField;
	asciiChar: PasswordField;
	lowChar: PasswordField;
	upperChar: PasswordField;
}

/** Minimal shape of the Keystone List passed to initList / testFieldType. */
interface PasswordTestList {
	add(fields: Record<string, unknown>): void;
	model: new (data?: Record<string, unknown>) => PasswordTestItem;
	fields: PasswordTestFields;
}

export const initList = function (List: PasswordTestList) {
	List.add({
		password: PasswordType,
		minChar: {
			type: PasswordType,
			min: 6,
		},

		maxFalse: {
			type: PasswordType,
			max: false,
		},

		digitChar: {
			type: PasswordType,
			rejectCommon: false,
			complexity: {
				digitChar: true,
			},
		},

		spChar: {
			type: PasswordType,
			rejectCommon: false,
			complexity: {
				spChar: true,
			},
		},

		asciiChar: {
			type: PasswordType,
			rejectCommon: false,
			complexity: {
				asciiChar: true,
			},
		},

		lowChar: {
			type: PasswordType,
			rejectCommon: false,
			complexity: {
				lowChar: true,
			},
		},

		upperChar: {
			type: PasswordType,
			rejectCommon: false,
			complexity: {
				upperChar: true,
			},
		},
	});
};

export const testFieldType = function (List: PasswordTestList) {
	describe('updateItem', function () {
		it('should update password if specified', function (done) {
			const testItem = new List.model();
			List.fields.password!.updateItem(testItem, {
				password: 'asdf',
			}, function () {
				expect(testItem.password).to.equal('asdf');
				done();
			});
		});

		it('should update password with hash if specified', function (done) {
			const testItem = new List.model();
			List.fields.password!.updateItem(testItem, {
				password_hash: '12asdf34',
			}, function () {
				expect(testItem.password).to.equal('12asdf34');
				done();
			});
		});

		it('should update password if both password and hash specified', function (done) {
			const testItem = new List.model();
			List.fields.password!.updateItem(testItem, {
				password: 'asdf',
				password_hash: '12asdf34',
			}, function () {
				expect(testItem.password).to.equal('asdf');
				done();
			});
		});

		it('should clear password if passed password is null', function (done) {
			const testItem = new List.model({
				password: 'asdf',
			});
			List.fields.password!.updateItem(testItem, {
				password: null,
			}, function () {
				expect(testItem.password).to.be.null;
				done();
			});
		});

		it('should clear password if passed hash is null', function (done) {
			const testItem = new List.model({
				password: 'asdf',
			});
			List.fields.password!.updateItem(testItem, {
				password_hash: null,
			}, function () {
				expect(testItem.password).to.be.null;
				done();
			});
		});

		it('should clear password if passed password is empty string', function (done) {
			const testItem = new List.model({
				password: 'asdf',
			});
			List.fields.password!.updateItem(testItem, {
				password: '',
			}, function () {
				expect(testItem.password).to.equal('');
				done();
			});
		});

		it('should clear password if passed hash is empty string', function (done) {
			const testItem = new List.model({
				password: 'asdf',
			});
			List.fields.password!.updateItem(testItem, {
				password_hash: '',
			}, function () {
				expect(testItem.password).to.equal('');
				done();
			});
		});

		it('should not update if neither password nor hash specified', function (done) {
			const testItem = new List.model();
			List.fields.password!.updateItem(testItem, {}, function () {
				expect(testItem.password).to.be.undefined;
				done();
			});
		});
	});

	describe('validateInput', function () {
		it('should validate a matching password and confirm value', function (done) {
			List.fields.password!.validateInput({
				password: 'vasjdhb273r8ywbfeuygr2834ryfhwubsudfih',
				password_confirm: 'vasjdhb273r8ywbfeuygr2834ryfhwubsudfih',
			}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should invalidate empty string input', function (done) {
			List.fields.password!.validateInput({
				password: '',
				password_confirm: '',
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should validate undefined input', function (done) {
			List.fields.password!.validateInput({}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate null input', function (done) {
			List.fields.password!.validateInput({
				password: null,
				password_confirm: null,
			}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should invalidate undefined confirmation value', function (done) {
			List.fields.password!.validateInput({
				password: 'something',
				password_confirm: undefined,
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should validate empty string confirmation value', function (done) {
			List.fields.password!.validateInput({
				password: 'something',
				password_confirm: '',
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should validate null confirmation value', function (done) {
			List.fields.password!.validateInput({
				password: 'something',
				password_confirm: null,
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should validate password longer than 72 characters when max is set to false', function (done) {
			List.fields.maxFalse!.validateInput({
				password: 'CheckOutThisRidiculouslyLongPasswordLoremipsumdolorsitametconsecteturadipiscingelitPraesentetnibhpretiumvestibulumdoloratsuscipitmiClassaptenttacitisociosquadlitoratorquentperconubianostraperinceptoshimenaeosIntegerquisduinonnuncegestaspretiumeuetanteInplaceratacmisitametsollicitudin',
			}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate password with at least one digit when digits are required', function (done) {
			List.fields.digitChar!.validateInput({
				digitChar: 'digits123',
			}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate password with at least one special char when spchars are required', function (done) {
			List.fields.spChar!.validateInput({
				spChar: 'specialchars!&',
			}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate password with ASCII chars only when ASCII only is required', function (done) {
			List.fields.asciiChar!.validateInput({
				asciiChar: 'asciionly',
			}, function (result: boolean, _detail: string) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate password with at least one lowercase char when lowercase is required', function (done) {
			List.fields.lowChar!.validateInput({
				lowChar: 'lowercase123',
			}, function (result: boolean, _detail: string) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate password with at least one uppercase char when uppercase is required', function (done) {
			List.fields.upperChar!.validateInput({
				upperChar: 'UpperCase',
			}, function (result: boolean, _detail: string) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should invalidate mismatching values', function (done) {
			List.fields.password!.validateInput({
				password: 'something',
				password_confirm: 'notsomething',
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate empty string password value', function (done) {
			List.fields.password!.validateInput({
				password: '',
				password_confirm: 'something',
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate null password value', function (done) {
			List.fields.password!.validateInput({
				password: null,
				password_confirm: 'something',
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate undefined password value', function (done) {
			List.fields.password!.validateInput({
				password: undefined,
				password_confirm: 'something',
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate true password value', function (done) {
			List.fields.password!.validateInput({
				password: true,
				password_confirm: 'something',
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate false password value', function (done) {
			List.fields.password!.validateInput({
				password: false,
				password_confirm: 'something',
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate password shorter than min characters', function (done) {
			List.fields.minChar!.validateInput({
				minChar: '1234',
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate password longer than 72 characters', function (done) {
			List.fields.password!.validateInput({
				password: 'CheckOutThisRidiculouslyLongPasswordLoremipsumdolorsitametconsecteturadipiscingelitPraesentetnibhpretiumvestibulumdoloratsuscipitmiClassaptenttacitisociosquadlitoratorquentperconubianostraperinceptoshimenaeosIntegerquisduinonnuncegestaspretiumeuetanteInplaceratacmisitametsollicitudin',
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate password with no digits when digits are required', function (done) {
			List.fields.digitChar!.validateInput({
				digitChar: 'nodigits',
			}, function (result: boolean, detail: string) {
				expect(result).to.be.false;
				expect(detail).to.equal('enter at least one digit');
				done();
			});
		});

		it('should invalidate password with no special characters when spchars are required', function (done) {
			List.fields.spChar!.validateInput({
				spChar: 'nospecialchars',
			}, function (result: boolean, detail: string) {
				expect(result).to.be.false;
				expect(detail).to.equal('enter at least one special character');
				done();
			});
		});

		it('should invalidate password with non-ASCII chars when ASCII is required', function (done) {
			List.fields.asciiChar!.validateInput({
				asciiChar: 'םגפשבך',
			}, function (result: boolean, detail: string) {
				expect(result).to.be.false;
				expect(detail).to.equal('Password must be longer than 8 characters. \nonly ASCII characters are allowed');
				done();
			});
		});

		it('should invalidate password with no lowercase chars when lowercase is required', function (done) {
			List.fields.lowChar!.validateInput({
				lowChar: 'NOLOWERCASE',
			}, function (result: boolean, detail: string) {
				expect(result).to.be.false;
				expect(detail).to.equal('use at least one lower case character');
				done();
			});
		});

		it('should invalidate password with no uppercase chars when uppercase is required', function (done) {
			List.fields.upperChar!.validateInput({
				upperChar: 'nouppercase',
			}, function (result: boolean, detail: string) {
				expect(result).to.be.false;
				expect(detail).to.equal('use at least one upper case character');
				done();
			});
		});

	});

	describe('validateRequiredInput', function () {
		it('should validate a hash value', function (done) {
			const testItem = new List.model();
			List.fields.password!.validateRequiredInput(testItem, {
				password_hash: '12asdf34',
			}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate a password value', function (done) {
			const testItem = new List.model();
			List.fields.password!.validateRequiredInput(testItem, {
				password: 'asdf',
			}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate a password and hash value', function (done) {
			const testItem = new List.model();
			List.fields.password!.validateRequiredInput(testItem, {
				password: 'asdf',
				password_hash: '12asdf34',
			}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate undefined password and hash values if a value exists already', function (done) {
			const testItem = new List.model({
				password: 'asdf',
			});
			List.fields.password!.validateRequiredInput(testItem, {}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should invalidate undefined password and hash values', function (done) {
			const testItem = new List.model();
			List.fields.password!.validateRequiredInput(testItem, {}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate an empty password value', function (done) {
			const testItem = new List.model();
			List.fields.password!.validateRequiredInput(testItem, {
				password: '',
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate an empty hash value', function (done) {
			const testItem = new List.model();
			List.fields.password!.validateRequiredInput(testItem, {
				password_hash: '',
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate an empty hash and password value', function (done) {
			const testItem = new List.model();
			List.fields.password!.validateRequiredInput(testItem, {
				password: '',
				password_hash: '',
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate an empty hash and password value even if a value exists', function (done) {
			const testItem = new List.model({
				password: 'blabla',
			});
			List.fields.password!.validateRequiredInput(testItem, {
				password: '',
				password_hash: '',
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate null password value even if a value exists', function (done) {
			const testItem = new List.model({
				password: 'asdf',
			});
			List.fields.password!.validateRequiredInput(testItem, {
				password: null,
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate null hash value even if a value exists', function (done) {
			const testItem = new List.model({
				password: 'asdf',
			});
			List.fields.password!.validateRequiredInput(testItem, {
				password_hash: null,
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate null password and hash value even if a value exists', function (done) {
			const testItem = new List.model({
				password: 'asdf',
			});
			List.fields.password!.validateRequiredInput(testItem, {
				password: null,
				password_hash: null,
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});
	});

	describe('addFilterToQuery', function () {
		it('should filter for existing values', function () {
			const result = List.fields.password!.addFilterToQuery({
				exists: true,
			});
			expect(result.password).to.eql({
				$ne: null,
			});
		});

		it('should filter for non-existing values', function () {
			const result = List.fields.password!.addFilterToQuery({
				exists: false,
			});
			expect(result.password).to.be.null;
		});
	});

	describe('invalid complexity options', function () {
		it('should throw an error when non-existing complexity options are passed', function (done) {
			try {
				List.add({
					doesntExist: {
						type: PasswordType,
						complexity: {
							doesntExist: true,
						},
					},
				});
			} catch (err: unknown) {
				expect((err as Error).message).to.eql('FieldType.Password: options.complexity - option does not exist.');
				done();
			}
		});
		it('should throw an error when a non-boolean value is passed for complexity options', function (done) {
			try {
				List.add({
					doesntExist: {
						type: PasswordType,
						complexity: {
							spChar: 'squirrel',
						},
					},
				});
			} catch (err: unknown) {
				expect((err as Error).message).to.eql('FieldType.Password: options.complexity - Value must be boolean.');
				done();
			}
		});
	});

	describe('max less than min', function () {
		it('should throw an error when max value is set lower than min', function (done) {
			try {
				List.add({
					minmax: {
						type: PasswordType,
						min: 20,
						max: 12,
					},
				});
			} catch (err: unknown) {
				expect((err as Error).message).to.eql('FieldType.Password: options - maximum password length cannot be less than the minimum length.');
				done();
			}
		});
	});
};
