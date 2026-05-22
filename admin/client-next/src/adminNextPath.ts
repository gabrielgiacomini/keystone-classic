type KeystoneRuntimeConfig = {
  adminLegacyPath: string;
  adminNextPath: string;
  adminApiPath: string;
  brand: string;
  version: string;
  backUrl: string;
  /** Display name of the authenticated user, if a session is present. */
  signedInUser?: string;
};

declare global {
  interface Window {
    Keystone?: KeystoneRuntimeConfig;
  }
}

const DEFAULT_ADMIN_NEXT_BASEPATH = '/keystone-next';
const DEFAULT_ADMIN_API_BASEPATH = '/keystone-api';

function normalizeBasepath(value: string | undefined, fallback: string): string {
  const raw = value != null && value.trim().length > 0 ? value.trim() : fallback;
  const normalized = raw.replace(/^\/+|\/+$/g, '');
  return `/${normalized}`;
}

export function getAdminNextBasepath(): string {
  return normalizeBasepath(window.Keystone?.adminNextPath, DEFAULT_ADMIN_NEXT_BASEPATH);
}

export function getAdminApiBasepath(): string {
  return normalizeBasepath(window.Keystone?.adminApiPath, DEFAULT_ADMIN_API_BASEPATH);
}

export function buildAdminNextPath(path = '/'): string {
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return `${getAdminNextBasepath()}${suffix}`;
}

/** Returns the server-provided brand name. */
export function getBrandName(): string {
  return window.Keystone?.brand ?? '';
}

/** Returns the server-provided KeystoneJS version. */
export function getKeystoneVersion(): string {
  return window.Keystone?.version ?? '';
}

/**
 * Returns the URL to the public site / app.
 * Mirrors `Keystone.backUrl` in the legacy bootstrap.
 */
export function getBackUrl(): string {
  return window.Keystone?.backUrl ?? '/';
}

/** Display name of the authenticated user, or `null` when no session. */
export function getSignedInUser(): string | null {
  return window.Keystone?.signedInUser ?? null;
}

/** Path to the next admin sign-out endpoint. */
export function getSignoutPath(): string {
  return buildAdminNextPath('/signout');
}
