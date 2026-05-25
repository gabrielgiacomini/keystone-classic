/**
 * @file
 * This file defines the `NumberFilter` component, which is used to filter
 * `Number` fields in the KeystoneJS Admin UI.
 *
 * It provides a set of options for filtering by number, and it supports
 * inverting the filter.
 */
import React from 'react';
import Form from '../../../admin/client-legacy/compat/elemental/Form.mjs';
import FormField from '../../../admin/client-legacy/compat/elemental/FormField.mjs';
import FormInput from '../../../admin/client-legacy/compat/elemental/FormInput.mjs';
import FormSelect from '../../../admin/client-legacy/compat/elemental/FormSelect.mjs';
import Grid from '../../../admin/client-legacy/compat/elemental/Grid.mjs';

const MODE_OPTIONS = [
	{ label: 'Exactly', value: 'equals' },
	{ label: 'Greater Than', value: 'gt' },
	{ label: 'Less Than', value: 'lt' },
	{ label: 'Between', value: 'between' },
];

/**
 * Returns the default value for the filter.
 * @returns {object} The default value.
 */
function getDefaultValue () {
	return {
		mode: MODE_OPTIONS[0].value,
		value: '',
	};
}

/**
 * The `NumberFilter` component.
 * @augments React.Component
 */
class NumberFilter extends React.Component {
	static defaultProps = {
		filter: getDefaultValue(),
	};

	static getDefaultValue = getDefaultValue;

	componentDidMount() {
		// focus the text input
		this.focusTarget();
	}

	focusTarget = () => {
		if (this.focusTargetRef) this.focusTargetRef.focus();
	};

	/**
	 * Returns a function that handles a change in the value of the filter.
	 * @param {string} type The type of the value to handle.
	 * @returns {(e: Event) => void} The change handler.
	 */
	handleChangeBuilder = (type) => {
		return (e) => {
			const { filter, onChange } = this.props;

			switch (type) {
				case 'minValue':
					onChange({
						mode: filter.mode,
						value: {
							min: e.target.value,
							max: filter.value.max,
						},
					});
					break;
				case 'maxValue':
					onChange({
						mode: filter.mode,
						value: {
							min: filter.value.min,
							max: e.target.value,
						},
					});
					break;
				case 'value':
					onChange({
						mode: filter.mode,
						value: e.target.value,
					});
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
		this.updateFilter({ mode: e.target.value });

		// focus on next tick
		setTimeout(this.focusTarget, 0);
	};

	/**
	 * Renders the controls for the filter.
	 * @param {object} mode The current mode of the filter.
	 * @returns {React.Element} The rendered controls.
	 */
	renderControls(mode) {
		let controls;
		const { field } = this.props;
		const placeholder = field.label + ' is ' + mode.label.toLowerCase() + '...';

		if (mode.value === 'between') {
			controls = React.createElement(
				Grid.Row,
				{ xsmall: 'one-half', gutter: 10 },
				React.createElement(
					Grid.Col,
					null,
					React.createElement(FormInput, {
						onChange: this.handleChangeBuilder('minValue'),
						placeholder: 'Min.',
						ref: (input) => { this.focusTargetRef = input; },
						type: 'number',
						'data-list-filter-number-min': true,
					})
				),
				React.createElement(
					Grid.Col,
					null,
					React.createElement(FormInput, {
						onChange: this.handleChangeBuilder('maxValue'),
						placeholder: 'Max.',
						type: 'number',
						'data-list-filter-number-max': true,
					})
				)
			);
		} else {
			controls = React.createElement(FormInput, {
				onChange: this.handleChangeBuilder('value'),
				placeholder,
				ref: (input) => { this.focusTargetRef = input; },
				type: 'number',
				'data-list-filter-number-value': true,
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
		const mode = MODE_OPTIONS.filter(i => i.value === filter.mode)[0];

		return React.createElement(
			Form,
			{ component: 'div' },
			React.createElement(
				FormField,
				null,
				React.createElement(FormSelect, {
					onChange: this.selectMode,
					options: MODE_OPTIONS,
					value: mode.value,
					'data-list-filter-number-mode': true,
				})
			),
			this.renderControls(mode)
		);
	}
}

export default NumberFilter;
