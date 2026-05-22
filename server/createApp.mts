import type { Keystone } from '../index.mjs';
import type { Application, Request, Response, NextFunction, RequestHandler } from 'express';
import compression from 'compression';
import morgan from 'morgan';
import express from 'express';
import helmet from 'helmet';
import { randomBytes } from 'node:crypto';

import language from '../lib/middleware/language.mjs';
import initLetsEncrypt from './initLetsEncrypt.mjs';
import initSslRedirect from './initSslRedirect.mjs';
import initTrustProxy from './initTrustProxy.mjs';
import initViewEngine from './initViewEngine.mjs';
import initViewLocals from './initViewLocals.mjs';
import bindIPRestrictions from './bindIPRestrictions.mjs';
import bindLessMiddleware from './bindLessMiddleware.mjs';
import bindSassMiddleware from './bindSassMiddleware.mjs';
import bindStylusMiddleware from './bindStylusMiddleware.mjs';
import bindStaticMiddleware from './bindStaticMiddleware.mjs';
import bindSessionMiddleware from './bindSessionMiddleware.mjs';
import bindBodyParser from './bindBodyParser.mjs';
import bindRedirectsHandler from './bindRedirectsHandler.mjs';
import bindErrorHandlers from './bindErrorHandlers.mjs';
import createMethodOverrideMiddleware from './methodOverride.mjs';
import { createAdminLegacyStaticRouter, createAdminApiRouter, createAdminLegacyRouter } from '../admin/server/index.mjs';
import createAdminNextStaticRouter, { createAdminNextIndexRouter } from '../admin/server/app/createAdminNextStaticRouter.mjs';
import {
	assertDistinctAdminSurfacePaths,
	getAdminApiEnabled,
	getAdminSurfacePaths,
	getAdminClientMode,
	getAdminLegacyApiAliasEnabled,
	getAdminLegacyApiAliasPath,
} from '../lib/core/adminSurfacePathUtils.mjs';

export default function createApp(keystone: Keystone, expressApp?: (() => Application)): Application {
	if (!keystone.app) {
		if (!expressApp) {
			expressApp = express;
		}
		keystone.app = expressApp();
	}

	// keystone.app is guaranteed non-null after the block above (either pre-set or just assigned).
	const app = keystone.app as Application;

	initLetsEncrypt(keystone, app);
	initSslRedirect(keystone, app);

	keystone.initDatabaseConfig();
	// eslint-disable-next-line sonarjs/deprecation, @typescript-eslint/no-deprecated -- createApp remains sync; async session-store migration is tracked separately.
	keystone.initExpressSession(keystone.mongoose);

	initTrustProxy(keystone, app);
	initViewEngine(keystone, app);
	initViewLocals(keystone, app);
	bindIPRestrictions(keystone, app);

	// Security headers
	app.use(helmet({
		contentSecurityPolicy: false, // configured separately below with per-request nonce
		hsts: (keystone.get('ssl') === 'force')
			? { maxAge: 31536000, includeSubDomains: true }
			: false,
		frameguard: { action: 'sameorigin' },
		noSniff: true,
		xssFilter: true,
		dnsPrefetchControl: true,
		ieNoOpen: true,
	}));

	// Per-request CSP nonce
	app.use((_req: Request, res: Response, next: NextFunction) => {
		res.locals['cspNonce'] = randomBytes(16).toString('base64');
		next();
	});
	app.use(helmet.contentSecurityPolicy({
		directives: {
			defaultSrc: ["'self'"],
			scriptSrc: ["'self'", (_req, res) => `'nonce-${String((res as Response).locals['cspNonce'])}'`],
			styleSrc: ["'self'", "'unsafe-inline'"],
			imgSrc: ["'self'", 'data:', 'https:'],
			connectSrc: ["'self'"],
			fontSrc: ["'self'", 'data:'],
			objectSrc: ["'none'"],
			frameAncestors: ["'self'"],
		},
	}));

	if (keystone.get('compress')) {
		app.use(compression());
	}

	const preStatic = keystone.get('pre:static');
	if (typeof preStatic === 'function') {
		preStatic(app);
	}
	app.use(function (req: Request, res: Response, next: NextFunction) {
		keystone.callHook('pre:static', req, res, next);
	});

	if (keystone.get('favicon')) {
		const faviconPath = keystone.getPath('favicon');
		app.get('/favicon.ico', (_req: Request, res: Response) => { res.sendFile(faviconPath); });
	}

	const adminClientMode = getAdminClientMode(keystone);
	const adminSurfacePaths = getAdminSurfacePaths(keystone);
	assertDistinctAdminSurfacePaths(adminSurfacePaths);
	const shouldMountAdminClients = !keystone.get('headless') && adminClientMode !== false;
	const shouldMountAdminApi = getAdminApiEnabled(keystone, adminClientMode);

	if (shouldMountAdminClients) {
		const { adminLegacyPath, adminNextPath } = adminSurfacePaths;
		if (adminClientMode === 'legacy' || adminClientMode === 'both') {
			app.use(adminLegacyPath, createAdminLegacyStaticRouter(keystone));
		}
		if (adminClientMode === 'next' || adminClientMode === 'both') {
			app.use(adminNextPath, createAdminNextStaticRouter(keystone));
		}
	}

	bindLessMiddleware(keystone, app);
	void bindSassMiddleware(keystone, app);
	void bindStylusMiddleware(keystone, app);
	bindStaticMiddleware(keystone, app);

	bindSessionMiddleware(keystone, app);

	app.use(function (req: Request, res: Response, next: NextFunction) {
		keystone.callHook('pre:logger', req, res, next);
	});

	if (keystone.get('logger')) {
		const loggerOptions = keystone.get('logger options');
		if (loggerOptions && typeof loggerOptions.tokens === 'object') {
			for (const key in loggerOptions.tokens) {
				if (Object.prototype.hasOwnProperty.call(loggerOptions.tokens, key) && typeof (loggerOptions.tokens as Record<string, unknown>)[key] === 'function') {
					morgan.token(key, (loggerOptions.tokens as Record<string, unknown>)[key] as morgan.TokenCallbackFn);
				}
			}
		}
		app.use(morgan(keystone.get('logger') as string, loggerOptions));
	}

	if (keystone.get('logging middleware')) {
		app.use(keystone.get('logging middleware') as RequestHandler);
	}

	if (shouldMountAdminApi || shouldMountAdminClients) {
		const preAdmin = keystone.get('pre:admin');
		if (typeof preAdmin === 'function') {
			preAdmin(app);
		}
		app.use(function (req: Request, res: Response, next: NextFunction) {
			keystone.callHook('pre:admin', req, res, next);
		});
		if (shouldMountAdminApi) {
			app.use(adminSurfacePaths.adminApiPath, createAdminApiRouter(keystone));
			if (
				shouldMountAdminClients
				&& getAdminLegacyApiAliasEnabled(keystone)
				&& getAdminLegacyApiAliasPath(keystone).toLowerCase() !== adminSurfacePaths.adminApiPath.toLowerCase()
			) {
				app.use(getAdminLegacyApiAliasPath(keystone), createAdminApiRouter(keystone));
			}
		}
		if (shouldMountAdminClients && (adminClientMode === 'legacy' || adminClientMode === 'both')) {
			app.use(adminSurfacePaths.adminLegacyPath, createAdminLegacyRouter(keystone));
		}
		if (shouldMountAdminClients && (adminClientMode === 'next' || adminClientMode === 'both')) {
			app.use(adminSurfacePaths.adminNextPath, createAdminNextIndexRouter(keystone));
		}
	}

	const preBodyparser = keystone.get('pre:bodyparser');
	if (typeof preBodyparser === 'function') {
		preBodyparser(app);
	}
	app.use(function (req: Request, res: Response, next: NextFunction) {
		keystone.callHook('pre:bodyparser', req, res, next);
	});

	bindBodyParser(keystone, app);
	app.use(createMethodOverrideMiddleware());

	const languageOptions = keystone.get('language options') ?? {};
	if (!languageOptions.disable) {
		app.use(language(keystone));
	}

	// 'frame guard' option is superseded by helmet's frameguard (P7-45).
	// The frameGuard import is retained for backward-compatible re-exports only.

	const preRoutes = keystone.get('pre:routes');
	if (typeof preRoutes === 'function') {
		preRoutes(app);
	}
	app.use(function (req: Request, res: Response, next: NextFunction) {
		keystone.callHook('pre:routes', req, res, next);
	});

	const appRouter = keystone.get('routes');
	if (typeof appRouter === 'function') {
		if (appRouter.length === 3) {
			app.use(appRouter as (req: unknown, res: unknown, next: unknown) => void);
		} else {
			(appRouter as (app: Application) => void)(app);
		}
	}

	bindRedirectsHandler(keystone, app);

	const preError = keystone.get('pre:error');
	if (typeof preError === 'function') {
		preError(app);
	}
	app.use(function (req: Request, res: Response, next: NextFunction) {
		keystone.callHook('pre:error', req, res, next);
	});

	bindErrorHandlers(keystone, app);

	return app;
}
