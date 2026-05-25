/**
 * @file
 * This file defines the `DatetimeField` component, which is used to render a
 * datetime field in the KeystoneJS Admin UI.
 *
 * It provides a date picker and a time input to make it easy to select a
 * date and time.
 */
import DateInput from '../../components/DateInput.mjs';
import Field from '../Field.mjs';
import React from 'react';
import Button from '../../../admin/client-legacy/compat/elemental/Button.mjs';
import FormField from '../../../admin/client-legacy/compat/elemental/FormField.mjs';
import FormInput from '../../../admin/client-legacy/compat/elemental/FormInput.mjs';
import FormNote from '../../../admin/client-legacy/compat/elemental/FormNote.mjs';
import Group from '../../../admin/client-legacy/compat/elemental/InlineGroup.mjs';
import Section from '../../../admin/client-legacy/compat/elemental/InlineGroupSection.mjs';
import { formatDateByFormat, parseDatetimeInput, timezoneOffsetForDate, toValidDate } from '../../utils/date.mjs';

/**
 * The `DatetimeField` component.
 * @augments Field
 */
export default Field.create({

	displayName: 'DatetimeField',
	statics: {
		type: 'Datetime',
	},

	focusTargetRef: 'dateInput',

	// default input formats
	dateInputFormat: 'YYYY-MM-DD',
	timeInputFormat: 'h:mm:ss a',
	tzOffsetInputFormat: 'Z',

	// parse formats (duplicated from lib/fieldTypes/datetime.js)
	parseFormats: ['YYYY-MM-DD', 'YYYY-MM-DD h:m:s a', 'YYYY-MM-DD h:m a', 'YYYY-MM-DD H:m:s', 'YYYY-MM-DD H:m'],

	/**
	 * Gets the initial state of the component.
	 * @returns {object} The initial state.
	 */
	getInitialState () {
		return {
			dateValue: this.props.value && this.format(this.props.value, this.dateInputFormat),
			timeValue: this.props.value && this.format(this.props.value, this.timeInputFormat),
			tzOffsetValue: this.props.value ? this.format(this.props.value, this.tzOffsetInputFormat) : this.format(new Date(), this.tzOffsetInputFormat),
		};
	},

	/**
	 * Gets the default props for the component.
	 * @returns {object} The default props.
	 */
	getDefaultProps () {
		return {
			formatString: 'Do MMM YYYY, h:mm:ss a',
		};
	},

	/**
	 * Checks whether a value is a valid date and time.
	 * @param {string|Date|number|null} value The value to check.
	 * @returns {boolean} Whether the value is valid.
	 */
	// TODO: Move isValid() so we can share with server-side code
	isValid (value) {
		return Boolean(toValidDate(value));
	},

	/**
	 * Formats a value.
	 * @param {string|Date|number|null} value The value to format.
	 * @param {string} format The format string to use.
	 * @returns {string} The formatted value.
	 */
	// TODO: Move format() so we can share with server-side code
	format (value, format) {
		format = format || this.dateInputFormat + ' ' + this.timeInputFormat;
		return value ? formatDateByFormat(value, format, { utc: this.props.isUTC }) : '';
	},

	/**
	 * Handles a change in the value of the field.
	 * @param {string} dateValue The new date value.
	 * @param {string} timeValue The new time value.
	 * @param {string} tzOffsetValue The new timezone offset value.
	 */
	handleChange (dateValue, timeValue, tzOffsetValue) {
		let nextOffset = tzOffsetValue;

		// if the change included a timezone offset, include that in the calculation (so NOW works correctly during DST changes)
		if (typeof nextOffset === 'undefined') {
			const parsedLocal = parseDatetimeInput(dateValue, timeValue, undefined, { utc: this.props.isUTC });
			nextOffset = this.props.isUTC ? '+00:00' : timezoneOffsetForDate(parsedLocal || new Date());
			this.setState({ tzOffsetValue: nextOffset });
		}
		const parsed = parseDatetimeInput(dateValue, timeValue, nextOffset, { utc: this.props.isUTC });

		this.props.onChange({
			path: this.props.path,
			value: parsed ? parsed.toISOString() : null,
		});
	},

	/**
	 * Handles a change in the date value.
	 * @param {object} event The event object.
	 * @param {string} event.value The new date string.
	 */
	dateChanged ({ value }) {
		this.setState({ dateValue: value });
		this.handleChange(value, this.state.timeValue);
	},

	/**
	 * Handles a change in the time value.
	 * @param {object} evt The event object.
	 */
	timeChanged (evt) {
		this.setState({ timeValue: evt.target.value });
		this.handleChange(this.state.dateValue, evt.target.value);
	},

	/**
	 * Sets the value of the field to the current date and time.
	 */
	setNow () {
		const now = new Date();
		const dateValue = this.format(now, this.dateInputFormat);
		const timeValue = this.format(now, this.timeInputFormat);
		const tzOffsetValue = this.format(now, this.tzOffsetInputFormat);
		this.setState({
			dateValue: dateValue,
			timeValue: timeValue,
			tzOffsetValue: tzOffsetValue,
		});
		this.handleChange(dateValue, timeValue, tzOffsetValue);
	},

	/**
	 * Renders the note.
	 * @returns {React.Element} The rendered note.
	 */
	renderNote () {
		if (!this.props.note) return null;
		return React.createElement(FormNote, { note: this.props.note });
	},

	/**
	 * Renders the UI for the field.
	 * @returns {React.Element} The rendered UI.
	 */
	renderUI () {
		let input;
		if (this.shouldRenderField()) {
			input = React.createElement(
				'div',
				null,
				React.createElement(
					Group,
					null,
					React.createElement(
						Section,
						{ grow: true },
						React.createElement(DateInput, {
							format: this.dateInputFormat,
							name: this.getInputName(this.props.paths.date),
							onChange: this.dateChanged,
							ref: this.getFocusTargetRef('dateInput'),
							value: this.state.dateValue,
						})
					),
					React.createElement(
						Section,
						{ grow: true },
						React.createElement(FormInput, {
							autoComplete: 'off',
							name: this.getInputName(this.props.paths.time),
							onChange: this.timeChanged,
							placeholder: 'HH:MM:SS am/pm',
							value: this.state.timeValue,
						})
					),
					React.createElement(
						Section,
						null,
						React.createElement(Button, { onClick: this.setNow }, 'Now')
					)
				),
				React.createElement('input', {
					name: this.getInputName(this.props.paths.tzOffset),
					type: 'hidden',
					value: this.state.tzOffsetValue,
				})
			);
		} else {
			input = React.createElement(
				FormInput,
				{ noedit: true },
				this.format(this.props.value, this.props.formatString)
			);
		}
		return React.createElement(
			FormField,
			{
				label: this.props.label,
				className: 'field-type-datetime',
				htmlFor: this.getInputName(this.props.path),
			},
			input,
			this.renderNote()
		);
	},
});
