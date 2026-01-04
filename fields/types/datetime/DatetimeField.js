/**
 * @fileoverview
 * This file defines the `DatetimeField` component, which is used to render a
 * datetime field in the KeystoneJS Admin UI.
 *
 * It provides a date picker and a time input to make it easy to select a
 * date and time.
 */
import DateInput from '../../components/DateInput';
import Field from '../Field';
import moment from 'moment';
import React from 'react';
import {
	Button,
	FormField,
	FormInput,
	FormNote,
	InlineGroup as Group,
	InlineGroupSection as Section,
} from '../../../admin/client/App/elemental';

/**
 * The `DatetimeField` component.
 * @extends Field
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
	 * @returns {Object} The initial state.
	 */
	getInitialState () {
		return {
			dateValue: this.props.value && this.moment(this.props.value).format(this.dateInputFormat),
			timeValue: this.props.value && this.moment(this.props.value).format(this.timeInputFormat),
			tzOffsetValue: this.props.value ? this.moment(this.props.value).format(this.tzOffsetInputFormat) : this.moment().format(this.tzOffsetInputFormat),
		};
	},

	/**
	 * Gets the default props for the component.
	 * @returns {Object} The default props.
	 */
	getDefaultProps () {
		return {
			formatString: 'Do MMM YYYY, h:mm:ss a',
		};
	},

	/**
	 * Returns a moment object with the correct timezone.
	 * @returns {moment} The moment object.
	 */
	moment () {
		if (this.props.isUTC) return moment.utc.apply(moment, arguments);
		else return moment.apply(undefined, arguments);
	},

	/**
	 * Checks whether a value is a valid date and time.
	 * @param {*} value The value to check.
	 * @returns {boolean} Whether the value is valid.
	 */
	// TODO: Move isValid() so we can share with server-side code
	isValid (value) {
		return this.moment(value, this.parseFormats).isValid();
	},

	/**
	 * Formats a value.
	 * @param {*} value The value to format.
	 * @param {string} format The format string to use.
	 * @returns {string} The formatted value.
	 */
	// TODO: Move format() so we can share with server-side code
	format (value, format) {
		format = format || this.dateInputFormat + ' ' + this.timeInputFormat;
		return value ? this.moment(value).format(format) : '';
	},

	/**
	 * Handles a change in the value of the field.
	 * @param {string} dateValue The new date value.
	 * @param {string} timeValue The new time value.
	 * @param {string} tzOffsetValue The new timezone offset value.
	 */
	handleChange (dateValue, timeValue, tzOffsetValue) {
		var value = dateValue + ' ' + timeValue;
		var datetimeFormat = this.dateInputFormat + ' ' + this.timeInputFormat;

		// if the change included a timezone offset, include that in the calculation (so NOW works correctly during DST changes)
		if (typeof tzOffsetValue !== 'undefined') {
			value += ' ' + tzOffsetValue;
			datetimeFormat += ' ' + this.tzOffsetInputFormat;
		}
		// if not, calculate the timezone offset based on the date (respect different DST values)
		else {
			this.setState({ tzOffsetValue: this.moment(value, datetimeFormat).format(this.tzOffsetInputFormat) });
		}

		this.props.onChange({
			path: this.props.path,
			value: this.isValid(value) ? this.moment(value, datetimeFormat).toISOString() : null,
		});
	},

	/**
	 * Handles a change in the date value.
	 * @param {Object} event The event object.
	 */
	dateChanged ({ value }) {
		this.setState({ dateValue: value });
		this.handleChange(value, this.state.timeValue);
	},

	/**
	 * Handles a change in the time value.
	 * @param {Object} evt The event object.
	 */
	timeChanged (evt) {
		this.setState({ timeValue: evt.target.value });
		this.handleChange(this.state.dateValue, evt.target.value);
	},

	/**
	 * Sets the value of the field to the current date and time.
	 */
	setNow () {
		var dateValue = this.moment().format(this.dateInputFormat);
		var timeValue = this.moment().format(this.timeInputFormat);
		var tzOffsetValue = this.moment().format(this.tzOffsetInputFormat);
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
		return <FormNote note={this.props.note} />;
	},

	/**
	 * Renders the UI for the field.
	 * @returns {React.Element} The rendered UI.
	 */
	renderUI () {
		var input;
		if (this.shouldRenderField()) {
			input = (
				<div>
					<Group>
						<Section grow>
							<DateInput
								format={this.dateInputFormat}
								name={this.getInputName(this.props.paths.date)}
								onChange={this.dateChanged}
								ref="dateInput"
								value={this.state.dateValue}
							/>
						</Section>
						<Section grow>
							<FormInput
								autoComplete="off"
								name={this.getInputName(this.props.paths.time)}
								onChange={this.timeChanged}
								placeholder="HH:MM:SS am/pm"
								value={this.state.timeValue}
							/>
						</Section>
						<Section>
							<Button onClick={this.setNow}>Now</Button>
						</Section>
					</Group>
					<input
						name={this.getInputName(this.props.paths.tzOffset)}
						type="hidden"
						value={this.state.tzOffsetValue}
					/>
				</div>
			);
		} else {
			input = (
				<FormInput noedit>
					{this.format(this.props.value, this.props.formatString)}
				</FormInput>
			);
		}
		return (
			<FormField label={this.props.label} className="field-type-datetime" htmlFor={this.getInputName(this.props.path)}>
				{input}
				{this.renderNote()}
			</FormField>
		);
	},
});
