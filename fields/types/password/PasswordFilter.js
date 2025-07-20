/**
 * @fileoverview
 * This file defines the `PasswordFilter` component, which is used to filter
 * `Password` fields in the KeystoneJS Admin UI.
 *
 * It provides a segmented control to filter by whether the password is set or
 * not.
 */
import React from 'react';

import { SegmentedControl } from '../../../admin/client/App/elemental';

const EXISTS_OPTIONS = [
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
 * The `PasswordFilter` component.
 * @extends React.Component
 */
var PasswordFilter = React.createClass({
	propTypes: {
		filter: React.PropTypes.shape({
			exists: React.PropTypes.oneOf(EXISTS_OPTIONS.map(i => i.value)),
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
				options={EXISTS_OPTIONS}
				value={filter.exists}
			/>
		);
	},
});

module.exports = PasswordFilter;
