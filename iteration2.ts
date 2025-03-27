// Type definitions for KeystoneJS v4 index.js & lib/core/options.js
// Project: https://github.com/keystonejs/keystone-0.3
// Definitions by: Gabriel Giacomini <https://github.com/GabrielGiacomini>
// Based on the code in: index.js, lib/core/options.js

import * as express from "express";
import * as mongoose from "mongoose";
import { Hook } from "grappling-hook"; // @todo: Check if @types/grappling-hook exists or define basic type

// --- Dependencies ---
// @todo: Add types for cloudinary if needed: npm install --save-dev @types/cloudinary
// import * as cloudinary from 'cloudinary';

/**
 * @todo Define more specific types for imported modules instead of 'any' or Function.
 */
// ... (previous module declarations remain relevant) ...
// declare module './lib/core/importer' { const importer: any; export default importer; }
// declare module './lib/middleware/api' { function api(keystone: Keystone): any; export = api; }
// declare module './lib/middleware/cors' { function cors(keystone: Keystone): any; export = cors; }
// declare module './lib/core/createItems' { const createItems: any; export = createItems; }
// declare module './lib/core/createRouter' { const createRouter: any; export = createRouter; }
// declare module './lib/core/getOrphanedLists' { const getOrphanedLists: any; export = getOrphanedLists; }
// declare module './lib/core/init' { const init: any; export = init; }
// declare module './lib/core/initDatabaseConfig' { const initDatabaseConfig: any; export = initDatabaseConfig; }
// declare module './lib/core/initExpressApp' { const initExpressApp: any; export = initExpressApp; }
// declare module './lib/core/initExpressSession' { const initExpressSession: any; export = initExpressSession; }
// declare module './lib/core/initNav' { const initNav: any; export = initNav; }
// declare module './lib/core/list' { function list(key: string): any; export = list; } // @todo Define List class/interface
// declare module './lib/core/openDatabaseConnection' { const openDatabaseConnection: any; export = openDatabaseConnection; }
// declare module './lib/core/closeDatabaseConnection' { const closeDatabaseConnection: any; export = closeDatabaseConnection; }
// declare module './lib/core/populateRelated' { const populateRelated: any; export = populateRelated; }
// declare module './lib/core/redirect' { const redirect: any; export = redirect; }
// declare module './lib/core/start' { const start: any; export = start; }
// declare module './lib/core/wrapHTMLError' { const wrapHTMLError: any; export = wrapHTMLError; }
// declare module './lib/core/createKeystoneHash' { const createKeystoneHash: any; export = createKeystoneHash; }
// declare module './admin/server' { const Server: any; export = Server; }
// declare module './lib/email' { const Email: any; export = Email; }
// declare module './fields/types/Type' { const Type: any; export = Type; }
// declare module './lib/fieldTypes' { const fieldTypes: any; export = fieldTypes; }
// declare module './lib/list' { function listFactory(keystone: Keystone): any; export = listFactory; } // @todo Define List class/interface
// declare module './lib/storage' { const Storage: any; export = Storage; }
// declare module './lib/view' { const View: any; export = View; }
// declare module './lib/content' { const content: any; export = content; }
// declare module './lib/security/csrf' { const csrf: any; export = csrf; }
// declare module './lib/updates' { const updates: { apply: (callback: (err?: any) => void) => void }; export = updates; }
// declare module './lib/session' { const session: any; export = session; }
// declare module 'keystone-utils' { const utils: any; export = utils; }

/**
 * Interface defining common KeystoneJS configuration options.
 * Allows arbitrary keys for custom options.
 * @see lib/core/options.js
 */
interface KeystoneOptions {
	name?: string;
	brand?: string;
	"admin path"?: string;
	compress?: boolean;
	headless?: boolean;
	logger?: string | boolean | ((...args: any[]) => void);
	"auto update"?: boolean;
	"model prefix"?: string | null;
	/** Path to the root of the consuming module/project. Defaults based on module location. */
	"module root"?: string;
	"frame guard"?: "deny" | "sameorigin" | boolean;
	"cache admin bundles"?: boolean;
	"handle uploads"?: boolean;

	env?: string; // 'development', 'production', etc.
	port?: string | number;
	host?: string;
	/** Specific IP/Host to listen on (overrides host/port). */
	listen?: string;

	ssl?: boolean | "only";
	"ssl port"?: string | number;
	"ssl host"?: string;
	/** Path to SSL key file or the key itself. */
	"ssl key"?: string;
	/** Path to SSL cert file or the cert itself. */
	"ssl cert"?: string;

	/** Secret for signing cookies. */
	"cookie secret"?: string;
	/** Determines if signin cookies are used (defaults to true in dev). */
	"cookie signin"?: boolean;

	"embedly api key"?: string;
	"mandrill api key"?: string;
	"mandrill username"?: string;
	"google api key"?: string; // Browser key
	"google server api key"?: string; // Server key
	"ga property"?: string; // Google Analytics property ID
	"ga domain"?: string; // Google Analytics domain
	"chartbeat property"?: string;
	"chartbeat domain"?: string;
	/** Whitelisted IP ranges for Admin UI access. @todo Verify actual type (string | string[]?) */
	"allowed ip ranges"?: string | string[];

	/** Amazon S3 configuration. @todo Define S3 config type. */
	"s3 config"?: Record<string, any> | boolean;
	/** Azure Storage configuration. @todo Define Azure config type. */
	"azurefile config"?: Record<string, any> | boolean;
	/**
	 * Cloudinary configuration. Can be a config object, a cloudinary URL string, or `true` to use env vars.
	 * @todo Define Cloudinary config type from `@types/cloudinary`.
	 */
	"cloudinary config"?: Record<string, any> | string | boolean;

	/** Mongoose instance to use. Defaults to internal instance. */
	mongoose?: typeof mongoose;
	/** MongoDB connection URI. */
	mongo?: string;

	/** Session configuration. `true` enables default mongo store. Can be session options object. */
	session?: boolean | Record<string, any>;
	/** Enables auth features. `true` requires 'user model' and 'cookie secret'. Can be a user list instance. */
	auth?: boolean | any; // @todo Use List type when defined

	/** Key of the list to use for authentication. */
	"user model"?: string;
	/** Custom Express app instance. */
	app?: express.Express;
	/** Express session store instance. */
	"session store"?: any; // @todo Define session store type
	/** Navigation structure for Admin UI. */
	nav?: Record<string, string | string[]>; // e.g. { posts: ['posts', 'post-categories'], users: 'users' }

	/** Callback fired before static assets middleware. */
	"pre:static"?: express.RequestHandler | express.RequestHandler[];
	/** Callback fired before body parser middleware. */
	"pre:bodyparser"?: express.RequestHandler | express.RequestHandler[];
	/** Callback fired before session middleware. */
	"pre:session"?: express.RequestHandler | express.RequestHandler[];
	/** Callback fired before logger middleware. */
	"pre:logger"?: express.RequestHandler | express.RequestHandler[];
	/** Callback fired before admin UI middleware. */
	"pre:admin"?: express.RequestHandler | express.RequestHandler[];
	/** Callback fired before admin UI routes. */
	"pre:adminroutes"?: express.RequestHandler | express.RequestHandler[];
	/** Callback fired before application routes. */
	"pre:routes"?: express.RequestHandler | express.RequestHandler[];
	/** Callback fired before rendering views. */
	"pre:render"?: express.RequestHandler | express.RequestHandler[];

	/** Custom route handler function `(app: express.Application) => void`. */
	routes?: (app: express.Application) => void;

	/** Default: true */
	"trust proxy"?: boolean;
	/** Default: false */
	letsencrypt?:
		| boolean
		| {
				email: string;
				domains: string[];
				approveDomains?:
					| boolean
					| ((
							options: any,
							certs: any,
							cb: (
								err: Error | null,
								{ options, certs }: { options: any; certs: any }
							) => void
					  ) => void);
				server?: string;
		  }; // @todo Refine letsencrypt options type
	/** Default: false */
	"signin logo"?: string | [string, number]; // URL or [URL, height]
	/** Default: false */
	"signin url"?: string;
	/** Default: false */
	"signout url"?: string;

	// Allow any other keys
	[key: string]: any;
}

/**
 * Represents a KeystoneJS v4 application instance.
 * @see index.js
 */
declare class Keystone {
	/**
	 * Initializes a new Keystone instance.
	 * Sets up default options, hooks, and exposes Express.
	 */
	constructor();

	callHook: Hook["callHook"];
	addHook: Hook["addHook"];

	lists: Record<string, any>; // @todo Replace 'any' with defined List type
	fieldTypes: Record<string, any>; // @todo Replace 'any' with defined FieldType type
	paths: Record<string, any>; // @todo Define structure

	/**
	 * Internal storage for Keystone configuration options. Use `get()` and `set()` to access.
	 * @internal
	 */
	_options: KeystoneOptions;

	/**
	 * Internal storage for redirect rules.
	 * @internal
	 * @todo Define the structure of the redirects object.
	 */
	_redirects: Record<
		string,
		string | { from: string; to: string; status?: number }
	>;

	express: typeof express;
	mongoose: typeof mongoose;

	middleware: {
		api: any; // @todo Define specific type
		cors: any; // @todo Define specific type
	};

	/** The configured Express application instance. Initialized during `keystone.init()` or can be set via `keystone.set('app', myApp)`. */
	app?: express.Express;

	/** The configured navigation structure for the Admin UI. */
	nav?: {
		// @todo Define NavItem type properly
		sections: Array<{
			label: string;
			key: string;
			lists: Array<{ key: string; path: string; label: string; options: any }>;
		}>;
		by: {
			list: Record<
				string,
				{ key: string; path: string; label: string; options: any }
			>;
		};
	};

	// --- Options Management ---

	/**
	 * Sets a Keystone configuration option.
	 * Handles special cases for 'cloudinary config', 'auth', 'nav', 'mongo', 'module root', 'app', 'mongoose', 'frame guard'.
	 *
	 * @example
	 * keystone.set('user model', 'User');
	 * keystone.set('cloudinary config', 'cloudinary://api_key:api_secret@cloud_name');
	 *
	 * @param key The configuration option key.
	 * @param value The value to set.
	 * @returns The Keystone instance, for chaining.
	 * @see lib/core/options.js
	 */
	set<K extends keyof KeystoneOptions>(key: K, value: KeystoneOptions[K]): this;
	set(key: string, value: any): this;
	// The implementation also allows getting via set(key), but get(key) is preferred.
	// set<K extends keyof KeystoneOptions>(key: K): KeystoneOptions[K];
	// set(key: string): any;

	/**
	 * Sets multiple Keystone configuration options.
	 *
	 * @example
	 * keystone.options({
	 * 'name': 'My Site',
	 * 'auto update': true,
	 * });
	 *
	 * @param options An object containing option keys and values.
	 * @returns The full options object after updates.
	 * @see lib/core/options.js
	 */
	options(options: Partial<KeystoneOptions>): KeystoneOptions;
	/**
	 * Gets the full Keystone configuration options object.
	 * @returns The full options object.
	 */
	options(): KeystoneOptions;

	/**
	 * Gets a Keystone configuration option.
	 *
	 * @example
	 * const userModel = keystone.get('user model');
	 *
	 * @param key The configuration option key.
	 * @returns The value of the option, or undefined if not set.
	 * @see lib/core/options.js
	 */
	get<K extends keyof KeystoneOptions>(key: K): KeystoneOptions[K];
	get(key: string): any;

	/**
	 * Gets an expanded path option, resolving it relative to the `module root` if it's not absolute.
	 *
	 * @example
	 * const updatesPath = keystone.getPath('updates', './updates');
	 *
	 * @param key The path option key.
	 * @param defaultValue A default value to use if the option is not set.
	 * @returns The resolved path string, or undefined if not set and no default is provided.
	 * @see lib/core/options.js
	 */
	getPath(
		key: keyof KeystoneOptions | string,
		defaultValue?: string
	): string | undefined;

	/**
	 * Expands a potentially relative path to be absolute based on the `module root` option.
	 * If the path is already absolute, it's returned unchanged.
	 *
	 * @param pathValue The path string to expand.
	 * @returns The expanded, absolute path string.
	 * @see lib/core/options.js
	 */
	expandPath(pathValue: string): string;

	// --- Core Methods ---

	prefixModel: (key: string) => string;
	createItems: any; // @todo Define signature from lib/core/createItems.js
	createRouter: typeof express.Router;
	getOrphanedLists: () => any[]; // @todo Use List[] type when defined
	importer: (moduleRoot: string) => (dirname: string) => Record<string, any>;
	init: any; // @todo Define signature from lib/core/init.js
	initDatabaseConfig: any; // @todo Define signature from lib/core/initDatabaseConfig.js
	initExpressApp: any; // @todo Define signature from lib/core/initExpressApp.js
	initExpressSession: any; // @todo Define signature from lib/core/initExpressSession.js
	initNav: any; // @todo Define signature from lib/core/initNav.js
	list: (key: string) => any | undefined; // @todo Use List type when defined
	openDatabaseConnection: (
		options?: mongoose.ConnectOptions & { uri?: string },
		callback?: (err?: any) => void
	) => this;
	closeDatabaseConnection: (callback?: (err?: any) => void) => void;
	populateRelated: any; // @todo Define signature from lib/core/populateRelated.js
	redirect: (
		from: string | Record<string, string | number>,
		to?: string,
		status?: number
	) => void;
	start: (
		options?: Record<string, any> | ((err?: any) => void),
		callback?: (err?: any) => void
	) => void; // @todo Refine signature
	wrapHTMLError: any; // @todo Define signature from lib/core/wrapHTMLError.js
	createKeystoneHash: any; // @todo Define signature from lib/core/createKeystoneHash.js

	applyUpdates(callback: (err?: any) => void): void;
	import(dirname: string): Record<string, any>;

	console: {
		err(type: string, msg: string): void;
	};

	// --- Exposed Modules/Classes ---

	Admin: {
		Server: any; // @todo Define Admin.Server type
	};
	Email: any; // @todo Define Email class type
	Field: {
		Types: Record<string, any>; // @todo Define FieldTypes map type
	} & any; // @todo Define Field base class type
	Keystone: typeof Keystone;
	List: any; // @todo Define List class type
	Storage: any; // @todo Define Storage class type
	View: any; // @todo Define View class type
	content: any; // @todo Define content module type
	security: {
		csrf: any; // @todo Define csrf module type
	};
	utils: any; // @todo Define keystone-utils type
	session: any; // @todo Define session module type
	version: string;

	// Deprecated
	/** @deprecated Use `keystone.set('routes', fn)` instead. */
	routes: () => never;
}

declare const keystone: Keystone;
export = keystone;

/*
Usage Instructions:

1.  **Installation:**
    ```bash
    npm install --save-dev @types/express @types/mongoose @types/node @types/cloudinary
    # or
    yarn add --dev @types/express @types/mongoose @types/node @types/cloudinary
    ```
    *Note:* You might need `@types/grappling-hook` if available.

2.  **Import Keystone:**
    ```typescript
    import * as keystone from 'keystone'; // Adjust path if placing definitions elsewhere

    // Configure Keystone using typed methods and options
    keystone.set('name', 'My Project');
    keystone.set('mongo', 'mongodb://localhost/my-db');
    keystone.set('user model', 'User');
    keystone.set('cookie secret', '---- YOUR SECRET ----');
    keystone.set('module root', __dirname); // Often useful

    const cloudinaryUrl = process.env.CLOUDINARY_URL;
    if (cloudinaryUrl) {
        keystone.set('cloudinary config', cloudinaryUrl);
    }

    // Get options
    const moduleRoot = keystone.get('module root');
    const isDev = keystone.get('env') === 'development';

    // Set multiple options
    keystone.options({
        'port': 3000,
        'auto update': true,
        'session': true,
        'auth': true,
    });

    // Use path methods
    const publicPath = keystone.getPath('static', 'public');
    console.log('Serving static files from:', publicPath);

    // ... rest of your Keystone setup ...

    keystone.start();
    ```

3.  **Typing Issues & TODOs:**
    - Continue replacing `any` with specific types as we define them (e.g., `List`, `Field`, core methods).
    - Refine the `KeystoneOptions` interface further if specific options have more complex types (e.g., `letsencrypt`, storage configs).
    - Verify the exact types for options like `allowed ip ranges`.
*/
