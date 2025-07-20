/**
 * @fileoverview
 * This file defines the `NumberField` component, which is used to render a
 * number field in the KeystoneJS Admin UI.
 */
import React from 'react';
import Field from '../Field';
import { FormInput } from '../../../admin/client/App/elemental';

/**
 * The `NumberField` component.
 * @extends Field
 */
module.exports = Field.create({
	displayName: 'NumberField',
	statics: {
		type: 'Number',
	},
	/**
	 * Handles a change in the value of the field.
	 * @param {Object} event The event object.
	 */
	valueChanged (event) {
		var newValue = event.target.value;
		if (/^-?\d*\.?\d*$/.test(newValue)) {
			this.props.onChange({
				path: this.props.path,
				value: newValue,
			});
		}
	},
	/**
	 * Renders the field.
	 * @returns {React.Element} The rendered field.
	 */
	renderField () {
		return (
			<FormInput
				autoComplete="off"
				name={this.getInputName(this.props.path)}
				onChange={this.valueChanged}
				ref="focusTarget"
				value={this.props.value}
			/>
		);
	},
});
