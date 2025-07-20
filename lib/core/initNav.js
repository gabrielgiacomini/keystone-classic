/**
 * @fileoverview This file defines the `initNav` function for Keystone, which is
 * responsible for initializing the navigation structure for the Admin UI.
 *
 * The navigation structure determines how lists are grouped and displayed in the
 * Admin UI sidebar. This function processes the `nav` option provided during
 * Keystone initialization and builds a structured navigation object.
 *
 * It uses 'lodash' for object and array manipulation and 'keystone-utils' for
 * utility functions like converting keys to labels.
 */
var _ = require('lodash');
var utils = require('keystone-utils');

/**
 * Initializes Keystone's navigation configuration.
 *
 * This function processes the `sections` object provided in the `nav` option
 * and constructs a structured navigation object. If no `sections` are provided,
 * it creates a flat navigation structure with all non-hidden lists.
 *
 * @param {Object} sections - The navigation configuration object.
 * @returns {Object} A structured navigation object.
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

	// If no sections are defined, create a flat navigation structure.
	if (!sections) {
		sections = {};
		nav.flat = true;
		_.forEach(this.lists, function (list) {
			if (list.get('hidden')) return;
			sections[list.path] = [list.path];
		});
	}

	// Process each section in the navigation configuration.
	_.forEach(sections, function (section, key) {
		if (typeof section === 'string') {
			section = [section];
		}
		section = {
			lists: section,
			label: nav.flat ? keystone.list(section[0]).label : utils.keyToLabel(key),
			key: key,
		};

		// Process the lists within the section.
		section.lists = _.map(section.lists, function (i) {
			if (typeof i === 'string') {
				var list = keystone.list(i);
				if (!list) {
					throw new Error('Invalid Keystone Option (nav): list ' + i + ' has not been defined.\n');
				}
				if (list.get('hidden')) {
					throw new Error('Invalid Keystone Option (nav): list ' + i + ' is hidden.\n');
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
			throw new Error('Invalid Keystone Option (nav): ' + i + ' is in an unrecognized format.\n');
		});

		// Add the section to the navigation if it has lists.
		if (section.lists.length) {
			nav.sections.push(section);
			nav.by.section[section.key] = section;
		}
	});

	return nav;
};
