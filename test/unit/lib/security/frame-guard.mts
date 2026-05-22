import keystone from 'keystone';
import { expect } from 'chai';
import request from 'supertest';
import type { Application, Request, Response } from 'express';
import getExpressApp from '../../../helpers/getExpressApp.mts';
import frameGuard from 'keystone/lib/security/frameGuard';

let app: Application;

describe('Keystone "frame guard" setting', function () {
	before(async function () {
		app = await getExpressApp();
		// eslint-disable-next-line @typescript-eslint/no-deprecated, sonarjs/deprecation, @typescript-eslint/no-unnecessary-type-assertion
		app.use(frameGuard(keystone as unknown as Parameters<typeof frameGuard>[0]));
		app.get('/', function (_req: Request, res: Response) {
			res.send('OK');
		});
	});

	describe('default setting', function () {
		it('should be "sameorigin"', function () {
			expect(keystone.get('frame guard')).to.equal('sameorigin');
		});
	});

	describe('keystone.set("frame guard")', function () {
		it('should allow setting to "sameorigin"', function () {
			keystone.set('frame guard', 'sameorigin');
			expect(keystone.get('frame guard')).to.equal('sameorigin');
		});
		it('should allow setting to "deny"', function () {
			keystone.set('frame guard', 'deny');
			expect(keystone.get('frame guard')).to.equal('deny');
		});
		it('should allow setting to TRUE, converts to "deny"', function () {
			keystone.set('frame guard', true);
			expect(keystone.get('frame guard')).to.equal('deny');
		});
		it('should allow setting to FALSE', function () {
			keystone.set('frame guard', false);
			expect(keystone.get('frame guard')).to.equal(false);
		});
		it('should translate invalid options to FALSE', function () {
			keystone.set('frame guard', 'xxx');
			expect(keystone.get('frame guard')).to.equal(false);
			keystone.set('frame guard', 999);
			expect(keystone.get('frame guard')).to.equal(false);
			keystone.set('frame guard', []);
			expect(keystone.get('frame guard')).to.equal(false);
			keystone.set('frame guard', {});
			expect(keystone.get('frame guard')).to.equal(false);
		});
	});

	describe('legacy frameGuard middleware', function () {
		it('should not set X-Frame-Options when "frame guard" is "deny"', async function () {
			keystone.set('frame guard', 'deny');
			await request(app)
				.get('/')
				.expect(200)
				.expect(function (res: request.Response): string | undefined {
					return (res.headers as Record<string, string>)['x-frame-options'] ? 'X-Frame-Options key exists' : undefined;
				});
		});
		it('should not set X-Frame-Options when "frame guard" is "sameorigin"', async function () {
			keystone.set('frame guard', 'sameorigin');
			await request(app)
				.get('/')
				.expect(200)
				.expect(function (res: request.Response): string | undefined {
					return (res.headers as Record<string, string>)['x-frame-options'] ? 'X-Frame-Options key exists' : undefined;
				});
		});
		it('should not set X-Frame-Options when "frame guard" is TRUE', async function () {
			keystone.set('frame guard', true);
			await request(app)
				.get('/')
				.expect(200)
				.expect(function (res: request.Response): string | undefined {
					return (res.headers as Record<string, string>)['x-frame-options'] ? 'X-Frame-Options key exists' : undefined;
				});
		});
		it('should not set X-Frame-Options when "frame guard" is FALSE', async function () {
			keystone.set('frame guard', false);
			await request(app)
				.get('/')
				.expect(200)
				.expect(function (res: request.Response): string | undefined {
					return (res.headers as Record<string, string>)['x-frame-options'] ? 'X-Frame-Options key exists' : undefined;
				});
		});
	});
});
