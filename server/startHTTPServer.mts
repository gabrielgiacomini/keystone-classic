import type { Keystone } from '../index.mjs';
import type { Application } from 'express';
import http from 'http';

export default function startHTTPServer(keystone: Keystone, app: Application, callback: (err: Error | null, message?: string) => void): void {
	const host = keystone.get('host');
	if (!host) throw new Error('startHTTPServer: keystone "host" config is required');
	const port = keystone.get('port') as number;
	const forceSsl = (keystone.get('ssl') === 'force');

	keystone.httpServer = http
		.createServer(app)
		.listen(port, host, function ready(this: void) {
			const message = keystone.get('name') + ' is ready on '
				+ 'http://' + host + ':' + port
				+ (forceSsl ? ' (SSL redirect)' : '');
			callback(null, message);
		});
	keystone.httpServer.on('error', function (err: Error) {
		callback(err);
	});
}
