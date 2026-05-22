import type { Keystone } from '../../index.mjs';
import debugLib from 'debug';

const debug = debugLib('keystone:core:openDatabaseConnection');

const DEFAULT_MONGO_TIMEOUT_OPTIONS = {
	serverSelectionTimeoutMS: 5000,
	socketTimeoutMS: 30000,
	connectTimeoutMS: 10000,
};

function readTimeoutOption(name: string, fallback: number): number {
	const value = process.env[name];
	if (!value) return fallback;
	const parsed = Number(value);
	return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function getMongoTimeoutOptions(): Record<string, number> {
	return {
		serverSelectionTimeoutMS: readTimeoutOption(
			'KEYSTONE_MONGO_SERVER_SELECTION_TIMEOUT_MS',
			DEFAULT_MONGO_TIMEOUT_OPTIONS.serverSelectionTimeoutMS
		),
		socketTimeoutMS: readTimeoutOption(
			'KEYSTONE_MONGO_SOCKET_TIMEOUT_MS',
			DEFAULT_MONGO_TIMEOUT_OPTIONS.socketTimeoutMS
		),
		connectTimeoutMS: readTimeoutOption(
			'KEYSTONE_MONGO_CONNECT_TIMEOUT_MS',
			DEFAULT_MONGO_TIMEOUT_OPTIONS.connectTimeoutMS
		),
	};
}

function toConnectionError(err: unknown): Error {
	if (err instanceof Error) return err;
	return new Error(typeof err === 'string' ? err : Object.prototype.toString.call(err));
}

export default function openDatabaseConnection(this: Keystone, callback: (err?: Error | null) => void): Keystone {
	const keystone = this;
	let mongoConnectionOpen = false;

	if (keystone.get('mongo replica set')) {
		debug('setting up mongo replica set');
		const replicaData = keystone.get('mongo replica set');
		if (!replicaData) return this;
		let replica = '';
		const credentials =
			replicaData.username && replicaData.password
				? replicaData.username + ':' + replicaData.password + '@'
				: '';

		replicaData.db.servers.forEach(function (server: { host: string; port: number }) {
			replica +=
				'mongodb://' +
				credentials +
				server.host +
				':' +
				server.port +
				'/' +
				replicaData.db.name +
				',';
		});

			const options: Record<string, unknown> = getMongoTimeoutOptions();
			if (replicaData.authSource) {
				options.authSource = replicaData.authSource;
			}
		if (replicaData.db.replicaSetOptions?.rs_name) {
			options.replicaSet = replicaData.db.replicaSetOptions.rs_name;
		}
		if (replicaData.db.replicaSetOptions?.readPreference) {
			options.readPreference = replicaData.db.replicaSetOptions.readPreference;
		}

		debug('connecting to replica set');
		void keystone.mongoose.connect(replica, options);
	} else if (keystone.get('mongo options')) {
			debug('connecting to mongo with custom options');
			keystone.initDatabaseConfig();
			const mongo_options = {
				...getMongoTimeoutOptions(),
				...(keystone.get('mongo options') ?? {}),
			};
			const mongoUri = keystone.get('mongo');
			if (!mongoUri) throw new Error('openDatabaseConnection: keystone "mongo" config (connection URI) is required');
			void keystone.mongoose.connect(mongoUri, mongo_options);
	} else {
		debug('connecting to mongo');
			keystone.initDatabaseConfig();
			const mongoUri = keystone.get('mongo');
			if (!mongoUri) throw new Error('openDatabaseConnection: keystone "mongo" config (connection URI) is required');
			void keystone.mongoose.connect(mongoUri, getMongoTimeoutOptions());
		}

	keystone.mongoose.connection
		.on('error', function (err: Error) {
			if (mongoConnectionOpen && err.name === 'ValidationError') return;

			console.error('------------------------------------------------');
			console.error('Mongoose connection "error" event fired with:');
			console.error(err);

			if (!mongoConnectionOpen) {
				callback(new Error(
					'KeystoneJS (' +
						keystone.get('name') +
						') failed to start - Check that you are running `mongod` in a separate process.'
				));
				return;
			}

			callback(err);
		})
		.once('open', function () {
			debug('mongo connection open');
			mongoConnectionOpen = true;

			const connected = function () {
				if (keystone.get('auto update')) {
					debug('applying auto update');
					keystone.applyUpdates(callback);
				} else {
					callback();
				}
			};

				if (keystone.sessionStorePromise) {
					keystone.sessionStorePromise.then(connected, function (err: unknown) {
						callback(toConnectionError(err));
					});
				} else {
					connected();
				}
		});

	return this;
}
