import type { Keystone } from '../../../index.mjs';
import type { Router as ExpressRouter } from 'express';
import express from 'express';

import createAdminApiRouter from './createAdminApiRouter.mjs';
import createAdminLegacyRouter from './createAdminLegacyRouter.mjs';

/**
 * Backward-compatible mixed admin router.
 *
 * New server mounting should use `createAdminApiRouter` at `/{admin api path}`
 * and `createAdminLegacyRouter` at `/{admin legacy path}`. This wrapper preserves the
 * historical `/{admin legacy path}/api/*` shape for direct imports of
 * `createAdminLegacyCompatRouter`.
 */
export default function createAdminLegacyCompatRouter(keystone: Keystone): ExpressRouter {
	const router = express.Router();
	router.use('/api', createAdminApiRouter(keystone));
	router.use(createAdminLegacyRouter(keystone));
	return router;
}
