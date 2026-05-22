/**
 * Shared error-first callback types for Keystone's public API.
 *
 * Use these instead of hand-writing `(err: Error | null, result?: T) => void`
 * at every call-site. They are intentionally simple — no discriminated unions —
 * matching the Node.js/Mongoose convention consumers already know.
 */

/** Standard Node-style error-first callback. Result is optional on success. */
export type Callback<T = void> = (err: Error | null, result?: T) => void;

/** Variant where a result is always present on success (err === null). */
export type CallbackRequired<T> = (err: null, result: T) => void;

/** Mongoose-style document callback — doc may be null when not found. */
export type DocCallback<T> = (err: Error | null, doc: T | null) => void;
