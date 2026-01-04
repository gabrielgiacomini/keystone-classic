/**
 * @fileoverview
 * This file defines the `PasswordFilter` component, which is used to filter
 * `Password` fields in the KeystoneJS Admin UI.
 *
 * It provides a segmented control to filter by whether the password is set or
 * not.
 */
import PropTypes from 'prop-types';

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
class PasswordFilter extends React.Component {
    static propTypes = {
		filter: PropTypes.shape({
			exists: PropTypes.oneOf(EXISTS_OPTIONS.map(i => i.value)),
		}),
	};

    static getDefaultValue = getDefaultValue;

    static defaultProps = {
        filter: getDefaultValue(),
    };

    /**
	 * Handles a change in the filter's value.
	 * @param {boolean} value The new value.
	 */
    toggleExists = (value) => {
		this.props.onChange({ exists: value });
	};

    /**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */
    render() {
		const { filter } = this.props;

		return (
			<SegmentedControl
				equalWidthSegments
				onChange={this.toggleExists}
				options={EXISTS_OPTIONS}
				value={filter.exists}
			/>
		);
	}
}

export default PasswordFilter;
