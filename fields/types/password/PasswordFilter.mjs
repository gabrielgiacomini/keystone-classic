/**
 * @file
 * This file defines the `PasswordFilter` component, which is used to filter
 * `Password` fields in the KeystoneJS Admin UI.
 *
 * It provides a segmented control to filter by whether the password is set or
 * not.
 */
import React from 'react';

import SegmentedControl from '../../../admin/client-legacy/App/elemental/SegmentedControl/index.mjs';

const EXISTS_OPTIONS = [
	{ label: 'Is Set', value: true },
	{ label: 'Is NOT Set', value: false },
];

/**
 * Returns the default value for the filter.
 * @returns {object} The default value.
 */
function getDefaultValue () {
	return {
		exists: true,
	};
}

/**
 * The `PasswordFilter` component.
 * @augments React.Component
 */
function PasswordFilter({ filter, onChange }) {
	return React.createElement(
		'div',
		{ 'data-list-filter-password': true },
		React.createElement(SegmentedControl, {
			equalWidthSegments: true,
			onChange: (value) => onChange({ exists: value }),
			options: EXISTS_OPTIONS,
			value: filter.exists,
		})
	);
}


PasswordFilter.defaultProps = {
	filter: getDefaultValue(),
};

PasswordFilter.getDefaultValue = getDefaultValue;

export default PasswordFilter;
