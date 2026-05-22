/**
 * Thin wrappers over Playwright's `request` fixture for the Keystone
 * REST endpoints exercised by the spec suite.
 *
 * Centralising the route prefixes here means specs read like
 * declarative client code, and route changes in `admin/server/api/`
 * have one obvious place to update.
 */

import type { APIRequestContext, APIResponse } from '@playwright/test';
import { API_BASE } from '../fixtures/server.js';

/**
 * GET the current session. Returns `{ user: undefined }` when signed
 * out, or `{ user: <user> }` when signed in.
 * @param request Playwright request context.
 * @returns The raw session response.
 */
export async function getSession (request: APIRequestContext): Promise<APIResponse> {
	return request.get(`${API_BASE}/session`);
}

/**
 * POST to the signin endpoint with the given credentials.
 * @param request Playwright request context.
 * @param email Account email.
 * @param password Account password.
 * @returns The signin response.
 */
export async function signin (
	request: APIRequestContext,
	email: string,
	password: string,
): Promise<APIResponse> {
	return request.post(`${API_BASE}/session/signin`, {
		data: { email, password },
	});
}

/**
 * POST to the signout endpoint.
 * @param request Playwright request context.
 * @returns The signout response.
 */
export async function signout (request: APIRequestContext): Promise<APIResponse> {
	return request.post(`${API_BASE}/session/signout`);
}

/**
 * GET a list with optional querystring (search / pagination / etc).
 * @param request Playwright request context.
 * @param list Lowercase list path (e.g. "post").
 * @param query Optional querystring params.
 * @returns The list-get response.
 */
export async function getList (
	request: APIRequestContext,
	list: string,
	query?: Record<string, string | number | boolean>,
): Promise<APIResponse> {
	const qs = query
		? '?'
			+ Object.entries(query)
				.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
				.join('&')
		: '';
	return request.get(`${API_BASE}/${list}${qs}`);
}

/**
 * Create a new item in `list`. Field names use the form-style dotted
 * paths Keystone expects (e.g. "name.first").
 * @param request Playwright request context.
 * @param list Lowercase list path.
 * @param data Field values keyed by dotted path.
 * @returns The create response.
 */
export async function createItem (
	request: APIRequestContext,
	list: string,
	data: Record<string, unknown>,
): Promise<APIResponse> {
	return request.post(`${API_BASE}/${list}/create`, { data });
}

/**
 * Update an existing item by id.
 * @param request Playwright request context.
 * @param list Lowercase list path.
 * @param id Item id.
 * @param data Field values keyed by dotted path.
 * @returns The update response.
 */
export async function updateItem (
	request: APIRequestContext,
	list: string,
	id: string,
	data: Record<string, unknown>,
): Promise<APIResponse> {
	return request.post(`${API_BASE}/${list}/${id}`, { data });
}

/**
 * Delete an item by id.
 * @param request Playwright request context.
 * @param list Lowercase list path.
 * @param id Item id.
 * @returns The delete response.
 */
export async function deleteItem (
	request: APIRequestContext,
	list: string,
	id: string,
): Promise<APIResponse> {
	return request.post(`${API_BASE}/${list}/${id}/delete`);
}

/**
 * GET a single item by id.
 * @param request Playwright request context.
 * @param list Lowercase list path.
 * @param id Item id.
 * @returns The item-get response.
 */
export async function getItem (
	request: APIRequestContext,
	list: string,
	id: string,
): Promise<APIResponse> {
	return request.get(`${API_BASE}/${list}/${id}`);
}
