import ArrayFieldMixin from '../../mixins/ArrayField';
import DateInput from '../../components/DateInput';
import Field from '../Field';

/**
 * @fileoverview
 * This file defines the `DateArrayField` component, which is used to render a
 * date array field in the KeystoneJS Admin UI.
 *
 * It uses the `ArrayFieldMixin` to provide the core functionality for an
 * array field, and it provides a `DateInput` component to edit the dates.
 */
import PropTypes from 'prop-types';

import React from 'react';
import moment from 'moment';

const DEFAULT_INPUT_FORMAT = 'YYYY-MM-DD';
const DEFAULT_FORMAT_STRING = 'Do MMM YYYY';

/**
 * The `DateArrayField` component.
 * @extends Field
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
	 * @returns {Object} The default props.
	 */
	getDefaultProps () {
		return {
			formatString: DEFAULT_FORMAT_STRING,
			inputFormat: DEFAULT_INPUT_FORMAT,
		};
	},

	/**
	 * Processes a new value.
	 * @param {*} value The new value.
	 * @returns {string} The processed value.
	 */
	processInputValue (value) {
		if (!value) return;
		const m = moment(value);
		return m.isValid() ? m.format(this.props.inputFormat) : value;
	},

	/**
	 * Formats a value.
	 * @param {*} value The value to format.
	 * @returns {string} The formatted value.
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
