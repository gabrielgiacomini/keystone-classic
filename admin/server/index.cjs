'use strict';

const namespace = require('./index.mjs');
const adminServer = namespace.default || namespace;

Object.defineProperty(adminServer, 'default', {
	configurable: true,
	value: adminServer,
});
Object.defineProperty(adminServer, '__esModule', {
	configurable: true,
	value: true,
});

module.exports = adminServer;
