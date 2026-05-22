import type { Keystone } from '../../index.mjs';
import type { KeystoneList } from '../list.mjs';

/**
 * Looks up a registered Keystone List by key (or alias path).
 * @throws {ReferenceError} If no list is registered under the given key.
 */
export default function list(this: Keystone, key: string): KeystoneList {
	const aliasPath = this.paths[key];
	const result = this.lists[key] || (aliasPath ? this.lists[aliasPath] : undefined);
	if (!result) {
		throw new ReferenceError('Unknown keystone list ' + JSON.stringify(key));
	}
	return result;
}
