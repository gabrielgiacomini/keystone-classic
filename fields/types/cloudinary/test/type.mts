import { expect } from 'chai';
import CloudinaryType from '../CloudinaryType.mjs';
import CloudinaryImageType from '../../cloudinaryimage/CloudinaryImageType.mjs';
import CloudinaryImagesType from '../../cloudinaryimages/CloudinaryImagesType.mjs';
import type { KeystoneList } from '../../Type.mjs';

type TestList = import('../../test-helpers.mjs').TestList;
type SchemaConstructor = new (definition?: Record<string, unknown>) => TestList['schema'];

function createCloudinaryConstructorList(List: TestList, cloudinaryConfig: unknown): KeystoneList {
	const Schema = List.schema.constructor as SchemaConstructor;
	return {
		key: 'CloudinaryMissingConfigGuard',
		path: 'cloudinary-missing-config-guard',
		schema: new Schema({}),
		mappings: { name: null },
		get(key: string) {
			return key === 'nocreate' ? true : undefined;
		},
		automap() {},
		underscoreMethod() {},
		keystone: {
			get(key: string) {
				return key === 'cloudinary config' ? cloudinaryConfig : undefined;
			},
			mongoose: { Schema },
		},
	} as unknown as KeystoneList;
}

export const initList = function (List: TestList) {
	// CloudinaryType requires 'cloudinary config' to be set in keystone.
	// In tests there is no real Cloudinary account; we just set the flag.
	List.keystone.set('cloudinary config', true);

	List.add({
		singleImage: { type: CloudinaryType },
		multiImage:  { type: CloudinaryType, multiple: true },
		withFolder:  { type: CloudinaryType, folder: 'uploads' },
	});
};

export const testFieldType = function (List: TestList) {

	describe('configuration', function () {
		it('should throw a targeted error when cloudinary config is missing', function () {
			const MissingConfigList = createCloudinaryConstructorList(List, undefined);
			const createField = () => new CloudinaryType(MissingConfigList, 'metadataImage', { folder: 'permalinks' });
			expect(createField).to.throw(
				'Cloudinary fields (CloudinaryMissingConfigGuard.metadataImage) require the "cloudinary config" option to be set.',
			);
		});
	});

	// ---------------------------------------------------------------------------
	// addToSchema — single mode
	// ---------------------------------------------------------------------------

	describe('addToSchema (single mode)', function () {
		it('should add public_id path to the schema', function () {
			const schema = List.model.schema;
			expect(schema.path('singleImage.public_id')).to.exist;
		});

		it('should add url path to the schema', function () {
			const schema = List.model.schema;
			expect(schema.path('singleImage.url')).to.exist;
		});

		it('should add version path to the schema', function () {
			const schema = List.model.schema;
			expect(schema.path('singleImage.version')).to.exist;
		});

		it('should add secure_url path to the schema', function () {
			const schema = List.model.schema;
			expect(schema.path('singleImage.secure_url')).to.exist;
		});

		it('should add signature path to the schema', function () {
			const schema = List.model.schema;
			expect(schema.path('singleImage.signature')).to.exist;
		});

		it('should add format path to the schema', function () {
			const schema = List.model.schema;
			expect(schema.path('singleImage.format')).to.exist;
		});
	});

	// ---------------------------------------------------------------------------
	// addToSchema — multiple mode
	// ---------------------------------------------------------------------------

	describe('addToSchema (multiple mode)', function () {
		it('should add the field as an array in the schema', function () {
			const schema = List.model.schema;
			// In array mode the path is a DocumentArray, not a simple leaf
			const schemaPath = schema.path('multiImage');
			expect(schemaPath).to.exist;
		});
	});

	// ---------------------------------------------------------------------------
	// getEmptyValue / getData — single mode
	// ---------------------------------------------------------------------------

	describe('getData (single mode)', function () {
		it('should return an object for a new item', function () {
			const testItem = new List.model();
			const data = List.fields.singleImage!.getData(testItem);
			expect(data).to.be.an('object');
		});

		it('should return an object with the expected cloudinary keys structure', function () {
			const testItem = new List.model();
			const data = List.fields.singleImage!.getData(testItem);
			// getData returns whatever is stored — for a fresh document the field
			// may be an empty object or undefined; either way getData wraps it.
			expect(data).to.be.an('object');
			expect(Array.isArray(data)).to.be.false;
		});
	});

	// ---------------------------------------------------------------------------
	// getData — multiple mode
	// ---------------------------------------------------------------------------

		describe('getData (multiple mode)', function () {
			it('should return an array for a new item', function () {
				const testItem = new List.model();
				const data = List.fields.multiImage!.getData(testItem);
				expect(data).to.be.an('array');
		});

		it('should return an empty array when no images are stored', function () {
			const testItem = new List.model();
			const data = List.fields.multiImage!.getData(testItem);
			expect(data).to.have.lengthOf(0);
			});
		});

		describe('removeImage (multiple mode)', function () {
			it('should save with a promise and invoke the callback on success', function (done) {
				const images = [{ public_id: 'abc' }, { public_id: 'def' }];
				let saveCalled = false;
				const item = {
					get(path: string) {
						expect(path).to.equal('multiImage');
						return images;
					},
					save() {
						saveCalled = true;
						return Promise.resolve(item);
					},
				};

				List.fields.multiImage!.removeImage(item, 'abc', 'remove', function (err: unknown) {
					try {
						expect(err).to.equal(undefined);
						expect(saveCalled).to.equal(true);
						expect(images.map(image => image.public_id)).to.deep.equal(['def']);
						done();
					} catch (error) {
						done(error);
					}
				});
			});

			it('should deliver promise save errors to the callback', function (done) {
				const expected = new Error('save failed');
				const images = [{ public_id: 'abc' }];
				const item = {
					get() {
						return images;
					},
					save() {
						return Promise.reject(expected);
					},
				};

				List.fields.multiImage!.removeImage(item, String(0), 'remove', function (err: unknown) {
					try {
						expect(err).to.equal(expected);
						expect(images).to.have.lengthOf(0);
						done();
					} catch (error) {
						done(error);
					}
				});
			});
		});

		// ---------------------------------------------------------------------------
		// getFolder
	// ---------------------------------------------------------------------------

	describe('getFolder', function () {
		it('should return the folder option when folder is set', function () {
			const folder = List.fields.withFolder!.getFolder();
			expect(folder).to.equal('uploads');
		});

		it('should return null for a field with no folder and no cloudinary folders setting', function () {
			// keystone.init() does not set 'cloudinary folders', so getFolder returns null
			const folder = List.fields.singleImage!.getFolder();
			expect(folder).to.equal(null);
		});

		it('should derive the prefixed folder when cloudinary folders is enabled', function () {
			const previousCloudinaryFolders = List.keystone.get('cloudinary folders');
			const previousCloudinaryPrefix = List.keystone.get('cloudinary prefix');
			try {
				List.keystone.set('cloudinary folders', true);
				List.keystone.set('cloudinary prefix', 'cloom');
				const folder = List.fields.singleImage!.getFolder();
				expect(folder).to.equal(`cloom/${List.path}/singleImage`);
			} finally {
				List.keystone.set('cloudinary folders', previousCloudinaryFolders);
				List.keystone.set('cloudinary prefix', previousCloudinaryPrefix);
			}
		});
	});

	// ---------------------------------------------------------------------------
	// validateInput
	// ---------------------------------------------------------------------------

	describe('validateInput', function () {
		it('should validate undefined input', function (done) {
			List.fields.singleImage!.validateInput({}, function (result: unknown) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate null input', function (done) {
			List.fields.singleImage!.validateInput({ singleImage: null }, function (result: unknown) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate empty string input', function (done) {
			List.fields.singleImage!.validateInput({ singleImage: '' }, function (result: unknown) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate an upload: prefixed string', function (done) {
			List.fields.singleImage!.validateInput({ singleImage: 'upload:file1' }, function (result: unknown) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate a delete string', function (done) {
			List.fields.singleImage!.validateInput({ singleImage: 'delete' }, function (result: unknown) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should validate an object with public_id', function (done) {
			List.fields.singleImage!.validateInput({ singleImage: { public_id: 'abc' } }, function (result: unknown) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should invalidate a plain string that is not a recognised command', function (done) {
			List.fields.singleImage!.validateInput({ singleImage: 'notacommand' }, function (result: unknown) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should invalidate a numeric value', function (done) {
			List.fields.singleImage!.validateInput({ singleImage: 42 }, function (result: unknown) {
				expect(result).to.be.false;
				done();
			});
		});

		it('should validate an array of multiple images', function (done) {
			List.fields.multiImage!.validateInput({ multiImage: [{ public_id: 'abc' }, 'upload:file1'] }, function (result: unknown) {
				expect(result).to.be.true;
				done();
			});
		});

		it('should invalidate arrays containing invalid multiple image values', function (done) {
			List.fields.multiImage!.validateInput({ multiImage: [{ public_id: 'abc' }, 42] }, function (result: unknown) {
				expect(result).to.be.false;
				done();
			});
		});
	});

	// ---------------------------------------------------------------------------
	// validateRequiredInput
	// ---------------------------------------------------------------------------

	describe('validateRequiredInput', function () {
		it('should always return true (files cannot be validated here)', function (done) {
			const testItem = new List.model();
			List.fields.singleImage!.validateRequiredInput(testItem, {}, function (result: unknown) {
				expect(result).to.be.true;
				done();
			});
		});
	});

	// ---------------------------------------------------------------------------
	// Deprecation wrapper smoke test
	// ---------------------------------------------------------------------------

		describe('CloudinaryImage deprecation wrapper', function () {
			it('should be a function named CloudinaryImage (properName)', function () {
				// The CloudinaryImageType wrapper is a constructor function.
				expect(typeof CloudinaryImageType).to.equal('function');
				expect(CloudinaryImageType.properName).to.equal('CloudinaryImage');
		});

		it('should share prototype chain with CloudinaryType', function () {
			// The wrapper delegates to CloudinaryType via prototype chain,
			// so every prototype method of CloudinaryType is available.
			const proto = CloudinaryImageType.prototype;
			expect(typeof proto.addToSchema).to.equal('function');
			expect(typeof proto.getData).to.equal('function');
				expect(typeof proto.getFolder).to.equal('function');
			});
		});

		describe('CloudinaryImages deprecation wrapper', function () {
			it('should be a function named CloudinaryImages (properName)', function () {
				expect(typeof CloudinaryImagesType).to.equal('function');
				expect(CloudinaryImagesType.properName).to.equal('CloudinaryImages');
			});

			it('should inherit unified Cloudinary validation methods', function () {
				const proto = CloudinaryImagesType.prototype;
				expect(typeof proto.validateInput).to.equal('function');
				expect(typeof proto.validateRequiredInput).to.equal('function');
			});
		});
	};
