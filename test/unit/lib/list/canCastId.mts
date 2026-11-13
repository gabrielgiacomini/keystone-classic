import { expect } from 'chai';
import mongoose from 'mongoose';
import canCastId from 'keystone/lib/list/canCastId';

const ObjectIdModel = mongoose.model('CanCastIdUnitObjectId', new mongoose.Schema({ title: String }));
const StringModel = mongoose.model('CanCastIdUnitString', new mongoose.Schema({ _id: String, title: String }));
const NumberModel = mongoose.model('CanCastIdUnitNumber', new mongoose.Schema({ _id: Number, title: String }));

describe('lib/list/canCastId', function () {
	it('follows the ObjectId cast for an ObjectId _id', function () {
		expect(canCastId(ObjectIdModel, '507f1f77bcf86cd799439011')).to.equal(true);
		expect(canCastId(ObjectIdModel, new mongoose.Types.ObjectId())).to.equal(true);
		// Mongoose accepts any 12-character string as the bytes of an ObjectId.
		expect(canCastId(ObjectIdModel, 'abcdefghijkl')).to.equal(true);
		expect(canCastId(ObjectIdModel, 'not-an-objectid')).to.equal(false);
		expect(canCastId(ObjectIdModel, '42')).to.equal(false);
		expect(canCastId(ObjectIdModel, '')).to.equal(false);
	});

	it('follows the Number cast for a Number _id', function () {
		expect(canCastId(NumberModel, '42')).to.equal(true);
		expect(canCastId(NumberModel, 42)).to.equal(true);
		expect(canCastId(NumberModel, 0)).to.equal(true);
		expect(canCastId(NumberModel, 'not-a-number')).to.equal(false);
		expect(canCastId(NumberModel, '507f1f77bcf86cd799439011')).to.equal(false);
	});

	it('accepts every string and number for a String _id', function () {
		expect(canCastId(StringModel, 'not-an-objectid')).to.equal(true);
		expect(canCastId(StringModel, '507f1f77bcf86cd799439011')).to.equal(true);
		expect(canCastId(StringModel, 42)).to.equal(true);
	});

	it('rejects query operators and arrays for every id type', function () {
		for (const model of [ObjectIdModel, StringModel, NumberModel]) {
			expect(canCastId(model, { $ne: null }), model.modelName).to.equal(false);
			expect(canCastId(model, ['a']), model.modelName).to.equal(false);
		}
	});

	it('rejects plain objects and arrays the schema type alone would cast', function () {
		const hex = '507f1f77bcf86cd799439011';
		for (const model of [ObjectIdModel, StringModel, NumberModel]) {
			expect(canCastId(model, { _id: hex }), model.modelName).to.equal(false);
			expect(canCastId(model, [hex]), model.modelName).to.equal(false);
			expect(canCastId(model, [42]), model.modelName).to.equal(false);
			expect(canCastId(model, { toString: () => hex }), model.modelName).to.equal(false);
			expect(canCastId(model, Object.create(null)), model.modelName).to.equal(false);
			expect(canCastId(model, {}), model.modelName).to.equal(false);
		}
		// Also before the schema type is asked, and when there is none to ask.
		expect(canCastId({}, { $ne: null })).to.equal(false);
	});

	it('leaves a missing id to the query', function () {
		for (const model of [ObjectIdModel, StringModel, NumberModel]) {
			expect(canCastId(model, undefined), model.modelName).to.equal(true);
			expect(canCastId(model, null), model.modelName).to.equal(true);
		}
	});

	it('reports castable when the model exposes no _id schema type', function () {
		expect(canCastId(undefined, 'x')).to.equal(true);
		expect(canCastId({}, 'x')).to.equal(true);
		expect(canCastId({ schema: {} }, 'x')).to.equal(true);
		expect(canCastId({ schema: { path: () => undefined } }, 'x')).to.equal(true);
	});

	it('does not swallow an error that is not a CastError', function () {
		const boom = new Error('boom');
		const model = { schema: { path: () => ({ cast() { throw boom; } }) } };
		expect(() => canCastId(model, 'x')).to.throw(boom);
	});
});
