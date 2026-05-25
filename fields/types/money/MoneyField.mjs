/**
 * @file
 * This file defines the `MoneyField` component, which is used to render a
 * money field in the KeystoneJS Admin UI.
 */
import FormInput from '../../../admin/client-legacy/App/elemental/FormInput/index.mjs';
import Field from '../Field.mjs';
import React from 'react';

/**
 * The `MoneyField` component.
 * @augments Field
 */
export default Field.create({
	displayName: 'MoneyField',
	statics: {
		type: 'Money',
	},

	/**
	 * Handles a change in the value of the field.
	 * @param {object} event The event object.
	 */
	valueChanged (event) {
		const newValue = event.target.value.replace(/[^\d\s\,\.\$€£¥]/g, '');
		if (newValue === this.props.value) return;

		this.props.onChange({
			path: this.props.path,
			value: newValue,
		});
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
