/**
 * @file
 * This file defines the `DateField` component, which is used to render a date
 * field in the KeystoneJS Admin UI.
 *
 * It provides a date picker and a "Today" button to make it easy to select a
 * date.
 */
import DateInput from '../../components/DateInput.mjs';
import Field from '../Field.mjs';
import React from 'react';
import Button from '../../../admin/client-legacy/compat/elemental/Button.mjs';
import FormInput from '../../../admin/client-legacy/compat/elemental/FormInput.mjs';
import Group from '../../../admin/client-legacy/compat/elemental/InlineGroup.mjs';
import Section from '../../../admin/client-legacy/compat/elemental/InlineGroupSection.mjs';
import { formatDateByFormat, parseDateByFormat, toValidDate } from '../../utils/date.mjs';

/*
TODO: Implement yearRange Prop, or deprecate for max / min values (better)
*/

const DEFAULT_INPUT_FORMAT = 'YYYY-MM-DD';
const DEFAULT_FORMAT_STRING = 'Do MMM YYYY';

/**
 * The `DateField` component.
 * @augments Field
 */
export default Field.create({
	displayName: 'DateField',
	statics: {
		type: 'Date',
	},

	/**
	 * Gets the default props for the component.
	 * @returns {object} The default props.
	 */
	getDefaultProps () {
		return {
			formatString: DEFAULT_FORMAT_STRING,
			inputFormat: DEFAULT_INPUT_FORMAT,
		};
	},
	/**
	 * Handles a change in the value of the field.
	 * @param {object} event The event object.
	 * @param {string} event.value The new date value in the configured input format.
	 */
	valueChanged ({ value }) {
		this.props.onChange({
			path: this.props.path,
			value: value,
		});
	},
	/**
	 * Converts a value to a valid Date object.
	 * @param {string|Date|number} value The value to convert.
	 * @returns {Date|null} The date object.
	 */
	toDate (value) {
		return parseDateByFormat(value, this.props.inputFormat) || toValidDate(value);
	},
	/**
	 * Checks whether a value is valid.
	 * @param {string|Date|number} value The value to check.
	 * @returns {boolean} Whether the value is valid.
	 */
	isValid (value) {
		return Boolean(this.toDate(value));
	},
	/**
	 * Formats a value.
	 * @param {string|Date|number} value The value to format.
	 * @returns {string} The formatted value.
	 */
	format (value) {
		return value ? formatDateByFormat(value, this.props.formatString, { utc: this.props.isUTC }) : '';
	},
	/**
	 * Sets the value of the field to today's date.
	 */
	setToday () {
		this.valueChanged({
			value: formatDateByFormat(new Date(), this.props.inputFormat, { utc: this.props.isUTC }),
		});
	},
	/**
	 * Renders the value of the field.
	 * @returns {React.Element} The rendered value.
	 */
	renderValue () {
		return React.createElement(FormInput, { noedit: true }, this.format(this.props.value));
	},
	/**
	 * Renders the field.
	 * @returns {React.Element} The rendered field.
	 */
	renderField () {
		const date = this.toDate(this.props.value);
		const value = this.props.value && date
			? formatDateByFormat(date, this.props.inputFormat, { utc: this.props.isUTC })
			: this.props.value;

		return React.createElement(
			Group,
			null,
			React.createElement(
				Section,
				{ grow: true },
				React.createElement(DateInput, {
					format: this.props.inputFormat,
					name: this.getInputName(this.props.path),
					onChange: this.valueChanged,
					ref: this.getFocusTargetRef(),
					value,
				})
			),
			this.props.todayButton && React.createElement(
				Section,
				null,
				React.createElement(Button, { onClick: this.setToday }, 'Today')
			)
		);
	},

});
