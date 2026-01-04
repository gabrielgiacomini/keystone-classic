/**
 * @fileoverview
 * This file defines the `DateFilter` component, which is used to filter `Date`
 * fields in the KeystoneJS Admin UI.
 *
 * It provides a date picker and a set of options for filtering by date.
 */
import React, { PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import moment from 'moment';
import DayPicker from 'react-day-picker';

import {
	FormInput,
	FormSelect,
	Grid,
	SegmentedControl,
} from '../../../admin/client/App/elemental';

const INVERTED_OPTIONS = [
	{ label: 'Matches', value: false },
	{ label: 'Does NOT Match', value: true },
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
 * @param {Object} props The component's props.
 * @returns {React.Element} The rendered component.
 */
const DayPickerIndicator = ({ activeInputField }) => {
	const style = activeInputField === 'before' ? { left: '11rem' } : null;

	return (
		<span className="DayPicker-Indicator" style={style}>
			<span className="DayPicker-Indicator__border" />
			<span className="DayPicker-Indicator__bg" />
		</span>
	);
};

/**
 * Returns the default value for the filter.
 * @returns {Object} The default value.
 */
function getDefaultValue () {
	return {
		mode: MODE_OPTIONS[0].value,
		inverted: INVERTED_OPTIONS[0].value,
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
		filter: PropTypes.shape({
			mode: PropTypes.oneOf(MODE_OPTIONS.map(i => i.value)),
			inverted: PropTypes.boolean,
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
		this.__isMounted = true;
	},
	componentWillUnmount () {
		this.__isMounted = false;
	},

	// ==============================
	// METHODS
	// ==============================

	/**
	 * Updates the filter with a new value.
	 * @param {Object} value The new value.
	 */
	updateFilter (value) {
		this.props.onChange({ ...this.props.filter, ...value });
	},
	/**
	 * Toggles the inverted state of the filter.
	 * @param {boolean} value The new inverted state.
	 */
	toggleInverted (value) {
		this.updateFilter({ inverted: value });
		this.setFocus(this.props.filter.mode);
	},
	/**
	 * Selects a new mode for the filter.
	 * @param {Object} e The event object.
	 */
	selectMode (e) {
		const mode = e.target.value;
		this.updateFilter({ mode });
		this.setFocus(mode);
	},
	/**
	 * Sets the focus to the correct input field.
	 * @param {string} mode The current mode of the filter.
	 */
	setFocus (mode) {
		// give the UI a moment to render
		if (mode === 'between') {
			setTimeout(() => {
				findDOMNode(this.refs[this.state.activeInputField]).focus();
			}, 50);
		} else {
			setTimeout(() => {
				this.refs.input.focus();
			}, 50);
		}
	},
	/**
	 * Handles a change in the value of one of the input fields.
	 * @param {Object} e The event object.
	 */
	handleInputChange (e) {
		// TODO @jedwatson
		// Entering virtually any value will return an "Invalid date", so I'm
		// temporarily disabling user entry. This entire component needs review.

		// const { value } = e.target;
		// let { month } = this.state;
		// // Change the current month only if the value entered by the user is a valid
		// // date, according to the `L` format
		// if (moment(value, 'L', true).isValid()) {
		// 	month = moment(value, 'L').toDate();
		// }
		// this.updateFilter({ value: value });
		// this.setState({ month }, this.showCurrentDate);
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
		const newActiveField = activeInputField === 'before'
			? 'after'
			: 'before';
		send[activeInputField] = day;
		this.updateFilter(send);
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
		// give the UI a moment to render
		setTimeout(() => {
			this.refs.daypicker.showMonth(this.state.month);
		}, 50);
	},

	// ==============================
	// RENDERERS
	// ==============================

	/**
	 * Renders the toggle for inverting the filter.
	 * @returns {React.Element} The rendered toggle.
	 */
	renderToggle () {
		const { filter } = this.props;
		return (
			<div style={{ marginBottom: '1em' }}>
				<SegmentedControl
					equalWidthSegments
					onChange={this.toggleInverted}
					options={INVERTED_OPTIONS}
					value={filter.inverted}
				/>
			</div>
		);
	},
	/**
	 * Renders the controls for the filter.
	 * @returns {React.Element} The rendered controls.
	 */
	renderControls () {
		let controls;
		const { activeInputField } = this.state;
		const { field, filter } = this.props;
		const mode = MODE_OPTIONS.filter(i => i.value === filter.mode)[0];
		const placeholder = field.label + ' is ' + mode.label.toLowerCase() + '...';

		// DayPicker Modifiers - Selected Day
		let modifiers = filter.mode === 'between' ? {
			selected: (day) => moment(filter[activeInputField]).isSame(day),
		} : {
			selected: (day) => moment(filter.value).isSame(day),
		};

		if (mode.value === 'between') {
			controls = (
				<div>
					<div style={{ marginBottom: '1em' }}>
						<Grid.Row xsmall="one-half" gutter={10}>
							<Grid.Col>
								<FormInput
									autoFocus
									ref="after"
									placeholder="From"
									onChange={this.handleInputChange}
									onFocus={() => this.setActiveField('after')}
									value={moment(filter.after).format(this.props.format)}
								/>
							</Grid.Col>
							<Grid.Col>
								<FormInput
									ref="before"
									placeholder="To"
									onChange={this.handleInputChange}
									onFocus={() => this.setActiveField('before')}
									value={moment(filter.before).format(this.props.format)}
								/>
							</Grid.Col>
						</Grid.Row>
					</div>
					<div style={{ position: 'relative' }}>
						<DayPicker
							modifiers={modifiers}
							className="DayPicker--chrome"
							onDayClick={this.switchBetweenActiveInputFields}
						/>
						<DayPickerIndicator activeInputField={activeInputField} />
					</div>
				</div>
			);
		} else {
			controls = (
				<div>
					<div style={{ marginBottom: '1em' }}>
						<FormInput
							autoFocus
							ref="input"
							placeholder={placeholder}
							value={moment(filter.value).format(this.props.format)}
							onChange={this.handleInputChange}
							onFocus={this.showCurrentDate}
						/>
					</div>
					<div style={{ position: 'relative' }}>
						<DayPicker
							ref="daypicker"
							modifiers={modifiers}
							className="DayPicker--chrome"
							onDayClick={this.selectDay}
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
		return (
			<div>
				{this.renderToggle()}
				<div style={{ marginBottom: '1em' }}>
					<FormSelect
						options={MODE_OPTIONS}
						onChange={this.selectMode}
						value={mode.value}
					/>
				</div>
				{this.renderControls()}
			</div>
		);
	},
});

export default DateFilter;
