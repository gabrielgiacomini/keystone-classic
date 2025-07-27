/**
 * @fileoverview Exports a middleware that detects the user's language preferences
 * using the `express-request-language` package. This middleware helps in
 * internationalization (i18n) by determining the appropriate language from
 * the request headers, cookies, or query parameters.
 *
 * @see {@link https://github.com/nicolasbadia/express-request-language}
 * @see {@link module:keystone.server.createApp}
 */

var requestLanguage = require('express-request-language');
var assign = require('object-assign');

/**
 * @typedef {Object} LanguageOptions
 * @property {string[]} [supported languages=['en-US']] - An array of BCP 47 language tags that the application supports.
 * @property {string} [language cookie='language'] - The name of the cookie used to store the user's language preference.
 * @property {import('cookie').CookieSerializeOptions} [language cookie options={}] - Options for the language cookie, as defined by the `cookie` package.
 * @property {string} [language select url='/languages/{language}'] - A URL pattern for changing the language. The `{language}` placeholder is replaced with the language tag.
 * @property {string} [language query name='language'] - The name of the URL query parameter to use for language selection.
 */

/**
 * Creates and configures the language detection middleware.
 *
 * This middleware integrates `express-request-language` into Keystone. It's
 * configured via the `language options` setting in Keystone's configuration.
 * The middleware will add a `req.language` property to incoming requests,
 * indicating the resolved language.
 *
 * @param {import('../../index').Keystone} keystone The Keystone instance, used to access configuration options.
 * @returns {import('express').RequestHandler} An Express middleware function that handles language detection.
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
