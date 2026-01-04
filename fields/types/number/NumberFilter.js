/**
 * @fileoverview
 * This file defines the `NumberFilter` component, which is used to filter
 * `Number` fields in the KeystoneJS Admin UI.
 *
 * It provides a set of options for filtering by number, and it supports
 * inverting the filter.
 */
import React from 'react';
import { findDOMNode } from 'react-dom';
import {
	Form,
	FormField,
	FormInput,
	FormSelect,
	Grid,
} from '../../../admin/client/App/elemental';

const MODE_OPTIONS = [
	{ label: 'Exactly', value: 'equals' },
	{ label: 'Greater Than', value: 'gt' },
	{ label: 'Less Than', value: 'lt' },
	{ label: 'Between', value: 'between' },
];

/**
 * Returns the default value for the filter.
 * @returns {Object} The default value.
 */
function getDefaultValue () {
	return {
		mode: MODE_OPTIONS[0].value,
		value: '',
	};
}

/**
 * The `NumberFilter` component.
 * @extends React.Component
 */
class NumberFilter extends React.Component {
    static getDefaultValue = getDefaultValue;

    static defaultProps = {
        filter: getDefaultValue(),
    };

    componentDidMount() {
		// focus the text input
		findDOMNode(this.refs.focusTarget).focus();
	}

    /**
	 * Returns a function that handles a change in the value of the filter.
	 * @param {string} type The type of the value to handle.
	 * @returns {function} The change handler.
	 */
    handleChangeBuilder = (type) => {
		const self = this;
		return function handleChange (e) {
			const { filter, onChange } = self.props;

			switch (type) {
				case 'minValue':
					onChange({
						mode: filter.mode,
						value: {
							min: e.target.value,
							max: filter.value.max,
						},
					});
					break;
				case 'maxValue':
					onChange({
						mode: filter.mode,
						value: {
							min: filter.value.min,
							max: e.target.value,
						},
					});
					break;
				case 'value':
					onChange({
						mode: filter.mode,
						value: e.target.value,
					});
			}
		};
	};

    /**
	 * Updates the filter with a new value.
	 * @param {Object} changedProp The changed property.
	 */
    updateFilter = (changedProp) => {
		this.props.onChange({ ...this.props.filter, ...changedProp });
	};

    /**
	 * Selects a new mode for the filter.
	 * @param {Object} e The event object.
	 */
    selectMode = (e) => {
		this.updateFilter({ mode: e.target.value });

		// focus on next tick
		setTimeout(() => {
			findDOMNode(this.refs.focusTarget).focus();
		}, 0);
	};

    /**
	 * Renders the controls for the filter.
	 * @param {Object} mode The current mode of the filter.
	 * @returns {React.Element} The rendered controls.
	 */
    renderControls = (mode) => {
		let controls;
		const { field } = this.props;
		const placeholder = field.label + ' is ' + mode.label.toLowerCase() + '...';

		if (mode.value === 'between') {
			controls = (
				<Grid.Row xsmall="one-half" gutter={10}>
					<Grid.Col>
						<FormInput
							onChange={this.handleChangeBuilder('minValue')}
							placeholder="Min."
							ref="focusTarget"
							type="number"
						/>
					</Grid.Col>
					<Grid.Col>
						<FormInput
							onChange={this.handleChangeBuilder('maxValue')}
							placeholder="Max."
							type="number"
						/>
					</Grid.Col>
				</Grid.Row>
			);
		} else {
			controls = (
				<FormInput
					onChange={this.handleChangeBuilder('value')}
					placeholder={placeholder}
					ref="focusTarget"
					type="number"
				/>
			);
		}

		return controls;
	};

    /**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */
    render() {
		const { filter } = this.props;
		const mode = MODE_OPTIONS.filter(i => i.value === filter.mode)[0];

		return (
			<Form component="div">
				<FormField>
					<FormSelect
						onChange={this.selectMode}
						options={MODE_OPTIONS}
						value={mode.value}
					/>
				</FormField>
				{this.renderControls(mode)}
			</Form>
		);
	}
}

export default NumberFilter;
