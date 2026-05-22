import type { Keystone } from '../index.mjs';
import type { Application } from 'express';
import { create as greenlockCreate } from 'greenlock-express';

export default function initLetsEncrypt(keystone: Keystone, app: Application): void {
	const options = keystone.get('letsencrypt');
	const ssl = keystone.get('ssl');

	if (!options) {
		return;
	}

	if (!ssl) {
		console.error('Ignoring `letsencrypt` setting because `ssl` is not set.');
		return;
	}
	if (ssl === 'only') {
		console.error('To use Let\'s Encrypt you need to have a regular HTTP listener as well. Please set ssl to either `true` or `"force"`.');
		return;
	}

	const email = options.email;
	let approveDomains = options.domains;
	const server = options.production ? 'production' : 'staging';
	const agreeTos = options.tos;

	if (!Array.isArray(approveDomains)) {
		approveDomains = [approveDomains];
	}

	if (!agreeTos) {
		console.error("For auto registation with Let's Encrypt you have to agree to the TOS (https://letsencrypt.org/repository/) (tos: true), provide domains (domains: ['mydomain.com', 'www.mydomain.com']) and a domain owner email (email: 'admin@mydomain.com')");
		return;
	}

	const lex = greenlockCreate({
		server: server,
		approveDomains: approveDomains,
		agreeTos: agreeTos,
		email: email,
	});

	keystone.set('https server options', lex.httpsOptions);
	app.use(lex.middleware());
}
