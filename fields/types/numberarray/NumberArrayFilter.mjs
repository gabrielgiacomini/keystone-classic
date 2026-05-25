/**
 * @file
 * This file defines the `NumberArrayFilter` component, which is used to filter
 * `NumberArray` fields in the KeystoneJS Admin UI.
 *
 * It provides a set of options for filtering by number, and it supports
 * inverting the filter.
 */
import React from 'react';

import FormField from '../../../admin/client-legacy/App/elemental/FormField/index.mjs';
import FormInput from '../../../admin/client-legacy/App/elemental/FormInput/index.mjs';
import FormSelect from '../../../admin/client-legacy/App/elemental/FormSelect/index.mjs';
import Grid from '../../../admin/client-legacy/App/elemental/Grid/index.mjs';

const MODE_OPTIONS = [
	{ label: 'Exactly', value: 'equals' },
	{ label: 'Greater Than', value: 'gt' },
	{ label: 'Less Than', value: 'lt' },
	{ label: 'Between', value: 'between' },
];

const PRESENCE_OPTIONS = [
	{ label: 'At least one element', value: 'some' },
	{ label: 'No element', value: 'none' },
];

/**
 * Returns the default value for the filter.
 * @returns {object} The default value.
 */
function getDefaultValue () {
	return {
		mode: MODE_OPTIONS[0].value,
		presence: PRESENCE_OPTIONS[0].value,
		value: '',
	};
}

/**
 * The `NumberArrayFilter` component.
 * @augments React.Component
 */
class NumberArrayFilter extends React.Component {

	static defaultProps = {
		filter: getDefaultValue(),
	};

	static getDefaultValue = getDefaultValue;

	focusTarget = () => {
		if (this.focusTargetRef) this.focusTargetRef.focus();
	};

	/**
	 * Returns a function that handles a specific type of onChange events for
	 * either 'minValue', 'maxValue' or simply 'value'
	 * @param {string} type The type of the value to handle.
	 * @returns {(e: object) => void} The change handler.
	 */
	handleValueChangeBuilder = (type) => {
		return (e) => {
			switch (type) {
				case 'minValue':
					this.updateFilter({
						value: {
							min: e.target.value,
							max: this.props.filter.value.max,
						},
					});
					break;
				case 'maxValue':
					this.updateFilter({
						value: {
							min: this.props.filter.value.min,
							max: e.target.value,
						},
					});
					break;
				case 'value':
					this.updateFilter({
						value: e.target.value,
					});
					break;
			}
		};
	};

	/**
	 * Updates the filter with a new value.
	 * @param {object} changedProp The changed property.
	 */
	updateFilter = (changedProp) => {
		this.props.onChange({ ...this.props.filter, ...changedProp });
	};

	/**
	 * Selects a new mode for the filter.
	 * @param {object} e The event object.
	 */
	selectMode = (e) => {
		const mode = e.target.value;
		this.updateFilter({ mode });
		this.focusTarget();
	};

	/**
	 * Selects a new presence for the filter.
	 * @param {object} e The event object.
	 */
	selectPresence = (e) => {
		const presence = e.target.value;
		this.updateFilter({ presence });
		this.focusTarget();
	};

	/**
	 * Renders the controls for the filter.
	 * @param {object} presence The presence object.
	 * @param {object} mode The mode object.
	 * @returns {React.Element} The rendered controls.
	 */
	renderControls(presence, mode) {
		let controls;
		const placeholder = presence.label + ' is ' + mode.label.toLowerCase() + '...';

		if (mode.value === 'between') {
			// Render "min" and "max" input
			controls = React.createElement(
				Grid.Row,
				{ xsmall: 'one-half', gutter: 10 },
				React.createElement(
					Grid.Col,
					null,
					React.createElement(FormInput, {
						onChange: this.handleValueChangeBuilder('minValue'),
						placeholder: 'Min.',
						ref: (input) => { this.focusTargetRef = input; },
						type: 'number',
						value: this.props.filter.value.min,
					})
				),
				React.createElement(
					Grid.Col,
					null,
					React.createElement(FormInput, {
						onChange: this.handleValueChangeBuilder('maxValue'),
						placeholder: 'Max.',
						type: 'number',
						value: this.props.filter.value.max,
					})
				)
			);
		} else {
			// Render one number input
			controls = React.createElement(FormInput, {
				onChange: this.handleValueChangeBuilder('value'),
				placeholder,
				ref: (input) => { this.focusTargetRef = input; },
				type: 'number',
				value: this.props.filter.value,
			});
		}

		return controls;
	}

	/**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */
	render() {
		const { filter } = this.props;
		// Get mode and presence based on their values with .filter
		const mode = MODE_OPTIONS.filter(i => i.value === filter.mode)[0];
		const presence = PRESENCE_OPTIONS.filter(i => i.value === filter.presence)[0];

		return React.createElement(
			'div',
			null,
			React.createElement(
				FormField,
				null,
				React.createElement(FormSelect, {
					onChange: this.selectPresence,
					options: PRESENCE_OPTIONS,
					value: presence.value,
				})
			),
			React.createElement(
				FormField,
				null,
				React.createElement(FormSelect, {
					onChange: this.selectMode,
					options: MODE_OPTIONS,
					value: mode.value,
				})
			),
			this.renderControls(presence, mode)
		);
	}
}

export default NumberArrayFilter;
