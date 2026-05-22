import keystone from 'keystone';
import getMongooseConnection from './getMongooseConnection.mts';
import express from 'express';
import createMethodOverrideMiddleware from '../../server/methodOverride.mts';

/**
 * Creates and returns a minimal Express app wired to a shared Mongoose
 * connection, suitable for integration tests.
 */
async function getExpressApp(): Promise<import('express').Application> {
	const mongoose = await getMongooseConnection();
	keystone.init({
		'mongoose': mongoose,
	});
	const app = keystone.express();

	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(createMethodOverrideMiddleware());

	return app;
}

export default getExpressApp;
