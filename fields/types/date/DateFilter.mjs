/**
 * @file
 * This file defines the `DateFilter` component, which is used to filter `Date`
 * fields in the KeystoneJS Admin UI.
 *
 * It provides a date picker and a set of options for filtering by date.
 */
import React from 'react';
import DayPicker from '../../components/DayPicker.mjs';
import { formatDateByFormat, isSameDay, parseDateByFormat, startOfToday } from '../../utils/date.mjs';

import FormInput from '../../../admin/client-legacy/compat/elemental/FormInput.mjs';
import FormSelect from '../../../admin/client-legacy/compat/elemental/FormSelect.mjs';
import Grid from '../../../admin/client-legacy/compat/elemental/Grid.mjs';
import SegmentedControl from '../../../admin/client-legacy/compat/elemental/SegmentedControl.mjs';

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
 * @param {object} props The component's props.
 * @param {string} props.activeInputField The name of the currently active input field ('after' or 'before').
 * @returns {React.Element} The rendered component.
 */
const DayPickerIndicator = ({ activeInputField }) => {
	const style = activeInputField === 'before' ? { left: '11rem' } : null;

	return React.createElement(
		'span',
		{ className: 'DayPicker-Indicator', style },
		React.createElement('span', { className: 'DayPicker-Indicator__border' }),
		React.createElement('span', { className: 'DayPicker-Indicator__bg' })
	);
};

/**
 * Returns the default value for the filter.
 * @returns {object} The default value.
 */
function getDefaultValue () {
	return {
		mode: MODE_OPTIONS[0].value,
		inverted: INVERTED_OPTIONS[0].value,
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
		this.__isMounted = true;
	}

	componentWillUnmount() {
		this.__isMounted = false;
	}

	// ==============================
	// METHODS
	// ==============================

	/**
	 * Updates the filter with a new value.
	 * @param {object} value The new value.
	 */
	updateFilter = (value) => {
		this.props.onChange({ ...this.props.filter, ...value });
	};

	/**
	 * Toggles the inverted state of the filter.
	 * @param {boolean} value The new inverted state.
	 */
	toggleInverted = (value) => {
		this.updateFilter({ inverted: value });
		this.setFocus(this.props.filter.mode);
	};

	/**
	 * Selects a new mode for the filter.
	 * @param {object} e The event object.
	 */
	selectMode = (e) => {
		const mode = e.target.value;
		this.updateFilter({ mode });
		this.setFocus(mode);
	};

	/**
	 * Sets the focus to the correct input field.
	 * @param {string} mode The current mode of the filter.
	 */
	setFocus(mode) {
		// give the UI a moment to render
		if (mode === 'between') {
			setTimeout(() => {
				this.inputRefs[this.state.activeInputField]?.focus();
			}, 50);
		} else {
			setTimeout(() => {
				this.inputRefs.input?.focus();
			}, 50);
		}
	}

	/**
	 * Handles a change in the value of one of the input fields.
	 * @param {object} e The event object.
	 */
	handleInputChange = (e) => {
		const { name, value } = e.target;
		const nextValue = parseDateByFormat(value, this.props.format);
		if (!nextValue) return;
		if (name === 'after' || name === 'before') {
			this.updateFilter({ [name]: nextValue });
			this.setState({ month: nextValue });
			return;
		}
		this.updateFilter({ value: nextValue });
		this.setState({ month: nextValue }, this.showCurrentDate);
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
		const newActiveField = activeInputField === 'before'
			? 'after'
			: 'before';
		send[activeInputField] = day;
		this.updateFilter(send);
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
		// give the UI a moment to render
		setTimeout(() => {
			this.dayPickerRef?.showMonth(this.state.month);
		}, 50);
	};

	// ==============================
	// RENDERERS
	// ==============================

	/**
	 * Renders the toggle for inverting the filter.
	 * @returns {React.Element} The rendered toggle.
	 */
	renderToggle() {
		const { filter } = this.props;
		return React.createElement(
			'div',
			{ style: { marginBottom: '1em' } },
			React.createElement(SegmentedControl, {
				equalWidthSegments: true,
				onChange: this.toggleInverted,
				options: INVERTED_OPTIONS,
				value: filter.inverted,
			})
		);
	}

	/**
	 * Renders the controls for the filter.
	 * @returns {React.Element} The rendered controls.
	 */
	renderControls() {
		let controls;
		const { activeInputField } = this.state;
		const { field, filter } = this.props;
		const mode = MODE_OPTIONS.filter(i => i.value === filter.mode)[0];
		const placeholder = field.label + ' is ' + mode.label.toLowerCase() + '...';

		// DayPicker Modifiers - Selected Day
		const modifiers = filter.mode === 'between' ? {
			selected: (day) => isSameDay(filter[activeInputField], day),
		} : {
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
								autoFocus: true,
								ref: (input) => { this.inputRefs.after = input; },
								name: 'after',
								placeholder: 'From',
								onChange: this.handleInputChange,
								onFocus: () => this.setActiveField('after'),
								value: formatDateByFormat(filter.after, this.props.format),
								'data-list-filter-date-after': true,
							})
						),
						React.createElement(
							Grid.Col,
							null,
							React.createElement(FormInput, {
								ref: (input) => { this.inputRefs.before = input; },
								name: 'before',
								placeholder: 'To',
								onChange: this.handleInputChange,
								onFocus: () => this.setActiveField('before'),
								value: formatDateByFormat(filter.before, this.props.format),
								'data-list-filter-date-before': true,
							})
						)
					)
				),
				React.createElement(
					'div',
					{ style: { position: 'relative' } },
					React.createElement(DayPicker, {
						modifiers,
						className: 'DayPicker--chrome',
						onDayClick: this.switchBetweenActiveInputFields,
					}),
					React.createElement(DayPickerIndicator, { activeInputField })
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
						autoFocus: true,
						ref: (input) => { this.inputRefs.input = input; },
						name: 'value',
						placeholder,
						value: formatDateByFormat(filter.value, this.props.format),
						onChange: this.handleInputChange,
						onFocus: this.showCurrentDate,
						'data-list-filter-date-value': true,
					})
				),
				React.createElement(
					'div',
					{ style: { position: 'relative' } },
					React.createElement(DayPicker, {
						ref: (dayPicker) => { this.dayPickerRef = dayPicker; },
						modifiers,
						className: 'DayPicker--chrome',
						onDayClick: this.selectDay,
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
		return React.createElement(
			'div',
			null,
			this.renderToggle(),
			React.createElement(
				'div',
				{ style: { marginBottom: '1em' } },
				React.createElement(FormSelect, {
					options: MODE_OPTIONS,
					onChange: this.selectMode,
					value: mode.value,
					'data-list-filter-date-mode': true,
				})
			),
			this.renderControls()
		);
	}
}

export default DateFilter;
