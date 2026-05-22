import { expect } from 'chai';

/** Shape of a Keystone document item used in boolean-field tests. */
interface BooleanItem {
	bool: boolean;
	nested: {
		bool: boolean;
	};
}

/** The boolean field exposed via `List.fields.bool!` or `List.fields['nested.bool']!`. */
interface BooleanField {
	updateItem(item: BooleanItem, data: Record<string, unknown>, callback: () => void): void;
	validateInput(data: Record<string, unknown>, callback: (result: boolean) => void): void;
	validateRequiredInput(item: BooleanItem, data: Record<string, unknown>, callback: (result: boolean) => void): void;
	addFilterToQuery(filter: Record<string, unknown>): Record<string, unknown>;
	inputIsValid(data: Record<string, unknown>, required: boolean): boolean;
}

/** Named fields registered on the List by initList. */
interface BooleanTestFields {
	bool: BooleanField;
	indented: BooleanField;
	defaultFalse: BooleanField;
	defaultTrue: BooleanField;
	required: BooleanField;
	initial: BooleanField;
	requiredInitial: BooleanField;
	initialDefaultTrue: BooleanField;
	collapse: BooleanField;
	'nested.bool': BooleanField;
}

/** Minimal shape of the Keystone List passed to initList / testFieldType. */
interface BooleanTestList {
	add(schema: Record<string, unknown>): void;
	model: new (data?: Record<string, unknown>) => BooleanItem;
	fields: BooleanTestFields;
}

export const initList = function (List: BooleanTestList) {
	List.add({
		bool: { type: Boolean, note: 'This is a boolean field' },
		indented: { type: Boolean, indent: true },
		nested: {
			bool: { type: Boolean },
		},
		defaultFalse: { type: Boolean, default: false },
		defaultTrue: { type: Boolean, default: true },
		required: { type: Boolean, required: true },
		initial: { type: Boolean, initial: true },
		requiredInitial: { type: Boolean, required: true, initial: true },
		initialDefaultTrue: { type: Boolean, initial: true, default: true },
		collapse: { type: Boolean, collapse: true },
	});
};

export const testFieldType = function (List: BooleanTestList) {
	describe('updateItem', function () {
		it('should be true when passed the boolean true', function (done) {
			const testItem = new List.model();
			List.fields.bool!.updateItem(testItem, {
				bool: true,
			}, function () {
				expect(testItem.bool).to.be.true;
				done();
			});
		});

		it('should be true when passed the string "true"', function (done) {
			const testItem = new List.model();
			List.fields.bool!.updateItem(testItem, {
				bool: 'true',
			}, function () {
				expect(testItem.bool).to.be.true;
				done();
			});
		});

		it('should be false when passed the boolean false', function (done) {
			const testItem = new List.model();
			List.fields.bool!.updateItem(testItem, {
				bool: false,
			}, function () {
				expect(testItem.bool).to.be.false;
				done();
			});
		});

		it('should be false when passed the string "false"', function (done) {
			const testItem = new List.model();
			List.fields.bool!.updateItem(testItem, {
				bool: 'false',
			}, function () {
				expect(testItem.bool).to.be.false;
				done();
			});
		});

		it('should be true when passed 1', function (done) {
			const testItem = new List.model();
			List.fields.bool!.updateItem(testItem, {
				bool: 1,
			}, function () {
				expect(testItem.bool).to.be.true;
				done();
			});
		});

		it('should be true when passed any other string', function (done) {
			const testItem = new List.model();
			List.fields.bool!.updateItem(testItem, { bool: 'abc' }, function () {
				expect(testItem.bool).to.be.true;
				done();
			});
		});

		it('should be true when passed any numerical input > 1', function (done) {
			const testItem = new List.model();
			List.fields.bool!.updateItem(testItem, { bool: 2 }, function () {
				expect(testItem.bool).to.be.true;
				done();
			});
		});

		it('should be false when passed 0', function (done) {
			const testItem = new List.model();
			List.fields.bool!.updateItem(testItem, {
				bool: 0,
			}, function () {
				expect(testItem.bool).to.be.false;
				done();
			});
		});

		it('should be false when passed undefined', function (done) {
			const testItem = new List.model();
			List.fields.bool!.updateItem(testItem, {}, function () {
				expect(testItem.bool).to.be.false;
				done();
			});
		});

		it('should be false when passed an empty string', function (done) {
			const testItem = new List.model();
			List.fields.bool!.updateItem(testItem, {
				bool: '',
			}, function () {
				expect(testItem.bool).to.be.false;
				done();
			});
		});

		it('should be false when passed null', function (done) {
			const testItem = new List.model();
			List.fields.bool!.updateItem(testItem, { bool: null }, function () {
				expect(testItem.bool).to.be.false;
				done();
			});
		});

		it('should update nested fields', function (done) {
			const testItem = new List.model();
			List.fields['nested.bool']!.updateItem(testItem, {
				nested: {
					bool: true,
				},
			}, function () {
				expect((testItem.nested as Record<string, unknown>).bool).to.be.true;
				done();
			});
		});

		it('should update nested fields with flat paths', function (done) {
			const testItem = new List.model();
			List.fields['nested.bool']!.updateItem(testItem, {
				'nested.bool': true,
			}, function () {
				expect((testItem.nested as Record<string, unknown>).bool).to.be.true;
				done();
			});
		});
	});

	describe('validateInput', function () {
		it('should validate true', function (done) {
			List.fields.bool!.validateInput({ bool: true }, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate false', function (done) {
			List.fields.bool!.validateInput({ bool: false }, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate "true"', function (done) {
			List.fields.bool!.validateInput({ bool: 'true' }, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate "false"', function (done) {
			List.fields.bool!.validateInput({ bool: 'false' }, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate 0', function (done) {
			List.fields.bool!.validateInput({ bool: 0 }, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate 1', function (done) {
			List.fields.bool!.validateInput({ bool: 1 }, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate undefined input', function (done) {
			List.fields.bool!.validateInput({}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate null', function (done) {
			List.fields.bool!.validateInput({ bool: null }, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate an empty string', function (done) {
			List.fields.bool!.validateInput({ bool: '' }, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate any other string input', function (done) {
			List.fields.bool!.validateInput({ bool: 'abc' }, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate all numerical input > 2', function (done) {
			List.fields.bool!.validateInput({ bool: 2 }, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should invalidate object input', function (done) {
			List.fields.bool!.validateInput({ bool: {} }, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate array input', function (done) {
			List.fields.bool!.validateInput({ bool: [] }, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});
	});

	describe('validateRequiredInput', function () {
		it('should validate true', function (done) {
			const testItem = new List.model();
			List.fields.bool!.validateRequiredInput(testItem, { bool: true }, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate a truthy string', function (done) {
			const testItem = new List.model();
			List.fields.bool!.validateRequiredInput(testItem, { bool: 'abc' }, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate a truthy number', function (done) {
			const testItem = new List.model();
			List.fields.bool!.validateRequiredInput(testItem, { bool: 2 }, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should invalidate "false"', function (done) {
			const testItem = new List.model();
			List.fields.bool!.validateRequiredInput(testItem, { bool: 'false' }, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate false', function (done) {
			const testItem = new List.model();
			List.fields.bool!.validateRequiredInput(testItem, { bool: false }, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate ""', function (done) {
			const testItem = new List.model();
			List.fields.bool!.validateRequiredInput(testItem, { bool: '' }, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate null', function (done) {
			const testItem = new List.model();
			List.fields.bool!.validateRequiredInput(testItem, { bool: null }, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate undefined', function (done) {
			const testItem = new List.model();
			List.fields.bool!.validateRequiredInput(testItem, { bool: undefined }, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate 0', function (done) {
			const testItem = new List.model();
			List.fields.bool!.validateRequiredInput(testItem, { bool: 0 }, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});
	});

	describe('addFilterToQuery', function () {
		it('should filter with the mongodb negation when passed false', function () {
			const result = List.fields.bool!.addFilterToQuery({ value: false });
			expect(result.bool).to.eql({
				$ne: true,
			});
		});

		it('should filter with the mongodb negation when passed "false"', function () {
			const result = List.fields.bool!.addFilterToQuery({ value: 'false' });
			expect(result.bool).to.eql({
				$ne: true,
			});
		});

		it('should filter true when passed true', function () {
			const result = List.fields.bool!.addFilterToQuery({ value: true });
			expect(result.bool).to.be.true;
		});
	});

	/* Deprecated inputIsValid tests */

	it('should always validate when not required', function () {
		expect(List.fields.bool!.inputIsValid({ bool: 'true' }, false)).to.be.true;
		expect(List.fields.bool!.inputIsValid({ bool: true }, false)).to.be.true;
		expect(List.fields.bool!.inputIsValid({ bool: 'false' }, false)).to.be.true;
		expect(List.fields.bool!.inputIsValid({ bool: false }, false)).to.be.true;
		expect(List.fields.bool!.inputIsValid({ bool: '' }, false)).to.be.true;
		expect(List.fields.bool!.inputIsValid({ bool: undefined }, false)).to.be.true;
	});

	it('should validate input properly when required', function () {
		expect(List.fields.bool!.inputIsValid({ bool: 'true' }, true)).to.be.true;
		expect(List.fields.bool!.inputIsValid({ bool: true }, true)).to.be.true;
		expect(List.fields.bool!.inputIsValid({ bool: 'false' }, true)).to.be.false;
		expect(List.fields.bool!.inputIsValid({ bool: false }, true)).to.be.false;
		expect(List.fields.bool!.inputIsValid({ bool: '' }, true)).to.be.false;
		expect(List.fields.bool!.inputIsValid({ bool: undefined }, true)).to.be.false;
	});
};
