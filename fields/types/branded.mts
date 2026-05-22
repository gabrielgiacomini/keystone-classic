declare const __brand: unique symbol;
type Brand<T, B> = T & { readonly [__brand]: B };

/** A list's stable key — used to index keystone.lists. e.g. 'User', 'Post'. */
export type ListKey = Brand<string, 'ListKey'>;

/** A list's URL path slug — used in legacy admin URLs. e.g. 'users', 'posts'. */
export type ListPath = Brand<string, 'ListPath'>;

/** A MongoDB document id, as a string. e.g. '6a0a29ce5cea5214d684ab2a'. */
export type DocumentId = Brand<string, 'DocumentId'>;

/** A field path within a list. e.g. 'name.first', 'email'. */
export type FieldPath = Brand<string, 'FieldPath'>;

/** Helpers that mint branded values (the only legitimate sites that create them). */
/**
 * Casts a string to a branded ListKey.
 * @param s - The raw string to brand.
 * @returns The branded ListKey.
 */
export const asListKey = (s: string): ListKey => s as ListKey;
/**
 * Casts a string to a branded ListPath.
 * @param s - The raw string to brand.
 * @returns The branded ListPath.
 */
export const asListPath = (s: string): ListPath => s as ListPath;
/**
 * Casts a string to a branded DocumentId.
 * @param s - The raw string to brand.
 * @returns The branded DocumentId.
 */
export const asDocumentId = (s: string): DocumentId => s as DocumentId;
/**
 * Casts a string to a branded FieldPath.
 * @param s - The raw string to brand.
 * @returns The branded FieldPath.
 */
export const asFieldPath = (s: string): FieldPath => s as FieldPath;
