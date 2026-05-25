import { expect } from 'chai';

import { api } from '../../../../../admin/shared/api/fetch.ts';

interface FetchCall {
	url: string;
	init: RequestInit;
}

function installBrowserApiTestGlobals(cookie: string, adminApiPath = '/custom-api') {
	const calls: FetchCall[] = [];
	const hadDocument = 'document' in globalThis;
	const hadWindow = 'window' in globalThis;
	const originalDocument = globalThis.document;
	const originalWindow = globalThis.window;
	const originalFetch = globalThis.fetch;

	Object.defineProperty(globalThis, 'document', {
		configurable: true,
		value: { cookie },
	});
	Object.defineProperty(globalThis, 'window', {
		configurable: true,
		value: { Keystone: { adminApiPath } },
	});
	globalThis.fetch = ((url: string | URL | Request, init?: RequestInit) => {
		const requestUrl = url instanceof Request ? url.url : url.toString();
		calls.push({ url: requestUrl, init: init ?? {} });
		return Promise.resolve({
			ok: true,
			json() {
				return Promise.resolve({ ok: true });
			},
		} as Response);
	}) as typeof fetch;

	return {
		calls,
		restore() {
			if (!hadDocument) {
				delete (globalThis as { document?: Document }).document;
			} else {
				Object.defineProperty(globalThis, 'document', {
					configurable: true,
					value: originalDocument,
				});
			}
			if (!hadWindow) {
				delete (globalThis as { window?: Window }).window;
			} else {
				Object.defineProperty(globalThis, 'window', {
					configurable: true,
					value: originalWindow,
				});
			}
			globalThis.fetch = originalFetch;
		},
	};
}

describe('admin shared API fetch wrapper', function () {
	it('uses the injected admin API path and omits CSRF for safe methods', async function () {
		const browser = installBrowserApiTestGlobals('XSRF-TOKEN=safe-token', '/manage-api');
		try {
			await api('/session');
		} finally {
			browser.restore();
		}

		expect(browser.calls).to.have.length(1);
		expect(browser.calls[0]?.url).to.equal('/manage-api/session');
		expect(browser.calls[0]?.init.credentials).to.equal('include');
		const headers = browser.calls[0]?.init.headers as Headers;
		expect(headers.get('Accept')).to.equal('application/json');
		expect(headers.get('Content-Type')).to.equal('application/json');
		expect(headers.has('x-xsrf-token')).to.equal(false);
	});

	it('sends x-xsrf-token for mutating JSON requests', async function () {
		const browser = installBrowserApiTestGlobals('other=1; XSRF-TOKEN=mutating%20token', '/manage-api');
		try {
			await api('/session/signin', {
				method: 'POST',
				body: JSON.stringify({ email: 'admin@example.test', password: 'secret' }),
			});
		} finally {
			browser.restore();
		}

		const headers = browser.calls[0]?.init.headers as Headers;
		expect(headers.get('x-xsrf-token')).to.equal('mutating token');
		expect(headers.get('Content-Type')).to.equal('application/json');
	});

	it('does not force JSON content type for FormData uploads', async function () {
		const browser = installBrowserApiTestGlobals('XSRF-TOKEN=upload-token', '/manage-api');
		try {
			await api('/file/upload', {
				method: 'POST',
				body: new FormData(),
			});
		} finally {
			browser.restore();
		}

		const headers = browser.calls[0]?.init.headers as Headers;
		expect(headers.get('x-xsrf-token')).to.equal('upload-token');
		expect(headers.has('Content-Type')).to.equal(false);
	});
});
