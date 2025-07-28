import * as mongoose from "mongoose";
import * as express from "express";
import * as http from "http";
import * as https from "https";
import { KeystoneDocument, KeystoneTypeConstructor } from "./core";
import { KeystoneList, KeystoneListConstructor } from "./list";

/**
 * Global configuration options for Keystone instances.
 * @see /lib/keystone/keystone.js - Main Keystone class implementation
 */
export interface KeystoneGlobalOptions {
	/** Name of the project/application. Displayed in the Admin UI. */
	name?: string;
	/** Brand text to display at the top of the Admin UI signin page. */
	brand?: string;
	/**
	 * Path to the Admin UI.
	 * Default: '/keystone'
	 */
	"admin path"?: string;
	/**
	 * Enable HTTP compression.
	 * Default: true
	 */
	compress?: boolean;
	/**
	 * Run without Admin UI (API only).
	 * Default: false
	 */
	headless?: boolean;
	/**
	 * Logging configuration (true, false, or a function).
	 * Default: console.log
	 */
	logger?: string | boolean | ((...args: any[]) => void);
	/**
	 * Auto-create/update lists from schema changes.
	 * Default: process.env.NODE_ENV !== 'production'
	 */
	"auto update"?: boolean;
	/**
	 * Prefix for all MongoDB collection names.
	 * Default: '' (empty string)
	 */
	"model prefix"?: string | null;
	/**
	 * Path to the root of the consuming module/project.
	 * Default: based on module location
	 */
	"module root"?: string;
	/**
	 * X-Frame-Options protection for clickjacking.
	 * Default: 'sameorigin'
	 */
	"frame guard"?: "deny" | "sameorigin" | boolean;
	/**
	 * Cache Admin UI bundles in production.
	 * Default: true
	 */
	"cache admin bundles"?: boolean;
	/**
	 * Enable file upload handling.
	 * Default: true
	 */
	"handle uploads"?: boolean;
	/**
	 * Environment name (usually 'development', 'production').
	 * Default: process.env.NODE_ENV
	 */
	env?: string;
	/**
	 * HTTP port to listen on.
	 * Default: process.env.PORT || 3000
	 */
	port?: string | number;
	/**
	 * Host to bind the server to.
	 * Default: process.env.HOST || '0.0.0.0'
	 */
	host?: string;
	/**
	 * Specific IP/Host to listen on (overrides host/port).
	 * Default: undefined
	 */
	listen?: string;
	/**
	 * Enable HTTPS. 'only' forces HTTPS and redirects HTTP.
	 * Default: false
	 */
	ssl?: boolean | "only";
	/**
	 * HTTPS port (only used if ssl is enabled).
	 * Default: 3001
	 */
	"ssl port"?: string | number;
	/**
	 * Host to bind the HTTPS server to.
	 * Default: value of 'host'
	 */
	"ssl host"?: string;
	/**
	 * Path to SSL key file or the key itself.
	 * Required if ssl is enabled.
	 */
	"ssl key"?: string;
	/**
	 * Path to SSL certificate file or the cert itself.
	 * Required if ssl is enabled.
	 */
	"ssl cert"?: string;
	/**
	 * Secret used for signing cookies.
	 * Required for session support.
	 */
	"cookie secret"?: string;
	/**
	 * Enable signin cookies (for persistent sessions).
	 * Default: true in development
	 */
	"cookie signin"?: boolean;
	/**
	 * Embedly API key for oEmbed support.
	 */
	"embedly api key"?: string;
	/**
	 * Mandrill API key for email sending.
	 */
	"mandrill api key"?: string;
	/**
	 * Mandrill username for email sending.
	 */
	"mandrill username"?: string;
	/**
	 * Google API Browser key.
	 */
	"google api key"?: string;
	/**
	 * Google API Server key.
	 */
	"google server api key"?: string;
	/**
	 * Google Analytics property ID.
	 */
	"ga property"?: string;
	/**
	 * Google Analytics domain.
	 */
	"ga domain"?: string;
	/**
	 * Chartbeat property ID.
	 */
	"chartbeat property"?: string;
	/**
	 * Chartbeat domain.
	 */
	"chartbeat domain"?: string;
	/**
	 * Whitelist IP ranges for Admin UI access.
	 */
	"allowed ip ranges"?: string | string[];
	/**
	 * Amazon S3 configuration.
	 * Can be a config object, or true to use environment variables.
	 */
	"s3 config"?: Record<string, any> | boolean;
	/**
	 * Azure Storage configuration.
	 * Can be a config object, or true to use environment variables.
	 */
	"azurefile config"?: Record<string, any> | boolean;
	/**
	 * Cloudinary configuration.
	 * Can be a config object, URL string, or true to use environment variables.
	 */
	"cloudinary config"?: Record<string, any> | string | boolean;
	/**
	 * Mongoose instance to use.
	 * Default: internal Mongoose instance
	 */
	mongoose?: typeof mongoose;
	/**
	 * MongoDB connection URI.
	 * Default: 'mongodb://localhost/keystone-db'
	 */
	mongo?: string;
	/**
	 * Session configuration.
	 * true enables default MongoDB session store.
	 */
	session?: boolean | Record<string, any>;
	/**
	 * Enable authentication.
	 * true requires 'user model' and 'cookie secret'.
	 */
	auth?: boolean | KeystoneList<any> | string;
	/**
	 * Key of the list to use for authentication.
	 * Default: 'User'
	 */
	"user model"?: string;
	/**
	 * Custom Express app instance.
	 * Use if you need to customize Express before Keystone initialization.
	 */
	app?: express.Express;
	/**
	 * Express session store instance.
	 * Default: Connects-Mongo based on MongoDB connection.
	 */
	"session store"?: any;
	/**
	 * Navigation structure for Admin UI.
	 * Maps section names to lists or arrays of lists.
	 */
	nav?: Record<string, string | string[]>;
	/**
	 * Middleware executed before static assets handling.
	 */
	"pre:static"?: express.RequestHandler | express.RequestHandler[];
	/**
	 * Middleware executed before body parser.
	 */
	"pre:bodyparser"?: express.RequestHandler | express.RequestHandler[];
	/**
	 * Middleware executed before session handling.
	 */
	"pre:session"?: express.RequestHandler | express.RequestHandler[];
	/**
	 * Middleware executed before logger.
	 */
	"pre:logger"?: express.RequestHandler | express.RequestHandler[];
	/**
	 * Middleware executed before Admin UI.
	 */
	"pre:admin"?: express.RequestHandler | express.RequestHandler[];
	/**
	 * Middleware executed before Admin UI routes.
	 */
	"pre:adminroutes"?: express.RequestHandler | express.RequestHandler[];
	/**
	 * Middleware executed before application routes.
	 */
	"pre:routes"?: express.RequestHandler | express.RequestHandler[];
	/**
	 * Middleware executed before rendering views.
	 */
	"pre:render"?: express.RequestHandler | express.RequestHandler[];
	/**
	 * Custom route handler function.
	 * @param app The Express application instance.
	 */
	routes?: (app: express.Application) => void;
	/**
	 * Trust proxy headers (X-Forwarded-For, etc).
	 * Default: true
	 */
	"trust proxy"?: boolean;
	/**
	 * Let's Encrypt configuration for auto-SSL.
	 * Default: false
	 */
	letsencrypt?:
		| boolean
		| {
				/** Email address for Let's Encrypt registration. */
				email: string;
				/** Domain names to secure. */
				domains: string[];
				/** Domain approval logic or flag. */
				approveDomains?: boolean | Function;
				/** Let's Encrypt server (production or staging). */
				server?: string;
		  };
	/**
	 * Logo for Admin UI signin page.
	 * String URL or [URL, height] array.
	 * Default: false
	 */
	"signin logo"?: string | [string, number];
	/**
	 * Custom URL for signin page.
	 * Default: false
	 */
	"signin url"?: string;
	/**
	 * Custom URL for signout page.
	 * Default: false
	 */
	"signout url"?: string;

	/**
	 * Allow any other custom options.
	 * Additional options will be accessible via keystone.get().
	 */
	[key: string]: any;
}

/**
 * Hook interface for Keystone's event system.
 */
interface Hook {
	callHook(event: string, ...args: any[]): any;
	addHook(event: string, handler: Function): void;
}

/**
 * Main Keystone class.
 * @see /lib/keystone/keystone.js - Main Keystone implementation
 */
export class Keystone {
	/** Hook system for events. */
	callHook: Hook["callHook"];
	addHook: Hook["addHook"];

	/** Map of all registered lists. */
	lists: Record<string, KeystoneList<any>>;
	/** Map of available field types. */
	fieldTypes: Record<string, any>;
	/** Path configuration object. */
	paths: Record<string, any>;
	/** Internal options storage. */
	_options: KeystoneGlobalOptions;
	/** URL redirect mappings. */
	_redirects: Record<
		string,
		string | { from: string; to: string; status?: number }
	>;

	/** Express application instance. */
	express: express.Express;
	/** Mongoose instance. */
	mongoose: typeof mongoose;

	/** Middleware instances. */
	middleware: {
		/** API middleware for serving JSON data. */
		api: any;
		/** CORS middleware for cross-origin requests. */
		cors: any;
	};

	/** Optional Express app (if provided via options). */
	app?: express.Express;
	/** Navigation structure for Admin UI. */
	nav?: {
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

	/** Prefixes model names with configured prefix. */
	prefixModel: (key: string) => string;

	/** Creates items in bulk (implementation details). */
	createItems: any;

	/** Express router factory. */
	createRouter: typeof express.Router;

	/** Gets lists with no relationships. */
	getOrphanedLists: () => KeystoneList<any>[];

	/** Creates module importer function. */
	importer: (moduleRoot: string) => (dirname: string) => Record<string, any>;

	/** Initialization methods. */
	init: any;
	initDatabaseConfig: any;
	initExpressApp: any;
	initExpressSession: any;
	initNav: any;

	/** Gets a list by key. */
	list: (key: string) => KeystoneList<any> | undefined;

	/** Populates related fields (implementation details). */
	populateRelated: any;

	/**
	 * Defines URL redirects.
	 * @param from Source URL or redirect mapping object.
	 * @param to Destination URL (if from is string).
	 * @param status HTTP status code (default: 302).
	 */
	redirect: (
		from: string | Record<string, string | number>,
		to?: string,
		status?: number
	) => void;

	/** Wraps HTML error responses. */
	wrapHTMLError: any;

	/** Creates Keystone password hash. */
	createKeystoneHash: any;

	/** Console utilities. */
	console: { err(type: string, msg: string): void };

	/** Admin UI server. */
	Admin: { Server: any };
	/** Email utilities. */
	Email: any;
	/** Field type system. */
	Field: KeystoneTypeConstructor & {
		Types: {
			/** Standard text field. */
			Text?: any;
			/** Numeric field with formatting options. */
			Number?: any;
			/** Multi-line text field. */
			Textarea?: any;
			/** Boolean/checkbox field. */
			Boolean?: any;
			/** Single-select dropdown/radio field. */
			Select?: any;
			/** Combined date and time field. */
			Datetime?: any;
			/** Date-only field. */
			Date?: any;
			/** Rich text WYSIWYG editor field. */
			Html?: any;
			/** Relationship to other list items. */
			Relationship?: any;
			/** Name field (first/last name). */
			Name?: any;
			/** Email field with validation. */
			Email?: any;
			/** Password field with encryption. */
			Password?: any;
			/** Currency field with formatting. */
			Money?: any;
			// ... other core types ...
			[key: string]: KeystoneTypeConstructor | undefined;
		};
	};

	/** Keystone class reference. */
	Keystone: typeof Keystone;
	/** List constructor. */
	List: KeystoneListConstructor;
	/** Storage system. */
	Storage: any;
	/** View system. */
	View: any;
	/** Content system. */
	content: any;
	/** Security utilities. */
	security: { csrf: any };
	/** Utility functions. */
	utils: any;
	/** Session management. */
	session: any;
	/** Keystone version. */
	version: string;

	/** Routes method (deprecated). */
	routes: () => never;

	/** Express session middleware. */
	expressSession?: express.RequestHandler;

	/** HTTP and HTTPS servers. */
	httpServer?: http.Server;
	httpsServer?: https.Server;
}
