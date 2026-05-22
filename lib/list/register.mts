import schemaPlugins from '../schemaPlugins.mjs';
import UpdateHandler from '../updateHandler.mjs';
import type { UpdateHandlerOptions } from '../updateHandler.mjs';
import bindMethods from '../utils/bindMethods.mjs';
import type { BoundMethodNode } from '../utils/bindMethods.mjs';
import debugLib from 'debug';
import type { Request } from 'express';
import type { KeystoneList } from '../list.mjs';

const debug = debugLib('keystone:core:list:register');

/** Minimal document shape for Mongoose virtual/method `this` contexts in register.mts. */
interface RegisterDoc {
	__methods?: BoundMethodNode;
	[key: string]: unknown;
}

export default function register(this: KeystoneList): KeystoneList {
	const keystone = this.keystone;
	const list = this;

	if (keystone.lists[this.key]) {
		throw new Error('List.register() Error: list "' + this.key + '" is already registered.');
	}
	const existingPathKey = keystone.paths[this.path];
	if (existingPathKey) {
		throw new Error('List.register() Error: path "' + this.path + '" is already registered by list "' + existingPathKey + '".');
	}

	if (this.schema.methods.toCSV) {
		console.warn(this.key + ' Warning: List.schema.methods.toCSV support has been removed from KeystoneJS.\nPlease use getCSVData instead (see the 0.3 -> 4.0 Upgrade Guide)\n');
	}

	if (this.get('sortable')) { schemaPlugins.sortable.apply(this); }
	if (this.get('autokey')) { schemaPlugins.autokey.apply(this); }
	if (this.get('track')) { schemaPlugins.track.apply(this); }
	if (this.get('history')) { schemaPlugins.history.apply(this); }

	// Virtual 'list' — returns the KeystoneList instance for this schema document.
	// The getter closes over `list`; no `this` needed inside the getter body.
	this.schema.virtual('list').get(function () { return list; });

	if (Object.keys(this.relationships).length) {
		this.schema.methods.getRelated = schemaPlugins.methods.getRelated as unknown as typeof this.schema.methods[string];
		this.schema.methods.populateRelated = schemaPlugins.methods.populateRelated as unknown as typeof this.schema.methods[string];
		// Mongoose's Schema type does not expose `options` in @types/mongoose, but the
		// property exists at runtime and is the standard way to set toObject transforms.
		// JUSTIFIED: schema.options is a Mongoose runtime property not declared in
		// @types/mongoose — cast through the minimal SchemaWithToObjectOptions type.
		const schemaWithOpts = this.schema as unknown as {
			options: { toObject?: { transform?: typeof schemaPlugins.options.transform } };
		};
		if (!schemaWithOpts.options.toObject) schemaWithOpts.options.toObject = {};
		schemaWithOpts.options.toObject.transform = schemaPlugins.options.transform;
	}

	// Virtual '_' — underscore-method dispatch.  `this` is the Mongoose document;
	// `__methods` is lazily bound on first access via the legacy-compatible helper.
	// JUSTIFIED: `this` uses `RegisterDoc` (a local minimal interface) rather than
	// a full Mongoose Document generic — the schema.virtual getter callback does not
	// receive Mongoose's generic TDoc type parameter at this call site.
	this.schema.virtual('_').get(function (this: RegisterDoc) {
		if (!this.__methods) {
			this.__methods = bindMethods(list.underscoreMethods, this);
		}
		return this.__methods;
	});

	// schema.method 'getUpdateHandler' — factory that produces an UpdateHandler
	// bound to the current document (`this`), the incoming request, and options.
	// `res` is accepted for API compatibility but is not forwarded to UpdateHandler
	// (UpdateHandler's constructor is (list, item, req, options?)).
	this.schema.method('getUpdateHandler', function (
		this: RegisterDoc,
		req: Request,
		_res: unknown,
		ops?: UpdateHandlerOptions
	) {
		return new UpdateHandler(list, this, req, ops);
	});

	if (this.get('inherits')) {
		const inheritedModel = (this.get('inherits') as KeystoneList).model.discriminator(this.key, this.schema);
		this.model = inheritedModel as unknown as typeof this.model;
	} else {
		this.model = keystone.mongoose.model(this.key, this.schema);
	}

	if (this.options.searchUsesTextIndex && !this.declaresTextIndex()) {
		this.ensureTextIndex(function (err?: Error | null) {
			if (err) {
				console.error('this.ensureTextIndex() failed for \'' + list.key + '\':\n', err.message, (err as Error & { stack?: string }).stack);
				return;
			}
			debug('this.ensureTextIndex() done for \'' + list.key + '\'');
		});
	}

	keystone.lists[this.key] = this;
	keystone.paths[this.path] = this.key;
	Object.assign(keystone.fieldTypes, this.fieldTypes);

	this.model.on('index', function (err: Error | null) {
		if (err) console.error('Mongoose model \'index\' event fired on \'' + list.key + '\' with error:\n', err.message, (err as Error & { stack?: string }).stack);
	});
	this.model.on('index-single-start', function (index: unknown) {
		debug('Mongoose model \'index-single-start\' event fired on \'' + list.key + '\' for index:\n', index);
	});
	this.model.on('index-single-done', function (err: Error | null, index: unknown) {
		if (err) console.error('Mongoose model \'index-single-done\' event fired on \'' + list.key + '\' for index:\n', index, '\nWith error:\n', err.message, (err as Error & { stack?: string }).stack);
		else debug('Mongoose model \'index-single-done\' event fired on \'' + list.key + '\' for index:\n', index);
	});
	this.model.on('error', function (err: Error | null) {
		if (err) console.error('Mongoose model \'error\' event fired on \'' + list.key + '\' with error:\n', err.message, (err as Error & { stack?: string }).stack);
	});

	return this;
}
