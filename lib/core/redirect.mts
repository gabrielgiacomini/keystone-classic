import type { Keystone } from '../../index.mjs';
import isObject from '../utils/isObject.mjs';

export default function redirect(this: Keystone): Keystone {
	if (arguments.length === 1 && isObject(arguments[0])) {
		Object.assign(this._redirects, arguments[0]);
	} else if (arguments.length === 2 && typeof arguments[0] === 'string' && typeof arguments[1] === 'string') {
		this._redirects[arguments[0]] = arguments[1];
	}
	return this;
}
