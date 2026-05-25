/**
 * @file
 * This file defines the `BooleanFilter` component, which is used to filter
 * `Boolean` fields in the KeystoneJS Admin UI.
 *
 * It provides a segmented control to filter by whether the value is checked or
 * not.
 */
import React from 'react';
import SegmentedControl from '../../../admin/client-legacy/App/elemental/SegmentedControl/index.mjs';

const VALUE_OPTIONS = [
	{ label: 'Is Checked', value: true },
	{ label: 'Is NOT Checked', value: false },
];

/**
 * Returns the default value for the filter.
 * @returns {object} The default value.
 */
function getDefaultValue () {
	return {
		value: true,
	};
}

/**
 * The `BooleanFilter` component.
 * @augments React.Component
 */
function BooleanFilter({ filter, onChange }) {
	return React.createElement(
		'div',
		{ 'data-list-filter-boolean': true },
		React.createElement(SegmentedControl, {
			equalWidthSegments: true,
			options: VALUE_OPTIONS,
			value: filter.value,
			onChange: (value) => onChange({ value }),
		})
	);
}


BooleanFilter.defaultProps = {
	filter: getDefaultValue(),
};

BooleanFilter.getDefaultValue = getDefaultValue;

export default BooleanFilter;
