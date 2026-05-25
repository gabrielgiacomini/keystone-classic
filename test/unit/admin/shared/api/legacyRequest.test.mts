import { expect } from 'chai';

import { legacyApiRequest } from '../../../../../admin/shared/api/legacyRequest.mjs';

interface FetchCall {
	url: string;
	init: RequestInit;
}

function installLegacyRequestGlobals(cookie: string) {
	const calls: FetchCall[] = [];
	const hadDocument = 'document' in globalThis;
	const originalDocument = globalThis.document;
	const originalFetch = globalThis.fetch;

	Object.defineProperty(globalThis, 'document', {
		configurable: true,
		value: { cookie },
	});
	globalThis.fetch = ((url: string | URL | Request, init?: RequestInit) => {
		const requestUrl = url instanceof Request ? url.url : url.toString();
		calls.push({ url: requestUrl, init: init ?? {} });
		return Promise.resolve(new Response(JSON.stringify({ counts: { Posts: 2 } }), {
			status: 200,
			headers: { 'content-type': 'application/json' },
		}));
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
			globalThis.fetch = originalFetch;
		},
	};
}

function request(options: Record<string, unknown>) {
	return new Promise<{ resp: { statusCode: number }; body: unknown }>((resolve, reject) => {
		legacyApiRequest(options, (error: Error | null, resp: { statusCode: number }, body: unknown) => {
			if (error) reject(error);
			else resolve({ resp, body });
		});
	});
}

describe('admin shared legacy API request adapter', function () {
	it('preserves the legacy callback response shape for JSON GET requests', async function () {
		const browser = installLegacyRequestGlobals('XSRF-TOKEN=legacy-token');
		try {
			const result = await request({ url: '/keystone-api/counts' });
			expect(result.resp.statusCode).to.equal(200);
			expect(result.body).to.deep.equal({ counts: { Posts: 2 } });
		} finally {
			browser.restore();
		}

		expect(browser.calls[0]?.url).to.equal('/keystone-api/counts');
		const headers = browser.calls[0]?.init.headers as Headers;
		expect(headers.get('Accept')).to.equal('application/json');
		expect(headers.has('x-xsrf-token')).to.equal(false);
	});

	it('adds CSRF and JSON headers for mutating JSON requests', async function () {
		const browser = installLegacyRequestGlobals('XSRF-TOKEN=legacy%20token');
		try {
			await request({
				url: '/keystone-api/Post/delete',
				method: 'POST',
				json: { ids: ['1'] },
			});
		} finally {
			browser.restore();
		}

		const headers = browser.calls[0]?.init.headers as Headers;
		expect(headers.get('x-xsrf-token')).to.equal('legacy token');
		expect(headers.get('Content-Type')).to.equal('application/json');
		expect(browser.calls[0]?.init.body).to.equal(JSON.stringify({ ids: ['1'] }));
	});
});
