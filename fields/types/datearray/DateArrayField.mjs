/**
 * @file
 * This file defines the `DateArrayField` component, which is used to render a
 * date array field in the KeystoneJS Admin UI.
 *
 * It uses the `ArrayFieldMixin` to provide the core functionality for an
 * array field, and it provides a `DateInput` component to edit the dates.
 */
import ArrayFieldMixin from '../../mixins/ArrayField.mjs';
import DateInput from '../../components/DateInput.mjs';
import Field from '../Field.mjs';
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const DEFAULT_INPUT_FORMAT = 'YYYY-MM-DD';
const DEFAULT_FORMAT_STRING = 'Do MMM YYYY';

/**
 * The `DateArrayField` component.
 * @augments Field
 */
export default Field.create({

	displayName: 'DateArrayField',
	statics: {
		type: 'DateArray',
	},
	mixins: [ArrayFieldMixin],

	propTypes: {
		formatString: PropTypes.string,
		inputFormat: PropTypes.string,
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
	 * Processes a new value into the field's input format string.
	 * Returns `undefined` for falsy input and the original value if it cannot
	 * be parsed as a valid date.
	 * @param {string|number|Date} value The raw input value to process.
	 * @returns {string|undefined} The formatted date string, or `undefined` if
	 *   the input is falsy.
	 */
	processInputValue (value) {
		if (!value) return;
		const m = moment(value);
		return m.isValid() ? m.format(this.props.inputFormat) : value;
	},

	/**
	 * Formats a value using the component's `formatString` prop.
	 * @param {string|number|Date} value The date value to format.
	 * @returns {string} The formatted date string, or an empty string for a
	 *   falsy value.
	 */
	formatValue (value) {
		return value ? moment(value).format(this.props.formatString) : '';
	},

	/**
	 * Returns the input component.
	 * @returns {React.Component} The input component.
	 */
	getInputComponent () {
		return DateInput;
	},

});
