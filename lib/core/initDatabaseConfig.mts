import type { Keystone } from '../../index.mjs';
import { slug } from '../utils/string.mjs';

/**
 * Resolves the MongoDB connection URL from environment variables or the app name
 * and stores it under the `mongo` setting, unless one is already configured.
 * @returns The Keystone instance for chaining.
 */
export default function initDatabaseConfig(this: Keystone): Keystone {
		if (!this.get('mongo')) {
			const dbName = (this.get('db name'))
				|| slug(this.get('name') ?? '');

		const dbUrl = process.env.MONGO_URI
			|| process.env.MONGODB_URI
			|| process.env.MONGO_URL
			|| process.env.MONGODB_URL
			|| process.env.MONGOLAB_URI
			|| process.env.MONGOLAB_URL
			|| (process.env.OPENSHIFT_MONGODB_DB_URL
			|| 'mongodb://localhost/') + dbName;

		this.set('mongo', dbUrl);
	}
	return this;
}
