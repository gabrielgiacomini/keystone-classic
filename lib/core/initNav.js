/**
 * @fileoverview This file defines the `initNav` method for the Keystone instance.
 * It is responsible for initializing Keystone's internal navigation configuration,
 * which is used to build the navigation UI in the Admin UI.
 * @module lib/core/initNav
 */
var _ = require('lodash');
var utils = require('keystone-utils');

/**
 * Initializes Keystone's internal navigation configuration.
 *
 * @param {object} sections The navigation configuration object.
 * @returns {object} The initialized navigation configuration.
 * @api private
 */
module.exports = function initNav (sections) {
	var keystone = this;

	var nav = {
		sections: [],
		by: {
			list: {},
			section: {},
		},
	};

	if (!sections) {
		sections = {};
		nav.flat = true;
		_.forEach(this.lists, function (list) {
			if (list.get('hidden')) return;
			sections[list.path] = [list.path];
		});
	}

	_.forEach(sections, function (section, key) {
		if (typeof section === 'string') {
			section = [section];
		}
		section = {
			lists: section,
			label: nav.flat ? keystone.list(section[0]).label : utils.keyToLabel(key),
		};
		section.key = key;
		section.lists = _.map(section.lists, function (i) {
			if (typeof i === 'string') {
				var list = keystone.list(i);
				if (!list) {
					throw new Error('Invalid Keystone Option (nav): list "' + i + '" has not been defined.\n');
				}
				if (list.get('hidden')) {
					throw new Error('Invalid Keystone Option (nav): list "' + i + '" is hidden.\n');
				}
				nav.by.list[list.key] = section;
				return {
					key: list.key,
					label: list.label,
					path: list.path,
				};
			} else if (_.isObject(i)) {
				if (!_.has(i, 'key')) {
					throw new Error('Invalid Keystone Option (nav): object ' + JSON.stringify(i) + ' requires a "key" property.\n');
				}
				i.label = i.label || utils.keyToLabel(i.key);
				i.path = i.path || utils.keyToPath(i.key);
				i.external = true;
				nav.by.list[i.key] = section;
				return i;
			}
			throw new Error('Invalid Keystone Option (nav): "' + i + '" is in an unrecognized format.\n');
		});
		if (section.lists.length) {
			nav.sections.push(section);
			nav.by.section[section.key] = section;
		}
	});

	return nav;
};
