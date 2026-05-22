'use strict';

const namespace = require('./index.mjs');
const keystone = namespace.default || namespace;

Object.defineProperty(keystone, 'default', {
	configurable: true,
	value: keystone,
});
Object.defineProperty(keystone, '__esModule', {
	configurable: true,
	value: true,
});

module.exports = keystone;
