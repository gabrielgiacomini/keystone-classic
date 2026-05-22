/**
 * Express module augmentation — declares the custom properties Keystone
 * attaches to `req`, `res`, and `res.locals` so TypeScript route handlers
 * are fully typed without per-file casts.
 */

import 'express';
import type { Keystone } from '../index.mjs';
import type { KeystoneFlashError } from '../lib/updateHandler.mjs';
import type { KeystoneList } from '../lib/list.mjs';

// Re-export so external consumers can import KeystoneList from this module.
export type { KeystoneList };

/** Supported shapes for Keystone Admin UI access checks on authenticated users. */
export type CanAccessKeystone = boolean | (() => boolean);

/**
 * Minimal interface for the authenticated user document stored on `req.user`.
 * The actual shape depends on the application's User model; this covers the
 * properties that Keystone's own server code reads from `req.user`.
 */
export interface SessionUser {
	/** MongoDB document id. */
	id: string;
	/** Set to `true` on users that are allowed to access the Keystone Admin UI. */
	canAccessKeystone?: CanAccessKeystone;
	/** Hashed password – used for cookie-based sign-in token generation. */
	password?: string;
	/** Catch-all for any other properties the application adds to its User model. */
	[key: string]: unknown;
}

declare module 'express-serve-static-core' {
	interface Request {
		/** Keystone singleton, set by admin dynamic router. */
		keystone?: Keystone;
		/** Resolved List instance, set by admin `initList` middleware. */
		list?: KeystoneList;
		/**
		 * Authenticated user document.  Set by `lib/session.signinWithUser`; set
		 * to `null` by `lib/session.signout` and on failed cookie sign-in.
		 */
		user?: SessionUser | null;
		/** Request language, set by `lib/middleware/language`. */
		language?: string;
		/**
		 * Store a flash message.  Widens the connect-flash overload so callers
		 * can pass either a plain string or a structured `KeystoneFlashError`
		 * object (which Keystone stores in the flash store and the Admin UI
		 * renderer reads back as a rich error object).
		 */
		flash(type: string, msg: string | KeystoneFlashError | (string | KeystoneFlashError)[]): number;
		/**
		 * Files uploaded by multer middleware, keyed by fieldname.
		 * After `handleUploadedFiles` processes them, each value is either a single
		 * `Multer.File` (first upload for a fieldname) or an array when multiple
		 * files share the same fieldname.  The raw multer output (`upload.any()`)
		 * is an array; Keystone normalises it to this dict shape.
		 */
		files?: Record<string, Express.Multer.File | Express.Multer.File[]> | undefined;
	}

	interface Response {
		/**
		 * Sends a JSON API success response.
		 * Defined by `lib/middleware/api.mjs`.
		 */
		apiResponse(data: unknown): void;
		/**
		 * Sends a JSON API error response.
		 * Overloads: apiError(statusCode, error?, detail?, code?) or apiError(error, detail?)
		 * `lib/middleware/api.mjs` uses 4-arg form; `admin/server/middleware/apiError.mjs` uses 3-arg form.
		 */
		apiError(
			statusOrKey: number | string,
			errorOrDetail?: unknown,
			detail?: unknown,
			code?: number
		): void;
		/**
		 * Admin-specific error helper (shorthand for 404).
		 * Defined by `lib/middleware/api.mjs` and `admin/server/middleware/apiError.mjs`.
		 */
		apiNotFound(err?: unknown, msg?: string): void;
		/**
		 * Admin-specific error helper (shorthand for 403).
		 * Defined by `lib/middleware/api.mjs` and `admin/server/middleware/apiError.mjs`.
		 */
		apiNotAllowed(err?: unknown, msg?: string): void;
		/**
		 * Admin-specific error helper (shorthand for 403).
		 * Defined by `admin/server/middleware/apiError.mjs`.
		 */
		apiForbidden?: (err?: unknown, msg?: string) => void;
		/**
		 * Logs an error with context. Defined by `admin/server/middleware/logError.mjs`.
		 * @param context - Route or endpoint label shown in brackets.
		 * @param description - Human-readable description; omit to fall back to "error:".
		 * @param err - Optional error object; message and stack are printed when provided.
		 */
		logError(context: string, description: string, err?: unknown): void;
	}

	interface Locals {
		/** CSRF token key name stored in locals, set by `lib/security/csrf`. */
		csrf_token_key?: string;
		/** CSRF token value stored in locals, set by `lib/security/csrf`. */
		csrf_token_value?: string;
	}
}
