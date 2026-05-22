import type { Keystone } from '../../index.mjs';
import type { Mongoose } from 'mongoose';
import { initExpressSessionCore } from './initExpressSession.mjs';

/**
 * Async-first variant of {@link initExpressSession}.
 *
 * Calls the synchronous `initExpressSession` to set up the proxy middleware and
 * kick off the real-store load, then awaits `sessionStorePromise` before
 * resolving. By the time this Promise settles, the proxy's inner middleware has
 * been swapped to the real-store-backed `session()` — the caller can use
 * `keystone.expressSession` with no MemoryStore-backed window.
 *
 * @example
 * await keystone.initExpressSessionAsync(mongoose);
 * // keystone.expressSession is now backed by the real store.
 */
export default async function initExpressSessionAsync(this: Keystone, mongoose: Mongoose): Promise<Keystone> {
	initExpressSessionCore.call(this, mongoose);

	if (this.sessionStorePromise) {
		await this.sessionStorePromise;
	}

	return this;
}
