/**
 * @fileoverview Exports a middleware that detects the user's language preferences.
 *
 * @see {@link https://github.com/nicolasbadia/express-request-language}
 * @see {@link module:keystone.server.createApp}
 */

var requestLanguage = require('express-request-language');
var assign = require('object-assign');

/**
 * @typedef {Object} LanguageOptions
 * @property {string[]} [supported languages=['en-US']] - An array of supported languages.
 * @property {string} [language cookie='language'] - The name of the cookie to store the language preference.
 * @property {import('cookie').CookieSerializeOptions} [language cookie options={}] - Options for the language cookie.
 * @property {string} [language select url='/languages/{language}'] - The URL to use for language selection.
 * @property {string} [language query name] - The name of the query parameter to use for language selection.
 */

/**
 * Returns a middleware that detects the user's language preferences.
 *
 * It uses the `express-request-language` middleware to parse the request
 * and determine the best language to use based on the `Accept-Language`
 * header, a cookie, or a query parameter.
 *
 * The middleware can be configured via the `language options` setting
 * in Keystone.
 *
 * @param {import('../../index').Keystone} keystone The Keystone instance.
 * @returns {import('express').RequestHandler} The `express-request-language` middleware.
 */
module.exports = function (keystone) {
	/** @type {LanguageOptions} */
	var languageOptions = assign({
		'supported languages': ['en-US'],
		'language cookie': 'language',
		'language cookie options': {},
		'language select url': '/languages/{language}',
	}, keystone.get('language options'));

	// Configure and return the express-request-language middleware.
	return requestLanguage({
		languages: languageOptions['supported languages'],
		cookie: {
			name: languageOptions['language cookie'],
			url: languageOptions['language select url'],
			options: languageOptions['language cookie options'],
		},
		queryName: languageOptions['language query name'],
	});
};
