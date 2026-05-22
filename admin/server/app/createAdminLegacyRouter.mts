import type { Keystone } from '../../../index.mjs';
import type { Router as ExpressRouter, Request, Response, NextFunction, RequestHandler } from 'express';
import express from 'express';

import IndexRoute from '../routes-legacy/index.mjs';
import SigninRoute from '../routes-legacy/signin.mjs';
import SignoutRoute from '../routes-legacy/signout.mjs';
import createHealthchecksHandler from './createHealthchecksHandler.mjs';
import { getAdminLegacyPath } from '../../../lib/core/adminSurfacePathUtils.mjs';
import type { KeystoneSessionModule } from '../../../lib/session.mjs';

interface KeystoneWithInternals extends Keystone {
	nativeApp: boolean;
	session: KeystoneSessionModule;
}

function initNav(ks: KeystoneWithInternals): void {
	if (!ks.nav) {
		ks.nav = ks.initNav();
	}
}

function bindKeystone(keystone: Keystone): RequestHandler {
	return function (req: Request, _res: Response, next: NextFunction): void {
		req.keystone = keystone;
		next();
	};
}

/** Builds the admin legacy React 15 page router. */
export default function createAdminLegacyRouter(keystone: Keystone): ExpressRouter {
	const ks = keystone as KeystoneWithInternals;
	initNav(ks);

	const router = express.Router();
	router.use(bindKeystone(keystone));

	if (typeof keystone.get('pre:adminroutes') === 'function') {
		(keystone.get('pre:adminroutes') as (r: ExpressRouter) => void)(router);
	}
	router.use(function (req: Request, res: Response, next: NextFunction): void {
		keystone.callHook('pre:adminroutes', req, res, next);
	});

	if (keystone.get('healthchecks')) {
		let healthcheckHandlerPromise: Promise<RequestHandler> | undefined;
		router.use('/server-health', function (req: Request, res: Response, next: NextFunction): void {
			healthcheckHandlerPromise ??= createHealthchecksHandler(keystone) as Promise<RequestHandler>;
			healthcheckHandlerPromise.then(function (h: RequestHandler): void { h(req, res, next); }, next);
		});
	}

	if (keystone.get('auth') === true) {
		if (!keystone.get('signout url')) {
			keystone.set('signout url', getAdminLegacyPath(keystone) + '/signout');
		}
			if (!keystone.get('signin url')) {
				keystone.set('signin url', getAdminLegacyPath(keystone) + '/signin');
			}
			if (!ks.nativeApp || !keystone.get('session')) {
				router.all('*', function persistSession(req, res, next) { ks.session.persist(req, res, next); });
			}
			router.all('/signin', SigninRoute as RequestHandler);
			router.all('/signout', SignoutRoute as RequestHandler);
			router.use(function requireKeystoneAuth(req, res, next) { ks.session.keystoneAuth(req, res, next); });
		} else if (typeof keystone.get('auth') === 'function') {
			router.use(keystone.get('auth') as RequestHandler);
		}

	router.get('/', IndexRoute as RequestHandler);
	router.all('/:list/:page([0-9]{1,5})?', IndexRoute as RequestHandler);
	router.all('/:list/:item', IndexRoute as RequestHandler);

	return router;
}
