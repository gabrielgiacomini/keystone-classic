import { api } from './fetch.js';

/** Shape of the authenticated user object returned by the session API. */
export interface SessionUser {
  id: string;
  name?: string;
  email?: string;
  canAccessKeystone?: boolean;
  [key: string]: unknown;
}

/** Response from `GET /api/session`. */
export interface SessionResponse {
  user: SessionUser | null;
}

/** Request body for `POST /api/session/signin`. */
export interface SigninPayload {
  email: string;
  password: string;
}

/** Successful response from `POST /api/session/signin`. */
export interface SigninResponse {
  success: boolean;
  user: SessionUser;
}

/**
 * Fetches the current session info — the authenticated user, or `null` if
 * unauthenticated.
 */
export function getSession(): Promise<SessionResponse> {
  return api<SessionResponse>('/session');
}

/**
 * POSTs sign-in credentials. Resolves with the freshly authenticated user on
 * success; rejects on credential failure or transport error.
 *
 * @param payload Sign-in credentials.
 */
export function signin(payload: SigninPayload): Promise<SigninResponse> {
  return api<SigninResponse>('/session/signin', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * POSTs a sign-out request. The server clears the session cookie and the
 * caller should then redirect to `/signin`.
 */
export function signout(): Promise<unknown> {
  return api<unknown>('/session/signout', { method: 'POST' });
}
