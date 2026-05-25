// CSRF: the server sets an XSRF-TOKEN cookie (see lib/security/csrf.mts).
// The server validates the token from the x-csrf-token or x-xsrf-token header.
// For GET requests no token is needed (the server skips CSRF for safe methods).
// For mutating requests, read document.cookie for XSRF-TOKEN and send it as
// x-xsrf-token. credentials: 'include' ensures the session cookie is sent on
// every request — the cookie path is '/' (no sub-path restriction).

function getXsrfToken(): string {
  const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/);
  return match?.[1] != null ? decodeURIComponent(match[1]) : '';
}

function getAdminApiBasepath(): string {
  const keystone = (window as Window & {
    Keystone?: { adminApiPath?: unknown };
  }).Keystone;
  return typeof keystone?.adminApiPath === 'string' && keystone.adminApiPath.length > 0
    ? keystone.adminApiPath
    : '/keystone-api';
}

export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(status: number, body: unknown) {
    super(`HTTP ${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

/**
 * Thin fetch wrapper for the Keystone admin API. Prepends the server-provided
 * admin API base path, sends credentials with every request, and attaches the
 * `x-xsrf-token` header for mutating verbs (the server's CSRF middleware
 * skips safe methods).
 * @template T Expected JSON response shape.
 * @param path API path beginning with `/`.
 * @param init Standard `fetch` init bag (method, body, headers, etc.).
 * @returns Promise resolving to the parsed JSON response.
 */
export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const method = (init.method ?? 'GET').toUpperCase();
  const isMutating = method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS';
  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');
  if (!(init.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (isMutating && !headers.has('x-xsrf-token') && !headers.has('x-csrf-token')) {
    headers.set('x-xsrf-token', getXsrfToken());
  }

  const res = await fetch(`${getAdminApiBasepath()}${path}`, {
    ...init,
    credentials: 'include',
    headers,
  });
  if (!res.ok) {
    let body: unknown = null;
    try {
      body = await res.json();
    } catch {
      body = await res.text().catch(() => null);
    }
    throw new ApiError(res.status, body);
  }
  return res.json() as Promise<T>;
}
