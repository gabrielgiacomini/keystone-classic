import mongoose from 'mongoose';

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost/test';

async function dropTestDatabase () {
	try {
		await mongoose.connect(mongoUri);
		await mongoose.connection.db.dropDatabase();
		await mongoose.connection.close();
	} catch (err) {
		console.error('pretest dropTestDatabase failed:', err instanceof Error ? err.message : String(err));
	}
}

dropTestDatabase();
