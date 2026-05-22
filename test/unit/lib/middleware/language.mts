import { expect } from 'chai';
import sinon from 'sinon';
import language from 'keystone/lib/middleware/language';
import type { Keystone } from 'keystone';

const COOKIE_NAME_ARG = 0;
const COOKIE_LANGUAGE_ARG = 1;
const COOKIE_OPTIONS_ARG = 2;

function getNoop() { return function noop() {}; }

interface MockRequest {
	locals: Record<string, unknown>;
	headers: { 'accept-language'?: string };
	cookies: { language?: string };
	query: Record<string, string>;
	cookie: () => void;
	url?: string;
	acceptLanguage?: string;
	storedLanguage?: string;
}

interface MockResponse {
	redirect: sinon.SinonSpy;
	cookie: sinon.SinonSpy;
}

function mockRequest(acceptLanguageOrOpts?: string | Partial<MockRequest>, storedLanguage?: string): MockRequest {
	const args = Array.from(arguments as unknown as unknown[]);
	const options: Partial<MockRequest> = typeof args[0] === 'object' ? (args[0] as Partial<MockRequest>) : {};

	let acceptLanguage: string | undefined;
	if (Object.keys(options).length) {
		acceptLanguage = options.acceptLanguage as string | undefined;
	} else {
		acceptLanguage = acceptLanguageOrOpts as string | undefined;
	}

	return Object.assign({
		locals: {},
		headers: {
			'accept-language': acceptLanguage,
		},
		cookies: {
			language: storedLanguage,
		},
		query: {},
		cookie: getNoop(),
	}, options) as MockRequest;
}

function mockResponse(): MockResponse {
	return {
		redirect: sinon.spy(),
		cookie: sinon.spy(),
	};
}

function keystoneOptions(options?: Record<string, unknown>): Keystone {
	const opts = Object.assign({}, options);
	return {
		get: function (key: string) {
			return opts[key];
		},
	} as unknown as Keystone;
}

function getCookieName(res: MockResponse) {
	return res.cookie.getCall(0).args[COOKIE_NAME_ARG] as string;
}

function getCookieLanguage(res: MockResponse) {
	return res.cookie.getCall(0).args[COOKIE_LANGUAGE_ARG] as string;
}

function getCookieOptions(res: MockResponse, option: string) {
	return (res.cookie.getCall(0).args[COOKIE_OPTIONS_ARG] as Record<string, unknown>)[option];
}

describe('language', function () {
	it('must allow Accept-Language selection', function () {
		const ks = keystoneOptions({ 'language options': { 'supported languages': ['en-US', 'zh-CN'] } });
		const expected = 'zh-CN';
		const req = mockRequest({ acceptLanguage: 'zh-CN;q=1,en-US;q=0.8' });
		const res = mockResponse();
		const middleware = language(ks);
		middleware(req as unknown as Parameters<typeof middleware>[0], res as unknown as Parameters<typeof middleware>[1], getNoop());
		expect(getCookieLanguage(res)).to.eql(expected);
	});

	describe('must set language', function () {
		describe('with default options', function () {
			it('must create a language cookie', function (done) {
				const ks = keystoneOptions();
				const res = mockResponse();
				const expected = 'en-US';
				language(ks)(
					mockRequest() as unknown as Parameters<ReturnType<typeof language>>[0],
					res as unknown as Parameters<ReturnType<typeof language>>[1],
					function (err?: unknown) {
						expect(err).to.equal(undefined);
						expect(getCookieLanguage(res)).to.eql(expected);
						done();
					},
				);
			});
		});

		describe('with custom cookie name', function () {
			it('must create a custom language cookie', function (done) {
				const ks = keystoneOptions({ 'language options': { 'language cookie': 'locale' } });
				const res = mockResponse();
				const expected = 'locale';
				language(ks)(
					mockRequest() as unknown as Parameters<ReturnType<typeof language>>[0],
					res as unknown as Parameters<ReturnType<typeof language>>[1],
					function (err?: unknown) {
						expect(err).to.equal(undefined);
						expect(getCookieName(res)).to.eql(expected);
						done();
					},
				);
			});
		});

		describe('with custom cookie options', function () {
			it('must create a custom language cookie', function (done) {
				const ks = keystoneOptions({ 'language options': { 'language cookie options': { maxAge: 24 * 3600 * 1000, secure: true } } });
				const res = mockResponse();
				language(ks)(
					mockRequest() as unknown as Parameters<ReturnType<typeof language>>[0],
					res as unknown as Parameters<ReturnType<typeof language>>[1],
					function (err?: unknown) {
						expect(err).to.equal(undefined);
						expect(getCookieOptions(res, 'secure')).to.eql(true);
						expect(getCookieOptions(res, 'maxAge')).to.eql(86400000);
						done();
					},
				);
			});
		});
	});

	describe('must create language route', function () {
		describe('with default options', function () {
			it('must create /language route to change language', function () {
				const ks = keystoneOptions();
				const req = mockRequest({ acceptLanguage: 'zh-CN;q=0.8,en-US;q=1', storedLanguage: 'zh-CN', url: '/languages/en-US' });
				const res = mockResponse();
				const middleware = language(ks);
				middleware(req as unknown as Parameters<typeof middleware>[0], res as unknown as Parameters<typeof middleware>[1], getNoop());
				expect(res.redirect.calledOnce).to.eql(true);
				expect(res.cookie.calledOnce).to.eql(true);
				expect(getCookieLanguage(res)).to.eql('en-US');
			});
		});

		describe('with default options', function () {
			it('must create custom route to change language', function () {
				const ks = keystoneOptions({ 'language options': { 'language select url': '/locale/{language}' } });
				const req = mockRequest({ acceptLanguage: 'zh-CN;q=0.8,en-US;q=1', storedLanguage: 'zh-CN', url: '/locale/en-US' });
				const res = mockResponse();
				const middleware = language(ks);
				middleware(req as unknown as Parameters<typeof middleware>[0], res as unknown as Parameters<typeof middleware>[1], getNoop());
				expect(res.redirect.calledOnce).to.eql(true);
				expect(res.cookie.calledOnce).to.eql(true);
				expect(getCookieLanguage(res)).to.eql('en-US');
			});
		});
	});

	describe('query string language setting', function () {
		describe('with default query name', function () {
			it('must allow query string language setting', function () {
				const ks = keystoneOptions({ 'language options': { 'supported languages': ['en-US', 'zh-CN'] } });
				const req = mockRequest({ acceptLanguage: 'zh-CN;1,en-US;q=0.8', query: { language: 'en-US' } });
				const res = mockResponse();
				language(ks)(req as unknown as Parameters<ReturnType<typeof language>>[0], res as unknown as Parameters<ReturnType<typeof language>>[1], getNoop());
				expect(getCookieLanguage(res)).to.eql('en-US');
			});
		});

		describe('with custom query name', function () {
			it('must allow query string language setting', function () {
				const ks = keystoneOptions({ 'language options': { 'supported languages': ['en-US', 'zh-CN'], 'language query name': 'locale' } });
				const req = mockRequest({ acceptLanguage: 'zh-CN;1,en-US;q=0.8', query: { locale: 'en-US' } });
				const res = mockResponse();
				language(ks)(req as unknown as Parameters<ReturnType<typeof language>>[0], res as unknown as Parameters<ReturnType<typeof language>>[1], getNoop());
				expect(getCookieLanguage(res)).to.eql('en-US');
			});
		});
	});
});
