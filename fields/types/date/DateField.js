import DateInput from '../../components/DateInput';
import Field from '../Field';
import moment from 'moment';

/**
 * @fileoverview
 * This file defines the `DateField` component, which is used to render a date
 * field in the KeystoneJS Admin UI.
 *
 * It provides a date picker and a "Today" button to make it easy to select a
 * date.
 */
import PropTypes from 'prop-types';

import React from 'react';
import {
	Button,
	FormInput,
	InlineGroup as Group,
	InlineGroupSection as Section,
} from '../../../admin/client/App/elemental';

/*
TODO: Implement yearRange Prop, or deprecate for max / min values (better)
*/

const DEFAULT_INPUT_FORMAT = 'YYYY-MM-DD';
const DEFAULT_FORMAT_STRING = 'Do MMM YYYY';

/**
 * The `DateField` component.
 * @extends Field
 */
export default Field.create({
	displayName: 'DateField',
	statics: {
		type: 'Date',
	},
	propTypes: {
		formatString: PropTypes.string,
		inputFormat: PropTypes.string,
		label: PropTypes.string,
		note: PropTypes.string,
		onChange: PropTypes.func,
		path: PropTypes.string,
		todayButton: PropTypes.bool,
		value: PropTypes.string,
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
	 * Handles a change in the value of the field.
	 * @param {Object} event The event object.
	 */
	valueChanged ({ value }) {
		this.props.onChange({
			path: this.props.path,
			value: value,
		});
	},
	/**
	 * Converts a value to a moment object.
	 * @param {*} value The value to convert.
	 * @returns {moment} The moment object.
	 */
	toMoment (value) {
		if (this.props.isUTC) {
			return moment.utc(value);
		} else {
			return moment(value);
		}
	},
	/**
	 * Checks whether a value is valid.
	 * @param {*} value The value to check.
	 * @returns {boolean} Whether the value is valid.
	 */
	isValid (value) {
		return this.toMoment(value, this.inputFormat).isValid();
	},
	/**
	 * Formats a value.
	 * @param {*} value The value to format.
	 * @returns {string} The formatted value.
	 */
	format (value) {
		return value ? this.toMoment(value).format(this.props.formatString) : '';
	},
	/**
	 * Sets the value of the field to today's date.
	 */
	setToday () {
		this.valueChanged({
			value: this.toMoment(new Date()).format(this.props.inputFormat),
		});
	},
	/**
	 * Renders the value of the field.
	 * @returns {React.Element} The rendered value.
	 */
	renderValue () {
		return (
			<FormInput noedit>
				{this.format(this.props.value)}
			</FormInput>
		);
	},
	/**
	 * Renders the field.
	 * @returns {React.Element} The rendered field.
	 */
	renderField () {
		var dateAsMoment = this.toMoment(this.props.value);
		var value = this.props.value && dateAsMoment.isValid()
			? dateAsMoment.format(this.props.inputFormat)
			: this.props.value;

		return (
			<Group>
				<Section grow>
					<DateInput
						format={this.props.inputFormat}
						name={this.getInputName(this.props.path)}
						onChange={this.valueChanged}
						ref="dateInput"
						value={value}
					/>
				</Section>
				{
					this.props.todayButton
					&& <Section>
						<Button onClick={this.setToday}>Today</Button>
					</Section>
				}
			</Group>
		);
	},

});
