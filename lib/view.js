/**
 * @fileoverview This file defines the `View` class, a powerful helper for
 * managing the logic and rendering of views in a Keystone application. It provides
 * a structured way to handle asynchronous operations, such as database queries,
 * before rendering a template.
 *
 * The `View` class uses a queueing system to manage `init`, `action`, `query`,
 * and `render` events, allowing for a clear separation of concerns in view
 * logic. It simplifies common tasks like conditional action handling, data
 * fetching, and template rendering.
 *
 * @module lib/view
 * @requires lodash
 * @requires async
 * @requires keystone
 * @requires keystone-utils
 */

var _ = require('lodash');
var async = require('async');
var keystone = require('../');
var utils = require('keystone-utils');

/**
 * View constructor.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @constructor
 * @api public
 */

function View (req, res) {

	if (!req || req.constructor.name !== 'IncomingMessage') {
		throw new Error('Keystone.View Error: Express request object is required.');
	}

	if (!res || res.constructor.name !== 'ServerResponse') {
		throw new Error('Keystone.View Error: Express response object is required.');
	}

	this.req = req;
	this.res = res;

	this.initQueue = [];	// executed first in series
	this.actionQueue = [];	// executed second in parallel, if optional conditions are met
	this.queryQueue = [];	// executed third in parallel
	this.renderQueue = [];	// executed fourth in parallel

}

module.exports = View;


/**
 * Adds a method (or array of methods) to be executed in parallel
 * to the `init`, `action` or `render` queue.
 *
 * @param {string|function|Object} on - The event to listen for.
 * @param {function} callback - The function to execute.
 * @returns {View} The view instance for chaining.
 * @api public
 */

View.prototype.on = function (on) {

	var req = this.req;
	var callback = arguments[1];

	if (typeof on === 'function') {

		/* If the first argument is a function that returns truthy then add the second
		 * argument to the action queue
		 *
		 * Example:
		 *
		 *     view.on(function() {
		 *             var thing = true;
		 *             return thing;
		 *         },
		 *         function(next) {
		 *             console.log('thing is true!');
		 *             next();
		 *         }
		 *     );
		 */

		if (on()) {
			this.actionQueue.push(callback);
		}

	} else if (utils.isObject(on)) {

		/* Do certain actions depending on information in the response object.
		 *
		 * Example:
		 *
		 *     view.on({ 'user.name.first': 'Admin' }, function(next) {
		 *         console.log('Hello Admin!');
		 *         next();
		 *     });
		 */

		var check = function (value, path) {
			var ctx = req;
			var parts = path.split('.');
			for (var i = 0; i < parts.length - 1; i++) {
				if (!ctx[parts[i]]) {
					return false;
				}
				ctx = ctx[parts[i]];
			}
			path = _.last(parts);
			return (value === true && path in ctx) ? true : (ctx[path] === value);
		};

		if (_.every(on, check)) {
			this.actionQueue.push(callback);
		}

	} else if (on === 'get' || on === 'post' || on === 'put' || on === 'delete') {

		/* Handle HTTP verbs
		 *
		 * Example:
		 *     view.on('get', function(next) {
		 *         console.log('GOT!');
		 *         next();
		 *     });
		 */
		if (req.method !== on.toUpperCase()) {
			return this;
		}

		if (arguments.length === 3) {

			/* on a POST and PUT requests search the req.body for a matching value
			 * on every other request search the query.
			 *
			 * Example:
			 *     view.on('post', { action: 'theAction' }, function(next) {
			 *         // respond to the action
			 *         next();
			 *     });
			 *
			 * Example:
			 *     view.on('get', { page: 2 }, function(next) {
			 *         // do something specifically on ?page=2
			 *         next();
			 *     });
			 */

			callback = arguments[2];

			var values = {};
			if (utils.isString(arguments[1])) {
				values[arguments[1]] = true;
			} else {
				values = arguments[1];
			}

			var ctx = (on === 'post' || on === 'put') ? req.body : req.query;

			if (!_.every(values || {}, function (value, path) {
				return (value === true && path in ctx) ? true : (ctx[path] === value);
			})) {
				return this;
			}

		}

		this.actionQueue.push(callback);

	} else if (on === 'init') {

		/* Init events are always fired in series, before any other actions
		 *
		 * Example:
		 *     view.on('init', function (next) {
		 *         // do something before any actions or queries have run
		 *     });
		 */

		this.initQueue.push(callback);

	} else if (on === 'render') {

		/* Render events are always fired last in parallel, after any other actions
		 *
		 * Example:
		 *     view.on('render', function (next) {
		 *         // do something after init, action and query middleware has run
		 *     });
		 */

		this.renderQueue.push(callback);

	}

	// TODO: Should throw if we didn't recognise the first argument!

	return this;

};
/**
 * QueryCallbacks constructor.
 *
 * @param {Object|string} options - The options for the callbacks.
 * @constructor
 * @private
 */
var QueryCallbacks = function (options) {
	if (utils.isString(options)) {
		options = { then: options };
	} else {
		options = options || {};
	}
	this.callbacks = {};
	if (options.err) this.callbacks.err = options.err;
	if (options.none) this.callbacks.none = options.none;
	if (options.then) this.callbacks.then = options.then;
	return this;
};

QueryCallbacks.prototype.has = function (fn) { return (fn in this.callbacks); };
QueryCallbacks.prototype.err = function (fn) { this.callbacks.err = fn; return this; };
QueryCallbacks.prototype.none = function (fn) { this.callbacks.none = fn; return this; };
QueryCallbacks.prototype.then = function (fn) { this.callbacks.then = fn; return this; };


/**
 * Queues a Mongoose query for execution before the view is rendered.
 * The results of the query are set in `locals[key]`.
 *
 * @param {string} key - The key to store the query results in `res.locals`.
 * @param {Query} query - The Mongoose query to execute.
 * @param {Object} [options] - Options for the query.
 * @returns {QueryCallbacks} A chainable object for attaching callbacks.
 * @api public
 */

View.prototype.query = function (key, query, options) {

	var locals = this.res.locals;
	var parts = key.split('.');
	var chain = new QueryCallbacks(options);

	key = parts.pop();

	for (var i = 0; i < parts.length; i++) {
		if (!locals[parts[i]]) {
			locals[parts[i]] = {};
		}
		locals = locals[parts[i]];
	}

	this.queryQueue.push(function (next) {
		query.exec(function (err, results) {

			locals[key] = results;
			var callbacks = chain.callbacks;

			if (err) {
				if ('err' in callbacks) {
					/* Will pass errors into the err callback
					 *
					 * Example:
					 *     view.query('books', keystone.list('Book'))
					 *         .err(function (err, next) {
					 *             console.log('ERROR: ', err);
					 *             next();
					 *         });
					 */
					return callbacks.err(err, next);
				}
			} else {
				if ((!results || (utils.isArray(results) && !results.length)) && 'none' in callbacks) {
					/* If there are no results view.query().none will be called
					 *
					 * Example:
					 *     view.query('books', keystone.list('Book').model.find())
					 *         .none(function (next) {
					 *             console.log('no results');
					 *             next();
					 *         });
					 */
					return callbacks.none(next);
				} else if ('then' in callbacks) {
					if (utils.isFunction(callbacks.then)) {
						return callbacks.then(err, results, next);
					} else {
						return keystone.populateRelated(results, callbacks.then, next);
					}
				}
			}

			return next(err);

		});
	});

	return chain;
};


/**
 * Executes the current queue of init and action methods in series, and
 * then executes the render function. If renderFn is a string, it is provided
 * to `res.render`.
 *
 * It is expected that *most* init and action stacks require processing in
 * series.  If there are several init or action methods that should be run in
 * parallel, queue them as an array, e.g. `view.on('init', [first, second])`.
 *
 * @param {string|function} renderFn - The template path or render function.
 * @param {Object} [locals] - The locals to pass to the template.
 * @param {function} [callback] - The callback to call after rendering.
 * @api public
 */
View.prototype.render = function (renderFn, locals, callback) {

	var req = this.req;
	var res = this.res;

	if (typeof renderFn === 'string') {
		var viewPath = renderFn;
		renderFn = function () {
			if (typeof locals === 'function') {
				locals = locals();
			}
			this.res.render(viewPath, locals, callback);
		}.bind(this);
	}

	if (typeof renderFn !== 'function') {
		throw new Error('Keystone.View.render() renderFn must be a templatePath (string) or a function.');
	}

	// Add actions, queries & renderQueue to the end of the initQueue
	this.initQueue.push.apply(this.initQueue, this.actionQueue);
	this.initQueue.push.apply(this.initQueue, this.queryQueue);

	var preRenderQueue = [];

	// Add Keystone's global pre('render') queue
	keystone.getMiddleware('pre:render').forEach(function (fn) {
		preRenderQueue.push(function (next) {
			fn(req, res, next);
		});
	});

	this.initQueue.push(preRenderQueue);
	this.initQueue.push(this.renderQueue);

	async.eachSeries(this.initQueue, function (i, next) {
		if (Array.isArray(i)) {
			// process nested arrays in parallel
			async.parallel(i, next);
		} else if (typeof i === 'function') {
			// process single methods in series
			i(next);
		} else {
			throw new Error('Keystone.View.render() events must be functions.');
		}
	}, function (err) {
		renderFn(err, req, res);
	});

};
