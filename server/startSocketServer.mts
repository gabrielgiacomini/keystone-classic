import type { Keystone } from '../index.mjs';
import type { Application } from 'express';
import fs from 'fs';

export default function startSocketServer(keystone: Keystone, app: Application, callback: (err: Error | null, message?: string) => void): void {
	const unixSocket = keystone.get('unix socket');
	if (!unixSocket) throw new Error('startSocketServer: keystone "unix socket" config is required');
	const message = keystone.get('name') + ' is ready on ' + unixSocket;

	fs.unlink(unixSocket, function (unlinkErr) {
		if (unlinkErr && unlinkErr.code !== 'ENOENT') {
			console.warn('startSocketServer: failed to unlink socket', unlinkErr);
		}
		// app.listen(path, callback) — callback receives no error argument;
		// errors are surfaced via the 'error' event on the returned server.
		keystone.httpServer = app.listen(unixSocket, function () {
			callback(null, message);
		});
		keystone.httpServer.on('error', function (err: Error) {
			callback(err);
		});
		fs.chmod(unixSocket, 0x777, function () {});
	});
}
