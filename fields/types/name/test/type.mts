import { expect } from 'chai';
import NameType from '../NameType.mjs';

/** Shape of a Keystone document item used in name-field tests. */
interface NameItem {
	name: {
		first: string;
		last: string;
		full: string;
	};
}

/**
 * Return type of `addFilterToQuery`. Supports both the `$or`-array form used
 * for non-inverted matches and the flat-key form used for inverted matches.
 */
interface NameFilterQuery {
	$or?: Record<string, RegExp>[];
	[key: string]: RegExp | { $not: RegExp } | { $in: (string | null)[] } | { $nin: (string | null)[] } | Record<string, RegExp>[] | undefined;
}

/** The name field exposed via `List.fields.name!`. */
interface NameField {
	updateItem(item: NameItem, data: Record<string, unknown>, callback: () => void): void;
	validateInput(data: Record<string, unknown>, callback: (result: boolean) => void): void;
	validateRequiredInput(item: NameItem, data: Record<string, unknown>, callback: (result: boolean) => void): void;
	addFilterToQuery(filter: Record<string, unknown>): NameFilterQuery;
}

/** Minimal Keystone List shape required by the name-field test suite. */
interface NameList {
	add(schema: Record<string, unknown>): void;
	model: new (data?: Record<string, unknown>) => NameItem;
	fields: {
		name: NameField;
	};
}

export const initList = function (List: NameList) {
	List.add({
		name: NameType,
	});
};

export const testFieldType = function (List: NameList) {
	describe('updateItem', function () {
		it('should update the full name', function (done) {
			const testItem = new List.model();
			List.fields.name!.updateItem(testItem, {
				name: 'Max Mustermann',
			}, function () {
				expect(testItem.name.full).to.equal('Max Mustermann');
				done();
			});
		});

		it('should update the first name', function (done) {
			const testItem = new List.model();
			List.fields.name!.updateItem(testItem, {
				name: {
					first: 'Max',
				},
			}, function () {
				expect(testItem.name.first).to.equal('Max');
				done();
			});
		});

		it('should update the last name', function (done) {
			const testItem = new List.model();
			List.fields.name!.updateItem(testItem, {
				name: {
					last: 'Max',
				},
			}, function () {
				expect(testItem.name.last).to.equal('Max');
				done();
			});
		});
	});

	describe('validateInput', function () {
		it('should validate string input', function (done) {
			List.fields.name!.validateInput({
				name: 'Max',
			}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate empty string input', function (done) {
			List.fields.name!.validateInput({
				name: '',
			}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate undefined input', function (done) {
			List.fields.name!.validateInput({}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate null input', function (done) {
			List.fields.name!.validateInput({
				name: null,
			}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should invalidate numeric input', function (done) {
			List.fields.name!.validateInput({
				name: 1,
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate object input', function (done) {
			List.fields.name!.validateInput({
				name: { things: 'stuff' },
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate array input', function (done) {
			List.fields.name!.validateInput({
				name: [1, 2, 3],
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate Boolean input', function (done) {
			List.fields.name!.validateInput({
				name: true,
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate function input', function (done) {
			List.fields.name!.validateInput({
				name: function () {},
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate regexp input', function (done) {
			List.fields.name!.validateInput({
				name: /foo/,
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate date input', function (done) {
			List.fields.name!.validateInput({
				name: new Date(),
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		describe('first name', function () {
			it('should validate string input', function (done) {
				List.fields.name!.validateInput({
					name_first: 'Max',
				}, function (result: boolean) {
					expect(result).to.be.true;
					done();
				});
			});

			it('should validate dot notation', function (done) {
				List.fields.name!.validateInput({
					'name.first': 'Max',
				}, function (result: boolean) {
					expect(result).to.be.true;
					done();
				});
			});

			it('should validate nested object', function (done) {
				List.fields.name!.validateInput({
					name: {
						first: 'Max',
					},
				}, function (result: boolean) {
					expect(result).to.be.true;
					done();
				});
			});

			it('should validate empty string input', function (done) {
				List.fields.name!.validateInput({
					name_first: '',
				}, function (result: boolean) {
					expect(result).to.be.true;
					done();
				});
			});

			it('should validate undefined input', function (done) {
				List.fields.name!.validateInput({}, function (result: boolean) {
					expect(result).to.be.true;
					done();
				});
			});

			it('should validate null input', function (done) {
				List.fields.name!.validateInput({
					name_first: null,
				}, function (result: boolean) {
					expect(result).to.be.true;
					done();
				});
			});

			it('should invalidate numeric input', function (done) {
				List.fields.name!.validateInput({
					name_first: 1,
				}, function (result: boolean) {
					expect(result).to.be.false;
					done();
				});
			});

			it('should invalidate object input', function (done) {
				List.fields.name!.validateInput({
					name_first: { things: 'stuff' },
				}, function (result: boolean) {
					expect(result).to.be.false;
					done();
				});
			});

			it('should invalidate array input', function (done) {
				List.fields.name!.validateInput({
					name_first: [1, 2, 3],
				}, function (result: boolean) {
					expect(result).to.be.false;
					done();
				});
			});

			it('should invalidate Boolean input', function (done) {
				List.fields.name!.validateInput({
					name_first: true,
				}, function (result: boolean) {
					expect(result).to.be.false;
					done();
				});
			});

			it('should invalidate function input', function (done) {
				List.fields.name!.validateInput({
					name_first: function () {},
				}, function (result: boolean) {
					expect(result).to.be.false;
					done();
				});
			});

			it('should invalidate regexp input', function (done) {
				List.fields.name!.validateInput({
					name_first: /foo/,
				}, function (result: boolean) {
					expect(result).to.be.false;
					done();
				});
			});

			it('should invalidate date input', function (done) {
				List.fields.name!.validateInput({
					name_first: Date.now(),
				}, function (result: boolean) {
					expect(result).to.be.false;
					done();
				});
			});
		});

		describe('last name', function () {
			it('should validate string input', function (done) {
				List.fields.name!.validateInput({
					name_last: 'Max',
				}, function (result: boolean) {
					expect(result).to.be.true;
					done();
				});
			});

			it('should validate dot notation', function (done) {
				List.fields.name!.validateInput({
					'name.last': 'Max',
				}, function (result: boolean) {
					expect(result).to.be.true;
					done();
				});
			});

			it('should validate nested object', function (done) {
				List.fields.name!.validateInput({
					name: {
						last: 'Max',
					},
				}, function (result: boolean) {
					expect(result).to.be.true;
					done();
				});
			});

			it('should validate empty string input', function (done) {
				List.fields.name!.validateInput({
					name_last: '',
				}, function (result: boolean) {
					expect(result).to.be.true;
					done();
				});
			});

			it('should validate undefined input', function (done) {
				List.fields.name!.validateInput({}, function (result: boolean) {
					expect(result).to.be.true;
					done();
				});
			});

			it('should validate null input', function (done) {
				List.fields.name!.validateInput({
					name_last: null,
				}, function (result: boolean) {
					expect(result).to.be.true;
					done();
				});
			});

			it('should invalidate numeric input', function (done) {
				List.fields.name!.validateInput({
					name_last: 1,
				}, function (result: boolean) {
					expect(result).to.be.false;
					done();
				});
			});

			it('should invalidate object input', function (done) {
				List.fields.name!.validateInput({
					name_last: { things: 'stuff' },
				}, function (result: boolean) {
					expect(result).to.be.false;
					done();
				});
			});

			it('should invalidate array input', function (done) {
				List.fields.name!.validateInput({
					name_last: [1, 2, 3],
				}, function (result: boolean) {
					expect(result).to.be.false;
					done();
				});
			});

			it('should invalidate Boolean input', function (done) {
				List.fields.name!.validateInput({
					name_last: true,
				}, function (result: boolean) {
					expect(result).to.be.false;
					done();
				});
			});

			it('should invalidate function input', function (done) {
				List.fields.name!.validateInput({
					name_last: function () {},
				}, function (result: boolean) {
					expect(result).to.be.false;
					done();
				});
			});

			it('should invalidate regexp input', function (done) {
				List.fields.name!.validateInput({
					name_last: /foo/,
				}, function (result: boolean) {
					expect(result).to.be.false;
					done();
				});
			});

			it('should invalidate date input', function (done) {
				List.fields.name!.validateInput({
					name_last: new Date(),
				}, function (result: boolean) {
					expect(result).to.be.false;
					done();
				});
			});
		});
	});

	describe('validateRequiredInput', function () {
		it('should validate input present', function (done) {
			const testItem = new List.model();
			List.fields.name!.validateRequiredInput(testItem, {
				name: 'Max',
			}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should invalidate undefined', function (done) {
			const testItem = new List.model();
			List.fields.name!.validateRequiredInput(testItem, {
				name: undefined,
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should validate undefined if a previous value exists', function (done) {
			const testItem = new List.model({
				'name.first': 'Max',
			});
			List.fields.name!.validateRequiredInput(testItem, {
				name: undefined,
			}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should invalidate empty string', function (done) {
			const testItem = new List.model();
			List.fields.name!.validateRequiredInput(testItem, {
				name: '',
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate null', function (done) {
			const testItem = new List.model();
			List.fields.name!.validateRequiredInput(testItem, {
				name: null,
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		describe('first name', function () {
			it('should validate input present', function (done) {
				const testItem = new List.model();
				List.fields.name!.validateRequiredInput(testItem, {
					name_first: 'Max',
				}, function (result: boolean) {
					expect(result).to.be.true;
					done();
				});
			});

			it('should invalidate undefined', function (done) {
				const testItem = new List.model();
				List.fields.name!.validateRequiredInput(testItem, {
					name_first: undefined,
				}, function (result: boolean) {
					expect(result).to.be.false;
					done();
				});
			});

			it('should validate undefined if a previous value exists', function (done) {
				const testItem = new List.model({
					'name.first': 'Max',
				});
				List.fields.name!.validateRequiredInput(testItem, {
					name_first: undefined,
				}, function (result: boolean) {
					expect(result).to.be.true;
					done();
				});
			});

			it('should invalidate empty string', function (done) {
				const testItem = new List.model();
				List.fields.name!.validateRequiredInput(testItem, {
					name_first: '',
				}, function (result: boolean) {
					expect(result).to.be.false;
					done();
				});
			});

			it('should invalidate null', function (done) {
				const testItem = new List.model();
				List.fields.name!.validateRequiredInput(testItem, {
					name_first: null,
				}, function (result: boolean) {
					expect(result).to.be.false;
					done();
				});
			});
		});

		describe('last name', function () {
			it('should validate input present', function (done) {
				const testItem = new List.model();
				List.fields.name!.validateRequiredInput(testItem, {
					name_last: 'Max',
				}, function (result: boolean) {
					expect(result).to.be.true;
					done();
				});
			});

			it('should invalidate undefined', function (done) {
				const testItem = new List.model();
				List.fields.name!.validateRequiredInput(testItem, {
					name_last: undefined,
				}, function (result: boolean) {
					expect(result).to.be.false;
					done();
				});
			});

			it('should validate undefined if a previous value exists', function (done) {
				const testItem = new List.model({
					'name.last': 'Max',
				});
				List.fields.name!.validateRequiredInput(testItem, {
					name_last: undefined,
				}, function (result: boolean) {
					expect(result).to.be.true;
					done();
				});
			});

			it('should invalidate empty string', function (done) {
				const testItem = new List.model();
				List.fields.name!.validateRequiredInput(testItem, {
					name_last: '',
				}, function (result: boolean) {
					expect(result).to.be.false;
					done();
				});
			});

			it('should invalidate null', function (done) {
				const testItem = new List.model();
				List.fields.name!.validateRequiredInput(testItem, {
					name_last: null,
				}, function (result: boolean) {
					expect(result).to.be.false;
					done();
				});
			});
		});
	});

	describe('addFilterToQuery', function () {
		it('should return a regex with the "i" flag set', function () {
			const result = List.fields.name!.addFilterToQuery({
				value: 'abc',
			});

			const $or = result.$or;
			expect($or).to.be.an('array').with.lengthOf(2);
			if ($or === undefined) {
				return expect.fail('expected result.$or');
			}
			if ($or[0] === undefined || $or[1] === undefined) {
				return expect.fail('expected result.$or with two regex branches');
			}
			expect($or[0]).to.eql({
				'name.first': /abc/i,
			});
			expect($or[1]).to.eql({
				'name.last': /abc/i,
			});
		});

		it('should allow case sensitive matching', function () {
			const result = List.fields.name!.addFilterToQuery({
				value: 'abc',
				caseSensitive: true,
			});

			const $or = result.$or;
			expect($or).to.be.an('array').with.lengthOf(2);
			if ($or === undefined) {
				return expect.fail('expected result.$or');
			}
			if ($or[0] === undefined || $or[1] === undefined) {
				return expect.fail('expected result.$or with two regex branches');
			}
			expect($or[0]).to.eql({
				'name.first': /abc/,
			});
			expect($or[1]).to.eql({
				'name.last': /abc/,
			});
		});

		it('should allow inverted matching', function () {
			const result = List.fields.name!.addFilterToQuery({
				value: 'abc',
				inverted: true,
			});
			expect(result['name.first']).to.eql({
				$not: /abc/i,
			});
			expect(result['name.last']).to.eql({
				$not: /abc/i,
			});
		});

		it('should allow exact matching', function () {
			const result = List.fields.name!.addFilterToQuery({
				value: 'abc',
				mode: 'exactly',
			});
			const $or = result.$or;
			expect($or).to.be.an('array').with.lengthOf(2);
			if ($or === undefined) {
				return expect.fail('expected result.$or');
			}
			if ($or[0] === undefined || $or[1] === undefined) {
				return expect.fail('expected result.$or with two regex branches');
			}
			expect($or[0]).to.eql({
				'name.first': /^abc$/i,
			});
			expect($or[1]).to.eql({
				'name.last': /^abc$/i,
			});
		});

		it('should allow matching the end', function () {
			const result = List.fields.name!.addFilterToQuery({
				value: 'abc',
				mode: 'endsWith',
			});
			const $or = result.$or;
			expect($or).to.be.an('array').with.lengthOf(2);
			if ($or === undefined) {
				return expect.fail('expected result.$or');
			}
			if ($or[0] === undefined || $or[1] === undefined) {
				return expect.fail('expected result.$or with two regex branches');
			}
			expect($or[0]).to.eql({
				'name.first': /abc$/i,
			});
			expect($or[1]).to.eql({
				'name.last': /abc$/i,
			});
		});

		it('should allow matching the start', function () {
			const result = List.fields.name!.addFilterToQuery({
				value: 'abc',
				mode: 'beginsWith',
			});
			const $or = result.$or;
			expect($or).to.be.an('array').with.lengthOf(2);
			if ($or === undefined) {
				return expect.fail('expected result.$or');
			}
			if ($or[0] === undefined || $or[1] === undefined) {
				return expect.fail('expected result.$or with two regex branches');
			}
			expect($or[0]).to.eql({
				'name.first': /^abc/i,
			});
			expect($or[1]).to.eql({
				'name.last': /^abc/i,
			});
		});

		it('should allow matching empty values in exact mode', function () {
			const result = List.fields.name!.addFilterToQuery({
				mode: 'exactly',
			});
			expect(result['name.first']).to.eql({
				$in: ['', null],
			});
			expect(result['name.last']).to.eql({
				$in: ['', null],
			});
		});

		it('should allow matching non-empty values in exact mode with the inverted option', function () {
			const result = List.fields.name!.addFilterToQuery({
				mode: 'exactly',
				inverted: true,
			});
			expect(result['name.first']).to.eql({
				$nin: ['', null],
			});
			expect(result['name.last']).to.eql({
				$nin: ['', null],
			});
		});
	});
};
