/**
 * @fileoverview
 * This file defines the `LocationFilter` component, which is used to filter
 * `Location` fields in the KeystoneJS Admin UI.
 *
 * It provides a set of inputs for the different parts of a location, and it
 * supports inverting the filter.
 */
import PropTypes from 'prop-types';

import React from 'react';
import { findDOMNode } from 'react-dom';

import {
	FormField,
	FormInput,
	Grid,
	SegmentedControl,
} from '../../../admin/client/App/elemental';

const INVERTED_OPTIONS = [
	{ label: 'Matches', value: false },
	{ label: 'Does NOT Match', value: true },
];

/**
 * Returns the default value for the filter.
 * @returns {Object} The default value.
 */
function getDefaultValue () {
	return {
		inverted: INVERTED_OPTIONS[0].value,
		street: undefined,
		city: undefined,
		state: undefined,
		code: undefined,
		country: undefined,
	};
}

/**
 * The `LocationFilter` component.
 * @extends React.Component
 */
class TextFilter extends React.Component {
    static propTypes = {
		filter: PropTypes.shape({
			inverted: PropTypes.boolean,
			street: PropTypes.string,
			city: PropTypes.string,
			state: PropTypes.string,
			code: PropTypes.string,
			country: PropTypes.string,
		}),
	};

    static getDefaultValue = getDefaultValue;

    static defaultProps = {
        filter: getDefaultValue(),
    };

    /**
	 * Updates the filter with a new value.
	 * @param {string} key The key of the value to update.
	 * @param {*} val The new value.
	 */
    updateFilter = (key, val) => {
		const update = {};
		update[key] = val;
		this.props.onChange(Object.assign(this.props.filter, update));
	};

    /**
	 * Toggles the inverted state of the filter.
	 * @param {boolean} value The new inverted state.
	 */
    toggleInverted = (value) => {
		this.updateFilter('inverted', value);
		findDOMNode(this.refs.focusTarget).focus();
	};

    /**
	 * Handles a change in the value of one of the filter fields.
	 * @param {Object} e The event object.
	 */
    updateValue = (e) => {
		this.updateFilter(e.target.name, e.target.value);
	};

    /**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */
    render() {
		const { filter } = this.props;

		return (
			<div>
				<FormField>
					<SegmentedControl
						equalWidthSegments
						onChange={this.toggleInverted}
						options={INVERTED_OPTIONS}
						value={filter.inverted}
					/>
				</FormField>
				<FormField>
					<FormInput
						autoFocus
						name="street"
						onChange={this.updateValue}
						placeholder="Address"
						ref="focusTarget"
						value={filter.street}
					/>
				</FormField>
				<Grid.Row gutter={10}>
					<Grid.Col xsmall="two-thirds">
						<FormInput
							name="city"
							onChange={this.updateValue}
							placeholder="City"
							style={{ marginBottom: '1em' }}
							value={filter.city}
						/>
					</Grid.Col>
					<Grid.Col xsmall="one-third">
						<FormInput
							name="state"
							onChange={this.updateValue}
							placeholder="State"
							style={{ marginBottom: '1em' }}
							value={filter.state}
						/>
					</Grid.Col>
					<Grid.Col xsmall="one-third" style={{ marginBottom: 0 }}>
						<FormInput
							name="code"
							onChange={this.updateValue}
							placeholder="Postcode"
							value={filter.code}
						/>
					</Grid.Col>
					<Grid.Col xsmall="two-thirds" style={{ marginBottom: 0 }}>
						<FormInput
							name="country"
							onChange={this.updateValue}
							placeholder="Country"
							value={filter.country}
						/>
					</Grid.Col>
				</Grid.Row>
			</div>
		);
	}
}

export default TextFilter;
