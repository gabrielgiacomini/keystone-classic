import { expect } from 'chai';
import RelationshipType from '../RelationshipType.mjs';

interface RelationshipSchemaPath {
	instance?: string;
	options?: {
		ref?: string;
	};
	caster?: RelationshipSchemaPath;
}

export const initList = function (List: import('../../test-helpers.mjs').TestList) {
	// We can use relationships that refer to the same List to test
	List.add({
		single: { type: RelationshipType, ref: List.key },
		many: { type: RelationshipType, ref: List.key, many: true },
	});
};

export const testFieldType = function (List: import('../../test-helpers.mjs').TestList) {

	const relatedItem = new List.model();
	before(async function () {
		await relatedItem.save();
	});
	/** Typed wrapper for `relatedItem.id` (Mongoose types id as `any`). */
	const relatedId = (): string => String(relatedItem.id);

	describe('schema contract', function () {
		it('preserves single and many ObjectId refs for Cloom-style relationship fields', function () {
			const singlePath = List.schema.path('single') as unknown as RelationshipSchemaPath;
			const manyPath = List.schema.path('many') as unknown as RelationshipSchemaPath;

			expect(singlePath.instance).to.equal('ObjectId');
			expect(singlePath.options?.ref).to.equal(List.key);
			expect(manyPath.instance).to.equal('Array');
			expect(manyPath.caster?.instance).to.equal('ObjectId');
			expect(manyPath.caster?.options?.ref).to.equal(List.key);
		});

		it('keeps self-referential refList metadata available after registration', function () {
			expect(List.fields.single!.paths).to.deep.equal({ refList: 'singleRefList' });
			expect(List.fields.many!.paths).to.deep.equal({ refList: 'manyRefList' });
			expect(List.fields.single!.refList).to.equal(List);
			expect(List.fields.many!.refList).to.equal(List);
		});
	});

	describe('single', function () {
		it('should validate id input', function (done) {
			List.fields.single!.validateInput({ single: relatedItem.id }, function (result: unknown) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate undefined input', function (done) {
			List.fields.single!.validateInput({}, function (result: unknown) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate empty input', function (done) {
			List.fields.single!.validateInput({ single: '' }, function (result: unknown) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate null input', function (done) {
			List.fields.single!.validateInput({ single: null }, function (result: unknown) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should invalidate boolean input', function (done) {
			List.fields.single!.validateInput({ single: true }, function (result: unknown) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should validate item objects (object with id property)', function (done) {
			List.fields.single!.validateInput({ single: relatedItem }, function (result: unknown) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should invalidate object input without id', function (done) {
			List.fields.single!.validateInput({ single: {} }, function (result: unknown) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate array input', function (done) {
			List.fields.single!.validateInput({ single: [] }, function (result: unknown) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should validate required present input', function (done) {
			const testItem = new List.model();
			List.fields.single!.validateRequiredInput(testItem, { single: relatedItem.id }, function (result: unknown) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate required present input with item', function (done) {
			const testItem = new List.model();
			List.fields.single!.validateRequiredInput(testItem, { single: relatedItem }, function (result: unknown) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate required present input with existing value', function (done) {
			const testItem = new List.model({
				single: relatedId(),
			});
			List.fields.single!.validateRequiredInput(testItem, { single: relatedId() }, function (result: unknown) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should invalidate required not present input', function (done) {
			const testItem = new List.model();
			List.fields.single!.validateRequiredInput(testItem, {}, function (result: unknown) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should validate required input with existing value', function (done) {
			const testItem = new List.model({
				single: relatedId(),
			});
			List.fields.single!.validateRequiredInput(testItem, {}, function (result: unknown) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should invalidate required blank input with existing value', function (done) {
			const testItem = new List.model({
				single: relatedId(),
			});
			List.fields.single!.validateRequiredInput(testItem, { single: '' }, function (result: unknown) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should save the provided value', async function () {
			const testItem = new List.model();
			await new Promise<void>((resolve) => { List.fields.single!.updateItem(testItem, { single: relatedItem.id }, resolve as (err?: unknown) => void); });
			// TODO: We should be testing for errors here
			const updatedItem = await testItem.save();
			const persistedData = await List.model.findById(updatedItem.id);
			expect(String(persistedData!.single)).to.equal(String(relatedItem.id));
		});

		it('should save the provided value with an item object', async function () {
			const testItem = new List.model();
			await new Promise<void>((resolve) => { List.fields.single!.updateItem(testItem, { single: relatedItem }, resolve as (err?: unknown) => void); });
			// TODO: We should be testing for errors here
			const updatedItem = await testItem.save();
			const persistedData = await List.model.findById(updatedItem.id);
			expect(String(persistedData!.single)).to.equal(String(relatedItem.id));
		});

		it('should clear the current value when provided null', async function () {
			const testItem = new List.model({
				single: relatedId(),
			});
			await testItem.save();
			await new Promise<void>((resolve) => { List.fields.single!.updateItem(testItem, { single: null }, resolve as (err?: unknown) => void); });
			// TODO: We should be testing for errors here
			const updatedItem = await testItem.save();
			const persistedData = await List.model.findById(updatedItem.id);
			expect(persistedData!.single).to.be.null;
		});

		it('should clear the current value when provided ""', async function () {
			const testItem = new List.model({
				single: relatedId(),
			});
			await testItem.save();
			await new Promise<void>((resolve) => { List.fields.single!.updateItem(testItem, { single: '' }, resolve as (err?: unknown) => void); });
			// TODO: We should be testing for errors here
			const updatedItem = await testItem.save();
			const persistedData = await List.model.findById(updatedItem.id);
			expect(persistedData!.single).to.be.null;
		});

		it('should not clear the current value when data object does not contain the field', async function () {
			const testItem = new List.model({
				single: relatedId(),
			});
			await testItem.save();
			await new Promise<void>((resolve) => { List.fields.single!.updateItem(testItem, {}, resolve as (err?: unknown) => void); });
			const updatedItem = await testItem.save();
			const persistedData = await List.model.findById(updatedItem.id);
			expect(String(persistedData!.single)).to.equal(String(relatedItem.id));
		});
	});

	describe('many', function () {
		it('should validate id input', function (done) {
			List.fields.many!.validateInput({ many: relatedItem.id }, function (result: unknown) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate empty array input', function (done) {
			List.fields.many!.validateInput({ many: [] }, function (result: unknown) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate null input', function (done) {
			List.fields.many!.validateInput({ many: null }, function (result: unknown) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate array input with ids', function (done) {
			List.fields.many!.validateInput({ many: [relatedItem.id] }, function (result: unknown) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate arrays of item objects (object with id property)', function (done) {
			List.fields.many!.validateInput({ many: [relatedItem] }, function (result: unknown) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate undefined input', function (done) {
			List.fields.many!.validateInput({}, function (result: unknown) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should not clear the current values when data object does not contain the field', async function () {
			const testItem = new List.model({
				many: [relatedItem.id, relatedItem.id],
			});
			await testItem.save();
			await new Promise<void>((resolve) => { List.fields.many!.updateItem(testItem, {}, resolve as (err?: unknown) => void); });
			const updatedItem = await testItem.save();
			const persistedData = await List.model.findById(updatedItem.id);
			expect((persistedData as unknown as { many: unknown[] }).many.length).to.equal(2);
			expect(String((persistedData as unknown as { many: unknown[] }).many[0])).to.equal(String(relatedItem.id));
			expect(String((persistedData as unknown as { many: unknown[] }).many[1])).to.equal(String(relatedItem.id));
		});

		it('should update the current values with the new values from the data object', async function () {
			const testItem = new List.model({
				many: [relatedItem.id, relatedItem.id, relatedItem.id],
			});
			await testItem.save();
			await new Promise<void>((resolve) => { List.fields.many!.updateItem(testItem, { many: [relatedItem.id, relatedItem.id] }, resolve as (err?: unknown) => void); });
			const updatedItem = await testItem.save();
			const persistedData = await List.model.findById(updatedItem.id);
			expect(String((persistedData as unknown as { many: unknown[] }).many)).to.eql(String([relatedItem.id, relatedItem.id]));
		});
	});

	describe('addFilterToQuery', function () {
		it('should filter arrays', function () {
			const result = List.fields.single!.addFilterToQuery({
				value: ['Some', 'strings'],
			});
			expect(result.single).to.eql({
				$in: ['Some', 'strings'],
			});
		});

		it('should convert a single string to an array and filter that', function () {
			const result = List.fields.single!.addFilterToQuery({
				value: 'a string',
			});
			expect(result.single).to.eql({
				$in: ['a string'],
			});
		});

		it('should support inverted filtering with an array', function () {
			const result = List.fields.single!.addFilterToQuery({
				value: ['Some', 'strings'],
				inverted: true,
			});
			expect(result.single).to.eql({
				$nin: ['Some', 'strings'],
			});
		});

		it('should filter by existance if no value is specified', function () {
			const result = List.fields.single!.addFilterToQuery({});
			expect(result.single).to.be.null;
		});

		it('should filter by non-existance if no value is specified', function () {
			const result = List.fields.single!.addFilterToQuery({
				inverted: true,
			});
			expect(result.single).to.eql({
				$ne: null,
			});
		});

		it('should filter by emptiness if many is true and no value is specified', function () {
			const result = List.fields.many!.addFilterToQuery({});
			expect(result.many).to.eql({
				$size: 0,
			});
		});

		it('should filter by non-emptiness if many is true and no value is specified', function () {
			const result = List.fields.many!.addFilterToQuery({
				inverted: true,
			});
			expect(result.many).to.eql({
				$not: {
					$size: 0,
				},
			});
		});
	});
};
