import { expect } from 'chai';
import SelectType from '../SelectType.mjs';

/**
 * Primitive values accepted by select fields in these test fixtures.
 * @see ../SelectType.mjs - Select field implementation
 */
type KeystoneSelectTestFieldValue = string | number | null;

/** Shape of a Keystone document item used in select-field tests. */
interface SelectItem {
	select?: KeystoneSelectTestFieldValue;
	nested?: {
		select?: KeystoneSelectTestFieldValue;
	};
	extraProps?: KeystoneSelectTestFieldValue;
	numeric?: number | null;
	emptyStringSelect?: string | null;
	extraPropsLabel?: string;
	extraPropsData?: Record<string, unknown>;
	extraPropsOptions?: Record<string, unknown>[];
	extraPropsOptionsMap?: Record<string, Record<string, unknown>>;
	_?: {
		extraProps: {
			pluck(property: string): unknown;
		};
	};
	get(path: string): unknown;
}

/** A select field instance as exposed via `List.fields`. */
interface SelectField {
	ops: { value: string | number; label: string; [key: string]: unknown }[];
	validateInput(data: Record<string, unknown>, callback: (result: boolean) => void): void;
	validateRequiredInput(item: SelectItem, data: Record<string, unknown>, callback: (result: boolean) => void): void;
	updateItem(item: SelectItem, data: Record<string, unknown>, callback: () => void): void;
	addFilterToQuery(filter: Record<string, unknown>): Record<string, unknown>;
	format(item: SelectItem): string;
	cloneOps(): { value: string | number; label: string; [key: string]: unknown }[];
}

/** Named fields registered on the List by initList. */
interface SelectTestFields {
	select: SelectField;
	'nested.select': SelectField;
	extraProps: SelectField;
	numeric: SelectField;
	emptyStringSelect: SelectField;
}

/** Minimal shape of the Keystone List passed to initList / testFieldType. */
interface SelectTestList {
	add(schema: Record<string, unknown>): void;
	model: new (data?: Record<string, unknown>) => SelectItem;
	fields: SelectTestFields;
}

export const initList = function (List: SelectTestList) {
	List.add({
		select: { type: SelectType, options: 'one, two, three' },
		nested: {
			select: { type: SelectType, options: 'one, two, three' },
		},
		extraProps: { type: SelectType, options: [
			{ value: 'one', label: 'One', custom: '1' },
			{ value: 'two', label: 'Two', custom: '2' },
		] },
		numeric: { type: SelectType, numeric: true, options: [
			{ value: 1, label: 'one' },
			{ value: 2, label: 'two' },
			{ value: 3, label: 'three' },
		] },
		emptyStringSelect: { type: SelectType, options: [
			{ value: '', label: '' },
			{ value: 'two', label: 'Two' },
		] },
	});
};

export const testFieldType = function (List: SelectTestList) {
	describe('invalid options', function () {
		it('should throw when no options are passed', function (done) {
			try {
				List.add({
					noOptions: { type: SelectType },
				});
			} catch (err: unknown) {
				expect((err as Error).message).to.eql('Select fields require an options array.');
				done();
			}
		});
	});

	describe('validateInput', function () {
		it('should validate top level selects', function (done) {
			List.fields.select!.validateInput({
				select: 'one',
			}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate nested selects', function (done) {
			List.fields['nested.select']!.validateInput({
				nested: {
					select: 'one',
				},
			}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate undefined input', function (done) {
			List.fields.select!.validateInput({
				select: undefined,
			}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate null input', function (done) {
			List.fields.select!.validateInput({
				select: null,
			}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate an empty string', function (done) {
			List.fields.select!.validateInput({
				select: '',
			}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate an empty string if specified as an option', function (done) {
			List.fields.emptyStringSelect!.validateInput({
				emptyStringSelect: '',
			}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should invalidate numbers', function (done) {
			List.fields.select!.validateInput({
				select: 1,
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should validate numbers when numeric is set to true', function (done) {
			List.fields.numeric!.validateInput({
				numeric: 1,
			}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate number strings when numeric is set to true', function (done) {
			List.fields.numeric!.validateInput({
				numeric: '1',
			}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should invalidate non existing options', function (done) {
			List.fields.select!.validateInput({
				select: 'four',
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate two selected options', function (done) {
			List.fields.select!.validateInput({
				select: 'one, two',
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate true', function (done) {
			List.fields.select!.validateInput({
				select: true,
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate false', function (done) {
			List.fields.select!.validateInput({
				select: false,
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});
	});

	describe('validateRequiredInput', function () {
		it('should validate a selected option', function (done) {
			const testItem = new List.model();
			List.fields.select!.validateRequiredInput(testItem, {
				select: 'one',
			}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate a nested select', function (done) {
			const testItem = new List.model();
			List.fields['nested.select']!.validateRequiredInput(testItem, {
				nested: {
					select: 'one',
				},
			}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate a nested select with a flat path', function (done) {
			List.fields.select!.validateInput({
				'nested.select': ['a', 'b'],
			}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should invalidate an empty string', function (done) {
			const testItem = new List.model();
			List.fields.select!.validateRequiredInput(testItem, {
				select: '',
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate undefined', function (done) {
			const testItem = new List.model();
			List.fields.select!.validateRequiredInput(testItem, {
				select: undefined,
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should validate undefined if a value exists', function (done) {
			const testItem = new List.model({
				select: 'one',
			});
			List.fields.select!.validateRequiredInput(testItem, {
				select: undefined,
			}, function (result: boolean) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should invalidate null', function (done) {
			const testItem = new List.model();
			List.fields.select!.validateRequiredInput(testItem, {
				select: null,
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate an empty string even if specified as an option', function (done) {
			const testItem = new List.model();
			List.fields.emptyStringSelect!.validateRequiredInput(testItem, {
				emptyStringSelect: '',
			}, function (result: boolean) {
				expect(result).to.be.false;
				done();
			});
		});
	});

	describe('updateItem', function () {
		it('should update top level fields', function (done) {
			const testItem = new List.model();
			List.fields.select!.updateItem(testItem, {
				select: 'one',
			}, function () {
				expect(testItem.select).to.equal('one');
				done();
			});
		});

		it('should update nested fields', function (done) {
			const testItem = new List.model();
			List.fields['nested.select']!.updateItem(testItem, {
				nested: {
					select: 'one',
				},
			}, function () {
				expect(testItem.nested?.select).to.equal('one');
				done();
			});
		});

		it('should update nested fields with flat paths', function (done) {
			const testItem = new List.model();
			List.fields['nested.select']!.updateItem(testItem, {
				'nested.select': 'one',
			}, function () {
				expect(testItem.nested?.select).to.equal('one');
				done();
			});
		});
	});

	describe('addFilterToQuery', function () {
		it('should filter by an array', function () {
			const result = List.fields.select!.addFilterToQuery({
				value: ['Some', 'strings'],
			});
			expect(result.select).to.eql({
				$in: ['Some', 'strings'],
			});
		});

		it('should support inverted mode for an array', function () {
			const result = List.fields.select!.addFilterToQuery({
				value: ['Some', 'strings'],
				inverted: true,
			});
			expect(result.select).to.eql({
				$nin: ['Some', 'strings'],
			});
		});

		it('should filter by a string', function () {
			const result = List.fields.select!.addFilterToQuery({
				value: 'a string',
			});
			expect(result.select).to.eql('a string');
		});

		it('should support inverted mode for a string', function () {
			const result = List.fields.select!.addFilterToQuery({
				value: 'a string',
				inverted: true,
			});
			expect(result.select).to.eql({
				$ne: 'a string',
			});
		});

		it('should filter by existance if no value exists', function () {
			const result = List.fields.select!.addFilterToQuery({});
			expect(result.select).to.eql({
				$in: ['', null],
			});
		});

		it('should filter by non-existance if no value exists', function () {
			const result = List.fields.select!.addFilterToQuery({
				inverted: true,
			});
			expect(result.select).to.eql({
				$nin: ['', null],
			});
		});
	});

	it('should format values with the label of the option', function () {
		const testItem = new List.model({
			select: 'one',
		});
		expect(List.fields.select!.format(testItem)).to.equal('One');
	});

	it('should pluck custom properties from the selected option', function () {
		const testItem = new List.model({
			extraProps: 'two',
		});
		expect(testItem._?.extraProps.pluck('custom')).to.equal('2');
	});

	it('should have the label in nameLabel', function () {
		const testItem = new List.model({
			extraProps: 'two',
		});
		expect(testItem.extraPropsLabel).to.equal('Two');
	});

	it('should have the current data in nameData', function () {
		const testItem = new List.model({
			extraProps: 'two',
		});
		expect(testItem.extraPropsData).to.eql({
			value: 'two', label: 'Two', custom: '2',
		});
	});

	it('should have the options in nameOption', function () {
		const testItem = new List.model({
			extraProps: 'two',
		});
		expect(testItem.extraPropsOptions).to.eql([
			{ value: 'one', label: 'One', custom: '1' },
			{ value: 'two', label: 'Two', custom: '2' },
		]);
	});

	it('should have the options map in nameOptionsMap', function () {
		const testItem = new List.model({
			extraProps: 'two',
		});
		expect(testItem.extraPropsOptionsMap).to.eql({
			one: {
				value: 'one', label: 'One', custom: '1',
			},
			two: {
				value: 'two', label: 'Two', custom: '2',
			},
		});
	});

	it('should return a blank string when formatting an undefined value', function () {
		const testItem = new List.model();
		expect(List.fields.select!.format(testItem)).to.equal('');
	});

	it('should return a shallow clone of the options', function () {
		const clonedOps = List.fields.select!.cloneOps();
		expect(clonedOps).to.eql(List.fields.select!.ops);
		expect(clonedOps).to.not.equal(List.fields.select!.ops);
	});
};
