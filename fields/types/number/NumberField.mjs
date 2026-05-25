/**
 * @file
 * This file defines the `NumberField` component, which is used to render a
 * number field in the KeystoneJS Admin UI.
 */
import React from 'react';
import Field from '../Field.mjs';
import FormInput from '../../../admin/client-legacy/App/elemental/FormInput/index.mjs';

/**
 * The `NumberField` component.
 * @augments Field
 */
export default Field.create({
	displayName: 'NumberField',
	statics: {
		type: 'Number',
	},
	/**
	 * Handles a change in the value of the field.
	 * @param {object} event The event object.
	 */
	valueChanged (event) {
		const newValue = event.target.value;
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
		return React.createElement(FormInput, {
			autoComplete: 'off',
			name: this.getInputName(this.props.path),
			onChange: this.valueChanged,
			ref: this.getFocusTargetRef(),
			value: this.props.value,
		});
	},
});
