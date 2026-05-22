import type { Keystone } from '../index.mjs';
import type { Application } from 'express';
import debugModule from 'debug';
import ipRangeRestrict from '../lib/security/ipRangeRestrict.mjs';

const debug = debugModule('keystone:server:bindIpRestrictions');

export default function bindIPRestrictions(keystone: Keystone, app: Application): void {
	if (keystone.get('allowed ip ranges')) {
		if (!app.get('trust proxy')) {
			console.log(
				'KeystoneJS Initialisaton Error:\n\n'
				+ 'to set IP range restrictions the "trust proxy" setting must be enabled.\n\n'
			);
			process.exit(1);
		}
		const allowedRanges = keystone.get('allowed ip ranges');
		debug('adding IP ranges', allowedRanges);
		app.use(ipRangeRestrict(
			typeof allowedRanges === 'string' ? allowedRanges : undefined,
			keystone.wrapHTMLError.bind(keystone)
		));
	}
}
