/**
 * Strongly-typed map of all Keystone configuration option keys and their value shapes.
 *
 * Used by `keystone.set(key, value)` / `keystone.get(key)` to provide
 * autocomplete and catch unknown-key typos. An index signature escape hatch
 * (`[key: string]: unknown`) is kept so that custom app-level keys still
 * compile; it will be removed in a future strict-mode step.
 */

import type { Application, RequestHandler } from 'express';
import type mongoose from 'mongoose';
import type { Store } from 'express-session';
import type { KeystoneListInheritanceSource } from '../list.mjs';

export interface KeystoneOptions {
	// ---- identity ----
	name?: string;
	brand?: string;
	'appversion'?: string;

	// ---- server / network ----
	env?: string;
	port?: number | string;
	host?: string;
	listen?: string;
	'unix socket'?: string;
	ssl?: boolean | string;
	'ssl port'?: number | string;
	'ssl host'?: string;
	'ssl key'?: string;
	'ssl cert'?: string;
	'ssl ca'?: string;
	'ssl pfx'?: string;
	/** PEM-encoded CA certificate(s) as a string. */
	'ssl ca data'?: string;
	/** PEM-encoded server certificate as a string. */
	'ssl cert data'?: string;
	/** PEM-encoded private key as a string. */
	'ssl key data'?: string;
	/** Passphrase for an encrypted private key. */
	'ssl passphrase'?: string;
	/** PFX/PKCS12 encoded private key and certificate chain as a string. */
	'ssl pfx data'?: string;
	/** The public-facing HTTPS port (when SSL terminates at a proxy). */
	'ssl public port'?: number | string;
	/** SNI callback returning per-hostname TLS credentials. */
	'ssl sni'?: (host: string) => Record<string, unknown>;
	/** Extra options forwarded to Node's `https.createServer()`. */
	'https server options'?: Record<string, unknown>;
	'trust proxy'?: boolean | string | string[];
	/** Let's Encrypt (greenlock-express) auto-provisioning options. */
	letsencrypt?: {
		/** Domain owner email address. */
		email: string;
		/** Domain(s) to provision certificates for. */
		domains: string | string[];
		/** Set to `true` to use the production Let's Encrypt API (default: staging). */
		production?: boolean;
		/** Must be `true` to agree to Let's Encrypt Terms of Service. */
		tos: boolean;
	};

	// ---- database ----
	mongo?: string;
	'mongo options'?: Record<string, unknown>;
	'mongo replica set'?: {
		username?: string;
		password?: string;
		authSource?: string;
		db: {
			servers: Array<{ host: string; port: number }>;
			name: string;
			replicaSetOptions?: { rs_name?: string; readPreference?: string };
		};
	};
	'db name'?: string;
	'auto update'?: boolean;
	/** Custom updates directory path used by automatic update application. */
	updates?: string;

	// ---- mongoose instance ----
	mongoose?: typeof mongoose;

	// ---- express app ----
	app?: Application;

	// ---- module / path resolution ----
	'module root'?: string;

	// ---- auth / session ----
	auth?: boolean | ((req: unknown, res: unknown, next: unknown) => void);
	'user model'?: string;
	session?: boolean | RequestHandler;
	'session options'?: Record<string, unknown>;
	'session store'?: 'mongo' | 'redis' | Store;
	'session store options'?: Record<string, unknown>;
	/** Session cookie max-age in milliseconds. Defaults to 86400000 (24 h). */
	'session age'?: number;
	'cookie secret'?: string;
	'cookie signin'?: boolean;
	'cookie signin options'?: Record<string, unknown>;

	// ---- security ----
	'frame guard'?: false | 'deny' | 'sameorigin';
	'allowed ip ranges'?: string;
	'ip range restrict'?: boolean;

	// ---- CORS ----
	'cors allow origin'?: string | string[] | false;
	'cors allow methods'?: string;
	'cors allow headers'?: string;

	// ---- admin UI ----
	/** Admin legacy React 15 panel path. Defaults to 'keystone'. */
	'admin legacy path'?: string;
	/** Admin next React 18 panel path when served beside admin legacy. Defaults to 'keystone-next'. */
	'admin next path'?: string;
	/** Canonical JSON/session/upload/list API path for admin clients and API-only usage. Defaults to 'keystone-api'. */
	'admin api path'?: string;
	'cache admin bundles'?: boolean;
	headless?: boolean;
	/** Which admin UI bundle(s) to serve. false = no UI, 'legacy' = admin legacy (default), 'next' = admin next, 'both' = both sibling panels, 'auto' = next unless custom legacy field browser code is detected. */
	'admin ui'?: false | 'legacy' | 'next' | 'both' | 'auto';
	/** Same-origin module script URL(s) loaded before admin-next starts. These scripts may set `window.Keystone.fieldComponents` or `window.Keystone.legacyFieldComponents`. */
	'admin next custom field scripts'?: string | string[];
	/** Whether to mount the admin API independently of UI mounting. Defaults to true unless headless is enabled. */
	'admin api'?: boolean;
	/** Temporary compatibility alias from /{admin legacy path}/api to /{admin api path}. Defaults to true during migration. */
	'admin legacy api alias'?: boolean;
	'back url'?: string;
	'signin url'?: string;
	'signout url'?: string;
	'signin redirect'?: string;
	'signout redirect'?: string;
	'signin logo'?: string | string[];
	'signin rate limit'?: false | {
		windowMs?: number | string;
		max?: number | string;
	};
	'signin lockout'?: false | {
		windowMs?: number | string;
		maxFailures?: number | string;
		durationMs?: number | string;
	};

	// ---- routing ----
	/** User-defined route handler: a (app) => void setup function, or a 3-argument Express middleware. */
	'routes'?: ((app: Application) => void) | ((req: unknown, res: unknown, next: unknown) => void);
	'pre:adminroutes'?: unknown;
	healthchecks?: unknown[];

	// ---- pre-route hooks ----
	/** Called with the Express app before the admin routes are mounted. */
	'pre:admin'?: (app: Application) => void;
	/** Called with the Express app before body-parser middleware is added. */
	'pre:bodyparser'?: (app: Application) => void;
	/** Called with the Express app before application routes are mounted. */
	'pre:routes'?: (app: Application) => void;
	/** Called with the Express app before session middleware is added. */
	'pre:session'?: (app: Application) => void;
	/** Called with the Express app before static-file middleware is added. */
	'pre:static'?: (app: Application) => void;
	/** Called with the Express app before error handlers are registered. */
	'pre:error'?: (app: Application) => void;

	// ---- error handlers ----
	/** Custom 404 handler: a middleware function or a view name to render. */
	'404'?: ((req: unknown, res: unknown, next: unknown) => void) | string;
	/** Custom 500 handler: an error-middleware function or a view name to render. */
	'500'?: ((err: unknown, req: unknown, res: unknown, next: unknown) => void) | string;

	// ---- views / templating ----
	'view engine'?: string;
	'custom engine'?: unknown;
	views?: string;
	/** Custom view constructor passed to Express `app.set('view', ctor)`. */
	'view'?: unknown;
	'language options'?: Record<string, unknown>;

	// ---- CSS/view middleware ----
	/** Enable response compression. */
	'compress'?: boolean;
	/** Path to a favicon file, served at /favicon.ico. */
	'favicon'?: string;
	/** Directory (or directories) of Less source files. */
	'less'?: string | string[];
	/** Options passed to the Less middleware. */
	'less options'?: Record<string, unknown>;
	/** Directory (or directories) of Sass source files. */
	'sass'?: string | string[];
	/** Options passed to the Sass middleware. */
	'sass options'?: Record<string, unknown>;
	/** Directory (or directories) of Stylus source files. */
	'stylus'?: string | string[];
	/** Options passed to the Stylus middleware. */
	'stylus options'?: Record<string, unknown>;
	/** Directory (or directories) served as static files. */
	'static'?: string | string[];
	/** Options passed to the static-file middleware. */
	'static options'?: Record<string, unknown>;

	// ---- body parser & upload ----
	/** Maximum file size accepted by the body parser (e.g. `'5mb'` or a byte count). */
	'file limit'?: string | number;
	/** Options forwarded to Multer for multipart/form-data handling. */
	'multer options'?: Record<string, unknown>;

	// ---- logger ----
	logger?: string | false;
	/** Options forwarded to the logging middleware (e.g. Morgan). */
	'logger options'?: Record<string, unknown>;
	/** Custom logging middleware function `(req, res, next)`. */
	'logging middleware'?: (req: unknown, res: unknown, next: unknown) => void;
	/** Key/value pairs merged into `res.locals` on every request. */
	'locals'?: Record<string, unknown>;

	// ---- email ----
	'email transport'?: string | object;
	emails?: string;
	'mandrill api key'?: string;
	'mandrill username'?: string;

	// ---- storage: Cloudinary ----
	'cloudinary config'?: boolean | {
		cloud_name?: string;
		api_key?: string;
		api_secret?: string;
		private_cdn?: boolean;
		secure_distribution?: string;
	};
	'cloudinary folders'?: boolean;
	'cloudinary prefix'?: string;
	'cloudinary progressive'?: boolean;
	'cloudinary secure'?: boolean;
	'cloudinary webp'?: boolean;

	// ---- storage: S3 ----
	's3 config'?: {
		bucket: string;
		key: string;
		secret: string;
		region?: string;
		/** Custom S3-compatible endpoint (e.g. MinIO, DigitalOcean Spaces). */
		endpoint?: string;
		/** Force path-style URLs instead of virtual-hosted-style (needed by some S3-compatible services). */
		forcePathStyle?: boolean;
		/** Optional path prefix within the S3 bucket. */
		s3path?: string;
		/** Optional root URL for served assets (overrides default S3 URL). */
		root?: string;
		/** Default headers to merge into every upload (flat `name/value` pairs or a plain object). */
		'default headers'?: Array<{ name: string; value: string }> | Record<string, string>;
	};

	// ---- storage: default region ----
	'default region'?: string;
	'handle uploads'?: boolean;
	'download limit'?: number | string;
	'csv field delimiter'?: string;
	'csv expanded'?: boolean;

	// ---- navigation ----
	/** Admin UI nav sections: `{ 'Section Label': ['list-path', ...] }`. Set via `keystone.set('nav', obj)`. */
	nav?: Record<string, string | string[]>;

	// ---- analytics ----
	'ga property'?: string;
	'ga domain'?: string;
	'chartbeat property'?: string;
	'chartbeat domain'?: string;

	// ---- APIs ----
	'google api key'?: string;
	'google server api key'?: string;

	// ---- wysiwyg (TinyMCE) ----
	'wysiwyg additional buttons'?: string;
	'wysiwyg additional options'?: Record<string, unknown>;
	'wysiwyg additional plugins'?: string;
	'wysiwyg cloudinary images'?: boolean;
	'wysiwyg cloudinary images filenameAsPublicID'?: boolean;
	'wysiwyg images'?: boolean;
	'wysiwyg importcss'?: string;
	'wysiwyg menubar'?: boolean;
	'wysiwyg override toolbar'?: boolean;
	'wysiwyg s3 images'?: boolean;
	'wysiwyg skin'?: string;
	'codemirror url path'?: string;

	// ---- list-level defaults (may be set on a per-List basis too) ----
	autokey?: unknown;
	defaultColumns?: string;
	defaultSort?: string;
	history?: boolean;
	inherits?: unknown;
	label?: string;
	'model prefix'?: string | null;
	noedit?: boolean;
	notes?: string;
	path?: string;
	plural?: string;
	searchFields?: string;
	singular?: string;
	sortable?: boolean;
	track?: boolean;

}

/**
 * Public alias for {@link KeystoneOptions}.
 *
 * Historically some typings used `KeystoneGlobalOptions` to refer to the
 * top-level Keystone configuration map.  This alias keeps those consumers
 * compiling without requiring any source changes.
 */
export type KeystoneGlobalOptions = KeystoneOptions;

// ---------------------------------------------------------------------------
// Phase 1 — Explicit List Registration Options
// ---------------------------------------------------------------------------

/**
 * Per-field tracking configuration for the `track` list option.
 * Set individual fields to `false` to disable them, or to a string to
 * customise the field path.
 */
export interface TrackOptions {
	/** Track who created the document. Defaults to `'createdBy'`. */
	createdBy?: boolean | string;
	/** Track when the document was created. Defaults to `'createdAt'`. */
	createdAt?: boolean | string;
	/** Track who last updated the document. Defaults to `'updatedBy'`. */
	updatedBy?: boolean | string;
	/** Track when the document was last updated. Defaults to `'updatedAt'`. */
	updatedAt?: boolean | string;
}

/**
 * Configuration for the `autokey` list option.
 * Keystone will auto-generate a URL-slug field (at `path`) from one or more
 * source field paths (in `from`) before each save.
 */
export interface AutokeySpec {
	/** The field path to write the generated key into (e.g. `'slug'`). */
	path: string;
	/**
	 * One or more source field paths to build the key from.
	 * Accepts a space-separated string or an array of path strings.
	 */
	from: string | string[];
	/**
	 * When `true`, appends an incrementing suffix to ensure uniqueness across
	 * the collection.  Can also be a `Record<string, unknown>` scoping object.
	 */
	unique?: boolean | Record<string, unknown>;
	/** When `true`, the generated key is fixed after initial creation. */
	fixed?: boolean;
	/** Ignore missing source values instead of throwing. */
	ignoreIncompleteSource?: boolean;
	/** Legacy typo alias for `ignoreIncompleteSource`. */
	ingoreIncompleteSource?: boolean;
}

/**
 * Required options for every Keystone List.
 *
 * Phase 1 of the quality-d type-safety initiative — these were previously
 * implicit defaults applied silently inside the List constructor.  They are
 * now declared explicitly at every list registration site so readers know
 * what each option does.
 *
 * Runtime default-fallback code in the List constructor is preserved during
 * Phase 1 as a belt-and-suspenders safety net; it will be removed in Phase 1
 * iteration 11 once every call site has been confirmed explicit.
 */
export interface ExplicitListOptions {
	// ---- permissions ----
	/** Prevent editing items through the Admin UI. */
	noedit: boolean;
	/** Prevent creating items through the Admin UI. */
	nocreate: boolean;
	/** Prevent deleting items through the Admin UI. */
	nodelete: boolean;
	/** Hide the list from the main Admin UI navigation. */
	hidden: boolean;

	// ---- sorting ----
	/** Enable drag-and-drop sorting in the Admin UI. */
	sortable: boolean;
	/**
	 * Default sort field/path.  Use `'-'` prefix for descending order.
	 * Use `'__default__'` to let Keystone pick: `'sortOrder'` when `sortable`
	 * is `true`, otherwise the list's `namePath`.
	 */
	defaultSort: string;

	// ---- search ----
	/**
	 * Fields to include in text searches in the Admin UI list view.
	 * Accepts a comma-separated string (legacy) or an array of field paths.
	 */
	searchFields: readonly string[] | string;
	/** Use a MongoDB text index for searching instead of regex. */
	searchUsesTextIndex: boolean;

	// ---- admin UI display ----
	/**
	 * Default columns to display in the Admin UI list view.
	 * Accepts a comma-separated string (legacy) or an array of field paths.
	 * Will be narrowed to `readonly string[]` in Phase 3.
	 */
	defaultColumns: readonly string[] | string;
	/** Default number of items per page in the Admin UI list view. */
	perPage: number;

	// ---- schema plugins ----
	/**
	 * Enable automatic tracking fields.
	 * `true` enables all four fields with default paths; `false` disables all.
	 * Pass a {@link TrackOptions} object to configure individual fields.
	 */
	track: boolean | TrackOptions;
	/**
	 * Auto-key configuration.
	 * `null` disables auto-key generation.  Pass an {@link AutokeySpec} to
	 * enable slug generation from one or more source paths.
	 */
	autokey: AutokeySpec | null;

	// ---- optional identity / routing ----
	/** Inherit schema and options from another List instance. */
	inherits?: KeystoneListInheritanceSource;
	/** Explicit label for the list (e.g. `'Blog Post'`). Computed from key if omitted. */
	label?: string;
	/** Singular label (e.g. `'Post'`). Computed from `label` if omitted. */
	singular?: string;
	/** Plural label (e.g. `'Posts'`). Computed from `label` if omitted. */
	plural?: string;
	/** URL path in the Admin UI (e.g. `'posts'`). Computed from key if omitted. */
	path?: string;
	/** Field path remapping (e.g. `{ name: 'title' }` to use `title` as the display name). */
	map?: { name?: string };
}
