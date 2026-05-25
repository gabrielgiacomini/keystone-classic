import type { Keystone } from '../index.mjs';
import type { Application } from 'express';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

type GreenlockInstance = {
	httpsOptions: unknown;
	middleware(): Parameters<Application['use']>[0];
};

type GreenlockExpressModule = {
	create(options: {
		server: string;
		approveDomains: string[];
		agreeTos: boolean;
		email: string;
	}): GreenlockInstance;
};

function loadGreenlockExpress(): GreenlockExpressModule {
	try {
		return require('greenlock-express') as GreenlockExpressModule;
	} catch (error) {
		const code = (error as { code?: unknown }).code;
		if (code === 'MODULE_NOT_FOUND' || code === 'ERR_MODULE_NOT_FOUND') {
			const missingDependencyError = new Error('To use the `letsencrypt` option, install the optional package `greenlock-express`.');
			(missingDependencyError as Error & { cause: unknown }).cause = error;
			throw missingDependencyError;
		}
		throw error;
	}
}

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

	const lex = loadGreenlockExpress().create({
		server: server,
		approveDomains: approveDomains,
		agreeTos: agreeTos,
		email: email,
	});

	keystone.set('https server options', lex.httpsOptions);
	app.use(lex.middleware());
}
