import keystone from 'keystone';
import { expect } from 'chai';
import getMongooseConnection from '../../../helpers/getMongooseConnection.mts';
import '../../../models/DependsOn.mts';

const DependsOn = keystone.lists['DependsOn'];
if (!DependsOn) {
	throw new Error('DependsOn list fixture was not registered.');
}

let mongoose: typeof import('mongoose');
before(async function () {
	mongoose = await getMongooseConnection();
	keystone.mongoose = mongoose;
});

describe('Test dependsOn and required', function () {

	it('Ignore required if evalDependsOn is not `true` by setting `state` to `draft`', function (done) {
		DependsOn.model.deleteMany({}).then(function () {
			const newPost = new DependsOn.model({ title: 'new post', state: 'draft' });
			return newPost.save();
		}).then(function () { done(); }, done);
	});

	it('Save will fail if `state` set to `published` and `publishedDate` is not defined', async function () {
		await DependsOn.model.deleteMany({});
		const backupLog = console.error;
		console.error = () => null;

		const newPost = new DependsOn.model({
			title: 'new post',
			state: 'published',
			publishedDate: undefined,
		});

		let saveError: unknown;
		try {
			await newPost.save();
		} catch (err) {
			saveError = err;
		} finally {
			console.error = backupLog;
		}

		expect(saveError).to.exist;
		const err = saveError as Record<string, unknown>;
		expect(err['name']).to.equal('ValidationError');
		expect(err['errors']).to.have.property('publishedDate');
	});

	it('Save will succeed if `state` set to `published` and `publishedDate` is defined', function (done) {
		DependsOn.model.deleteMany({}).then(function () {
			const newPost = new DependsOn.model({ title: 'new post', state: 'published', publishedDate: new Date() });
			return newPost.save();
		}).then(function () { done(); }, done);
	});

	after(function (done) {
		DependsOn.model.deleteMany({}).then(function () { done(); }, done);
	});
});
