/**
 * @fileoverview
 * This file defines the `TextFilter` component, which is used to filter `Text`
 * fields in the KeystoneJS Admin UI.
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
	SegmentedControl,
} from '../../../admin/client/App/elemental';

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
 * @returns {Object} The default value.
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
 * @extends React.Component
 */
var TextFilter = React.createClass({
	propTypes: {
		filter: React.PropTypes.shape({
			mode: React.PropTypes.oneOf(MODE_OPTIONS.map(i => i.value)),
			inverted: React.PropTypes.boolean,
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
	 * @param {Object} value The new value.
	 */
	updateFilter (value) {
		this.props.onChange({ ...this.props.filter, ...value });
	},
	/**
	 * Selects a new mode for the filter.
	 * @param {Object} e The event object.
	 */
	selectMode (e) {
		const mode = e.target.value;
		this.updateFilter({ mode });
		findDOMNode(this.refs.focusTarget).focus();
	},
	/**
	 * Toggles the inverted state of the filter.
	 * @param {boolean} inverted The new inverted state.
	 */
	toggleInverted (inverted) {
		this.updateFilter({ inverted });
		findDOMNode(this.refs.focusTarget).focus();
	},
	/**
	 * Handles a change in the value of the filter.
	 * @param {Object} e The event object.
	 */
	updateValue (e) {
		this.updateFilter({ value: e.target.value });
	},
	/**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */
	render () {
		const { field, filter } = this.props;
		const mode = MODE_OPTIONS.filter(i => i.value === filter.mode)[0];
		const placeholder = field.label + ' ' + mode.label.toLowerCase() + '...';

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

module.exports = TextFilter;
