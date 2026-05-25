/**
 * @file
 * This file defines the `TextareaField` component, which is used to render
 * a textarea field in the KeystoneJS Admin UI.
 */
import Field from '../Field.mjs';
import React from 'react';
import FormInput from '../../../admin/client-legacy/compat/elemental/FormInput.mjs';

/**
 * The `TextareaField` component.
 * @augments Field
 */
export default Field.create({
	displayName: 'TextareaField',
	statics: {
		type: 'Textarea',
	},
	/**
	 * Renders the value of the field.
	 * @returns {React.Element} The rendered value.
	 */
	renderValue () {
		const { height } = this.props;

		const styles = {
			height: height,
			whiteSpace: 'pre-wrap',
			overflowY: 'auto',
		};
		return React.createElement(FormInput, {
			multiline: true,
			noedit: true,
			style: styles,
		}, this.props.value);
	},
	/**
	 * Renders the field.
	 * @returns {React.Element} The rendered field.
	 */
	renderField () {
		const { height, path, style, value } = this.props;

		const styles = {
			height: height,
			...style,
		};
		return React.createElement(FormInput, {
			autoComplete: 'off',
			multiline: true,
			name: this.getInputName(path),
			onChange: this.valueChanged,
			ref: this.getFocusTargetRef(),
			style: styles,
			value,
		});
	},
});
