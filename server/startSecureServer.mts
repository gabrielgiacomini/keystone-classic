import type { Keystone } from '../index.mjs';
import type { Application } from 'express';
import type { ServerOptions } from 'node:https';
import tls from 'node:tls';
import fs from 'node:fs';
import nativeHttps from 'node:https';
import { createRequire } from 'node:module';

type HttpsModule = { createServer(options: ServerOptions, app: Application): { listen(port: number, host: string, cb: (err: Error) => void): import('http').Server } };

let https: HttpsModule;
const require = createRequire(import.meta.url);
try {
	const spdy = require('spdy') as HttpsModule | { default: HttpsModule };
	https = ('default' in spdy ? spdy.default : spdy) as HttpsModule;
} catch {
	https = nativeHttps as unknown as HttpsModule;
}

/**
 * Starts an HTTPS server with auto-generated or custom SSL certificates.
 * @param keystone - The keystone instance.
 * @param app - The Express application.
 * @param created - Callback invoked when the server is created.
 * @param callback - Callback invoked when the server starts or errors.
 * @returns Nothing; the function starts the server asynchronously.
 */
export default function startSecureServer(
	keystone: Keystone,
	app: Application,
	created: () => void,
	callback: (err: Error | null, message?: string) => void,
): void {
	const ssl = keystone.get('ssl');
	const host = keystone.get('ssl host') || keystone.get('host');
	if (!host) throw new Error('startSecureServer: keystone "ssl host" or "host" config is required');
	const port = keystone.get('ssl port') as number;
	let message = (ssl === 'only') ? keystone.get('name') + ' (SSL) is ready on ' : 'SSL Server is ready on ';
	const options: Record<string, unknown> = keystone.get('https server options') ?? {};
	options.minVersion = options.minVersion ?? ('TLSv1.2' as const);
	const npnProtos = options.NPNProtocols as string[] | undefined;
	if (npnProtos?.length === 1 && npnProtos[0] === 'http/1.1') {
		delete options.NPNProtocols;
	}

	if (keystone.get('ssl cert') && fs.existsSync(keystone.getPath('ssl cert'))) {
		options.cert = fs.readFileSync(keystone.getPath('ssl cert'));
	}
	if (keystone.get('ssl key') && fs.existsSync(keystone.getPath('ssl key'))) {
		options.key = fs.readFileSync(keystone.getPath('ssl key'));
	}
	if (keystone.get('ssl ca') && fs.existsSync(keystone.getPath('ssl ca'))) {
		options.ca = fs.readFileSync(keystone.getPath('ssl ca'));
	}
	if (keystone.get('ssl pfx') && fs.existsSync(keystone.getPath('ssl pfx'))) {
		options.pfx = fs.readFileSync(keystone.getPath('ssl pfx'));
	}

	if (keystone.get('ssl cert data')) {
		options.cert = keystone.get('ssl cert data');
	}
	if (keystone.get('ssl key data')) {
		options.key = keystone.get('ssl key data');
	}
	if (keystone.get('ssl ca data')) {
		options.ca = keystone.get('ssl ca data');
	}
	if (keystone.get('ssl pfx data')) {
		options.pfx = keystone.get('ssl pfx data');
	}
	if (keystone.get('ssl passphrase')) {
		options.passphrase = keystone.get('ssl passphrase');
	}

	/** Callback type for SNI certificate selection. */
type SniFunc = (host: string) => tls.SecureContextOptions | undefined | null;
	const sniFunc = keystone.get('ssl sni') as SniFunc | undefined;
	if (sniFunc) {
		const sniFuncRef = sniFunc;
		options.SNICallback = function (hostArg: string, cb: (err: Error | null, ctx?: tls.SecureContext) => void) {
			const ctx = sniFuncRef(hostArg);
			cb(null, ctx ? tls.createSecureContext(ctx) : undefined);
		};
	}

	if ((!options.key || !options.cert) && !options.pfx && !keystone.get('letsencrypt')) {
		if (sniFunc) {
			const localCtx = sniFunc('localhost');
			if (localCtx) {
				const localCtxRecord = localCtx as unknown as Record<string, unknown>;
				for (const prop in localCtxRecord) {
					if (Object.prototype.hasOwnProperty.call(localCtxRecord, prop)) {
						options[prop] = localCtxRecord[prop];
					}
				}
			}
		}
		if ((!options.key || !options.cert) && !options.pfx) {
			if (ssl === 'only') {
				console.log(keystone.get('name') + ' failed to start: invalid ssl configuration (certificate files required)');
				process.exit();
			}
			return callback(null, 'SSL Not Started: Invalid SSL Configuration (certificate files required)');
		}
	}

	const server = https.createServer(options, app);
	created();

	function ready(err: Error) {
		callback(err, message);
	}

	message += 'https://' + host + ':' + port;
	keystone.httpsServer = server.listen(port, host, ready);
	keystone.httpsServer.on('error', function (err: Error) {
		callback(err);
	});
}
