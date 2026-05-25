/**
 * @file
 * This file defines the `TextFilter` component, which is used to filter `Text`
 * fields in the KeystoneJS Admin UI.
 *
 * It provides a set of options for filtering by text, and it supports
 * inverting the filter.
 */
import React from 'react';

import FormField from '../../../admin/client-legacy/compat/elemental/FormField.mjs';
import FormInput from '../../../admin/client-legacy/compat/elemental/FormInput.mjs';
import FormSelect from '../../../admin/client-legacy/compat/elemental/FormSelect.mjs';
import SegmentedControl from '../../../admin/client-legacy/compat/elemental/SegmentedControl.mjs';

const INVERTED_OPTIONS = [
	{ label: 'Matches', value: false },
	{ label: 'Does NOT Match', value: true },
];

const MODE_OPTIONS = [
	{ label: 'Contains', value: 'contains' },
	{ label: 'Exactly', value: 'exactly' },
	{ label: 'Begins with', value: 'beginsWith' },
	{ label: 'Ends with', value: 'endsWith' },
];

/**
 * Returns the default value for the filter.
 * @returns {object} The default value.
 */
function getDefaultValue () {
	return {
		mode: MODE_OPTIONS[0].value,
		inverted: INVERTED_OPTIONS[0].value,
		value: '',
	};
}

/**
 * The `TextFilter` component.
 * @augments React.Component
 */
class TextFilter extends React.Component {

	static defaultProps = {
		filter: getDefaultValue(),
	};

	static getDefaultValue = getDefaultValue;

	focusTarget = () => {
		if (this.focusTargetRef) this.focusTargetRef.focus();
	};

	/**
	 * Updates the filter with a new value.
	 * @param {object} value The new value.
	 */
	updateFilter = (value) => {
		this.props.onChange({ ...this.props.filter, ...value });
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
	 * Toggles the inverted state of the filter.
	 * @param {boolean} inverted The new inverted state.
	 */
	toggleInverted = (inverted) => {
		this.updateFilter({ inverted });
		this.focusTarget();
	};

	/**
	 * Handles a change in the value of the filter.
	 * @param {object} e The event object.
	 */
	updateValue = (e) => {
		this.updateFilter({ value: e.target.value });
	};

	/**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */
	render() {
		const { field, filter } = this.props;
		const mode = MODE_OPTIONS.filter(i => i.value === filter.mode)[0];
		const placeholder = field.label + ' ' + mode.label.toLowerCase() + '...';

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
					'data-list-filter-text-inverted': true,
				})
			),
			React.createElement(
				FormField,
				null,
				React.createElement(FormSelect, {
					onChange: this.selectMode,
					options: MODE_OPTIONS,
					value: mode.value,
					'data-list-filter-text-mode': true,
				})
			),
			React.createElement(FormInput, {
				autoFocus: true,
				onChange: this.updateValue,
				placeholder,
				ref: (input) => { this.focusTargetRef = input; },
				value: this.props.filter.value,
				'data-list-filter-text-value': true,
			})
		);
	}
}

export default TextFilter;
