import _ from 'lodash';
import { FieldType } from '../Type.mjs';
import type { KeystoneList, FieldOptionsBase, MongooseDocument } from '../Type.mjs';
import sanitize from 'sanitize-filename';
import { defer } from '../../../lib/utils/async.mjs';
import cloudinarySdk from '../../../lib/cloudinaryClient.mjs';
import { ensureCallback, originalFilename, type NormalisedGenerateFilename, type StorageNameFile } from '../../../lib/storage/nameFunctions.mjs';
import type { Schema } from 'mongoose';

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/** One image record as stored in both schema modes. */
export interface CloudinaryImageData {
	public_id: string;
	version: number;
	signature: string;
	format: string;
	resource_type: string;
	url: string;
	width: number;
	height: number;
	secure_url: string;
	src?: (options?: Record<string, unknown>) => string;
}

interface CloudinaryUploadOptions {
	tags: string[];
	folder?: string;
	public_id?: string;
	[key: string]: unknown;
}

interface CloudinaryUploadResult extends CloudinaryImageData {
	error?: { message: string; http_code?: number; [key: string]: unknown };
}

interface UploadedFile {
	path: string;
	originalname?: string;
	size?: number;
	[key: string]: unknown;
}

const DEFAULT_OPTIONS = {
	generateFilename: undefined,
	whenExists: 'overwrite',
	retryAttempts: 3,
};

function getEmptyValue (): CloudinaryImageData {
	return {
		public_id: '', version: 0, signature: '', format: '',
		resource_type: '', url: '', width: 0, height: 0, secure_url: '',
	};
}

function truthy (value: unknown): boolean { return Boolean(value); }

function cleanUp (oldValues: CloudinaryImageData[], newValues: CloudinaryImageData[]): void {
	const oldvalIds = oldValues.map((v: CloudinaryImageData) => v.public_id);
	const newValIds = newValues.map((v: CloudinaryImageData) => v.public_id);
	const removed = _.difference(oldvalIds, newValIds);
	removed.forEach(function (id: string) {
		cloudinarySdk.uploader.destroy(id, function () {});
	});
}

function trimSupportedFileExtensions (publicId: string): string {
	const exts = [
		'.jpg', '.jpe', '.jpeg', '.jpc', '.jp2', '.j2k', '.wdp', '.jxr',
		'.hdp', '.png', '.gif', '.webp', '.bmp', '.tif', '.tiff', '.ico',
		'.pdf', '.ps', '.ept', '.eps', '.eps3', '.psd', '.svg', '.ai',
		'.djvu', '.flif', '.tga',
	];
	for (const ext of exts) {
		if (_.endsWith(publicId, ext)) return publicId.slice(0, -ext.length);
	}
	return publicId;
}

// cloudinarySdk is the typed wrapper from lib/cloudinaryClient — use directly.

interface KeystoneLike {
	get(key: string): unknown;
	mongoose: { Schema: new(def: Record<string, unknown>) => Schema };
}

function getKeystoneFromList (list: KeystoneList): KeystoneLike {
	return (list as KeystoneList & { keystone: KeystoneLike }).keystone;
}

// ---------------------------------------------------------------------------
// Constructor
// ---------------------------------------------------------------------------

function normalizeCloudinaryOptions(options: KeystoneFieldOptionsForCloudinaryType): void {
	const multiple = Boolean(options.multiple);
	if (!multiple) {
		if (options.filenameAsPublicID) {
			// originalFilename is a sync (file) => string function;
			// ensureCallback wraps it into the normalised 3-arg form.
			options.generateFilename = ensureCallback(originalFilename);
			options.whenExists = 'overwrite';
		}
		const merged = Object.assign({}, DEFAULT_OPTIONS, options) as KeystoneFieldOptionsForCloudinaryType;
		if (merged.generateFilename) {
			// generateFilename is already a NormalisedGenerateFilename here;
			// ensureCallback is idempotent for 3-arg functions.
			merged.generateFilename = ensureCallback(merged.generateFilename);
		}
		Object.assign(options, merged);
	}
}

function getCloudinaryProperties(options: KeystoneFieldOptionsForCloudinaryType): string[] {
	return options.multiple
		? ['select', 'selectPrefix', 'autoCleanup', 'publicID', 'folder', 'filenameAsPublicID']
		: ['select', 'selectPrefix', 'autoCleanup'];
}

/** Cloudinary image field type for Keystone. Supports single and multi-image uploads. */
class CloudinaryType extends FieldType<KeystoneFieldOptionsForCloudinaryType, CloudinaryImageData> {
	static readonly properName: string = 'Cloudinary';
	static readonly typeName: string = 'cloudinary';

	override _underscoreMethods = ['format'];
	override _fixedSize = 'full' as const;

	// Instance properties used across methods.
	declare paths: Record<string, string>;
	declare apply: (item: Record<string, unknown>, method: string, ...args: unknown[]) => unknown;
	declare removeImage: (item: { get(path: string): unknown; save(): Promise<unknown> }, id: number | string, method: string, callback?: (err?: unknown) => void) => void;

	/**
	 * Creates a CloudinaryType field instance.
	 * @param list - The parent Keystone list.
	 * @param path - The field path within the document.
	 * @param options - Cloudinary-specific field options.
	 */
	constructor(list: KeystoneList, path: string, options: KeystoneFieldOptionsForCloudinaryType) {
		normalizeCloudinaryOptions(options);
		super(list, path, options);
		this._properties = getCloudinaryProperties(this.options);

		const ks = getKeystoneFromList(list);
		if (!ks.get('cloudinary config')) {
			throw new Error(
				'Invalid Configuration\n\n'
				+ 'Cloudinary fields (' + list.key + '.' + path + ') require the "cloudinary config" option to be set.\n\n'
				+ 'See http://v4.keystonejs.com/docs/configuration/#services-cloudinary for more information.\n',
			);
		}
	}

	// -------------------------------------------------------------------------
	// getFolder — uses single-image logic (honours cloudinary prefix bug-fix)
	// -------------------------------------------------------------------------

	/**
	 * Returns the Cloudinary folder for this field, if configured.
	 * @returns The folder path or null.
	 */
	getFolder (): string | null {
		let folder: string | null = null;
		const ks = getKeystoneFromList(this.list);
		const opts = this.options;
		if (ks.get('cloudinary folders') || opts.folder) {
			if (typeof opts.folder === 'string') {
				folder = opts.folder;
			} else {
				const prefix = ks.get('cloudinary prefix') as string | undefined;
				const folderList: string[] = prefix ? [prefix] : [];
				folderList.push((this.list as KeystoneList & { path: string }).path);
				folderList.push(this.path);
				folder = folderList.join('/');
			}
		}
		return folder;
	}

	// -------------------------------------------------------------------------
	// addToSchema — dispatch
	// -------------------------------------------------------------------------

	/**
	 * Adds the Cloudinary field schema to the Mongoose model.
	 * Dispatches to single or array schema depending on options.
	 * @param schema - The Mongoose schema to augment.
	 */
	override addToSchema (schema: Schema): void {
		if (this.options.multiple) {
			this._addArraySchema(schema);
		} else {
			this._addSingleSchema(schema);
		}
	}

	// -------------------------------------------------------------------------
	// _addSingleSchema
	// -------------------------------------------------------------------------

	/**
	 * Adds single-image Cloudinary schema fields to Mongoose.
	 * @param schema - The Mongoose schema to augment.
	 */
	_addSingleSchema (schema: Schema): void {
		const field = this;
		const fieldPath = field.path;
		const _pathHelper = field._path as { addTo(obj: Record<string, unknown>, fields: unknown): Record<string, unknown> };
		const ks = getKeystoneFromList(field.list);

		const paths = {
			public_id: fieldPath + '.public_id', version: fieldPath + '.version',
			signature: fieldPath + '.signature', format: fieldPath + '.format',
			resource_type: fieldPath + '.resource_type', url: fieldPath + '.url',
			width: fieldPath + '.width', height: fieldPath + '.height',
			secure_url: fieldPath + '.secure_url', exists: fieldPath + '.exists',
			folder: fieldPath + '.folder', select: fieldPath + '_select',
			upload: fieldPath + '_upload', action: fieldPath + '_action',
		};
		field.paths = paths;

		const schemaPaths = _pathHelper.addTo({}, {
			public_id: String, version: Number, signature: String, format: String,
			resource_type: String, url: String, width: Number, height: Number, secure_url: String,
		});
		schema.add(schemaPaths as Parameters<Schema['add']>[0]);

		const exists = function (item: { get(path: string): unknown }): boolean {
			return Boolean(item.get(paths.public_id));
		};

		schema.virtual(paths.exists).get(function (this: { get(path: string): unknown }) { return exists(this); });
		schema.virtual(paths.folder).get(function () {
			return field.getFolder();
		});

		const src = function (item: { get(path: string): unknown }, options: Record<string, unknown>): string {
			if (!exists(item)) return '';
			const opts = typeof options === 'object' ? { ...options } : {};
			if (!('fetch_format' in opts) && ks.get('cloudinary webp') !== false) opts.fetch_format = 'auto';
			if (!('progressive' in opts) && ks.get('cloudinary progressive') !== false) opts.progressive = true;
			if (!('secure' in opts) && ks.get('cloudinary secure')) opts.secure = true;
			opts.version = item.get(paths.version);
			opts.format = (opts.format) || (item.get(paths.format));
			return cloudinarySdk.url(item.get(paths.public_id) as string, opts);
		};

		const addSize = function (options: Record<string, unknown>, width: unknown, height: unknown, other: unknown): Record<string, unknown> {
			if (width) options.width = width;
			if (height) options.height = height;
			if (typeof other === 'object' && other !== null) Object.assign(options, other);
			return options;
		};

		const reset = function (item: { set(path: string, value: unknown): void }): void {
			item.set(fieldPath, getEmptyValue());
		};

		const schemaMethods: Record<string, (this: { get(path: string): unknown; set(path: string, value: unknown): void }, ...args: unknown[]) => unknown> = {
			exists: function (this: { get(path: string): unknown }) { return exists(this); },
			folder: function () { return field.getFolder(); },
			src: function (this: { get(path: string): unknown }, options: unknown) { return src(this, options as Record<string, unknown>); },
			tag: function (this: { get(path: string): unknown }, options: unknown) {
				return exists(this) ? cloudinarySdk.image(this.get(paths.public_id) as string, options as Record<string, unknown>) : '';
			},
			scale: function (this: { get(path: string): unknown }, w: unknown, h: unknown, o: unknown) { return src(this, addSize({ crop: 'scale' }, w, h, o)); },
			fill: function (this: { get(path: string): unknown }, w: unknown, h: unknown, o: unknown) { return src(this, addSize({ crop: 'fill', gravity: 'faces' }, w, h, o)); },
			lfill: function (this: { get(path: string): unknown }, w: unknown, h: unknown, o: unknown) { return src(this, addSize({ crop: 'lfill', gravity: 'faces' }, w, h, o)); },
			fit: function (this: { get(path: string): unknown }, w: unknown, h: unknown, o: unknown) { return src(this, addSize({ crop: 'fit' }, w, h, o)); },
			limit: function (this: { get(path: string): unknown }, w: unknown, h: unknown, o: unknown) { return src(this, addSize({ crop: 'limit' }, w, h, o)); },
			pad: function (this: { get(path: string): unknown }, w: unknown, h: unknown, o: unknown) { return src(this, addSize({ crop: 'pad' }, w, h, o)); },
			lpad: function (this: { get(path: string): unknown }, w: unknown, h: unknown, o: unknown) { return src(this, addSize({ crop: 'lpad' }, w, h, o)); },
			crop: function (this: { get(path: string): unknown }, w: unknown, h: unknown, o: unknown) { return src(this, addSize({ crop: 'crop', gravity: 'faces' }, w, h, o)); },
			thumbnail: function (this: { get(path: string): unknown }, w: unknown, h: unknown, o: unknown) { return src(this, addSize({ crop: 'thumb', gravity: 'faces' }, w, h, o)); },
			resetItem: function (this: { set(path: string, value: unknown): void }) { reset(this); },
			delete: function (this: { get(path: string): unknown; set(path: string, value: unknown): void }) {
				const _this = this;
				const promise = new Promise(function (resolve) {
					cloudinarySdk.uploader.destroy(_this.get(paths.public_id) as string, function (result) { resolve(result); });
				});
				reset(this);
				return promise;
			},
			upload: function (this: { get(path: string): unknown }, file: unknown, options: unknown) {
				return new Promise(function (resolve) {
					cloudinarySdk.uploader.upload(file as string, function (result) { resolve(result); }, options as Record<string, unknown>);
				});
			},
		};

		_.forEach(schemaMethods, function (fn, key: string) {
			(field.underscoreMethod as (key: string, fn: (...args: unknown[]) => unknown) => void)(key, fn);
		});

		field.apply = function (item: Record<string, unknown>, method: string, ...args: unknown[]): unknown {
			const fn = schemaMethods[method];
			if (!fn) throw new Error(`Unknown cloudinary method: ${method}`);
			return (fn as (this: Record<string, unknown>, ...a: unknown[]) => unknown).apply(item, args);
		};

		(field.bindUnderscoreMethods as () => void).call(field);
	}

	// -------------------------------------------------------------------------
	// _addArraySchema
	// -------------------------------------------------------------------------

	/**
	 * Adds multi-image Cloudinary array schema fields to Mongoose.
	 * @param schema - The Mongoose schema to augment.
	 */
	_addArraySchema (schema: Schema): void {
		const field = this;
		const fieldPath = field.path;
		const ks = getKeystoneFromList(field.list);
		const mongoose = ks.mongoose;
		const _pathHelper = field._path as { addTo(obj: Record<string, unknown>, fields: unknown): Record<string, unknown> };

		field.paths = {
			folder: fieldPath + '.folder',
			upload: fieldPath + '_upload',
			uploads: fieldPath + '_uploads',
			action: fieldPath + '_action',
		};
		const paths = field.paths;

		const ImageSchema = new mongoose.Schema({
			public_id: String, version: Number, signature: String, format: String,
			resource_type: String, url: String, width: Number, height: Number, secure_url: String,
		});

		schema.virtual(paths.folder ?? '').get(function () {
			return field.getFolder();
		});

		const src = function (img: CloudinaryImageData, options: Record<string, unknown>): string {
			if (ks.get('cloudinary secure')) { options.secure = true; }
			options.format = (options.format) || img.format;
			return img.public_id ? cloudinarySdk.url(img.public_id, options) : '';
		};

		const addSize = function (options: Record<string, unknown>, width: unknown, height: unknown, other: unknown): Record<string, unknown> {
			if (width) options.width = width;
			if (height) options.height = height;
			if (typeof other === 'object' && other !== null) Object.assign(options, other);
			return options;
		};

		ImageSchema.method('src', function (this: CloudinaryImageData, options: Record<string, unknown>) { return src(this, options); });
		ImageSchema.method('scale', function (this: CloudinaryImageData, w: unknown, h: unknown, o: unknown) { return src(this, addSize({ crop: 'scale' }, w, h, o)); });
		ImageSchema.method('fill', function (this: CloudinaryImageData, w: unknown, h: unknown, o: unknown) { return src(this, addSize({ crop: 'fill', gravity: 'faces' }, w, h, o)); });
		ImageSchema.method('lfill', function (this: CloudinaryImageData, w: unknown, h: unknown, o: unknown) { return src(this, addSize({ crop: 'lfill', gravity: 'faces' }, w, h, o)); });
		ImageSchema.method('fit', function (this: CloudinaryImageData, w: unknown, h: unknown, o: unknown) { return src(this, addSize({ crop: 'fit' }, w, h, o)); });
		ImageSchema.method('limit', function (this: CloudinaryImageData, w: unknown, h: unknown, o: unknown) { return src(this, addSize({ crop: 'limit' }, w, h, o)); });
		ImageSchema.method('pad', function (this: CloudinaryImageData, w: unknown, h: unknown, o: unknown) { return src(this, addSize({ crop: 'pad' }, w, h, o)); });
		ImageSchema.method('lpad', function (this: CloudinaryImageData, w: unknown, h: unknown, o: unknown) { return src(this, addSize({ crop: 'lpad' }, w, h, o)); });
		ImageSchema.method('crop', function (this: CloudinaryImageData, w: unknown, h: unknown, o: unknown) { return src(this, addSize({ crop: 'crop', gravity: 'faces' }, w, h, o)); });
		ImageSchema.method('thumbnail', function (this: CloudinaryImageData, w: unknown, h: unknown, o: unknown) { return src(this, addSize({ crop: 'thumb', gravity: 'faces' }, w, h, o)); });

		schema.add(_pathHelper.addTo({}, [ImageSchema]) as Parameters<Schema['add']>[0]);

		field.removeImage = function (
			item: { get(path: string): unknown; save(): Promise<unknown> },
			id: number | string,
			method: string,
			callback?: (err?: unknown) => void,
		): void {
			const images = item.get(fieldPath) as CloudinaryImageData[];
			if (typeof id !== 'number') {
				for (let i = 0; i < images.length; i++) {
					if (images[i]?.public_id === id) { id = i; break; }
				}
			}
			const img = images[id as number];
			if (!img) return;
			if (method === 'delete') {
				cloudinarySdk.uploader.destroy(img.public_id, function () {});
			}
			images.splice(id as number, 1);
			if (callback) {
				Promise.resolve()
					.then(function saveRemovedImage() { return item.save(); })
					.then(function () { callback(); }, callback);
			}
		};

		(field.underscoreMethod as (key: string, fn: (...args: unknown[]) => unknown) => void)(
			'remove',
			function (this: { get(path: string): unknown; save(): Promise<unknown> }, id: unknown, callback: unknown) {
				field.removeImage(this, id as number | string, 'remove', callback as (err?: unknown) => void);
			},
		);
		(field.underscoreMethod as (key: string, fn: (...args: unknown[]) => unknown) => void)(
			'delete',
			function (this: { get(path: string): unknown; save(): Promise<unknown> }, id: unknown, callback: unknown) {
				field.removeImage(this, id as number | string, 'delete', callback as (err?: unknown) => void);
			},
		);

		(field.bindUnderscoreMethods as () => void).call(field);
	}

	// -------------------------------------------------------------------------
	// format
	// -------------------------------------------------------------------------

	/**
	 * Returns a comma-separated string of image URLs for display.
	 * @param item - The Mongoose document.
	 * @returns Formatted image URLs.
	 */
	override format (item: MongooseDocument): string {
		if (this.options.multiple) {
			return _.map(
				item.get(this.path) as CloudinaryImageData[],
				function (img: CloudinaryImageData) { return img.src?.() ?? ''; },
			).join(', ');
		}
		return item.get(this.paths.url ?? '') as string;
	}

	// -------------------------------------------------------------------------
	// getData
	// -------------------------------------------------------------------------

	/**
	 * Extracts the Cloudinary image data from a document.
	 * @param item - The document containing the field value.
	 * @param item.get - Method to retrieve a field value by path.
	 * @returns The image data object or array.
	 */
	override getData (item: { get: (p: string) => unknown }): CloudinaryImageData {
		const value = item.get(this.path);
		if (this.options.multiple) {
			return (Array.isArray(value) ? value : []) as unknown as CloudinaryImageData;
		}
		return (typeof value === 'object' ? value : {}) as CloudinaryImageData;
	}

	// -------------------------------------------------------------------------
	// getOptions — calls super then augments
	// -------------------------------------------------------------------------

	/**
	 * Returns field options augmented with Cloudinary settings.
	 * @returns The merged options object.
	 */
	override getOptions (): Record<string, unknown> {
		const result = super.getOptions();
		const ks = getKeystoneFromList(this.list);
		result.multiple = Boolean(this.options.multiple);
		if ('secure' in this.options) {
			result.secure = this.options.secure;
		} else if (ks.get('cloudinary secure')) {
			result.secure = ks.get('cloudinary secure');
		}
		return result;
	}

	// -------------------------------------------------------------------------
	// isModified
	// -------------------------------------------------------------------------

	/**
	 * Checks whether the Cloudinary field has been modified on the document.
	 * @param item - The Mongoose document.
	 * @returns Whether the public_id path is modified.
	 */
	override isModified (item: MongooseDocument): boolean {
		return item.isModified(this.paths.public_id ?? '');
	}

	// -------------------------------------------------------------------------
	// validateInput
	// -------------------------------------------------------------------------

	/**
	 * Validates submitted input data for this field.
	 * @param data - The submitted form data.
	 * @param callback - Validation result callback.
	 */
	override validateInput (data: Record<string, unknown>, callback: (valid: boolean) => void): void {
		const value = this.getValueFromData(data);
		const valid = this.options.multiple && Array.isArray(value)
			? value.every(validateInputValue)
			: validateInputValue(value);
		defer(callback, valid);
	}

	/**
	 * Validates that required input is present for this field.
	 * @param _item - Unused; the Mongoose document.
	 * @param _data - Unused; the submitted form data.
	 * @param callback - Validation result callback.
	 */
	override validateRequiredInput (_item: MongooseDocument, _data: Record<string, unknown>, callback: (valid: boolean) => void): void {
		defer(callback, true);
	}

	/**
	 * Always returns true — Cloudinary input validity is handled by validateInput.
	 * @returns Always true.
	 */
	override inputIsValid (): boolean { return true; }

	// -------------------------------------------------------------------------
	// updateItem — dispatch
	// -------------------------------------------------------------------------

	/**
	 * Updates the item from submitted data (handles upload/remove/set).
	 * NOTE: This method intentionally has a 4th `files` parameter so the
	 * dispatch layer in `lib/list/updateItem.mts` (which checks `.length > 3`)
	 * passes the uploaded-files map automatically. It overrides the base
	 * 3-param signature with a compatible superset (the `files` slot accepts
	 * the callback when called without files, preserving the base contract).
	 * @param item - The Mongoose document to update.
	 * @param data - The submitted form data.
	 * @param filesOrCallback - Uploaded files map, callback when called without files, or undefined when no upload files were passed.
	 * @param callback - Optional callback when files map is provided.
	 */
	override updateItem(
		item: MongooseDocument,
			data: Record<string, unknown>,
			filesOrCallback: Record<string, UploadedFile> | ((err?: unknown) => void) | undefined,
		callback?: (err?: unknown) => void,
	): void {
		let files: Record<string, UploadedFile>;
		let cb: (err?: unknown) => void;

		if (typeof filesOrCallback === 'function') {
			cb = filesOrCallback;
			files = {};
		} else {
			cb = callback ?? function () {};
			files = filesOrCallback ?? {};
		}

		if (this.options.multiple) {
			this._updateItemMulti(item as unknown as Record<string, unknown>, data, files, cb);
		} else {
			this._updateItemSingle(item as unknown as Record<string, unknown>, data, files, cb);
		}
	}

	// -------------------------------------------------------------------------
	// _updateItemSingle
	// -------------------------------------------------------------------------

	/**
	 * Updates a single-image Cloudinary field from submitted data.
	 * @param item - The document being updated.
	 * @param data - The submitted form data.
	 * @param files - Uploaded files map or callback.
	 * @param callback - Callback on completion.
	 */
	_updateItemSingle (
		item: Record<string, unknown>,
		data: Record<string, unknown>,
		files: Record<string, UploadedFile> | ((err?: unknown) => void),
		callback: (err?: unknown) => void,
	): void {
		if (typeof files === 'function') { callback = files; files = {}; }

		const field = this;
		const fieldPath = field.path;
		const paths = field.paths;
		const opts = field.options;
		const ks = getKeystoneFromList(field.list);
		const filesMap = files as Record<string, UploadedFile>;

		let value: unknown = field.getValueFromData(data);
		let uploadedFile: UploadedFile | undefined;

		const itemDoc = item as unknown as { get(path: string): unknown; set(path: string, value: unknown): void };

		if (value === 'remove' || value === 'delete') {
			cloudinarySdk.uploader.destroy(itemDoc.get(paths.public_id ?? '') as string, function (result) {
				if (result.error) { callback(result.error); }
				else { itemDoc.set(fieldPath, getEmptyValue()); callback(); }
			});
			return;
		}

		if (typeof value === 'string' && value.startsWith('upload:')) {
			uploadedFile = filesMap[value.slice(7)];
		} else if (typeof value === 'string' && /^(data:[a-z/]+;base64)|(https?:\/\/)/.test(value)) {
			uploadedFile = { path: value };
		} else {
			uploadedFile = field.getValueFromData(filesMap as unknown as Record<string, unknown>) as UploadedFile | undefined
				?? field.getValueFromData(filesMap as unknown as Record<string, unknown>, '_upload') as UploadedFile | undefined;
		}

		if (uploadedFile && !uploadedFile.path) uploadedFile = undefined;

		if (uploadedFile) {
			let tagPrefix: string = (ks.get('cloudinary prefix') as string | undefined) ?? '';
			const uploadOptions: CloudinaryUploadOptions = { tags: [] };
			if (tagPrefix.length) { uploadOptions.tags.push(tagPrefix); tagPrefix += '_'; }
			uploadOptions.tags.push(tagPrefix + (field.list as KeystoneList & { path: string }).path + '_' + fieldPath);
			if (ks.get('env') !== 'production') uploadOptions.tags.push(tagPrefix + 'dev');
			const folder = field.getFolder();
			if (folder) uploadOptions.folder = folder;

			const uploadedFileFinal = uploadedFile;
			field.getFilename(
				uploadedFileFinal,
				function (err: unknown, filename?: string) {
					if (err) return callback(err);
					if (filename !== undefined) {
						filename = sanitize(filename);
						uploadOptions.public_id = trimSupportedFileExtensions(filename);
					}
					cloudinarySdk.uploader.upload(uploadedFileFinal.path, function (result) {
						if (result.error) { return callback(result.error); }
						else { itemDoc.set(fieldPath, result); return callback(); }
					}, uploadOptions);
				},
			);
			return;
		}

		if (value === null || value === '' || (typeof value === 'object' && !Object.keys(value as Record<string, unknown>).length)) {
			value = getEmptyValue();
		}
		if (typeof value === 'object') itemDoc.set(fieldPath, value);
		defer(callback);

		void opts;
	}

	// -------------------------------------------------------------------------
	// _updateItemMulti
	// -------------------------------------------------------------------------

	/**
	 * Updates a multi-image Cloudinary field from submitted data.
	 * @param item - The document being updated.
	 * @param data - The submitted form data.
	 * @param files - Uploaded files map.
	 * @param callback - Callback on completion.
	 * @returns Nothing.
	 */
	_updateItemMulti (
		item: Record<string, unknown>,
		data: Record<string, unknown>,
		files: Record<string, UploadedFile>,
		callback: (err?: unknown) => void,
	): void {
		const field = this;
		const fieldPath = field.path;
		const opts = field.options;
		const ks = getKeystoneFromList(field.list);
		const itemDoc = item as unknown as { get(path: string): unknown; set(path: string, value: unknown): void };

		let values: unknown = field.getValueFromData(data);
		const oldValues: CloudinaryImageData[] = itemDoc.get(fieldPath) as CloudinaryImageData[];

		if (!values) {
			if (values !== undefined) {
				if (opts.autoCleanup) cleanUp(oldValues, []);
				itemDoc.set(fieldPath, []);
			}
			return process.nextTick(callback);
		}

		if (!Array.isArray(values)) values = [values];
		let valuesArr = values as unknown[];

		let cachedUploadOptions: CloudinaryUploadOptions | undefined;
		function getUploadOptions (): CloudinaryUploadOptions {
			if (cachedUploadOptions) return cachedUploadOptions;
			let tagPrefix: string = (ks.get('cloudinary prefix') as string | undefined) ?? '';
			const uploadOptions: CloudinaryUploadOptions = { tags: [] };
			if (tagPrefix.length) { uploadOptions.tags.push(tagPrefix); tagPrefix += '_'; }
			uploadOptions.tags.push(tagPrefix + (field.list as KeystoneList & { path: string }).path + '_' + fieldPath);
			if (ks.get('env') !== 'production') uploadOptions.tags.push(tagPrefix + 'dev');
			const folder = field.getFolder();
			if (folder) uploadOptions.folder = folder;
			cachedUploadOptions = uploadOptions;
			return uploadOptions;
		}

		valuesArr = valuesArr.map(function (value: unknown) {
			if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
				try { return JSON.parse(value) as unknown; } catch (_e) { /* not JSON */ }
			}
			if (typeof value === 'string') {
				if (value.startsWith('upload:')) return files[value.slice(7)];
				else if (/^(?:(data:[a-z/]+;base64)|(https?:\/\/))/.test(value)) return { path: value };
			}
			return value;
		});
		valuesArr = _.flatten(valuesArr);

		Promise.all(valuesArr.map(function (value: unknown) {
			if (typeof value === 'object' && value !== null && 'public_id' in value) {
				const imgVal = value as CloudinaryImageData;
				if (imgVal.public_id) return Promise.resolve(Object.assign(getEmptyValue(), imgVal));
				else return Promise.resolve(undefined);
			} else if (typeof value === 'object' && value !== null && 'path' in value) {
				const fileVal = value as UploadedFile;
				let uploadOptions: CloudinaryUploadOptions = getUploadOptions();
				if (opts.filenameAsPublicID && fileVal.originalname) {
					uploadOptions = Object.assign({}, uploadOptions, {
						public_id: fileVal.originalname.substring(0, fileVal.originalname.lastIndexOf('.')),
					});
				}
				return new Promise<CloudinaryImageData | undefined>(function (resolve, reject) {
					cloudinarySdk.uploader.upload(fileVal.path, function (result) {
						if (result.error) reject(new Error(result.error.message));
						else resolve(result as CloudinaryImageData);
					}, uploadOptions);
				});
			} else {
				return Promise.resolve(undefined);
			}
		})).then(function (result: (CloudinaryImageData | undefined)[]) {
			cleanUp(oldValues, valuesArr as CloudinaryImageData[]);
			itemDoc.set(fieldPath, result.filter(truthy));
			return callback();
		}, function (err: unknown) {
			cleanUp(oldValues, valuesArr as CloudinaryImageData[]);
			return callback(err);
		});
	}

	// -------------------------------------------------------------------------
	// Single-mode filename machinery
	// -------------------------------------------------------------------------

	/**
	 * Retries generating a unique filename for an uploaded file.
	 * @param attempt - The current retry attempt number.
	 * @param file - The uploaded file descriptor.
	 * @param callback - Callback with the generated filename or error.
	 * @returns Nothing.
	 */
	retryFilename (attempt: number, file: UploadedFile, callback: (err: unknown, name?: string) => void): void {
		const self = this;
		if (attempt > (self.options.retryAttempts ?? 3)) {
			return callback(new Error('Unique filename could not be generated; Maximum attempts exceeded'));
		}
		const generateFilename = self.options.generateFilename;
		if (!generateFilename) return callback(new Error('generateFilename is not configured'));
		// generateFilename is a NormalisedGenerateFilename (file, attempt, callback).
		// UploadedFile is structurally compatible with StorageFile (both have path + optional fields).
		generateFilename(
			file as StorageNameFile,
			attempt,
			function (err: Error | null, filename?: string) {
				if (err) return callback(err);
				self.fileExists(filename as string, function (err2: unknown, exists?: boolean | null) {
					if (err2) return callback(err2);
					if (exists) return self.retryFilename(attempt + 1, file, callback);
					callback(null, filename);
				});
			},
		);
	}

	/**
	 * Generates a filename for an uploaded Cloudinary file.
	 * @param file - The uploaded file descriptor.
	 * @param callback - Callback with the generated filename or error.
	 * @returns Nothing.
	 */
	getFilename (file: UploadedFile, callback: (err: unknown, name?: string) => void): void {
		const self = this;
		const generateFilename = self.options.generateFilename;
		if (!generateFilename) return callback(new Error('generateFilename is not configured'));
		switch (self.options.whenExists) {
			case 'overwrite':
				// generateFilename is a NormalisedGenerateFilename (file, attempt, callback).
				generateFilename(
					file as StorageNameFile,
					0,
					callback as (err: Error | null, name?: string) => void,
				);
				break;
			case 'error':
				generateFilename(
					file as StorageNameFile,
					0,
					function (err: Error | null, filename?: string) {
						if (err) return callback(err);
						self.fileExists(filename as string, function (err2: unknown, result?: boolean | null) {
							if (err2) return callback(err2);
							if (result === true) return callback(new Error('File already exists'));
							callback(null, filename);
						});
					},
				);
				break;
			case 'retry':
				self.retryFilename(0, file, callback);
				break;
		}
	}

	/**
	 * Checks whether a file already exists on Cloudinary.
	 * @param filename - The filename to check.
	 * @param callback - Callback with existence result or error.
	 */
	fileExists (filename: string, callback: (err: unknown, exists?: boolean | null) => void): void {
		cloudinarySdk.api.resource(filename, function (result) {
			if (result.error?.http_code === 404) { callback(null, false); }
			else if (result.error) { callback(result.error, null); }
			else { callback(null, true); }
		});
	}

	// -------------------------------------------------------------------------
	// getRequestHandler (single mode)
	// -------------------------------------------------------------------------

	getRequestHandler (
		item: Record<string, unknown>,
		req: {
			body?: Record<string, string>;
			files?: Record<string, UploadedFile & { size?: number }>;
		},
		paths: Record<string, string> | ((err?: unknown) => void),
		callback?: (err?: unknown) => void,
	): () => void {
		const field = this;
		const fieldPath = field.path;
		const opts = field.options;
		const ks = getKeystoneFromList(field.list);

		if (typeof paths === 'function') { callback = paths; paths = field.paths; }
		callback = callback ?? function () {};

		const resolvedPaths = paths as Record<string, string>;
		const resolvedCallback = callback;
		const itemDoc = item as unknown as { get(path: string): unknown; set(path: string, value: unknown): void; id: unknown };

		const pathAction = resolvedPaths.action ?? '';
		const pathSelect = resolvedPaths.select ?? '';
		const pathUpload = resolvedPaths.upload ?? '';
		const pathFolder = resolvedPaths.folder ?? '';
		const existsPath = field.paths.exists ?? '';

		return function () {
			if (req.body) {
				const action = req.body[pathAction];
				if (action && /^(delete|reset)$/.test(action)) {
					field.apply(item, action);
				}
			}
			if (req.body?.[pathSelect]) {
				cloudinarySdk.api.resource(req.body[pathSelect], function (result) {
					if (result.error) { resolvedCallback(result.error); }
					else { itemDoc.set(fieldPath, result); resolvedCallback(); }
				});
			} else if (req.files?.[pathUpload]?.size) {
				// req.files[pathUpload] is guaranteed non-null by the else-if guard above (.size check).
				// Cast via unknown: UploadedFile is a minimal local interface compatible at runtime.
				const uploadFile = req.files[pathUpload] as unknown as UploadedFile;
				let tp: string = (ks.get('cloudinary prefix') as string | undefined) || '';
				let imageDelete: Promise<unknown> | undefined;
				if (tp.length) tp += '_';
				const uploadOptions: CloudinaryUploadOptions = {
					tags: [
						tp + (field.list as KeystoneList & { path: string }).path + '_' + fieldPath,
						tp + (field.list as KeystoneList & { path: string }).path + '_' + fieldPath + '_' + String(itemDoc.id),
					],
				};
				if (ks.get('cloudinary folders')) {
					uploadOptions.folder = itemDoc.get(pathFolder) as string;
				}
				if (ks.get('cloudinary prefix')) uploadOptions.tags.push(ks.get('cloudinary prefix') as string);
				if (ks.get('env') !== 'production') uploadOptions.tags.push(tp + 'dev');
				if (opts.publicID) {
					const publicIdValue = itemDoc.get(opts.publicID);
					if (publicIdValue) uploadOptions.public_id = publicIdValue as string;
				} else if (opts.filenameAsPublicID) {
					uploadOptions.public_id = (uploadFile.originalname ?? '').substring(0, (uploadFile.originalname ?? '').lastIndexOf('.'));
				}
				if (opts.autoCleanup && itemDoc.get(existsPath)) {
					imageDelete = field.apply(item, 'delete') as Promise<unknown>;
				}
				const uploadComplete = function (result: CloudinaryUploadResult): void {
					if (result.error) { resolvedCallback(result.error); }
					else { itemDoc.set(fieldPath, result); resolvedCallback(); }
				};
				if (typeof imageDelete === 'undefined') {
					void (field.apply(item, 'upload', uploadFile.path, uploadOptions) as Promise<CloudinaryUploadResult>)
						.then(uploadComplete);
				} else {
					void imageDelete.then(function (result: unknown) {
						const r = result as { error?: unknown };
						if (r.error) { resolvedCallback(r.error); }
						else {
							void (field.apply(item, 'upload', uploadFile.path, uploadOptions) as Promise<CloudinaryUploadResult>)
								.then(uploadComplete);
						}
					});
				}
			} else {
				resolvedCallback();
			}
		};
	}
}

export default CloudinaryType;

// ---------------------------------------------------------------------------
// Public-facing type exports
// ---------------------------------------------------------------------------

/**
 * Options bag for the unified Cloudinary field type constructor.
 */
export interface KeystoneFieldOptionsForCloudinaryType extends FieldOptionsBase {
	/**
	 * When `true`, stores an array of sub-documents instead of a flat object.
	 * Default: `false` (single-image mode).
	 */
	multiple?: boolean;
	/** Cloudinary folder to upload images into. */
	folder?: string;
	/**
	 * When `true`, the existing image(s) are deleted from Cloudinary before a
	 * new one is uploaded.
	 */
	autoCleanup?: boolean;
	/**
	 * When `true`, uses the uploaded filename (without extension) as the
	 * Cloudinary `public_id`, and forces `whenExists: 'overwrite'`.
	 */
	filenameAsPublicID?: boolean;
	/**
	 * Path to a field on the document whose value is used as the Cloudinary
	 * `public_id`. Only consumed in single mode's `getRequestHandler`.
	 */
	publicID?: string;
	/** Prefix string for Admin UI select queries (single mode). */
	selectPrefix?: string;
	/** Force secure (https) Cloudinary URLs. */
	secure?: boolean;
	/**
	 * Strategy when a file with the same `public_id` already exists.
	 * Default: `'overwrite'`. (Single mode only.)
	 */
	whenExists?: string;
	/**
	 * Number of retry attempts when generating a unique filename.
	 * Default: 3. (Single mode only.)
	 */
	retryAttempts?: number;
	/**
	 * Custom function to generate a filename for the uploaded file. (Single mode only.)
	 * Must be a normalised three-argument function `(file, attempt, callback)`.
	 * Supply a `RawGenerateFilename` value through code and Keystone will normalise
	 * it via `ensureCallback` at construction time.
	 */
	generateFilename?: NormalisedGenerateFilename;
	/** Reserved for field registry use. */
	type?: unknown;
}

/**
 * Shape of a Cloudinary field instance.
 */
export interface KeystoneFieldForCloudinaryType {
	_underscoreMethods: string[];
	_fixedSize: string;
	_properties: string[];
	options: KeystoneFieldOptionsForCloudinaryType;
	path: string;
	paths: Record<string, string>;
	getFolder(): string | null;
	format(item: { get(path: string): unknown }): string;
	getData(item: { get(path: string): unknown }): Record<string, unknown> | Record<string, unknown>[];
	getOptions(): Record<string, unknown>;
	isModified(item: { isModified(path: string): boolean }): boolean;
	validateInput(data: Record<string, unknown>, callback: (valid: boolean) => void): void;
	validateRequiredInput(item: Record<string, unknown>, data: Record<string, unknown>, callback: (valid: boolean) => void): void;
	inputIsValid(): boolean;
	updateItem(
		item: Record<string, unknown>,
		data: Record<string, unknown>,
		files: Record<string, unknown> | ((err?: unknown) => void),
		callback: (err?: unknown) => void,
	): void;
	getRequestHandler(
		item: Record<string, unknown>,
		req: Record<string, unknown>,
		paths?: Record<string, string>,
		callback?: (err?: unknown) => void,
	): () => void;
	apply(item: Record<string, unknown>, method: string, ...args: unknown[]): unknown;
	removeImage(item: Record<string, unknown>, id: number | string, method: string, callback?: (err?: unknown) => void): void;
}

/**
 * Constructor type for the Cloudinary field type.
 */
export type KeystoneTypeConstructorForCloudinaryType = new(
	list: KeystoneList,
	path: string,
	options: KeystoneFieldOptionsForCloudinaryType,
) => KeystoneFieldForCloudinaryType;

// ---------------------------------------------------------------------------
// Private helper — extracted from validateInput
// ---------------------------------------------------------------------------

function validateInputValue (value: unknown): boolean {
	if (value === undefined || value === null || value === '') return true;
	if (typeof value === 'string' && /^(?:(upload:)|(delete$)|(data:[a-z/]+;base64)|(https?:\/\/))/.test(value)) return true;
	if (typeof value === 'object' && 'public_id' in value) return true;
	return false;
}
