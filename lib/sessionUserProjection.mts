import type { SessionUser } from '../types/express.js';
import { userCanAccessKeystone } from './canAccessKeystone.mjs';
import { isPasswordField } from './security/passwordFieldRedaction.mjs';

/**
 * Client-safe view of the authenticated user.
 *
 * This is the only shape Keystone serializes to browsers for `req.user`
 * (session API responses). It is an allowlist: fields not named here are never
 * emitted, so password hashes and other application-private user fields are
 * not part of session responses.
 */
export interface SessionUserProjection {
	/** Document id as a string (`user.id`, falling back to `user._id`). */
	id: string;
	/** Display name resolved through the user list's name field, when one exists. */
	name?: string;
	/** Email address, when the user document has a string `email`. */
	email?: string;
	/** Resolved Admin UI access flag, when the user model defines `canAccessKeystone`. */
	canAccessKeystone?: boolean;
}

/** The parts of a Keystone list the projection reads; duck-typed so plain stubs work in tests. */
export interface SessionUserProjectionList {
	fields?: Record<string, unknown>;
	namePath?: string;
	getDocumentName?(doc: Record<string, unknown>, escape?: boolean): string;
}

// Matches bcrypt hashes in modular crypt format ($2a$10$..., $2b$, $2x$, $2y$, legacy $2$).
const BCRYPT_HASH_RE = /^\$2[abxy]?\$\d{2}\$/;

function looksLikeHash(value: string): boolean {
	return BCRYPT_HASH_RE.test(value);
}

function safeString(value: unknown): string | undefined {
	if (typeof value !== 'string') return undefined;
	const trimmed = value.trim();
	if (!trimmed || looksLikeHash(trimmed)) return undefined;
	return trimmed;
}

function resolveId(user: SessionUser): string {
	// `id` is typed as always present, but plain/lean user objects may only carry `_id`.
	const raw: unknown = (user as { id?: unknown }).id ?? user['_id'];
	if (raw === undefined || raw === null) return '';
	if (typeof raw === 'string') return raw;
	// ObjectId, numbers and other id types all stringify to their canonical form.
	return String(raw as { toString(): string });
}

function resolveName(user: SessionUser, list: SessionUserProjectionList | null | undefined, id: string): string | undefined {
	const namePath = list?.namePath;
	if (namePath && isPasswordField(list, namePath)) return undefined;

	// Lists without a name field map `namePath` to `_id`; that is not a display name.
	if (list && typeof list.getDocumentName === 'function' && namePath && namePath !== '_id' && namePath !== 'id') {
		try {
			const fromList = safeString(list.getDocumentName(user));
			if (fromList && fromList !== id && fromList !== 'undefined' && fromList !== 'null') return fromList;
		} catch {
			// Fall through to the plain `user.name` resolution below.
		}
	}

	if (isPasswordField(list, 'name')) return undefined;
	const name = user['name'];
	if (typeof name === 'string') return safeString(name);
	if (name !== null && typeof name === 'object' && !Array.isArray(name)) {
		const parts = name as { first?: unknown; last?: unknown };
		const first = typeof parts.first === 'string' ? parts.first.trim() : '';
		const last = typeof parts.last === 'string' ? parts.last.trim() : '';
		return safeString(`${first} ${last}`);
	}
	return undefined;
}

/**
 * Builds the client-safe projection of an authenticated user.
 *
 * Use this everywhere `req.user` is serialized to a client. Returns `undefined`
 * for a missing user so `{ user: projectSessionUser(req.user, list) }` keeps the
 * signed-out response shape (`{}`).
 *
 * @param user - The authenticated user document (`req.user`), if any.
 * @param list - The configured user list (`keystone.lists[keystone.get('user model')]`), if known.
 * @returns The safe projection, or `undefined` when there is no user.
 */
export function projectSessionUser(
	user: SessionUser | null | undefined,
	list?: SessionUserProjectionList | null
): SessionUserProjection | undefined {
	if (!user) return undefined;

	const id = resolveId(user);
	const projection: SessionUserProjection = { id };

	const name = resolveName(user, list, id);
	if (name !== undefined) projection.name = name;

	if (!isPasswordField(list, 'email')) {
		const email = safeString(user['email']);
		if (email !== undefined) projection.email = email;
	}

	if (user.canAccessKeystone !== undefined) {
		projection.canAccessKeystone = userCanAccessKeystone(user);
	}

	return projection;
}

/**
 * Resolves the configured user list from a Keystone instance and projects the user.
 *
 * @param keystone - Keystone instance (or `undefined` when the request has none).
 * @param user - The authenticated user document, if any.
 * @returns The safe projection, or `undefined` when there is no user.
 */
export function projectSessionUserFor(
	keystone: { get(key: string): unknown; lists?: Record<string, unknown> } | null | undefined,
	user: SessionUser | null | undefined
): SessionUserProjection | undefined {
	if (!user) return undefined;
	const userModel = keystone?.get('user model');
	const list = typeof userModel === 'string' && userModel
		? keystone?.lists?.[userModel] as SessionUserProjectionList | undefined
		: undefined;
	return projectSessionUser(user, list);
}
