/**
 * @fileoverview This file defines the `createRouter` function for Keystone,
 * which provides a simple way to create a new Express router.
 *
 * This function is a convenience wrapper around `express.Router()`, allowing
 * developers to create routers without needing to directly import the Express
 * module themselves. This can simplify the setup of custom route handlers
 * within a Keystone application.
 * @example
 * const apiRouter = keystone.createRouter();
 * apiRouter.get('/users', (req, res) => {
 *   res.json({ users: [] });
 * });
 * keystone.app.use('/api', apiRouter);
 */
var express = require('express');

/**
 * Creates and returns a new Express router.
 *
 * This function is a shorthand for `express.Router()`, making it easier to
 * create new routers in projects that use Keystone but might not have a direct
 * dependency on Express.
 *
 * @returns {express.Router} A new Express router instance.
 * @example
 * const keystone = require('keystone');
 * const apiRouter = keystone.createRouter();
 *
 * apiRouter.get('/my-custom-endpoint', (req, res) => {
 *   res.json({ message: 'This is a custom API endpoint.' });
 * });
 *
 * keystone.app.use('/api', apiRouter);
 */
function createRouter () {
	// Simply call express.Router() to create a new router instance.
	return express.Router();
}

module.exports = createRouter;
