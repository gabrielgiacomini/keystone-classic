/**
 * @fileoverview
 * This file defines the `CloudinaryImageFilter` component, which is used to
 * filter `CloudinaryImage` fields in the KeystoneJS Admin UI.
 *
 * It provides a segmented control to filter by whether an image is set or not.
 */
import PropTypes from 'prop-types';

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
class CloudinaryImageFilter extends React.Component {
    static propTypes = {
		filter: PropTypes.shape({
			exists: PropTypes.oneOf(OPTIONS.map(i => i.value)),
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
				options={OPTIONS}
				value={filter.exists}
			/>
		);
	}
}

export default CloudinaryImageFilter;
