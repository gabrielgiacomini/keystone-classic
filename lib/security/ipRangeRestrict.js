/**
 * @fileoverview This file provides middleware for restricting access to routes based on the client's IP address.
 * It uses the `range_check` library to validate IP addresses against a list of allowed CIDR ranges.
 * This is a security feature to limit access to certain parts of the application to trusted networks.
 * @module lib/security/ipRangeRestrict
 */
'use strict';

var _ = require('lodash');
var range_check = require('range_check');
var util = require('util');

/**
 * Implements IP range-based access control middleware.
 *
 * @param {string} ipRanges A string containing space or comma-separated CIDR ranges (e.g., '127.0.0.0/8, 192.168.0.0/16').
 * @param {function} wrapHTMLError A function that generates an HTML error page.
 * @returns {function} An Express middleware function.
 */
module.exports = function (ipRanges, wrapHTMLError) {
	/**
	 * Express middleware to restrict requests to allowed IP ranges.
	 *
	 * @param {object} req The Express request object.
	 * @param {object} res The Express response object.
	 * @param {function} next The next middleware function in the stack.
	 */
	return function (req, res, next) {
		// Ensure that at least one IP range has been provided.
		if (_.isUndefined(ipRanges)) {
			throw new Error('Allowed IP range is not defined');
		}

		// Split the `ipRanges` string by spaces or commas to get an array of ranges.
		var allowedRanges = ipRanges.split(/\s+|,/);

		// Filter out any invalid CIDR ranges from the list.
		allowedRanges = _.filter(allowedRanges, function (ipRange) {
			return range_check.validRange(ipRange);
		});

		// If no valid ranges are left, throw an error.
		if (allowedRanges.length <= 0) {
			throw new Error('No valid CIDR ranges were specified');
		}

		// Determine the request's IP address. If 'trust proxy' is enabled in Express,
		// `req.ips` will contain the chain of IP addresses from the X-Forwarded-For header.
		// The original client IP is the last one in the array.
		var requestIP = (req.ips.length > 0) ? req.ips.slice().pop() : req.ip;

		// Check if the request's IP is within any of the allowed ranges.
		var requestAllowed = range_check.inRange(requestIP, allowedRanges);

		// If the request is not from an allowed IP, send a 403 Forbidden response.
		if (!requestAllowed) {
			var msg = '-> blocked request from %s (not in allowed IP range)';
			console.log(util.format(msg, req.ip));

			// Generate and send an HTML error page.
			var title = 'Sorry, your request is not authorized (403)';
			var message = 'Requests from outside permitted IP range are not allowed';
			var htmlError = wrapHTMLError(title, message);

			return res.status(403).send(htmlError);
		}

		// If the IP is allowed, proceed to the next middleware.
		next();
	};
};
