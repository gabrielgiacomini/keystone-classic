import mongoose from 'mongoose';

const uri = process.env.MONGO_URI || 'mongodb://localhost/test';

let _connectPromise: Promise<typeof mongoose> | null = null;

/**
 * Returns a Promise that resolves to the mongoose instance once the
 * connection is fully open. Safe to call multiple times — subsequent calls
 * reuse the same pending/resolved promise.
 *
 * Usage:
 *   before(async () => { mongoose = await getMongooseConnection(); });
 */
async function getMongooseConnection(): Promise<typeof mongoose> {
	if (!_connectPromise) {
		_connectPromise = mongoose.connect(uri).then(() => mongoose);
	}
	return _connectPromise;
}

export default getMongooseConnection;
