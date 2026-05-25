/**
 * @file
 * This file defines the `DateArrayFilter` component, which is used to filter
 * `DateArray` fields in the KeystoneJS Admin UI.
 *
 * It provides a date picker and a set of options for filtering by date.
 */
import React from 'react';
import DayPicker from '../../components/DayPicker.mjs';
import { formatDateByFormat, isSameDay, parseDateByFormat, startOfToday } from '../../utils/date.mjs';
import FormInput from '../../../admin/client-legacy/App/elemental/FormInput/index.mjs';
import FormSelect from '../../../admin/client-legacy/App/elemental/FormSelect/index.mjs';
import Grid from '../../../admin/client-legacy/App/elemental/Grid/index.mjs';

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
function DayPickerIndicator() {
	return React.createElement(
		'span',
		{ className: 'DayPicker-Indicator' },
		React.createElement('span', { className: 'DayPicker-Indicator__border' }),
		React.createElement('span', { className: 'DayPicker-Indicator__bg' })
	);
}

/**
 * Returns the default value for the filter.
 * @returns {object} The default value.
 */
function getDefaultValue () {
	return {
		mode: MODE_OPTIONS[0].value,
		presence: PRESENCE_OPTIONS[0].value,
		value: startOfToday(),
		before: startOfToday(),
		after: startOfToday(),
	};
}

/**
 * The `DateFilter` component.
 * @augments React.Component
 */
class DateFilter extends React.Component {
	static displayName = 'DateFilter';

	static defaultProps = {
		format: 'DD-MM-YYYY',
		filter: getDefaultValue(),
		value: startOfToday(),
	};

	static getDefaultValue = getDefaultValue;

	constructor(props) {
		super(props);
		this.inputRefs = {};
		this.state = {
			activeInputField: 'after',
			month: new Date(), // The month to display in the calendar
		};
	}

	componentDidMount() {
		// focus the text input
		if (this.props.filter.mode === 'between') {
			this.inputRefs[this.state.activeInputField]?.focus();
		} else {
			this.inputRefs.input?.focus();
		}
	}

	/**
	 * Updates the filter with a new value.
	 * @param {object} value The new value.
	 */
	updateFilter = (value) => {
		this.props.onChange({ ...this.props.filter, ...value });
	};

	/**
	 * Selects a new presence for the filter.
	 * @param {object} e The event object.
	 */
	selectPresence = (e) => {
		const presence = e.target.value;
		this.updateFilter({ presence });
		this.inputRefs.input?.focus();
	};

	/**
	 * Selects a new mode for the filter.
	 * @param {object} e The event object.
	 */
	selectMode = (e) => {
		const mode = e.target.value;
		this.updateFilter({ mode });
		if (mode === 'between') {
			setTimeout(() => { this.inputRefs[this.state.activeInputField]?.focus(); }, 200);
		} else {
			this.inputRefs.input?.focus();
		}
	};

	/**
	 * Handles a change in the value of the input.
	 * @param {object} e The event object.
	 */
	handleInputChange = (e) => {
		const { value } = e.target;
		let { month } = this.state;
		// Change the current month only if the value entered by the user is a valid
		// date, according to the `L` format
		const parsed = parseDateByFormat(value, 'L');
		if (parsed) {
			month = parsed;
		}
		this.updateFilter({ value: value });
		this.setState({ month }, this.showCurrentDate);
	};

	/**
	 * Sets the active input field.
	 * @param {string} field The name of the field to set as active.
	 */
	setActiveField = (field) => {
		this.setState({
			activeInputField: field,
		});
	};

	/**
	 * Switches between the two input fields in "between" mode.
	 * @param {object} e The event object.
	 * @param {Date} day The day that was clicked.
	 * @param {object} modifiers The modifiers for the day.
	 */
	switchBetweenActiveInputFields = (day, modifiers) => {
		if (modifiers && modifiers.disabled) return;
		const { activeInputField } = this.state;
		const send = {};
		send[activeInputField] = day;
		this.updateFilter(send);
		const newActiveField = (activeInputField === 'before') ? 'after' : 'before';
		this.setState(
			{ activeInputField: newActiveField },
			() => {
				this.inputRefs[newActiveField]?.focus();
			}
		);
	};

	/**
	 * Selects a day in the date picker.
	 * @param {object} e The event object.
	 * @param {Date} day The day that was clicked.
	 * @param {object} modifiers The modifiers for the day.
	 */
	selectDay = (day, modifiers) => {
		if (modifiers && modifiers.disabled) return;
		this.updateFilter({ value: day });
	};

	/**
	 * Shows the current date in the date picker.
	 */
	showCurrentDate = () => {
		this.dayPickerRef?.showMonth(this.state.month);
	};

	/**
	 * Renders the controls for the filter.
	 * @returns {React.Element} The rendered controls.
	 */
	renderControls() {
		let controls;
		const { field, filter } = this.props;
		const mode = MODE_OPTIONS.filter(i => i.value === filter.mode)[0];
		const placeholder = field.label + ' is ' + mode.label.toLowerCase() + '...';

		// DayPicker stuff
		const modifiers = {
			selected: (day) => isSameDay(filter.value, day),
		};

		if (mode.value === 'between') {
			controls = React.createElement(
				'div',
				null,
				React.createElement(
					'div',
					{ style: { marginBottom: '1em' } },
					React.createElement(
						Grid.Row,
						{ xsmall: 'one-half', gutter: 10 },
						React.createElement(
							Grid.Col,
							null,
							React.createElement(FormInput, {
								ref: (input) => { this.inputRefs.after = input; },
								placeholder: 'From',
								onFocus: () => { this.setActiveField('after'); },
								value: formatDateByFormat(filter.after, this.props.format),
							})
						),
						React.createElement(
							Grid.Col,
							null,
							React.createElement(FormInput, {
								ref: (input) => { this.inputRefs.before = input; },
								placeholder: 'To',
								onFocus: () => { this.setActiveField('before'); },
								value: formatDateByFormat(filter.before, this.props.format),
							})
						)
					)
				),
				React.createElement(
					'div',
					{ style: { position: 'relative' } },
					React.createElement(DayPicker, {
						className: 'DayPicker--chrome',
						modifiers,
						onDayClick: this.switchBetweenActiveInputFields,
					}),
					React.createElement(DayPickerIndicator)
				)
			);
		} else {
			controls = React.createElement(
				'div',
				null,
				React.createElement(
					'div',
					{ style: { marginBottom: '1em' } },
					React.createElement(FormInput, {
						onChange: this.handleInputChange,
						onFocus: this.showCurrentDate,
						placeholder,
						ref: (input) => { this.inputRefs.input = input; },
						value: formatDateByFormat(filter.value, this.props.format),
						'data-list-filter-date-value': true,
					})
				),
				React.createElement(
					'div',
					{ style: { position: 'relative' } },
					React.createElement(DayPicker, {
						className: 'DayPicker--chrome',
						modifiers,
						onDayClick: this.selectDay,
						ref: (dayPicker) => { this.dayPickerRef = dayPicker; },
					}),
					React.createElement(DayPickerIndicator)
				)
			);
		}

		return controls;
	}

	/**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */
	render() {
		const { filter } = this.props;
		const mode = MODE_OPTIONS.filter(i => i.value === filter.mode)[0];
		const presence = PRESENCE_OPTIONS.filter(i => i.value === filter.presence)[0];

		return React.createElement(
			'div',
			null,
			React.createElement(
				'div',
				{ style: { marginBottom: '1em' } },
				React.createElement(FormSelect, {
					onChange: this.selectPresence,
					options: PRESENCE_OPTIONS,
					value: presence.value,
					'data-list-filter-datearray-presence': true,
				})
			),
			React.createElement(
				'div',
				{ style: { marginBottom: '1em' } },
				React.createElement(FormSelect, {
					onChange: this.selectMode,
					options: MODE_OPTIONS,
					value: mode.value,
				})
			),
			this.renderControls()
		);
	}
}

export default DateFilter;
