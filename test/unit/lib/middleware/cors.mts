import keystone from 'keystone';
import { expect } from 'chai';
import cors from 'keystone/lib/middleware/cors';
import type { Keystone } from 'keystone';

function createResponse() {
	const headers: Record<string, unknown> = {};
	return {
		headers,
		header(name: string, value: unknown) {
			headers[name.toLowerCase()] = value;
			return this;
		},
	};
}

function runCors(origin: unknown, requestOrigin?: string) {
	const middleware = cors({
		get(key: string) {
			if (key === 'cors allow origin') return origin;
			return undefined;
		},
	} as unknown as Keystone);
	const req = { headers: { origin: requestOrigin } };
	const res = createResponse();
	let nextCalled = false;
	middleware(req as unknown as import('express').Request, res as unknown as import('express').Response, function () {
		nextCalled = true;
	});
	return { headers: res.headers, nextCalled };
}

describe('CORS middleware', function () {
	it('rejects boolean true for cors allow origin at option set time', function () {
		expect(function () {
			keystone.set('cors allow origin', true);
		}).to.throw('cors allow origin');
	});

	it('sets a configured explicit origin string', function () {
		const result = runCors('https://example.com');

		expect(result.nextCalled).to.equal(true);
		expect(result.headers['access-control-allow-origin']).to.equal('https://example.com');
	});

	it('reflects a request origin only when it is in the explicit allowlist', function () {
		const result = runCors(['https://admin.example.com', 'https://app.example.com'], 'https://app.example.com');

		expect(result.nextCalled).to.equal(true);
		expect(result.headers['access-control-allow-origin']).to.equal('https://app.example.com');
	});

	it('does not emit Access-Control-Allow-Origin for unlisted request origins', function () {
		const result = runCors(['https://admin.example.com'], 'https://evil.example.com');

		expect(result.nextCalled).to.equal(true);
		expect(result.headers).to.not.have.property('access-control-allow-origin');
	});

	it('rejects boolean true in the middleware if the setter is bypassed', function () {
		expect(function () {
			runCors(true, 'https://example.com');
		}).to.throw('cors allow origin');
	});
});
