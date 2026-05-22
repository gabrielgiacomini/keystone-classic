import type { Keystone } from '../../index.mjs';
import debugLib from 'debug';

const debug = debugLib('keystone:core:closeDatabaseConnection');

export default function closeDatabaseConnection(this: Keystone, callback?: () => void): Keystone {
	void this.mongoose.disconnect().then(function () {
		debug('mongo connection closed');
		if (callback) {
			callback();
		}
	});
	return this;
}
