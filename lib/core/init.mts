import type { Keystone } from '../../index.mjs';
import type { KeystoneOptions } from './options-types.js';

export default function init(this: Keystone, options?: Partial<KeystoneOptions>): Keystone {
	this.options(options);
	return this;
}
