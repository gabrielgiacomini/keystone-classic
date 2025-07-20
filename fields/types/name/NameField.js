/**
 * @fileoverview
 * This file defines the `NameField` component, which is used to render a name
 * field in the KeystoneJS Admin UI.
 *
 * It provides two text inputs for the first and last name.
 */
import Field from '../Field';
import React, { PropTypes } from 'react';
import {
	FormInput,
	Grid,
} from '../../../admin/client/App/elemental';

const NAME_SHAPE = {
	first: PropTypes.string,
	last: PropTypes.string,
};

/**
 * The `NameField` component.
 * @extends Field
 */
module.exports = Field.create({
	displayName: 'NameField',
	statics: {
		type: 'Name',
		getDefaultValue: () => ({
			first: '',
			last: '',
		}),
	},
	propTypes: {
		onChange: PropTypes.func.isRequired,
		path: PropTypes.string.isRequired,
		paths: PropTypes.shape(NAME_SHAPE).isRequired,
		value: PropTypes.shape(NAME_SHAPE).isRequired,
	},

	/**
	 * Handles a change in the value of one of the name fields.
	 * @param {string} which The name of the field that changed.
	 * @param {Object} event The event object.
	 */
	valueChanged: function (which, event) {
		const { value = {}, path, onChange } = this.props;
		onChange({
			path,
			value: {
				...value,
				[which]: event.target.value,
			},
		});
	},
	/**
	 * Handles a change in the first name field.
	 * @param {Object} event The event object.
	 */
	changeFirst: function (event) {
		return this.valueChanged('first', event);
	},
	/**
	 * Handles a change in the last name field.
	 * @param {Object} event The event object.
	 */
	changeLast: function (event) {
		return this.valueChanged('last', event);
	},
	/**
	 * Renders the value of the field.
	 * @returns {React.Element} The rendered value.
	 */
	renderValue () {
		const inputStyle = { width: '100%' };
		const { value = {} } = this.props;

		return (
			<Grid.Row small="one-half" gutter={10}>
				<Grid.Col>
					<FormInput noedit style={inputStyle}>
						{value.first}
					</FormInput>
				</Grid.Col>
				<Grid.Col>
					<FormInput noedit style={inputStyle}>
						{value.last}
					</FormInput>
				</Grid.Col>
			</Grid.Row>
		);
	},
	/**
	 * Renders the field.
	 * @returns {React.Element} The rendered field.
	 */
	renderField () {
		const { value = {}, paths, autoFocus } = this.props;
		return (
			<Grid.Row small="one-half" gutter={10}>
				<Grid.Col>
					<FormInput
						autoFocus={autoFocus}
						autoComplete="off"
						name={this.getInputName(paths.first)}
						onChange={this.changeFirst}
						placeholder="First name"
						value={value.first}
					/>
				</Grid.Col>
				<Grid.Col>
					<FormInput
						autoComplete="off"
						name={this.getInputName(paths.last)}
						onChange={this.changeLast}
						placeholder="Last name"
						value={value.last}
					/>
				</Grid.Col>
			</Grid.Row>
		);
	},
});
