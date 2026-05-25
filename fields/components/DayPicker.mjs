import React from 'react';
import { addMonths, buildMonthWeeks, formatDateByFormat, isSameDay, isSameMonth, monthCaption } from '../utils/date.mjs';

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default class DayPicker extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			month: props.initialMonth || new Date(),
		};
	}

	showMonth(month) {
		if (!month || Number.isNaN(new Date(month).getTime())) return;
		this.setState({ month: new Date(month) });
	}

	handlePrevious = () => {
		this.setState(({ month }) => ({
			month: addMonths(month, -1),
		}));
	};

	handleNext = () => {
		this.setState(({ month }) => ({
			month: addMonths(month, 1),
		}));
	};

	handleButtonMouseDown = (event) => {
		event.preventDefault();
	};

	modifiersFor(day) {
		const { modifiers } = this.props;
		const result = {};
		Object.entries(modifiers || {}).forEach(([name, predicate]) => {
			if (typeof predicate === 'function' && predicate(day)) {
				result[name] = true;
			}
		});
		if (!isSameMonth(day, this.state.month)) result.outside = true;
		if (isSameDay(day, new Date())) result.today = true;
		if (day.getDay() === 0) result.sunday = true;
		return result;
	}

	renderDay(day) {
		const modifiers = this.modifiersFor(day);
		const className = [
			'DayPicker-Day',
			...Object.keys(modifiers).map(name => `DayPicker-Day--${name}`),
		].join(' ');

		return React.createElement(
			'button',
			{
				key: formatDateByFormat(day, 'YYYY-MM-DD'),
				className,
				onClick: () => this.props.onDayClick(day, modifiers),
				onMouseDown: this.handleButtonMouseDown,
				tabIndex: this.props.tabIndex,
				type: 'button',
			},
			day.getDate()
		);
	}

	render() {
		const weeks = buildMonthWeeks(this.state.month);
		const className = ['DayPicker', this.props.className].filter(Boolean).join(' ');

		return React.createElement(
			'div',
			{ className, tabIndex: this.props.tabIndex },
			React.createElement(
				'div',
				{ className: 'DayPicker-NavBar' },
				React.createElement('button', {
					'aria-label': 'Previous Month',
					className: 'DayPicker-NavButton DayPicker-NavButton--prev',
					onClick: this.handlePrevious,
					onMouseDown: this.handleButtonMouseDown,
					type: 'button',
				}),
				React.createElement('button', {
					'aria-label': 'Next Month',
					className: 'DayPicker-NavButton DayPicker-NavButton--next',
					onClick: this.handleNext,
					onMouseDown: this.handleButtonMouseDown,
					type: 'button',
				})
			),
			React.createElement(
				'div',
				{ className: 'DayPicker-Month' },
				React.createElement('div', { className: 'DayPicker-Caption' }, monthCaption(this.state.month)),
				React.createElement(
					'div',
					{ className: 'DayPicker-Weekdays' },
					React.createElement(
						'div',
						{ className: 'DayPicker-WeekdaysRow' },
						WEEKDAYS.map(day => React.createElement('div', { key: day, className: 'DayPicker-Weekday' }, day))
					)
				),
				React.createElement(
					'div',
					{ className: 'DayPicker-Body' },
					weeks.map((week, index) => React.createElement(
						'div',
						{ key: index, className: 'DayPicker-Week' },
						week.map(day => this.renderDay(day))
					))
				)
			)
		);
	}
}


DayPicker.defaultProps = {
	modifiers: {},
	onDayClick: () => {},
	tabIndex: 0,
};
