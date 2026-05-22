import type { Keystone } from '../../index.mjs';
import type { KeystoneList } from '../list.mjs';
import crypto from 'crypto';

export default function createKeystoneHash(this: Keystone): string {
	const hash = crypto.createHash('md5');
	hash.update(this.version);
	Object.values(this.lists).forEach(function (list: KeystoneList) {
		hash.update(JSON.stringify(list.getOptions()));
	});
	return hash.digest('hex').slice(0, 6);
}
