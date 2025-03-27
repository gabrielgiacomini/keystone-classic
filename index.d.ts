// Type definitions for KeystoneJS v4 index.js
// Project: https://github.com/keystonejs/keystone-0.3
// Definitions by: Gabriel Giacomini <https://github.com/GabrielGiacomini>
// Based on the code in: index.js

import * as express from "express";
import * as mongoose from "mongoose";
import { Hook } from "grappling-hook"; // @todo: Check if @types/grappling-hook exists or define basic type

/**
 * @todo Define more specific types for imported modules instead of 'any' or Function.
 */
// declare module './lib/core/importer' { const importer: any; export default importer; }
// declare module './lib/middleware/api' { function api(keystone: Keystone): any; export = api; }
// declare module './lib/middleware/cors' { function cors(keystone: Keystone): any; export = cors; }
// declare module './lib/core/options' { const options: any; export = options; }
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
 * Represents a KeystoneJS v4 application instance.
 * @see index.js
 */
declare class Keystone {
	/**
	 * Initializes a new Keystone instance.
	 * Sets up default options, hooks, and exposes Express.
	 */
	constructor();

	/**
	 * Provides hook points for Keystone's initialization and request lifecycles.
	 * @see https://github.com/JedWatson/grappling-hook
	 * @todo Define specific types for hook arguments and return values.
	 * @example
	 * keystone.callHook('pre:routes', myMiddleware);
	 */
	callHook: Hook["callHook"];
	addHook: Hook["addHook"];

	/**
	 * A collection of registered Keystone Lists.
	 * Keys are the list keys, values are the List instances.
	 * @todo Define the List type/interface.
	 */
	lists: Record<string, any>; // Record<string, List>;

	/**
	 * A collection of registered Keystone Field Types.
	 * Keys are the field type names, values are the Field Type constructors.
	 * @todo Define the FieldType type/interface.
	 */
	fieldTypes: Record<string, any>; // Record<string, FieldType>;

	/**
	 * Storage for internal path references.
	 * @todo Define the structure of the paths object.
	 */
	paths: Record<string, any>;

	/**
	 * Internal storage for Keystone configuration options. Use `get()` and `set()` to access.
	 * @internal
	 * @todo Define a strong type for KeystoneOptions.
	 */
	_options: Record<string, any>;

	/**
	 * Internal storage for redirect rules.
	 * @internal
	 * @todo Define the structure of the redirects object.
	 */
	_redirects: Record<
		string,
		string | { from: string; to: string; status?: number }
	>;

	/**
	 * The Express instance used by Keystone.
	 */
	express: typeof express;

	/**
	 * The Mongoose instance used by Keystone.
	 */
	mongoose: typeof mongoose;

	/**
	 * Collection of Keystone middleware functions bound to the instance.
	 * @todo Define specific types for middleware functions.
	 */
	middleware: {
		api: any; // ReturnType<typeof import('./lib/middleware/api')>;
		cors: any; // ReturnType<typeof import('./lib/middleware/cors')>;
	};

	// --- Options Management (from lib/core/options.js) ---
	/**
	 * Sets keystone options
	 *
	 * Example:
	 * keystone.set('user model', 'User') // sets the 'user model' option to `User`
	 *
	 * @param {string} key - The option key.
	 * @param {any} value - The value.
	 * @see lib/core/options.js
	 */
	set(key: string, value: any): this;
	set(options: Record<string, any>): this;

	/**
	 * Gets keystone options
	 *
	 * Example:
	 * keystone.get('user model') // returns the 'user model' option
	 *
	 * @param {string} key - The option key.
	 * @see lib/core/options.js
	 */
	get(key: string): any;

	/**
	 * Gets an expanded path option, resolving '~' to the module root
	 *
	 * Example:
	 * keystone.get('path option', 'default value')
	 *
	 * @param {string} key - The option key.
	 * @param {string} [defaultValue] - The default value.
	 * @see lib/core/options.js
	 */
	getPath(key: string, defaultValue?: string): string | undefined;

	/**
	 * Sets multiple path options, resolving '~' to the module root
	 *
	 * Example:
	 * keystone.paths({ updates: './updates' })
	 *
	 * @param {Record<string, string>} paths - An object mapping path keys to string values.
	 * @see lib/core/options.js
	 */
	paths(paths: Record<string, string>): this;

	// --- Core Methods ---

	/**
	 * Prefixes a model key with the value of the 'model prefix' option, if set.
	 * Uses mongoose's internal `utils.toCollectionName` for formatting.
	 * @param {string} key - The base model key.
	 * @returns {string} The prefixed and formatted model key/collection name.
	 * @see index.js
	 */
	prefixModel(key: string): string;

	/**
	 * Programmatically create items in a Keystone list.
	 * @see lib/core/createItems.js
	 * @todo Define arguments and return type based on lib/core/createItems.js.
	 */
	createItems: any; // typeof import('./lib/core/createItems');

	/**
	 * Creates an Express Router instance.
	 * @see lib/core/createRouter.js
	 */
	createRouter: typeof express.Router; //typeof import('./lib/core/createRouter');

	/**
	 * Retrieves lists that haven't been associated with a navigation section.
	 * @see lib/core/getOrphanedLists.js
	 * @todo Define arguments and return type based on lib/core/getOrphanedLists.js.
	 * @todo Define the List type/interface.
	 */
	getOrphanedLists: () => any[]; //() => List[]; // typeof import('./lib/core/getOrphanedLists');

	/**
	 * Imports modules from a specified directory relative to the project root.
	 * @param {string} dirname - The directory path relative to the 'module root'.
	 * @returns {Record<string, any>} An object mapping filenames (without extension) to the imported modules.
	 * @see lib/core/importer.js
	 * @example
	 * const models = keystone.import('models');
	 */
	importer: (moduleRoot: string) => (dirname: string) => Record<string, any>; // typeof import('./lib/core/importer');

	/**
	 * Initializes Keystone, setting up database connections, middleware, and Express app.
	 * @see lib/core/init.js
	 * @todo Define arguments and return type based on lib/core/init.js.
	 */
	init: any; // typeof import('./lib/core/init');

	/**
	 * Initializes database configuration options.
	 * @see lib/core/initDatabaseConfig.js
	 * @todo Define arguments and return type based on lib/core/initDatabaseConfig.js.
	 */
	initDatabaseConfig: any; // typeof import('./lib/core/initDatabaseConfig');

	/**
	 * Initializes the main Express application.
	 * @see lib/core/initExpressApp.js
	 * @todo Define arguments and return type based on lib/core/initExpressApp.js.
	 */
	initExpressApp: any; // typeof import('./lib/core/initExpressApp');

	/**
	 * Initializes Express session middleware.
	 * @see lib/core/initExpressSession.js
	 * @todo Define arguments and return type based on lib/core/initExpressSession.js.
	 */
	initExpressSession: any; // typeof import('./lib/core/initExpressSession');

	/**
	 * Initializes the navigation structure for the Admin UI.
	 * @see lib/core/initNav.js
	 * @todo Define arguments and return type based on lib/core/initNav.js.
	 */
	initNav: any; // typeof import('./lib/core/initNav');

	/**
	 * Retrieves a registered List by its key.
	 * @param {string} key - The key of the List to retrieve.
	 * @returns {any | undefined} The List instance, or undefined if not found.
	 * @see lib/core/list.js
	 * @todo Define the List type/interface.
	 */
	list: (key: string) => any | undefined; // (key: string) => List | undefined; // typeof import('./lib/core/list');

	/**
	 * Opens the database connection.
	 * @param {mongoose.ConnectOptions & { uri?: string }} [options] - Connection options.
	 * @param {(err?: any) => void} [callback] - Callback function executed after connection attempt.
	 * @returns {this} The Keystone instance.
	 * @see lib/core/openDatabaseConnection.js
	 * @todo Refine argument types based on lib/core/openDatabaseConnection.js.
	 */
	openDatabaseConnection: (
		options?: mongoose.ConnectOptions & { uri?: string },
		callback?: (err?: any) => void
	) => this; // typeof import('./lib/core/openDatabaseConnection');

	/**
	 * Closes the database connection.
	 * @param {(err?: any) => void} [callback] - Callback function executed after disconnection attempt.
	 * @see lib/core/closeDatabaseConnection.js
	 * @todo Refine argument types based on lib/core/closeDatabaseConnection.js.
	 */
	closeDatabaseConnection: (callback?: (err?: any) => void) => void; // typeof import('./lib/core/closeDatabaseConnection');

	/**
	 * Populates relationship fields on a document or array of documents.
	 * @see lib/core/populateRelated.js
	 * @todo Define arguments and return type based on lib/core/populateRelated.js.
	 */
	populateRelated: any; // typeof import('./lib/core/populateRelated');

	/**
	 * Adds a redirect rule.
	 * @param {string | Record<string, string | number>} from - The path to redirect from, or an object mapping paths to destinations.
	 * @param {string} [to] - The path or URL to redirect to.
	 * @param {number} [status=301] - The HTTP status code for the redirect.
	 * @see lib/core/redirect.js
	 * @todo Refine argument types based on lib/core/redirect.js.
	 */
	redirect: (
		from: string | Record<string, string | number>,
		to?: string,
		status?: number
	) => void; // typeof import('./lib/core/redirect');

	/**
	 * Starts the Keystone application, listening for HTTP(S) connections.
	 * @param {Record<string, any> | ((err?: any) => void)} [options] - Startup options or a callback function.
	 * @param {(err?: any) => void} [callback] - Callback function executed after the server starts.
	 * @see lib/core/start.js
	 * @todo Refine argument types based on lib/core/start.js.
	 */
	start: (
		options?: Record<string, any> | ((err?: any) => void),
		callback?: (err?: any) => void
	) => void; // typeof import('./lib/core/start');

	/**
	 * Wraps an HTML error page.
	 * @see lib/core/wrapHTMLError.js
	 * @todo Define arguments and return type based on lib/core/wrapHTMLError.js.
	 */
	wrapHTMLError: any; // typeof import('./lib/core/wrapHTMLError');

	/**
	 * Creates a hash (likely for cache busting or similar).
	 * @see lib/core/createKeystoneHash.js
	 * @todo Define arguments and return type based on lib/core/createKeystoneHash.js.
	 */
	createKeystoneHash: any; // typeof import('./lib/core/createKeystoneHash');

	/**
	 * Applies application updates. Runs update scripts.
	 * @param {(err?: any) => void} callback - Function called after updates are applied or if an error occurs.
	 * @see index.js
	 * @see lib/updates.js
	 */
	applyUpdates(callback: (err?: any) => void): void;

	/**
	 * Imports modules from a specified directory relative to the project root ('module root').
	 * @param {string} dirname - The directory path relative to the 'module root'.
	 * @returns {Record<string, any>} An object mapping filenames (without extension) to the imported modules.
	 * @see index.js
	 * @example
	 * const models = keystone.import('models');
	 */
	import(dirname: string): Record<string, any>;

	/**
	 * Namespace for console logging functions.
	 */
	console: {
		/**
		 * Logs a configuration error message to the console if a logger is configured.
		 * @param {string} type - The type of error (e.g., 'Configuration Error').
		 * @param {string} msg - The error message.
		 */
		err(type: string, msg: string): void;
	};

	// --- Exposed Modules/Classes ---

	/**
	 * Admin UI server functionality.
	 * @todo Define the Admin.Server type.
	 */
	Admin: {
		Server: any; // typeof import('./admin/server');
	};

	/**
	 * Keystone Email class for sending emails.
	 * @todo Define the Email class type.
	 */
	Email: any; // typeof import('./lib/email');

	/**
	 * Base class for Keystone Fields.
	 * @todo Define the Field class type.
	 */
	Field: {
		Types: Record<string, any>; // FieldTypesMap; // typeof import('./lib/fieldTypes');
	} & any; // typeof import('./fields/types/Type');

	/**
	 * Constructor for the Keystone class itself. Allows creating multiple instances if needed.
	 */
	Keystone: typeof Keystone;

	/**
	 * The Keystone List class constructor/factory. Used to define data models.
	 * @todo Define the List class type properly.
	 */
	List: any; // ReturnType<typeof import('./lib/list')>;

	/**
	 * Keystone Storage class for handling file uploads.
	 * @todo Define the Storage class type.
	 */
	Storage: any; // typeof import('./lib/storage');

	/**
	 * Keystone View class for rendering templates.
	 * @todo Define the View class type.
	 */
	View: any; // typeof import('./lib/view');

	/**
	 * Content management helper functions.
	 * @todo Define the structure of the content module.
	 */
	content: any; // typeof import('./lib/content');

	/**
	 * Security related utilities.
	 */
	security: {
		/**
		 * CSRF protection middleware and utilities.
		 * @todo Define the csrf module type.
		 */
		csrf: any; // typeof import('./lib/security/csrf');
	};

	/**
	 * General utility functions. Re-exported from 'keystone-utils'.
	 * @todo Define the utils type based on 'keystone-utils'.
	 */
	utils: any; // typeof import('keystone-utils');

	/**
	 * Session management functions (signin, signout).
	 * @todo Define the session module type.
	 */
	session: any; // typeof import('./lib/session');

	/**
	 * The current version of the KeystoneJS package.
	 */
	version: string;

	// Deprecated
	/** @deprecated Use `keystone.set('routes', fn)` instead. */
	routes: () => never;
}

/**
 * The main export is a singleton instance of the Keystone class.
 * @see index.js
 */
declare const keystone: Keystone;

export = keystone;

/*
Usage Instructions:

1.  **Installation:**
    If you haven't already, install the necessary base types:
    ```bash
    npm install --save-dev @types/express @types/mongoose @types/node
    # or
    yarn add --dev @types/express @types/mongoose @types/node
    ```
    *Note:* You might need `@types/grappling-hook` if available, otherwise define a basic interface for it or use `any`.

2.  **Import Keystone:**
    In your TypeScript files (e.g., `keystone.ts` or your main application file), you can import the Keystone instance:
    ```typescript
    import * as keystone from 'keystone'; // Adjust path if placing definitions elsewhere

    // Configure Keystone using the typed instance
    keystone.set('name', 'My Awesome Project');
    keystone.set('mongoose', require('mongoose')); // Mongoose instance might still be required like this
    keystone.set('mongo', 'mongodb://localhost/my-db');
    keystone.set('user model', 'User');
    keystone.set('auto update', true);
    keystone.set('session', true);
    keystone.set('auth', true);

    // Define a List (assuming List type is defined elsewhere)
    // const User = new keystone.List('User');
    // User.add({...});
    // User.register();

    // Start Keystone
    keystone.start();
    ```

3.  **Typing Issues & TODOs:**
    - This definition file uses `any` extensively as placeholders for types defined in other files (`List`, `Field`, core methods, etc.).
    - As you provide the code for the referenced files (e.g., `lib/list.js`, `fields/types/Type.js`), these `any` types should be replaced with more specific interfaces or classes defined in separate `.d.ts` files or within this file if simple enough.
    - The `@todo` comments highlight areas needing further definition or clarification. For example, the exact function signatures for core methods like `init`, `start`, `applyUpdates`, etc., need to be derived from their respective source files.
    - Module declarations (`declare module '...'`) are commented out but show how you might structure types for internal modules if needed, though directly typing the methods/properties on the `Keystone` class is often sufficient.
*/
