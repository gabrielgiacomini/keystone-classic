import moment from 'moment';
import DayPicker from 'react-day-picker';
import PropTypes from 'prop-types';
import React from 'react';
import { findDOMNode } from 'react-dom';
import Popout from '../../admin/client/App/shared/Popout';
import { FormInput } from '../../admin/client/App/elemental';

let lastId = 0;

export default class extends React.Component {
    static displayName = 'DateInput';

    static propTypes = {
		format: PropTypes.string,
		name: PropTypes.string,
		onChange: PropTypes.func.isRequired,
		path: PropTypes.string,
		value: PropTypes.string,
	};

    static defaultProps = {
        format: 'YYYY-MM-DD',
    };

    constructor(props) {
        super(props);
        const id = ++lastId;
        let month = new Date();
        const { format, value } = props;
        if (moment(value, format, true).isValid()) {
			month = moment(value, format).toDate();
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

    UNSAFE_componentWillReceiveProps(newProps) {
		if (newProps.value === this.props.value) return;
		this.setState({
			month: moment(newProps.value, this.props.format).toDate(),
			inputValue: newProps.value,
		}, this.showCurrentMonth);
	}

    focus = () => {
		if (!this.refs.input) return;
		findDOMNode(this.refs.input).focus();
	};

    handleInputChange = (e) => {
		const { value } = e.target;
		this.setState({ inputValue: value }, this.showCurrentMonth);
	};

    handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			// If the date is strictly equal to the format string, dispatch onChange
			if (moment(this.state.inputValue, this.props.format, true).isValid()) {
				this.props.onChange({ value: this.state.inputValue });
			// If the date is not strictly equal, only change the tab that is displayed
			} else if (moment(this.state.inputValue, this.props.format).isValid()) {
				this.setState({
					month: moment(this.state.inputValue, this.props.format).toDate(),
				}, this.showCurrentMonth);
			}
		}
	};

    handleDaySelect = (e, date, modifiers) => {
		if (modifiers && modifiers.disabled) return;

		var value = moment(date).format(this.props.format);

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
		if (!this.refs.picker) return;
		this.refs.picker.showMonth(this.state.month);
	};

    handleFocus = (e) => {
		if (this.state.pickerIsOpen) return;
		this.showPicker();
	};

    handleCancel = () => {
		this.setState({ pickerIsOpen: false });
	};

    handleBlur = (e) => {
		let rt = e.relatedTarget || e.nativeEvent.explicitOriginalTarget;
		const popout = this.refs.popout.getPortalDOMNode();
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
		// react-day-picker adds a class to the selected day based on this
		const modifiers = {
			selected: (day) => moment(day).format(this.props.format) === selectedDay,
		};

		return (
			<div>
				<FormInput
					autoComplete="off"
					id={this.state.id}
					name={this.props.name}
					onBlur={this.handleBlur}
					onChange={this.handleInputChange}
					onFocus={this.handleFocus}
					onKeyPress={this.handleKeyPress}
					placeholder={this.props.format}
					ref="input"
					value={this.state.inputValue}
				/>
				<Popout
					isOpen={this.state.pickerIsOpen}
					onCancel={this.handleCancel}
					ref="popout"
					relativeToID={this.state.id}
					width={260}
				>
					<DayPicker
						modifiers={modifiers}
						onDayClick={this.handleDaySelect}
						ref="picker"
						tabIndex={-1}
					/>
				</Popout>
			</div>
		);
	}
}
