/**
 * @fileoverview This file provides CSRF (Cross-Site Request Forgery) protection middleware for KeystoneJS.
 * It implements the synchronizer token pattern to prevent CSRF attacks.
 * A secret is stored in the user's session, and a token is generated from it.
 * This token is then required for all non-safe HTTP methods (POST, PUT, DELETE, etc.).
 * The token can be passed in the request body, query string, or headers.
 * @module lib/security/csrf
 */
var crypto = require('crypto');
var scmp = require('scmp');
var utils = require('keystone-utils');

// The DISABLE_CSRF environment variable is available to automatically pass
// CSRF validation. This is useful in development scenarios where you want to
// restart the node process and aren't using a persistent session store, but
// should NEVER be set in production environments!!
var DISABLE_CSRF = process.env.DISABLE_CSRF === 'true';

/**
 * The key for the CSRF token in the request body or query string.
 * @const {string}
 */
exports.TOKEN_KEY = '_csrf';
/**
 * The key for the CSRF token key in `res.locals`.
 * @const {string}
 */
exports.LOCAL_KEY = 'csrf_token_key';
/**
 * The key for the CSRF token value in `res.locals`.
 * @const {string}
 */
exports.LOCAL_VALUE = 'csrf_token_value';
/**
 * The key for the CSRF secret in the session.
 * @const {string}
 */
exports.SECRET_KEY = exports.TOKEN_KEY + '_secret';
/**
 * The length of the CSRF secret.
 * @const {number}
 */
exports.SECRET_LENGTH = 10;
/**
 * The name of the CSRF token header.
 * @const {string}
 */
exports.CSRF_HEADER_KEY = 'x-csrf-token';
/**
 * The name of the XSRF token header (Angular-style).
 * @const {string}
 */
exports.XSRF_HEADER_KEY = 'x-xsrf-token';
/**
 * The name of the XSRF token cookie (Angular-style).
 * @const {string}
 */
exports.XSRF_COOKIE_KEY = 'XSRF-TOKEN';

/**
 * Generates a CSRF token from a salt and a secret.
 *
 * @param {string} salt The salt to use for token generation.
 * @param {string} secret The secret to use for token generation.
 * @returns {string} The generated CSRF token.
 * @private
 */
function tokenize (salt, secret) {
	return salt + crypto.createHash('sha1').update(salt + secret).digest('hex');
}

/**
 * Creates a new CSRF secret.
 *
 * @returns {string} A new CSRF secret.
 */
exports.createSecret = function () {
	return crypto.pseudoRandomBytes(exports.SECRET_LENGTH).toString('base64');
};

/**
 * Gets the CSRF secret from the request session. If a secret does not exist, a new one is created.
 *
 * @param {object} req The Express request object.
 * @returns {string} The CSRF secret.
 */
exports.getSecret = function (req) {
	return req.session[exports.SECRET_KEY] || (req.session[exports.SECRET_KEY] = exports.createSecret());
};

/**
 * Creates a new CSRF token.
 *
 * @param {object} req The Express request object.
 * @returns {string} A new CSRF token.
 */
exports.createToken = function (req) {
	return tokenize(utils.randomString(exports.SECRET_LENGTH), exports.getSecret(req));
};

/**
 * Gets the CSRF token for the current request, creating one if it doesn't exist.
 * The token is stored in `res.locals` and sent as a cookie.
 *
 * @param {object} req The Express request object.
 * @param {object} res The Express response object.
 * @returns {string} The CSRF token.
 */
exports.getToken = function (req, res) {
	res.locals[exports.LOCAL_VALUE] = res.locals[exports.LOCAL_VALUE] || exports.createToken(req);
	res.cookie(exports.XSRF_COOKIE_KEY, res.locals[exports.LOCAL_VALUE]);
	return res.locals[exports.LOCAL_VALUE];
};

/**
 * Extracts the CSRF token from the request.
 * The token is looked for in the request body, query string, and headers.
 *
 * @param {object} req The Express request object.
 * @returns {string} The CSRF token from the request, or an empty string if not found.
 */
exports.requestToken = function (req) {
	if (req.body && req.body[exports.TOKEN_KEY]) {
		return req.body[exports.TOKEN_KEY];
	} else if (req.query && req.query[exports.TOKEN_KEY]) {
		return req.query[exports.TOKEN_KEY];
	} else if (req.headers && req.headers[exports.XSRF_HEADER_KEY]) {
		return req.headers[exports.XSRF_HEADER_KEY];
	} else if (req.headers && req.headers[exports.CSRF_HEADER_KEY]) {
		return req.headers[exports.CSRF_HEADER_KEY];
	}
	// JM: If you think we should be checking the req.cookie here you don't understand CSRF.
	// On pages loaded from this app (on the same origin) JS will have access to the cookie and should add the CSRF value as one of the headers above.
	// Other pages, like those created by an attacker, can still create requests to this app (to which the browser will add cookie information) but,
	// since the calling page itself can't access the cookie, it will be unable to add the CSRF header, body or query param to the request.
	// The fact that we *don't* check the CSRF value that comes in with the cookie is what makes this CSRF implementation work.
	// See.. https://en.wikipedia.org/wiki/Cross-site_request_forgery#Cookie-to-header_token
	return '';
};

/**
 * Validates a CSRF token.
 *
 * @param {object} req The Express request object.
 * @param {string} [token] The token to validate. If not provided, it is extracted from the request.
 * @returns {boolean} `true` if the token is valid, otherwise `false`.
 */
exports.validate = function (req, token) {
	// Allow environment variable to disable check
	if (DISABLE_CSRF) return true;
	if (arguments.length === 1) {
		token = exports.requestToken(req);
	}
	if (typeof token !== 'string') {
		return false;
	}
	// Use scmp for constant-time string comparison to prevent timing attacks.
	return scmp(
		token,
		tokenize(
			token.slice(0, exports.SECRET_LENGTH),
			req.session[exports.SECRET_KEY]
		)
	);
};

/**
 * CSRF protection middleware.
 */
exports.middleware = {
	/**
	 * Middleware to initialize CSRF protection.
	 * It ensures a CSRF token is available in `res.locals`.
	 *
	 * @param {object} req The Express request object.
	 * @param {object} res The Express response object.
	 * @param {function} next The next middleware function in the stack.
	 */
	init: function (req, res, next) {
		res.locals[exports.LOCAL_KEY] = exports.LOCAL_VALUE;
		exports.getToken(req, res);
		next();
	},
	/**
	 * Middleware to validate the CSRF token on incoming requests.
	 * It checks for a valid token on non-safe HTTP methods.
	 *
	 * @param {object} req The Express request object.
	 * @param {object} res The Express response object.
	 * @param {function} next The next middleware function in the stack.
	 */
	validate: function (req, res, next) {
		// Allow environment variable to disable check
		if (DISABLE_CSRF) return next();
		// Bail on safe methods (GET, HEAD, OPTIONS)
		if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
			return next();
		}
		// Validate the token
		if (exports.validate(req)) {
			next();
		} else {
			// If the token is invalid, send a 403 Forbidden response.
			res.statusCode = 403;
			next(new Error('CSRF token mismatch'));
		}
	},
};
