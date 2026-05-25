/**
 * @file
 * This file defines the `LocationFilter` component, which is used to filter
 * `Location` fields in the KeystoneJS Admin UI.
 *
 * It provides a set of inputs for the different parts of a location, and it
 * supports inverting the filter.
 */
import React from 'react';

import FormField from '../../../admin/client-legacy/App/elemental/FormField/index.mjs';
import FormInput from '../../../admin/client-legacy/App/elemental/FormInput/index.mjs';
import Grid from '../../../admin/client-legacy/App/elemental/Grid/index.mjs';
import SegmentedControl from '../../../admin/client-legacy/App/elemental/SegmentedControl/index.mjs';

const INVERTED_OPTIONS = [
	{ label: 'Matches', value: false },
	{ label: 'Does NOT Match', value: true },
];

/**
 * Returns the default value for the filter.
 * @returns {object} The default value.
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
 * @augments React.Component
 */
class LocationFilter extends React.Component {

	static defaultProps = {
		filter: getDefaultValue(),
	};

	static getDefaultValue = getDefaultValue;

	focusTarget = () => {
		if (this.focusTargetRef) this.focusTargetRef.focus();
	};

	/**
	 * Updates the filter with a new value.
	 * @param {string} key The key of the value to update.
	 * @param {string|boolean} val The new value.
	 */
	updateFilter = (key, val) => {
		this.props.onChange({ ...this.props.filter, [key]: val });
	};

	/**
	 * Toggles the inverted state of the filter.
	 * @param {boolean} value The new inverted state.
	 */
	toggleInverted = (value) => {
		this.updateFilter('inverted', value);
		this.focusTarget();
	};

	/**
	 * Handles a change in the value of one of the filter fields.
	 * @param {object} e The event object.
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

		return React.createElement(
			'div',
			null,
			React.createElement(
				FormField,
				null,
				React.createElement(SegmentedControl, {
					equalWidthSegments: true,
					onChange: this.toggleInverted,
					options: INVERTED_OPTIONS,
					value: filter.inverted,
					'data-list-filter-location-mode': true,
				})
			),
			React.createElement(
				FormField,
				null,
				React.createElement(FormInput, {
					autoFocus: true,
					name: 'street',
					onChange: this.updateValue,
					placeholder: 'Address',
					ref: (input) => { this.focusTargetRef = input; },
					value: filter.street,
					'data-list-filter-location-street': true,
				})
			),
			React.createElement(
				Grid.Row,
				{ gutter: 10 },
				React.createElement(
					Grid.Col,
					{ xsmall: 'two-thirds' },
					React.createElement(FormInput, {
						name: 'city',
						onChange: this.updateValue,
						placeholder: 'City',
						style: { marginBottom: '1em' },
						value: filter.city,
						'data-list-filter-location-city': true,
					})
				),
				React.createElement(
					Grid.Col,
					{ xsmall: 'one-third' },
					React.createElement(FormInput, {
						name: 'state',
						onChange: this.updateValue,
						placeholder: 'State',
						style: { marginBottom: '1em' },
						value: filter.state,
						'data-list-filter-location-state': true,
					})
				),
				React.createElement(
					Grid.Col,
					{ xsmall: 'one-third', style: { marginBottom: 0 } },
					React.createElement(FormInput, {
						name: 'code',
						onChange: this.updateValue,
						placeholder: 'Postcode',
						value: filter.code,
						'data-list-filter-location-code': true,
					})
				),
				React.createElement(
					Grid.Col,
					{ xsmall: 'two-thirds', style: { marginBottom: 0 } },
					React.createElement(FormInput, {
						name: 'country',
						onChange: this.updateValue,
						placeholder: 'Country',
						value: filter.country,
						'data-list-filter-location-country': true,
					})
				)
			)
		);
	}
}

export default LocationFilter;
