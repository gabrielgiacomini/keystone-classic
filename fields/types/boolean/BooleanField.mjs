/**
 * @file
 * This file defines the `BooleanField` component, which is used to render a
 * boolean field in the KeystoneJS Admin UI.
 *
 * It provides a checkbox to toggle the value of the field.
 */
import React from 'react';
import Field from '../Field.mjs';
import Checkbox from '../../components/Checkbox.mjs';
import FormField from '../../../admin/client-legacy/compat/elemental/FormField.mjs';

const NOOP = () => {};

/**
 * The `BooleanField` component.
 * @augments Field
 */
export default Field.create({
	displayName: 'BooleanField',
	statics: {
		type: 'Boolean',
	},

	/**
	 * Handles a change in the value of the field.
	 * @param {boolean} value The new value.
	 */
	valueChanged (value) {
		this.props.onChange({
			path: this.props.path,
			value: value,
		});
	},
	/**
	 * Renders a hidden form input that carries the boolean value on submit.
	 * Returns nothing when the field should not be rendered.
	 * @returns {React.Element|undefined} The hidden input element, or undefined if the field should not render.
	 */
	renderFormInput () {
		if (!this.shouldRenderField()) return;

		return React.createElement('input', {
			name: this.getInputName(this.props.path),
			type: 'hidden',
			value: !!this.props.value,
		});
	},
	/**
	 * Renders the UI for the field.
	 * @returns {React.Element} The rendered UI.
	 */
	renderUI () {
		const { indent, value, label, path } = this.props;

		return React.createElement(
			'div',
			{ 'data-field-name': path, 'data-field-type': 'boolean' },
			React.createElement(
				FormField,
				{ offsetAbsentLabel: indent },
				React.createElement(
					'label',
					{ style: { height: '2.3em' } },
					this.renderFormInput(),
					React.createElement(Checkbox, {
						checked: value,
						onChange: (this.shouldRenderField() && this.valueChanged) || NOOP,
						readonly: !this.shouldRenderField(),
					}),
					React.createElement('span', { style: { marginLeft: '.75em' } }, label)
				),
				this.renderNote()
			)
		);
	},
});
