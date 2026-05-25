/**
 * @file
 * This file defines the `TextArrayFilter` component, which is used to filter
 * `TextArray` fields in the KeystoneJS Admin UI.
 *
 * It provides a set of options for filtering by text, and it supports
 * inverting the filter.
 */
import React from 'react';

import FormField from '../../../admin/client-legacy/App/elemental/FormField/index.mjs';
import FormInput from '../../../admin/client-legacy/App/elemental/FormInput/index.mjs';
import FormSelect from '../../../admin/client-legacy/App/elemental/FormSelect/index.mjs';

const MODE_OPTIONS = [
	{ label: 'Contains', value: 'contains' },
	{ label: 'Exactly', value: 'exactly' },
	{ label: 'Begins with', value: 'beginsWith' },
	{ label: 'Ends with', value: 'endsWith' },
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
 * The `TextArrayFilter` component.
 * @augments React.Component
 */
class TextArrayFilter extends React.Component {

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
	 * Selects a new presence for the filter.
	 * @param {object} e The event object.
	 */
	selectPresence = (e) => {
		const presence = e.target.value;
		this.updateFilter({ presence });
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
		const { filter } = this.props;
		const mode = MODE_OPTIONS.filter(i => i.value === filter.mode)[0];
		const presence = PRESENCE_OPTIONS.filter(i => i.value === filter.presence)[0];
		const beingVerb = mode.value === 'exactly' ? ' is ' : ' ';
		const placeholder = presence.label + beingVerb + mode.label.toLowerCase() + '...';

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
			React.createElement(FormInput, {
				autoFocus: true,
				onChange: this.updateValue,
				placeholder,
				ref: (input) => { this.focusTargetRef = input; },
				value: this.props.filter.value,
			})
		);
	}
}

export default TextArrayFilter;
