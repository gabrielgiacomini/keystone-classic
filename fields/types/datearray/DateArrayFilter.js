/**
 * @fileoverview
 * This file defines the `DateArrayFilter` component, which is used to filter
 * `DateArray` fields in the KeystoneJS Admin UI.
 *
 * It provides a date picker and a set of options for filtering by date.
 */
import React from 'react';
import { findDOMNode } from 'react-dom';
import moment from 'moment';
import DayPicker from 'react-day-picker';
import {
	FormInput,
	FormSelect,
	Grid,
} from '../../../admin/client/App/elemental';

const PRESENCE_OPTIONS = [
	{ label: 'At least one element', value: 'some' },
	{ label: 'No element', value: 'none' },
];

const MODE_OPTIONS = [
	{ label: 'On', value: 'on' },
	{ label: 'After', value: 'after' },
	{ label: 'Before', value: 'before' },
	{ label: 'Between', value: 'between' },
];

/**
 * A component that renders an indicator for the active input field in the
 * DayPicker.
 * @returns {React.Element} The rendered component.
 */
var DayPickerIndicator = React.createClass({
	render () {
		return (
			<span className="DayPicker-Indicator">
				<span className="DayPicker-Indicator__border" />
				<span className="DayPicker-Indicator__bg" />
			</span>
		);
	},
});

/**
 * Returns the default value for the filter.
 * @returns {Object} The default value.
 */
function getDefaultValue () {
	return {
		mode: MODE_OPTIONS[0].value,
		presence: PRESENCE_OPTIONS[0].value,
		value: moment(0, 'HH').format(),
		before: moment(0, 'HH').format(),
		after: moment(0, 'HH').format(),
	};
}

/**
 * The `DateFilter` component.
 * @extends React.Component
 */
var DateFilter = React.createClass({
	displayName: 'DateFilter',
	propTypes: {
		filter: React.PropTypes.shape({
			mode: React.PropTypes.oneOf(MODE_OPTIONS.map(i => i.value)),
			presence: React.PropTypes.string,
		}),
	},
	statics: {
		getDefaultValue: getDefaultValue,
	},
	getDefaultProps () {
		return {
			format: 'DD-MM-YYYY',
			filter: getDefaultValue(),
			value: moment().startOf('day').toDate(),
		};
	},
	/**
	 * Gets the initial state of the component.
	 * @returns {Object} The initial state.
	 */
	getInitialState () {
		return {
			activeInputField: 'after',
			month: new Date(), // The month to display in the calendar
		};
	},
	componentDidMount () {
		// focus the text input
		if (this.props.filter.mode === 'between') {
			findDOMNode(this.refs[this.state.activeInputField]).focus();
		} else {
			findDOMNode(this.refs.input).focus();
		}
	},
	/**
	 * Updates the filter with a new value.
	 * @param {Object} value The new value.
	 */
	updateFilter (value) {
		this.props.onChange({ ...this.props.filter, ...value });
	},
	/**
	 * Selects a new presence for the filter.
	 * @param {Object} e The event object.
	 */
	selectPresence (e) {
		const presence = e.target.value;
		this.updateFilter({ presence });
		findDOMNode(this.refs.input).focus();
	},
	/**
	 * Selects a new mode for the filter.
	 * @param {Object} e The event object.
	 */
	selectMode (e) {
		const mode = e.target.value;
		this.updateFilter({ mode });
		if (mode === 'between') {
			setTimeout(() => { findDOMNode(this.refs[this.state.activeInputField]).focus(); }, 200);
		} else {
			findDOMNode(this.refs.input).focus();
		}
	},
	/**
	 * Handles a change in the value of the input.
	 * @param {Object} e The event object.
	 */
	handleInputChange (e) {
		const { value } = e.target;
		let { month } = this.state;
		// Change the current month only if the value entered by the user is a valid
		// date, according to the `L` format
		if (moment(value, 'L', true).isValid()) {
			month = moment(value, 'L').toDate();
		}
		this.updateFilter({ value: value });
		this.setState({ month }, this.showCurrentDate);
	},
	/**
	 * Sets the active input field.
	 * @param {string} field The name of the field to set as active.
	 */
	setActiveField (field) {
		this.setState({
			activeInputField: field,
		});
	},
	/**
	 * Switches between the two input fields in "between" mode.
	 * @param {Object} e The event object.
	 * @param {Date} day The day that was clicked.
	 * @param {Object} modifiers The modifiers for the day.
	 */
	switchBetweenActiveInputFields (e, day, modifiers) {
		if (modifiers && modifiers.disabled) return;
		const { activeInputField } = this.state;
		const send = {};
		send[activeInputField] = day;
		this.updateFilter(send);
		const newActiveField = (activeInputField === 'before') ? 'after' : 'before';
		this.setState(
			{ activeInputField: newActiveField },
			() => {
				findDOMNode(this.refs[newActiveField]).focus();
			}
		);
	},
	/**
	 * Selects a day in the date picker.
	 * @param {Object} e The event object.
	 * @param {Date} day The day that was clicked.
	 * @param {Object} modifiers The modifiers for the day.
	 */
	selectDay (e, day, modifiers) {
		if (modifiers && modifiers.disabled) return;
		this.updateFilter({ value: day });
	},
	/**
	 * Shows the current date in the date picker.
	 */
	showCurrentDate () {
		this.refs.daypicker.showMonth(this.state.month);
	},
	/**
	 * Renders the controls for the filter.
	 * @returns {React.Element} The rendered controls.
	 */
	renderControls () {
		let controls;
		const { field, filter } = this.props;
		const mode = MODE_OPTIONS.filter(i => i.value === filter.mode)[0];
		const placeholder = field.label + ' is ' + mode.label.toLowerCase() + '...';

		// DayPicker stuff
		const modifiers = {
			selected: (day) => moment(filter.value).isSame(day),
		};

		if (mode.value === 'between') {
			controls = (
				<div>
					<div style={{ marginBottom: '1em' }}>
						<Grid.Row xsmall="one-half" gutter={10}>
							<Grid.Col>
								<FormInput ref="after" placeholder="From" onFocus={(e) => { this.setActiveField('after'); }} value={moment(filter.after).format(this.props.format)} />
							</Grid.Col>
							<Grid.Col>
								<FormInput ref="before" placeholder="To" onFocus={(e) => { this.setActiveField('before'); }} value={moment(filter.before).format(this.props.format)} />
							</Grid.Col>
						</Grid.Row>
					</div>
					<div style={{ position: 'relative' }}>
						<DayPicker
							className="DayPicker--chrome"
							modifiers={modifiers}
							onDayClick={this.switchBetweenActiveInputFields}
						/>
						<DayPickerIndicator />
					</div>
				</div>
			);
		} else {
			controls = (
				<div>
					<div style={{ marginBottom: '1em' }}>
						<FormInput
							onChange={this.handleInputChange}
							onFocus={this.showCurrentDate}
							placeholder={placeholder}
							ref="input"
							value={moment(filter.value).format(this.props.format)}
						/>
					</div>
					<div style={{ position: 'relative' }}>
						<DayPicker
							className="DayPicker--chrome"
							modifiers={modifiers}
							onDayClick={this.selectDay}
							ref="daypicker"
						/>
						<DayPickerIndicator />
					</div>
				</div>
			);
		}

		return controls;
	},
	/**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */
	render () {
		const { filter } = this.props;
		const mode = MODE_OPTIONS.filter(i => i.value === filter.mode)[0];
		const presence = PRESENCE_OPTIONS.filter(i => i.value === filter.presence)[0];

		return (
			<div>
				<div style={{ marginBottom: '1em' }}>
					<FormSelect
						onChange={this.selectPresence}
						options={PRESENCE_OPTIONS}
						value={presence.value}
					/>
				</div>
				<div style={{ marginBottom: '1em' }}>
					<FormSelect
						onChange={this.selectMode}
						options={MODE_OPTIONS}
						value={mode.value}
					/>
				</div>
				{this.renderControls()}
			</div>
		);
	},
});

export default DateFilter;
