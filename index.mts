/**
 * @file The main entry point for the KeystoneJS framework.
 *
 * This file initializes a new Keystone instance, configures it with default
 * settings, and extends it with the core functionality required to run a
 * Keystone application. It also exposes the major components of the framework
 * such as `List`, `Field`, and `View`.
 *
 * The exported `keystone` object is a singleton instance of the `Keystone`
 * class, which is the main interface for developers to interact with the
 * framework.
 * @module keystone
 */

import express from 'express';
import { EventEmitter } from 'events';
import path from 'node:path';
import pkg from './package.json' with { type: 'json' };
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import mongoose from 'mongoose';
import utils from './lib/utils/keystoneUtils.mjs';
import type { KeystoneUtils } from './lib/utils/keystoneUtils.mjs';

import importer from './lib/core/importer.mjs';
import { installHooks, type Hookable } from './lib/core/hooks.mjs';
import optionsMethods from './lib/core/options.mjs';
import createItems from './lib/core/createItems.mjs';
import createRouter from './lib/core/createRouter.mjs';
import getOrphanedLists from './lib/core/getOrphanedLists.mjs';
import init from './lib/core/init.mjs';
import initDatabaseConfig from './lib/core/initDatabaseConfig.mjs';
import initExpressApp from './lib/core/initExpressApp.mjs';
import initExpressSession from './lib/core/initExpressSession.mjs';
import initExpressSessionAsync from './lib/core/initExpressSessionAsync.mjs';
import initNav from './lib/core/initNav.mjs';
import list from './lib/core/list.mjs';
import openDatabaseConnection from './lib/core/openDatabaseConnection.mjs';
import closeDatabaseConnection from './lib/core/closeDatabaseConnection.mjs';
import populateRelated from './lib/core/populateRelated.mjs';
import redirect from './lib/core/redirect.mjs';
import start from './lib/core/start.mjs';
import wrapHTMLError from './lib/core/wrapHTMLError.mjs';
import createKeystoneHash from './lib/core/createKeystoneHash.mjs';

import apiMiddleware from './lib/middleware/api.mjs';
import corsMiddleware from './lib/middleware/cors.mjs';

import AdminServer from './admin/server/index.mjs';
import type { KeystoneAdminServer } from './admin/server/index.mjs';
import Email from './lib/email.mjs';
import Field from './fields/types/Type.mjs';
import FieldTypes from './lib/fieldTypes.mjs';
import listFactory from './lib/list.mjs';
import Storage from './lib/storage/index.mjs';
import View from './lib/view.mjs';
import content from './lib/content/index.mjs';
import type { Content } from './lib/content/index.mjs';
import csrf from './lib/security/csrf.mjs';
import session from './lib/session.mjs';
import updates from './lib/updates.mjs';

import type { Callback } from './types/keystone-callbacks.js';
import type { KeystoneOptions } from './lib/core/options-types.js';
import type { KeystoneList, KeystoneListConstructor } from './lib/list.mjs';
import type { FieldTypesMap } from './lib/fieldTypes.mjs';
import type { KeystoneSessionModule } from './lib/session.mjs';
import type { NavResult } from './lib/core/initNav.mjs';
import type { Server as HttpServer } from 'http';

export type { KeystoneOptions, KeystoneGlobalOptions, ExplicitListOptions, TrackOptions, AutokeySpec } from './lib/core/options-types.js';
export type { FieldTypesMap } from './lib/fieldTypes.mjs';
export type { KeystoneUtils } from './lib/utils/keystoneUtils.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Don't use process.cwd() as it breaks module encapsulation.
 *
 * Derive the module root from the location of this file. When Keystone is
 * consumed as a node_module, this resolves to the consuming project's root
 * by walking up out of `node_modules`.
 */
const moduleRoot = (function (_rootPath) {
	const parts = _rootPath.split(path.sep);
	const nmIdx = parts.lastIndexOf('node_modules');
	if (nmIdx >= 0) {
		return parts.slice(0, nmIdx).join(path.sep);
	}
	if (path.basename(_rootPath) === 'dist') {
		return path.dirname(_rootPath);
	}
	return _rootPath;
})(__dirname);

// ---------------------------------------------------------------------------
// Global ambient registry — consumers populate this in their own code:
//
//   declare global {
//     interface KeystoneLists {
//       User: KeystoneList;
//       Post: KeystoneList;
//     }
//   }
//
// Until at least one list is declared, `keystone.list(key)` is a compile
// error by design — this forces consumers to register their lists explicitly.
// ---------------------------------------------------------------------------

declare global {
	/**
	 * Registry of all Keystone lists in the current application.
	 *
	 * Consumers populate this interface with their own list definitions:
	 *
	 * @example
	 * ```ts
	 * declare global {
	 *   interface KeystoneLists {
	 *     User: KeystoneList; // replace with the precise list type once Phase 3 lands
	 *     Post: KeystoneList;
	 *   }
	 * }
	 * ```
	 *
	 * Until at least one list is declared, `keystone.list(key)` will be a compile
	 * error — by design. This forces consumers to declare their list registry
	 * explicitly rather than relying on implicit string lookup.
	 */
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface KeystoneLists {}
}

// ---------------------------------------------------------------------------
// Interface declaration — merged with the Keystone class below.
// This lets the constructor body call methods provided via Object.assign
// (e.g. this.set / this.get from optionsMethods) without TypeScript errors.
// ---------------------------------------------------------------------------

/** @interface */
export interface Keystone extends Hookable {
	// ---- lifecycle hook methods (mixed in at construction time) ----

	// ---- options methods (from lib/core/options.mjs) ----
	set<K extends keyof KeystoneOptions>(key: K, value: KeystoneOptions[K]): this;
	set(key: string, value: unknown): this;
	get<K extends keyof KeystoneOptions>(key: K): KeystoneOptions[K];
	get(key: string): unknown;
	options(options?: Partial<KeystoneOptions>): this | KeystoneOptions;
	getPath(key: string, defaultPath?: string): string;
	expandPath(pathValue: string): string;
	initConfig(): this;

	// ---- core methods (from lib/core/*.mjs) ----
	createItems(data: Record<string, unknown>, ops?: Record<string, unknown> | Callback<object>, callback?: Callback<object>): void;
	createRouter(): unknown;
	getOrphanedLists(): unknown[];
	importer(dirname: string): (paths: string) => Promise<unknown>;
	init(options?: Partial<KeystoneOptions>): this;
	initDatabaseConfig(): this;
	initExpressApp(customApp?: unknown): this;
	/**
	 * @deprecated Use `keystone.initExpressSessionAsync(mongoose)` instead. The synchronous variant remains for backward compatibility with callers that haven't migrated yet, but it has a brief MemoryStore-backed window for `session store: "mongo"|"redis"` before the real store resolves via `sessionStorePromise`. The async variant returns only after the real store is ready, with no proxy fallback.
	 */
	initExpressSession(mongoose?: unknown): this;
	initExpressSessionAsync(mongoose?: unknown): Promise<this>;
	initNav(sections?: unknown): NavResult;
	list<K extends keyof KeystoneLists>(key: K): KeystoneLists[K];
	/** @deprecated Prefer declaring the list key in the global `KeystoneLists` interface for typed access. */
	list(key: string): KeystoneList;
	openDatabaseConnection(callback: () => void): void;
	closeDatabaseConnection(callback?: () => void): void;
	populateRelated(docs: unknown, relationships: unknown, callback: Callback): this;
	redirect(key: string, val: unknown): this;
	start(events?: Record<string, () => void> | (() => void)): this;
	wrapHTMLError(type: string, msg?: string): string;
	createKeystoneHash(): string;

	// ---- instance methods defined below ----
	prefixModel(key: string): string;
	routes(): never;
	import(dirname: string): Promise<unknown>;
	applyUpdates(callback: Callback): void;
	console: { err(type: string, msg: string): void };

	// ---- properties attached post-construction ----
	/** Field-type registry alias. Prefer `keystone.Field.Types` for Keystone 4 parity. */
	Types: FieldTypesMap;
	/** Field constructor with field-type registry. */
	Field: typeof Field & { Types: FieldTypesMap };
	/** Session helpers (signinWithUser, signin, signout, persist, keystoneAuth). */
	session: KeystoneSessionModule;
	/** List constructor. Use `new keystone.List(key, options)` to register a new Keystone list. */
	List: KeystoneListConstructor;
	/** Admin router factories. */
	Admin: { Server: KeystoneAdminServer };
	/** Content module for managing CMS page content. */
	content: Content;
	/** Legacy Keystone utility helpers exposed as `keystone.utils`. */
	utils: KeystoneUtils;

	// ---- runtime-initialised properties ----
	/** The Express application. Assigned by createApp() once the server starts. */
	app?: express.Application;
	/** The express-session middleware. Lazily initialised by initExpressSession(). */
	expressSession?: express.RequestHandler;
	/** Resolves when the async session store (mongo/redis) is ready. Undefined for MemoryStore. */
	sessionStorePromise?: Promise<void>;
	/** Navigation structure. Set when the "nav" option is configured via initNav(). */
	nav?: NavResult;
	/** HTTP server instance. Assigned by startHTTPServer or startSocketServer. */
	httpServer?: HttpServer;
	/** HTTPS server instance. Assigned by startSecureServer. */
	httpsServer?: HttpServer;
}

/**
 * The main Keystone class.
 * @class Keystone
 */
export class Keystone extends EventEmitter {
	lists: Record<string, KeystoneList>;
	fieldTypes: Record<string, unknown>;
	paths: Record<string, string>;
	_options: KeystoneOptions;
	_redirects: Record<string, string>;
	express: typeof express;
	app?: express.Application;
	expressSession?: express.RequestHandler;
	sessionStorePromise?: Promise<void>;
	mongoose!: typeof mongoose;
	middleware: { api: unknown; cors: unknown };

	// These are attached after construction (see bottom of file)
	version!: string;
	Admin!: { Server: KeystoneAdminServer };
	Email!: unknown;
	Types!: FieldTypesMap;
	Field!: typeof Field & { Types: FieldTypesMap };
	Keystone!: typeof Keystone;
	List!: KeystoneListConstructor;
	Storage!: unknown;
	View!: unknown;
	content!: Content;
	security!: { csrf: typeof csrf };
	utils!: KeystoneUtils;
	session!: KeystoneSessionModule;

	constructor () {
		super();

		// Install lifecycle hook helpers for event handling.
		installHooks(this)
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
			'admin legacy path': 'keystone',
			'admin next path': 'keystone-next',
			'admin api path': 'keystone-api',
			'admin ui': 'legacy',
			'admin legacy api alias': true,
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
		this.set('cookie signin', this.get('env') === 'development');

		// Set API keys for various services.
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

		// Configure Cloudinary if the URL is provided.
		if (process.env.CLOUDINARY_URL) {
			this.set('cloudinary config', true);
		}

		// Initialize Mongoose.
		this.set('mongoose', mongoose);

		// Attach middleware packages, bound to this instance.
		// The `as Keystone` cast is safe: the constructor declares the same interface
		// that apiMiddleware/corsMiddleware require. The prototype methods are already
		// mixed in via Object.assign before `new Keystone()` is called in consumer code.
		this.middleware = {
			api: apiMiddleware(this as unknown as Keystone),
			cors: corsMiddleware(this as unknown as Keystone),
		};
	}
}

// Extend Keystone.prototype with methods from lib/core/options.mjs
Object.assign(Keystone.prototype, optionsMethods);

/**
 * Prefixes a model key with the `model prefix` option.
 * @param key The model key to prefix.
 * @returns The prefixed and collection-name-formatted key.
 */
Keystone.prototype.prefixModel = function (key: string): string {
	const modelPrefix = this.get('model prefix') as string | null;
	if (modelPrefix) {
		key = modelPrefix + '_' + key;
	}
	return key;
};

/* Attach core functionality to Keystone.prototype */
Keystone.prototype.createItems = createItems;
Keystone.prototype.createRouter = createRouter;
Keystone.prototype.getOrphanedLists = getOrphanedLists;
Keystone.prototype.importer = importer;
Keystone.prototype.init = init;
Keystone.prototype.initDatabaseConfig = initDatabaseConfig;
// These standalone functions use `this: Keystone` internally. The interface declares
// them with return type `this` (polymorphic). At the prototype level the concrete
// return type is `Keystone`, which is equivalent at runtime but requires an explicit
// cast to satisfy the polymorphic-this constraint.
Keystone.prototype.initExpressApp = initExpressApp as unknown as typeof Keystone.prototype.initExpressApp;
(Keystone.prototype as unknown as Record<string, unknown>).initExpressSession = initExpressSession;
Keystone.prototype.initExpressSessionAsync = initExpressSessionAsync as unknown as typeof Keystone.prototype.initExpressSessionAsync;
Keystone.prototype.initNav = initNav as unknown as typeof Keystone.prototype.initNav;
// Cast needed: the runtime implementation accepts any string key (including path aliases),
// but the public signature is generic over KeystoneLists. The implementation always returns
// KeystoneList (or throws), so this cast is safe.
(Keystone.prototype as unknown as Record<string, unknown>).list = list;
Keystone.prototype.openDatabaseConnection = openDatabaseConnection;
Keystone.prototype.closeDatabaseConnection = closeDatabaseConnection;
Keystone.prototype.populateRelated = populateRelated;
Keystone.prototype.redirect = redirect;
Keystone.prototype.start = start;
Keystone.prototype.wrapHTMLError = wrapHTMLError;
Keystone.prototype.createKeystoneHash = createKeystoneHash;

/** @deprecated Use `keystone.set('routes', fn)` instead. */
Keystone.prototype.routes = function (): never {
	throw new Error('keystone.routes(fn) has been removed, use keystone.set(\'routes\', fn)');
};

/** The primary export of the KeystoneJS module is an instance of the Keystone class. */
const keystone: Keystone = new Keystone();

// Expose modules and Classes
keystone.Admin = { Server: AdminServer };
keystone.Email = Email;
// Defined as a lazy getter to break a circular-init TDZ: when a consumer
// imports `lib/fieldTypes.mjs` directly, that module's static imports of
// concrete field types (e.g. `RelationshipType.mjs`) re-enter `index.mjs`
// before `lib/fieldTypes.mjs` has finished evaluating. A direct
// `keystone.Field.Types = FieldTypes` assignment then reads the
// uninitialized `FieldTypes` binding and throws `Cannot access 'FieldTypes'
// before initialization`. The getter captures the binding without reading
// it; the read happens lazily on first access, by which point both modules
// have completed evaluation.
Object.defineProperty(Field, 'Types', {
	configurable: true,
	enumerable: true,
	get (): FieldTypesMap { return FieldTypes; },
});
keystone.Field = Field as typeof Field & { Types: FieldTypesMap };
Object.defineProperty(keystone, 'Types', {
	configurable: true,
	enumerable: true,
	get (): FieldTypesMap { return FieldTypes; },
});
keystone.Keystone = Keystone;
// The listFactory returns the runtime List class; the public constructor type is
// document-generic so consumers keep typed model/document access when registering lists.
keystone.List = listFactory(keystone) as unknown as typeof keystone.List;
keystone.Storage = Storage;
keystone.View = View;

keystone.content = content;
keystone.security = { csrf: csrf };
keystone.utils = utils;

/**
 * Imports all `.mjs` / `.js` / `.json` modules under a directory path.
 * @param importPath The path to import modules from.
 * @returns A nested module map mirroring the directory tree.
 */
Keystone.prototype.import = function (importPath: string): Promise<unknown> {
	const moduleRootPath = this.get('module root');
	return importer(typeof moduleRootPath === 'string' ? moduleRootPath : '')(importPath);
};

/**
 * Applies application updates.
 * @param callback Called after all updates have been applied or on error.
 */
Keystone.prototype.applyUpdates = function (callback: Callback): void {
	const self = this;
	self.callHook('pre:updates', function (...args: unknown[]) {
		const err = args[0] instanceof Error ? args[0] : null;
		if (err) return callback(err);
		void updates.apply(function (applyErr?: Error) {
			if (applyErr) return callback(applyErr);
			self.callHook('post:updates', callback);
		});
	});
};

/**
 * Logs a configuration error to the console.
 */
Keystone.prototype.console = { err(_type: string, _msg: string): void { /* placeholder */ } };
Keystone.prototype.console.err = function (type: string, msg: string): void {
	if (keystone.get('logger')) {
		const dashes = '\n------------------------------------------------\n';
		console.log(dashes + 'KeystoneJS: ' + type + ':\n\n' + msg + dashes);
	}
};

keystone.version = pkg.version;
keystone.session = session;

/** Named export for the field-type registry. Consumers can `import { Types } from 'keystone'`. */
export const Types: FieldTypesMap = FieldTypes;

export { addFieldGroups, flattenFieldGroups } from './lib/fieldGroups.mjs';

export default keystone;

export type {
	KeystoneDocument,
	KeystoneFieldOptions,
	KeystoneField,
	KeystoneTypeConstructor,
} from './fields/types/Type.mjs';

export type {
	KeystoneList,
	KeystoneListOptions,
	KeystoneListMappings,
	KeystoneListSchema,
	KeystoneGroupFields,
	KeystoneGroupHeading,
	KSAdminUiElementField,
	KSAdminUiElementHeading,
	KSAdminUiElementIndent,
	KSAdminUiElementOutdent,
	KSAdminUIElement,
	ListKey,
} from './lib/list.mjs';

export type { FieldInstanceFor, FieldValueFor, DocumentFor, Filters } from './fields/types/FieldSpec.mjs';
export type { KeystoneFieldGroup, KeystoneFieldGroupList, FieldGroupsToFields } from './lib/fieldGroups.mjs';

export type {
	KSAdminUiFilterForTextField,
	KeystoneFieldOptionsForTextType,
	KeystoneFieldForTextType,
	KeystoneTypeConstructorForTextType,
} from './fields/types/text/TextType.mjs';

export type {
	KSAdminUiFilterForNumberField,
	KeystoneFieldOptionsForNumberType,
	KeystoneFieldForNumberType,
	KeystoneTypeConstructorForNumberType,
} from './fields/types/number/NumberType.mjs';

export type {
	KeystoneFieldOptionsForTextareaType,
	KeystoneFieldForTextareaType,
	KeystoneTypeConstructorForTextareaType,
} from './fields/types/textarea/TextareaType.mjs';

export type {
	KSAdminUiFilterForBooleanField,
	KeystoneFieldOptionsForBooleanType,
	KeystoneFieldForBooleanType,
	KeystoneTypeConstructorForBooleanType,
} from './fields/types/boolean/BooleanType.mjs';

export type {
	SelectValue,
	KeystoneFieldSelectableOption,
	KSAdminUiFilterForSelectField,
	KeystoneFieldOptionsForSelectType,
	KeystoneFieldForSelectType,
	KeystoneTypeConstructorForSelectType,
} from './fields/types/select/SelectType.mjs';

export type {
	KSAdminUiFilterForDateAndDateTimeFields,
	KeystoneFieldOptionsForDateType,
	KeystoneFieldForDateType,
	KeystoneTypeConstructorForDateType,
} from './fields/types/date/DateType.mjs';

export type {
	KeystoneFieldOptionsForDateTimeType,
	KeystoneFieldForDateTimeType,
	KeystoneTypeConstructorForDateTimeType,
} from './fields/types/datetime/DatetimeType.mjs';

export type {
	KSAdminUiFilterForDateArrayField,
	KeystoneFieldOptionsForDateArrayType,
	KeystoneFieldForDateArrayType,
	KeystoneTypeConstructorForDateArrayType,
} from './fields/types/datearray/DateArrayType.mjs';

export type {
	KeystoneFieldOptionsForHtmlType,
	KeystoneFieldForHtmlType,
	KeystoneTypeConstructorForHtmlType,
} from './fields/types/html/HtmlType.mjs';

export type {
	KeystoneFieldOptionsForUrlType,
	KeystoneFieldForUrlType,
	KeystoneTypeConstructorForUrlType,
} from './fields/types/url/UrlType.mjs';

export type {
	KeystoneFieldOptionsForKeyType,
	KeystoneFieldForKeyType,
	KeystoneTypeConstructorForKeyType,
} from './fields/types/key/KeyType.mjs';

export type {
	KeystoneFieldOptionsForColorType,
	KeystoneFieldForColorType,
	KeystoneTypeConstructorForColorType,
} from './fields/types/color/ColorType.mjs';

export type {
	NameValue,
	NameFilter,
	KeystoneFieldOptionsForNameType,
	KeystoneFieldForNameType,
	KeystoneTypeConstructorForNameType,
} from './fields/types/name/NameType.mjs';

export type {
	KeystoneFieldOptionsForMoneyType,
	KeystoneFieldForMoneyType,
	KeystoneTypeConstructorForMoneyType,
} from './fields/types/money/MoneyType.mjs';

export type {
	KeystoneFieldOptionsForEmailType,
	KeystoneFieldForEmailType,
	KeystoneTypeConstructorForEmailType,
} from './fields/types/email/EmailType.mjs';

export type {
	PasswordComplexityOptions,
	KeystoneFieldOptionsForPasswordType,
	KeystoneFieldForPasswordType,
	KeystoneTypeConstructorForPasswordType,
} from './fields/types/password/PasswordType.mjs';

// eslint-disable-next-line @typescript-eslint/no-deprecated -- deprecated alias remains exported for backward compatibility.
export type { RelationshipOptions } from './fields/types/relationship/RelationshipType.mjs';
// eslint-disable-next-line @typescript-eslint/no-deprecated -- deprecated alias remains exported for backward compatibility.
export type { KSAdminUiFilterForRelationshipField, RelationshipFilter } from './fields/types/relationship/RelationshipType.mjs';
export type {
	KeystoneFieldOptionsForRelationshipType,
	KeystoneFieldForRelationshipType,
	KeystoneTypeConstructorForRelationshipType,
} from './fields/types/relationship/RelationshipType.mjs';

// eslint-disable-next-line @typescript-eslint/no-deprecated -- deprecated alias remains exported for backward compatibility.
export type { KeystoneFieldForFileType } from './fields/types/file/FileType.mjs';
export type {
	FileValue,
	KeystoneFileStorage,
	KeystoneFieldOptionsForFileType,
	KeystoneTypeConstructorForFileType,
} from './fields/types/file/FileType.mjs';

export type {
	KSAdminUiFilterForTextArrayField,
	KeystoneFieldOptionsForTextArrayType,
	KeystoneFieldForTextArrayType,
	KeystoneTypeConstructorForTextArrayType,
} from './fields/types/textarray/TextArrayType.mjs';

export type {
	KSAdminUiFilterForNumberArrayField,
	KeystoneFieldOptionsForNumberArrayType,
	KeystoneFieldForNumberArrayType,
	KeystoneTypeConstructorForNumberArrayType,
} from './fields/types/numberarray/NumberArrayType.mjs';

export type {
	KSAdminUiFilterForLocationField,
	LocationPaths,
	KeystoneFieldOptionsForLocationType,
	KeystoneFieldForLocationType,
	KeystoneTypeConstructorForLocationType,
} from './fields/types/location/LocationType.mjs';

export type {
	KSAdminUiFilterForGeoPointField,
	KeystoneFieldOptionsForGeoPointType,
	KeystoneFieldForGeoPointType,
	KeystoneTypeConstructorForGeoPointType,
} from './fields/types/geopoint/GeoPointType.mjs';

export type {
	KeystoneFieldOptionsForCodeType,
	KeystoneFieldForCodeType,
	KeystoneTypeConstructorForCodeType,
} from './fields/types/code/CodeType.mjs';

export type {
	KeystoneFieldOptionsForCloudinaryType,
	KeystoneFieldForCloudinaryType,
	KeystoneTypeConstructorForCloudinaryType,
} from './fields/types/cloudinary/CloudinaryType.mjs';

export type {
	KeystoneFieldOptionsForCloudinaryImageType,
	KeystoneFieldForCloudinaryImageType,
	KeystoneTypeConstructorForCloudinaryImageType,
} from './fields/types/cloudinaryimage/CloudinaryImageType.mjs';

export type {
	KeystoneFieldOptionsForCloudinaryImagesType,
	KeystoneFieldForCloudinaryImagesType,
	KeystoneTypeConstructorForCloudinaryImagesType,
} from './fields/types/cloudinaryimages/CloudinaryImagesType.mjs';

export type {
	MarkdownValue,
	KSAdminUiFilterForMarkdownField,
	KeystoneFieldOptionsForMarkdownType,
	KeystoneTypeConstructorForMarkdownType,
} from './fields/types/markdown/MarkdownType.mjs';

export type { FieldSpec, FieldMap, AddArg } from './fields/types/FieldSpec.mjs';
