/**
 * @fileoverview This file defines the `apiForGet` function, which returns JSON
 * API middleware for a GET /:id endpoint. It allows for querying and
 * transforming the data before sending it as a JSON response.
 */

/**
 * Returns JSON API middleware for a GET /:id endpoint.
 *
 * @param {Object} options
 * @param {string} [options.id=id] The name of the express url param that contains the ID to get.
 * @param {function(Object, import('express').Request, import('express').Response): (void|boolean)} [options.query] A function that modifies the query to find the item.
 * @param {Object} [options.query] An object of additional `where` conditions to add to the `query`
 * @param {function(Object, import('express').Request, import('express').Response): Object} [options.transform] A function that transforms the object before it is sent as JSON.
 * @return {import('express').RequestHandler}
 */
module.exports = function apiForGet (options) {
	var idParam = options.id || 'id';
	var List = this;
	return function (req, res) {
		var id = req.params[idParam];
		var query = List.model.findById(id);
		if (typeof options.query === 'function') {
			var result = options.query(query, req);
			if (result === false) return;
		} else if (typeof options.query === 'object') {
			query.where(options.query);
		}
		query.exec(function (err, item) {
			if (err) return res.status(500).json({ err: 'database error', detail: err });
			if (!item) return res.status(404).json({ err: 'not found', id: id });
			if (options.transform) {
				item = options.transform(item, req, res);
				if (item === false) return;
			}
			return res.json({
				data: item,
			});
		});
	};
};
