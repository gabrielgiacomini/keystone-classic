/**
 * @file
 * This file defines the `SelectFilter` component, which is used to filter
 * `Select` fields in the KeystoneJS Admin UI.
 *
 * It provides a popout list of options to filter by, and it supports
 * inverting the filter.
 */
import React, { Component, PropTypes } from 'react';
import {
	Button,
	FormField,
	FormNote,
	SegmentedControl,
} from '../../../admin/client-legacy/App/elemental';
import PopoutList from '../../../admin/client-legacy/App/shared/Popout/PopoutList';
import Kbd from '../../../admin/client-legacy/App/shared/Kbd';
import bindFunctions from '../../utils/bindFunctions.mjs';

const INVERTED_OPTIONS = [
	{ label: 'Matches', value: false },
	{ label: 'Does NOT Match', value: true },
];

/**
 * Returns the default value for the filter.
 * @returns {object} The default value.
 */
function getDefaultValue () {
	return {
		inverted: INVERTED_OPTIONS[0].value,
		value: [],
	};
}

/**
 * A component that renders a single option in the filter.
 * @augments React.Component
 */
class FilterOption extends Component {
	constructor () {
		super();

		bindFunctions.call(this, [
			'handleClick',
		]);
	}
	/**
	 * Handles a click on the option.
	 */
	handleClick () {
		const { option, selected } = this.props;
		this.props.onClick(option, selected);
	}
	/**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */
	render () {
		const { option, selected } = this.props;
		return (
			<PopoutList.Item
				icon={selected ? 'check' : 'dash'}
				isSelected={selected}
				label={option.label}
				onClick={this.handleClick}
			/>
		);
	}
}

/**
 * The `SelectFilter` component.
 * @augments React.Component
 */
class SelectFilter extends Component {
	/**
	 * Initialises the component, binds event-handler methods, and sets
	 * the initial state.
	 */
	constructor () {
		super();

		bindFunctions.call(this, [
			'detectOS',
			'handleClick',
			'handleKeyDown',
			'handleKeyUp',
			'removeOption',
			'selectOption',
			'toggleAllOptions',
			'toggleInverted',
			'updateFilter',
		]);

		this.state = { metaDown: false };
	}
	/**
	 * Detects the OS and attaches keyboard listeners when the component mounts.
	 */
	componentDidMount () {
		this.detectOS();
		document.body.addEventListener('keydown', this.handleKeyDown, false);
		document.body.addEventListener('keyup', this.handleKeyUp, false);
	}
	/**
	 * Removes keyboard listeners when the component unmounts.
	 */
	componentWillUnmount () {
		document.body.removeEventListener('keydown', this.handleKeyDown);
		document.body.removeEventListener('keyup', this.handleKeyUp);
	}

	// ==============================
	// METHODS
	// ==============================

	/**
	 * Detects the user's operating system.
	 */
	// TODO this should probably be moved to the main App component and stored
	// in context for other components to subscribe to when required
	detectOS () {
		let osName = 'Unknown OS';

		if (navigator.appVersion.includes('Win')) osName = 'Windows';
		if (navigator.appVersion.includes('Mac')) osName = 'MacOS';
		if (navigator.appVersion.includes('X11')) osName = 'UNIX';
		if (navigator.appVersion.includes('Linux')) osName = 'Linux';

		this.setState({ osName });
	}
	/**
	 * Handles a keydown event.
	 * @param {object} e The event object.
	 */
	handleKeyDown (e) {
		if (e.key !== 'Meta') return;

		this.setState({ metaDown: true });
	}
	/**
	 * Handles a keyup event.
	 * @param {object} e The event object.
	 */
	handleKeyUp (e) {
		if (e.key !== 'Meta') return;

		this.setState({ metaDown: false });
	}

	/**
	 * Toggles the inverted state of the filter.
	 * @param {boolean} inverted The new inverted state.
	 */
	toggleInverted (inverted) {
		this.updateFilter({ inverted });
	}
	/**
	 * Toggles all options on or off.
	 */
	toggleAllOptions () {
		const { field, filter } = this.props;

		if (filter.value.length < field.ops.length) {
			this.updateFilter({ value: field.ops.map(i => i.value) });
		} else {
			this.updateFilter({ value: [] });
		}
	}
	/**
	 * Selects an option.
	 * @param {object} option The option to select.
	 */
	selectOption (option) {
		const value = this.state.metaDown
			? this.props.filter.value.concat(option.value)
			: [option.value];

		this.updateFilter({ value });
	}
	/**
	 * Removes an option from the filter.
	 * @param {object} option The option to remove.
	 */
	removeOption (option) {
		const value = this.state.metaDown
			? this.props.filter.value.filter(i => i !== option.value)
			: [option.value];

		this.updateFilter({ value });
	}
	/**
	 * Handles a click on an option.
	 * @param {object} option The option that was clicked.
	 * @param {boolean} selected Whether the option is currently selected.
	 */
	handleClick (option, selected) {
		selected ? this.removeOption(option) : this.selectOption(option);
	}
	/**
	 * Updates the filter with a new value.
	 * @param {object} value The new value.
	 */
	updateFilter (value) {
		this.props.onChange({ ...this.props.filter, ...value });
	}

	// ==============================
	// RENDERERS
	// ==============================

	/**
	 * Renders the options for the filter.
	 * @returns {React.Element} The rendered options.
	 */
	renderOptions () {
		return this.props.field.ops.map((option, i) => {
			const selected = this.props.filter.value.indexOf(option.value) > -1;
			return (
				<FilterOption
					key={`item-${i}-${option.value}`}
					option={option}
					selected={selected}
					onClick={this.handleClick}
				/>
			);
		});
	}
	/**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */
	render () {
		const { field, filter } = this.props;
		const indeterminate = filter.value.length < field.ops.length;

		const metaKeyLabel = this.state.osName === 'MacOS'
			? 'cmd'
			: 'ctrl';

		const fieldStyles = {
			alignItems: 'center',
			borderBottom: '1px dashed rgba(0,0,0,0.1)',
			display: 'flex',
			justifyContent: 'space-between',
			marginBottom: '1em',
			paddingBottom: '1em',
		};

		return (
			<div>
				<FormField>
					<SegmentedControl
						equalWidthSegments
						onChange={this.toggleInverted}
						options={INVERTED_OPTIONS}
						value={filter.inverted}
					/>
				</FormField>
				<div style={fieldStyles}>
					<Button size="xsmall" onClick={this.toggleAllOptions} style={{ padding: 0, width: 50 }}>
						{indeterminate ? 'All' : 'None'}
					</Button>
					<FormNote style={{ margin: 0 }}>
						Hold <Kbd>{metaKeyLabel}</Kbd> to select multiple options
					</FormNote>
				</div>
				{this.renderOptions()}
			</div>
		);
	}
};


SelectFilter.propTypes = {
	field: PropTypes.object,
	filter: PropTypes.shape({
		inverted: PropTypes.boolean,
		value: PropTypes.array,
	}),
};
SelectFilter.getDefaultValue = getDefaultValue;
SelectFilter.defaultProps = {
	filter: getDefaultValue(),
};

export default SelectFilter;
