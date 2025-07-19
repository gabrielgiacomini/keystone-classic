/**
 * @fileoverview The main entry point for the KeystoneJS framework.
 *
 * This file initializes a new Keystone instance, configures it with default
 * settings, and extends it with the core functionality required to run a
 * Keystone application. It also exposes the major components of the framework
 * such as `List`, `Field`, and `View`.
 *
 * The exported `keystone` object is a singleton instance of the `Keystone`
 * class, which is the main interface for developers to interact with the
 * framework.
 */

var _ = require('lodash');
var express = require('express');
var grappling = require('grappling-hook');
var path = require('path');
var utils = require('keystone-utils');
var importer = require('./lib/core/importer');

/**
 * Don't use process.cwd() as it breaks module encapsulation
 * Instead, let's use module.parent if it's present, or the module itself if there is no parent (probably testing keystone directly if that's the case)
 * This way, the consuming app/module can be an embedded node_module and path resolutions will still work
 * (process.cwd() breaks module encapsulation if the consuming app/module is itself a node_module)
 */
var moduleRoot = (function (_rootPath) {
	var parts = _rootPath.split(path.sep);
	parts.pop(); // get rid of /node_modules from the end of the path
	return parts.join(path.sep);
})(module.parent ? module.parent.paths[0] : module.paths[0]);

/**
 * The main Keystone class.
 *
 * @class Keystone
 * @property {Object} lists - A map of all registered `List` instances.
 * @property {Object} fieldTypes - A map of all registered `Field` types.
 * @property {Object} paths - A map of common paths for the application.
 * @property {Object} _options - Internal storage for Keystone's configuration options.
 * @property {Object} _redirects - A map of URL redirects.
 * @property {Function} express - The Express framework constructor.
 */
var Keystone = function () {
	// Inherit from GrapplingHook for event handling.
	grappling
		.mixin(this)
		.allowHooks(
			'pre:static',
			'pre:bodyparser',
			'pre:session',
			'pre:logger',
			'pre:admin',
			'pre:adminroutes',
			'pre:routes',
			'pre:render',
			'updates',
			'signin',
			'signout'
		);

	// Initialize instance properties.
	this.lists = {};
	this.fieldTypes = {};
	this.paths = {};
	this._options = {
		'name': 'Keystone',
		'brand': 'Keystone',
		'admin path': 'keystone',
		'compress': true,
		'headless': false,
		'logger': ':method :url :status :response-time ms',
		'auto update': false,
		'model prefix': null,
		'module root': moduleRoot,
		'frame guard': 'sameorigin',
		'cache admin bundles': true,
		'handle uploads': true,
	};
	this._redirects = {};

	// Expose Express to the Keystone instance.
	this.express = express;

	// Initialize environment defaults.
	// These are typically set via process.env variables.
	this.set('env', process.env.NODE_ENV || 'development');

	// Set default server port and host.
	this.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || '3000');
	this.set('host', process.env.HOST || process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
	this.set('listen', process.env.LISTEN);

	// Set SSL configuration.
	this.set('ssl', process.env.SSL);
	this.set('ssl port', process.env.SSL_PORT || '3001');
	this.set('ssl host', process.env.SSL_HOST || process.env.SSL_IP);
	this.set('ssl key', process.env.SSL_KEY);
	this.set('ssl cert', process.env.SSL_CERT);

	// Set cookie secret and sign-in behavior.
	this.set('cookie secret', process.env.COOKIE_SECRET);
	this.set('cookie signin', this.get('env') === 'development' ? true : false);

	// Set API keys for various services.
	this.set('embedly api key', process.env.EMBEDLY_API_KEY || process.env.EMBEDLY_APIKEY);
	this.set('mandrill api key', process.env.MANDRILL_API_KEY || process.env.MANDRILL_APIKEY);
	this.set('mandrill username', process.env.MANDRILL_USERNAME);
	this.set('google api key', process.env.GOOGLE_BROWSER_KEY);
	this.set('google server api key', process.env.GOOGLE_SERVER_KEY);
	this.set('ga property', process.env.GA_PROPERTY);
	this.set('ga domain', process.env.GA_DOMAIN);
	this.set('chartbeat property', process.env.CHARTBEAT_PROPERTY);
	this.set('chartbeat domain', process.env.CHARTBEAT_DOMAIN);
	this.set('allowed ip ranges', process.env.ALLOWED_IP_RANGES);

	// Configure S3 storage if credentials are provided.
	if (process.env.S3_BUCKET && process.env.S3_KEY && process.env.S3_SECRET) {
		this.set('s3 config', {
			bucket: process.env.S3_BUCKET,
			key: process.env.S3_KEY,
			secret: process.env.S3_SECRET,
			region: process.env.S3_REGION,
		});
	}

	// Configure Azure storage if credentials are provided.
	if (process.env.AZURE_STORAGE_ACCOUNT && process.env.AZURE_STORAGE_ACCESS_KEY) {
		this.set('azurefile config', {
			account: process.env.AZURE_STORAGE_ACCOUNT,
			key: process.env.AZURE_STORAGE_ACCESS_KEY,
		});
	}

	// Configure Cloudinary if the URL is provided.
	if (process.env.CLOUDINARY_URL) {
		// process.env.CLOUDINARY_URL is processed by the cloudinary package when this is set
		this.set('cloudinary config', true);
	}

	// Initialize Mongoose.
	this.set('mongoose', require('mongoose'));
	this.mongoose.Promise = require('es6-promise').Promise;

	// Configure Mongoose to use modern methods and prevent deprecation warnings.
	this.mongoose.set('useCreateIndex', true);

	// Attach middleware packages, bound to this instance.
	this.middleware = {
		api: require('./lib/middleware/api')(this),
		cors: require('./lib/middleware/cors')(this),
	};
};

// Extend Keystone.prototype with methods from lib/core/options.js
_.extend(Keystone.prototype, require('./lib/core/options'));

/**
 * Prefixes a model key with the `model prefix` option.
 *
 * @param {String} key
 * @returns {String} The prefixed key.
 */
Keystone.prototype.prefixModel = function (key) {
	var modelPrefix = this.get('model prefix');
	if (modelPrefix) {
		key = modelPrefix + '_' + key;
	}
	return require('mongoose/lib/utils').toCollectionName(key);
};

/* Attach core functionality to Keystone.prototype */
Keystone.prototype.createItems = require('./lib/core/createItems');
Keystone.prototype.createRouter = require('./lib/core/createRouter');
Keystone.prototype.getOrphanedLists = require('./lib/core/getOrphanedLists');
Keystone.prototype.importer = importer;
Keystone.prototype.init = require('./lib/core/init');
Keystone.prototype.initDatabaseConfig = require('./lib/core/initDatabaseConfig');
Keystone.prototype.initExpressApp = require('./lib/core/initExpressApp');
Keystone.prototype.initExpressSession = require('./lib/core/initExpressSession');
Keystone.prototype.initNav = require('./lib/core/initNav');
Keystone.prototype.list = require('./lib/core/list');
Keystone.prototype.openDatabaseConnection = require('./lib/core/openDatabaseConnection');
Keystone.prototype.closeDatabaseConnection = require('./lib/core/closeDatabaseConnection');
Keystone.prototype.populateRelated = require('./lib/core/populateRelated');
Keystone.prototype.redirect = require('./lib/core/redirect');
Keystone.prototype.start = require('./lib/core/start');
Keystone.prototype.wrapHTMLError = require('./lib/core/wrapHTMLError');
Keystone.prototype.createKeystoneHash = require('./lib/core/createKeystoneHash');

/* Deprecation / Change warnings for 0.4 */
/**
 * @deprecated `keystone.routes` has been removed. Use `keystone.set('routes', fn)`.
 */
Keystone.prototype.routes = function () {
	throw new Error('keystone.routes(fn) has been removed, use keystone.set(\'routes\', fn)');
};

/**
 * The primary export of the KeystoneJS module is an instance of the Keystone class.
 *
 * @name keystone
 * @type {Keystone}
 */
var keystone = (module.exports = new Keystone());

/*
	Note: until #1777 is complete, the order of execution here with the requires
	(specifically, they happen _after_ the module.exports above) is really
	important. As soon as the circular dependencies are sorted out to get their
	keystone instance from a closure or reference on {this} we can move these
	bindings into the Keystone constructor.
*/

// Expose modules and Classes
/** @member {Object} */
keystone.Admin = {
	Server: require('./admin/server'),
};
/** @member {Email} */
keystone.Email = require('./lib/email');
/** @member {Field} */
keystone.Field = require('./fields/types/Type');
/** @member {Object} */
keystone.Field.Types = require('./lib/fieldTypes');
/** @member {Keystone} */
keystone.Keystone = Keystone;
/** @member {List} */
keystone.List = require('./lib/list')(keystone);
/** @member {Storage} */
keystone.Storage = require('./lib/storage');
/** @member {View} */
keystone.View = require('./lib/view');

/** @member {Object} */
keystone.content = require('./lib/content');
/** @member {Object} */
keystone.security = {
	csrf: require('./lib/security/csrf'),
};
/** @member {Object} */
keystone.utils = utils;

/**
 * Imports all .js modules in a directory path.
 *
 * The path is resolved relative to the `module root` option, which defaults
 * to the root of the consuming project.
 *
 * @param {String} dirname The path to import modules from.
 * @returns {Object} An object containing the imported modules.
 * @example
 * var models = keystone.import('models');
 */
Keystone.prototype.import = function (dirname) {
	return importer(this.get('module root'))(dirname);
};

/**
 * Applies application updates.
 *
 * This method is used to apply database updates and other patches during
 * development and deployment.
 *
 * @param {Function} callback
 */
Keystone.prototype.applyUpdates = function (callback) {
	var self = this;
	self.callHook('pre:updates', function (err) {
		if (err) return callback(err);
		require('./lib/updates').apply(function (err) {
			if (err) return callback(err);
			self.callHook('post:updates', callback);
		});
	});
};

/**
 * Logs a configuration error to the console.
 *
 * @param {String} type The type of error.
 * @param {String} msg The error message.
 */
Keystone.prototype.console = {};
Keystone.prototype.console.err = function (type, msg) {
	if (keystone.get('logger')) {
		var dashes = '\n------------------------------------------------\n';
		console.log(dashes + 'KeystoneJS: ' + type + ':\n\n' + msg + dashes);
	}
};

/**
 * The version of the KeystoneJS framework.
 *
 * @property {String} version
 */
keystone.version = require('./package.json').version;

// Expose session management module.
/** @member {Object} */
keystone.session = require('./lib/session');
