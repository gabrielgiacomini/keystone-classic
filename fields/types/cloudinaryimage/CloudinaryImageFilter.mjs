/**
 * @file
 * This file defines the `CloudinaryImageFilter` component, which is used to
 * filter `CloudinaryImage` fields in the KeystoneJS Admin UI.
 *
 * It provides a segmented control to filter by whether an image is set or not.
 */
import React from 'react';

import SegmentedControl from '../../../admin/client-legacy/App/elemental/SegmentedControl/index.mjs';

const OPTIONS = [
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
 * The `CloudinaryImageFilter` component.
 * @augments React.Component
 */
function CloudinaryImageFilter({ filter, onChange }) {
	return React.createElement(SegmentedControl, {
		equalWidthSegments: true,
		onChange: (value) => onChange({ exists: value }),
		options: OPTIONS,
		value: filter.exists,
	});
}


CloudinaryImageFilter.defaultProps = {
	filter: getDefaultValue(),
};

CloudinaryImageFilter.getDefaultValue = getDefaultValue;

export default CloudinaryImageFilter;
