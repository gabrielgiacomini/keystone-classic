/**
 * @fileoverview This file is the entry point for the Admin UI server-side code.
 * It exports two functions, `createDynamicRouter` and `createStaticRouter`,
 * which are used to create the Express routers for the Admin UI.
 *
 * @see {@link module:createDynamicRouter}
 * @see {@link module:createStaticRouter}
 */

/**
 * Creates a dynamic router for the Admin UI.
 * @see {@link module:createDynamicRouter}
 */
exports.createDynamicRouter = require('./app/createDynamicRouter');

/**
 * Creates a static router for the Admin UI.
 * @see {@link module:createStaticRouter}
 */
exports.createStaticRouter = require('./app/createStaticRouter');
