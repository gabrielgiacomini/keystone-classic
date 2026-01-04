/**
 * @fileoverview
 * This file defines the `CloudinaryImageFilter` component, which is used to
 * filter `CloudinaryImage` fields in the KeystoneJS Admin UI.
 *
 * It provides a segmented control to filter by whether an image is set or not.
 */
import React from 'react';

import { SegmentedControl } from '../../../admin/client/App/elemental';

const OPTIONS = [
	{ label: 'Is Set', value: true },
	{ label: 'Is NOT Set', value: false },
];

/**
 * Returns the default value for the filter.
 * @returns {Object} The default value.
 */
function getDefaultValue () {
	return {
		exists: true,
	};
}

/**
 * The `CloudinaryImageFilter` component.
 * @extends React.Component
 */
var CloudinaryImageFilter = React.createClass({
	propTypes: {
		filter: React.PropTypes.shape({
			exists: React.PropTypes.oneOf(OPTIONS.map(i => i.value)),
		}),
	},
	statics: {
		getDefaultValue: getDefaultValue,
	},
	getDefaultProps () {
		return {
			filter: getDefaultValue(),
		};
	},
	/**
	 * Handles a change in the filter's value.
	 * @param {boolean} value The new value.
	 */
	toggleExists (value) {
		this.props.onChange({ exists: value });
	},
	/**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */
	render () {
		const { filter } = this.props;

		return (
			<SegmentedControl
				equalWidthSegments
				onChange={this.toggleExists}
				options={OPTIONS}
				value={filter.exists}
			/>
		);
	},
});

export default CloudinaryImageFilter;
