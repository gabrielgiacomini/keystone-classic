function getXsrfToken() {
	const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/);
	return match && match[1] != null ? decodeURIComponent(match[1]) : '';
}

function isMutatingMethod(method) {
	return method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS';
}

function parseBody(response, bodyText, wantsJson) {
	if (!bodyText) return null;
	if (wantsJson) return JSON.parse(bodyText);
	const contentType = response.headers.get('content-type') || '';
	return contentType.indexOf('application/json') !== -1 ? JSON.parse(bodyText) : bodyText;
}

/**
 * Transitional fetch adapter for legacy admin code that still expects xhr's
 * callback contract: callback(err, resp, body).
 */
export function legacyApiRequest(options, callback) {
	const method = (options.method || 'GET').toUpperCase();
	const headers = new Headers(options.headers || {});
	const body = options.json !== undefined
		? JSON.stringify(options.json)
		: options.body;

	headers.set('Accept', 'application/json');
	if (options.json !== undefined && !headers.has('Content-Type')) {
		headers.set('Content-Type', 'application/json');
	}
	if (isMutatingMethod(method) && !headers.has('x-xsrf-token') && !headers.has('x-csrf-token')) {
		headers.set('x-xsrf-token', getXsrfToken());
	}

	fetch(options.url, {
		method,
		credentials: 'include',
		headers,
		body,
	}).then((response) => {
		return response.text().then((bodyText) => {
			const resp = {
				status: response.status,
				statusCode: response.status,
				headers: response.headers,
			};
			const parsedBody = parseBody(response, bodyText, options.responseType === 'json' || options.json !== undefined);
			callback(null, resp, parsedBody);
		});
	}).catch((error) => {
		callback(error);
	});
}
