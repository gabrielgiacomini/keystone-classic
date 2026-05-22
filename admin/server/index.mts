export { default as createAdminLegacyCompatRouter } from './app/createAdminLegacyCompatRouter.mjs';
export { default as createAdminApiRouter } from './app/createAdminApiRouter.mjs';
export { default as createAdminLegacyRouter } from './app/createAdminLegacyRouter.mjs';
export { default as createAdminLegacyStaticRouter } from './app/createAdminLegacyStaticRouter.mjs';
export { default as createAdminNextStaticRouter, createAdminNextIndexRouter } from './app/createAdminNextStaticRouter.mjs';

import createAdminLegacyCompatRouter from './app/createAdminLegacyCompatRouter.mjs';
import createAdminApiRouter from './app/createAdminApiRouter.mjs';
import createAdminLegacyRouter from './app/createAdminLegacyRouter.mjs';
import createAdminLegacyStaticRouter from './app/createAdminLegacyStaticRouter.mjs';
import createAdminNextStaticRouter, { createAdminNextIndexRouter } from './app/createAdminNextStaticRouter.mjs';

/**
 * Public admin-server factory surface exposed on `keystone.Admin.Server` and
 * through the `keystone/admin/server` package subpath.
 */
export interface KeystoneAdminServer {
	createAdminLegacyCompatRouter: typeof createAdminLegacyCompatRouter;
	createAdminApiRouter: typeof createAdminApiRouter;
	createAdminLegacyRouter: typeof createAdminLegacyRouter;
	createAdminLegacyStaticRouter: typeof createAdminLegacyStaticRouter;
	createAdminNextStaticRouter: typeof createAdminNextStaticRouter;
	createAdminNextIndexRouter: typeof createAdminNextIndexRouter;
	/** Legacy Keystone 4 name for the admin static router. */
	createStaticRouter: typeof createAdminLegacyStaticRouter;
	/** Legacy Keystone 4 name for the mounted admin API and dynamic router. */
	createDynamicRouter: typeof createAdminLegacyCompatRouter;
}

const AdminServer: KeystoneAdminServer = {
	createAdminLegacyCompatRouter,
	createAdminApiRouter,
	createAdminLegacyRouter,
	createAdminLegacyStaticRouter,
	createAdminNextStaticRouter,
	createAdminNextIndexRouter,
	createStaticRouter: createAdminLegacyStaticRouter,
	createDynamicRouter: createAdminLegacyCompatRouter,
};

export default AdminServer;
