import type { Keystone } from '../../../index.mjs';
import type { Router as ExpressRouter } from 'express';

import createAdminNextStaticRouter from './createAdminNextStaticRouter.mjs';

/**
 * Preserves historical static-router mounting by serving the modern admin assets.
 *
 * @param keystone - Keystone instance used to build the modern static router.
 * @returns Express router serving modern admin static assets.
 */
export default function createAdminLegacyStaticRouter(keystone: Keystone): ExpressRouter {
	return createAdminNextStaticRouter(keystone);
}
