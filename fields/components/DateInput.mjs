import DayPicker from './DayPicker.mjs';
import React from 'react';
import Popout from '../../admin/client-legacy/compat/shared/Popout.mjs';
import FormInput from '../../admin/client-legacy/compat/elemental/FormInput.mjs';
import { formatDateByFormat, isSameDay, parseDateByFormat, toValidDate } from '../utils/date.mjs';

let lastId = 0;

export default class DateInput extends React.Component {
	static displayName = 'DateInput';

	static defaultProps = {
		format: 'YYYY-MM-DD',
	};

	constructor(props) {
		super(props);
		const id = ++lastId;
		let month = new Date();
		const { format, value } = props;
		const parsedValue = parseDateByFormat(value, format);
		if (parsedValue) {
			month = parsedValue;
		}

		this.state = {
			id: `_DateInput_${id}`,
			month: month,
			pickerIsOpen: false,
			inputValue: value,
		};
	}

	componentDidMount() {
		this.showCurrentMonth();
	}

	componentDidUpdate(prevProps) {
		if (this.props.value === prevProps.value) return;
		this.setState({
			month: parseDateByFormat(this.props.value, this.props.format) || new Date(),
			inputValue: this.props.value,
		}, this.showCurrentMonth);
	}

	focus = () => {
		if (!this.inputRef) return;
		this.inputRef.focus();
	};

	handleInputChange = (e) => {
		const { value } = e.target;
		this.setState({ inputValue: value }, this.showCurrentMonth);
	};

	handleKeyDown = (e) => {
		if (e.key !== 'Enter') return;

		e.preventDefault();
		// If the date is strictly equal to the format string, dispatch onChange
		const parsed = parseDateByFormat(this.state.inputValue, this.props.format);
		if (parsed && formatDateByFormat(parsed, this.props.format) === this.state.inputValue) {
			this.props.onChange({ value: this.state.inputValue });
		// If the date is not strictly equal, only change the tab that is displayed
		} else if (toValidDate(this.state.inputValue)) {
			this.setState({
				month: toValidDate(this.state.inputValue),
			}, this.showCurrentMonth);
		}
	};

	handleDaySelect = (date, modifiers) => {
		if (modifiers && modifiers.disabled) return;

		const value = formatDateByFormat(date, this.props.format);

		this.props.onChange({ value });
		this.setState({
			pickerIsOpen: false,
			month: date,
			inputValue: value,
		});
	};

	showPicker = () => {
		this.setState({ pickerIsOpen: true }, this.showCurrentMonth);
	};

	showCurrentMonth = () => {
		if (!this.pickerRef) return;
		this.pickerRef.showMonth(this.state.month);
	};

	handleFocus = () => {
		if (this.state.pickerIsOpen) return;
		this.showPicker();
	};

	handleCancel = () => {
		this.setState({ pickerIsOpen: false });
	};

	handleBlur = (e) => {
		let rt = e.relatedTarget || e.nativeEvent.explicitOriginalTarget;
		const popout = this.popoutRef?.getPortalDOMNode();
		while (rt) {
			if (rt === popout) return;
			rt = rt.parentNode;
		}
		this.setState({
			pickerIsOpen: false,
		});
	};

	render() {
		const selectedDay = this.props.value;
		// The local day picker adds a class to the selected day based on this.
		const modifiers = {
			selected: (day) => isSameDay(day, parseDateByFormat(selectedDay, this.props.format)),
		};

		return React.createElement(
			'div',
			null,
			React.createElement(FormInput, {
				autoComplete: 'off',
				id: this.state.id,
				name: this.props.name,
				onBlur: this.handleBlur,
				onChange: this.handleInputChange,
				onFocus: this.handleFocus,
				onKeyDown: this.handleKeyDown,
				placeholder: this.props.format,
				ref: (input) => { this.inputRef = input; },
				value: this.state.inputValue,
			}),
			React.createElement(
				Popout,
				{
					isOpen: this.state.pickerIsOpen,
					onCancel: this.handleCancel,
					ref: (popout) => { this.popoutRef = popout; },
					relativeToID: this.state.id,
					width: 260,
				},
				React.createElement(DayPicker, {
					modifiers,
					onDayClick: this.handleDaySelect,
					ref: (picker) => { this.pickerRef = picker; },
					tabIndex: -1,
				})
			)
		);
	}
}
