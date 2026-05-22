import type { Keystone } from '../../../index.mjs';
import type { Router as ExpressRouter, Request, Response, NextFunction, RequestHandler } from 'express';
import express from 'express';

import uploads from '../../../lib/uploads.mjs';
import apiErrorMiddleware from '../middleware/apiError.mjs';
import logErrorMiddleware from '../middleware/logError.mjs';
import sessionGet from '../api/session/get.mjs';
import sessionSignin from '../api/session/signin.mjs';
import { createSigninRateLimitMiddleware } from '../api/session/signinSecurity.mjs';
import sessionSignout from '../api/session/signout.mjs';
import { get as cloudinaryGet, autocomplete as cloudinaryAutocomplete, upload as cloudinaryUpload } from '../api/cloudinary.mjs';
import { upload as fileUpload } from '../api/file.mjs';
import { upload as s3Upload } from '../api/s3.mjs';
import counts from '../api/counts.mjs';
import metaGet from '../api/meta.mjs';
import initList from '../middleware/initList.mjs';
import listGet from '../api/list/get.mjs';
import listDownload from '../api/list/download.mjs';
import listCreate from '../api/list/create.mjs';
import listUpdate from '../api/list/update.mjs';
import listDelete from '../api/list/delete.mjs';
import itemGet from '../api/item/get.mjs';
import itemUpdate from '../api/item/update.mjs';
import itemSortOrder from '../api/item/sortOrder.mjs';
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

/**
 * Builds the canonical admin JSON/session/upload/list API router.
 * This router is mounted at `/{admin api path}` and therefore defines API
 * endpoints at its root, not under a nested `/api` prefix.
 */
export default function createAdminApiRouter(keystone: Keystone): ExpressRouter {
	const ks = keystone as KeystoneWithInternals;
	initNav(ks);

	const router = express.Router();

	router.use(express.json({}));
	router.use(express.urlencoded({ extended: true }));
	(uploads.configure as (r: ExpressRouter, options?: unknown) => void)(router, keystone.get('multer options'));
	router.use(bindKeystone(keystone));

	if (typeof keystone.get('pre:adminroutes') === 'function') {
		(keystone.get('pre:adminroutes') as (r: ExpressRouter) => void)(router);
	}
	router.use(function (req: Request, res: Response, next: NextFunction): void {
		keystone.callHook('pre:adminroutes', req, res, next);
	});

	router.use(apiErrorMiddleware);
	router.use(logErrorMiddleware);

	router.get('/session', sessionGet as RequestHandler);
	router.post('/session/signin', createSigninRateLimitMiddleware(keystone), sessionSignin as RequestHandler);
	router.post('/session/signout', sessionSignout as RequestHandler);

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
			router.use(function requireKeystoneAuth(req, res, next) { ks.session.keystoneAuth(req, res, next); });
		} else if (typeof keystone.get('auth') === 'function') {
			router.use(keystone.get('auth') as RequestHandler);
		}

	if (keystone.get('cloudinary config')) {
		router.get('/cloudinary/get', cloudinaryGet as RequestHandler);
		router.get('/cloudinary/autocomplete', cloudinaryAutocomplete as RequestHandler);
		router.post('/cloudinary/upload', cloudinaryUpload as RequestHandler);
	}
	router.post('/file/upload', fileUpload as RequestHandler);
	if (keystone.get('s3 config')) {
		router.post('/s3/upload', s3Upload as RequestHandler);
	}

	router.all('/counts', counts as RequestHandler);
	router.get('/', metaGet as RequestHandler);
	router.get('/:list', initList, listGet as RequestHandler);
	router.get('/:list/:format(export.csv|export.json)', initList, listDownload as RequestHandler);
	router.post('/:list/create', initList, listCreate as RequestHandler);
	router.post('/:list/update', initList, listUpdate as RequestHandler);
	router.post('/:list/delete', initList, listDelete as RequestHandler);
	router.get('/:list/:id', initList, itemGet as RequestHandler);
	router.post('/:list/:id', initList, itemUpdate as RequestHandler);
	router.post('/:list/:id/delete', initList, listDelete as RequestHandler);
	router.post('/:list/:id/sortOrder/:sortOrder/:newOrder', initList, itemSortOrder as RequestHandler);

	return router;
}
