/**
 * @file
 * This file defines the `TextArrayFilter` component, which is used to filter
 * `TextArray` fields in the KeystoneJS Admin UI.
 *
 * It provides a set of options for filtering by text, and it supports
 * inverting the filter.
 */
import React from 'react';
import { findDOMNode } from 'react-dom';

import {
	FormField,
	FormInput,
	FormSelect,
} from '../../../admin/client-legacy/App/elemental';

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
const TextArrayFilter = React.createClass({
	propTypes: {
		filter: React.PropTypes.shape({
			mode: React.PropTypes.oneOf(MODE_OPTIONS.map(i => i.value)),
			presence: React.PropTypes.oneOf(PRESENCE_OPTIONS.map(i => i.value)),
			value: React.PropTypes.string,
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
	 * Updates the filter with a new value.
	 * @param {object} value The new value.
	 */
	updateFilter (value) {
		this.props.onChange({ ...this.props.filter, ...value });
	},
	/**
	 * Selects a new mode for the filter.
	 * @param {object} e The event object.
	 */
	selectMode (e) {
		const mode = e.target.value;
		this.updateFilter({ mode });
		findDOMNode(this.refs.focusTarget).focus();
	},
	/**
	 * Selects a new presence for the filter.
	 * @param {object} e The event object.
	 */
	selectPresence (e) {
		const presence = e.target.value;
		this.updateFilter({ presence });
		findDOMNode(this.refs.focusTarget).focus();
	},
	/**
	 * Handles a change in the value of the filter.
	 * @param {object} e The event object.
	 */
	updateValue (e) {
		this.updateFilter({ value: e.target.value });
	},
	/**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */
	render () {
		const { filter } = this.props;
		const mode = MODE_OPTIONS.filter(i => i.value === filter.mode)[0];
		const presence = PRESENCE_OPTIONS.filter(i => i.value === filter.presence)[0];
		const beingVerb = mode.value === 'exactly' ? ' is ' : ' ';
		const placeholder = presence.label + beingVerb + mode.label.toLowerCase() + '...';

		return (
			<div>
				<FormField>
					<FormSelect
						onChange={this.selectPresence}
						options={PRESENCE_OPTIONS}
						value={presence.value}
					/>
				</FormField>
				<FormField>
					<FormSelect
						onChange={this.selectMode}
						options={MODE_OPTIONS}
						value={mode.value}
					/>
				</FormField>
				<FormInput
					autoFocus
					onChange={this.updateValue}
					placeholder={placeholder}
					ref="focusTarget"
					value={this.props.filter.value}
				/>
			</div>
		);
	},
});

export default TextArrayFilter;
