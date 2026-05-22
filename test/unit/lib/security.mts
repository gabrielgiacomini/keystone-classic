import { expect } from 'chai';
import sinon from 'sinon';
import * as csrf from 'keystone/lib/security/csrf';

interface MockReq {
	session: Record<string, unknown>;
	query: Record<string, string>;
	headers: string[];
	method: string;
	body?: Record<string, string>;
}

interface MockRes {
	locals: Record<string, unknown>;
	cookie: sinon.SinonStub;
	statusCode: number;
}

const REQ = function (method?: string): MockReq {
	const rtn: MockReq = {
		session: {},
		query: {},
		headers: [],
		method: method || 'GET',
	};
	if (method === 'POST') {
		rtn.body = {};
	}
	return rtn;
};

const RES = function (): MockRes {
	return {
		locals: {},
		cookie: sinon.stub(),
		statusCode: 0,
	};
};

const memory: {
	req: MockReq;
	post: MockReq;
	res: MockRes;
	firstSecret?: string;
	token?: string;
} = {
	req: REQ(),
	post: REQ('POST'),
	res: RES(),
};

describe('CSRF', function () {
	describe('createSecret()', function () {
		it('must create a new secret', function () {
			const secret = csrf.createSecret();
			expect(secret.slice(-2)).to.equal('==');
		});
	});
	describe('getSecret(req)', function () {
		it('must return a new secret', function () {
			const secret = memory.firstSecret = csrf.getSecret(memory.req as unknown as Parameters<typeof csrf.getSecret>[0]);
			expect(secret.slice(-2)).to.equal('==');
		});
		it('must return the same secret', function () {
			const secret = csrf.getSecret(memory.req as unknown as Parameters<typeof csrf.getSecret>[0]);
			expect(secret).to.equal(memory.firstSecret);
		});
	});
	describe('createToken(req)', function () {
		it('must create a new token', function () {
			memory.token = csrf.createToken(memory.req as unknown as Parameters<typeof csrf.createToken>[0]);
			expect(memory.token.length).to.be.above(38);
		});
	});
	describe('getToken(req, res)', function () {
		it('must create a new token in res.locals and return it', function () {
			const token = csrf.getToken(
				memory.req as unknown as Parameters<typeof csrf.getToken>[0],
				memory.res as unknown as Parameters<typeof csrf.getToken>[1],
			);
			expect(token).to.equal(memory.res.locals[csrf.LOCAL_VALUE]);
			sinon.assert.calledOnce(memory.res.cookie);
		});
	});
	describe('requestToken()', function () {
		it('must find a token in req.body', function () {
			const req: MockReq = { session: {}, query: {}, headers: [], method: 'POST', body: {} };
			req.body![csrf.TOKEN_KEY] = 'token';
			expect(csrf.requestToken(req as unknown as Parameters<typeof csrf.requestToken>[0])).to.equal('token');
		});
		it('must find a token in req.query', function () {
			const req: MockReq = { session: {}, query: {}, headers: [], method: 'GET' };
			req.query[csrf.TOKEN_KEY] = 'token';
			expect(csrf.requestToken(req as unknown as Parameters<typeof csrf.requestToken>[0])).to.equal('token');
		});
		it('must default to an empty string', function () {
			expect(csrf.requestToken({} as Parameters<typeof csrf.requestToken>[0])).to.equal('');
		});
	});
	describe('validate()', function () {
		it('must return true for valid tokens', function () {
			const valid = csrf.validate(
				memory.req as unknown as Parameters<typeof csrf.validate>[0],
				memory.token,
			);
			expect(valid).to.be.true;
		});
		it('must return false for invalid tokens', function () {
			const valid = csrf.validate(
				memory.req as unknown as Parameters<typeof csrf.validate>[0],
				'invalid',
			);
			expect(valid).to.be.false;
		});
		it('must find the token in req', function () {
			memory.post.body![csrf.TOKEN_KEY] = csrf.createToken(memory.post as unknown as Parameters<typeof csrf.createToken>[0]);
			const valid = csrf.validate(memory.post as unknown as Parameters<typeof csrf.validate>[0]);
			expect(valid).to.be.true;
		});
	});
	describe('middleware.init(req, res, next)', function () {
		it('must add a token to res.locals', function (next) {
			const req = REQ(), res = RES();
			(csrf.middleware.init as unknown as (req: MockReq, res: MockRes, next: () => void) => void)(req, res, function () {
				const token = res.locals[csrf.LOCAL_VALUE];
				expect((token as string).length).to.be.above(38);
				next();
			});
		});
	});
	describe('middleware.validate(req, res, next)', function () {
		it('must validate tokens in the request body', function (next) {
			const req = REQ('POST'), res = RES();
			req.body![csrf.TOKEN_KEY] = csrf.createToken(req as unknown as Parameters<typeof csrf.createToken>[0]);
			(csrf.middleware.validate as unknown as (req: MockReq, res: MockRes, next: (err?: Error) => void) => void)(req, res, function (err?: Error) {
				expect(err).to.be.undefined;
				next();
			});
		});
		it('must pass an error and set statusCode to 403 with no valid token in the request body', function (next) {
			const req = REQ('POST'), res = RES();
			(csrf.middleware.validate as unknown as (req: MockReq, res: MockRes, next: (err?: Error) => void) => void)(req, res, function (err?: Error) {
				expect(res.statusCode).to.equal(403);
				expect(err).to.be.an.instanceof(Error);
				next();
			});
		});
		it('must ignore GET requests', function (next) {
			const req = REQ(), res = RES();
			(csrf.middleware.validate as unknown as (req: MockReq, res: MockRes, next: (err?: Error) => void) => void)(req, res, function (err?: Error) {
				expect(err).to.be.undefined;
				next();
			});
		});
	});
});
