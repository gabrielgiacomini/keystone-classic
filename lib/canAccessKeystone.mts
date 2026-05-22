/** Authenticated user shape for Keystone Admin UI access checks. */
export interface KeystoneAccessUser {
	/** Legacy virtual boolean or method-shaped Admin UI access gate. */
	canAccessKeystone?: boolean | (() => unknown);
}

/**
 * Resolves the legacy Admin UI access gate from either supported shape.
 *
 * Keystone 4 apps commonly expose `canAccessKeystone` as a Mongoose virtual
 * boolean, while some downstream helpers call it as a method. Support both
 * without granting access merely because a method value is truthy.
 *
 * @param user - Authenticated user document, if one is available.
 * @returns Whether the user is allowed to access the Keystone Admin UI.
 */
export function userCanAccessKeystone(user: KeystoneAccessUser | null | undefined): boolean {
	const access = user?.canAccessKeystone;
	if (typeof access === 'function') {
		return Boolean(access.call(user));
	}
	return Boolean(access);
}
