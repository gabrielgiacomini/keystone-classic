/**
 * @fileoverview
 * This file defines the `MoneyField` component, which is used to render a
 * money field in the KeystoneJS Admin UI.
 */
import { FormInput } from '../../../admin/client/App/elemental';
import Field from '../Field';
import React, { PropTypes } from 'react';

/**
 * The `MoneyField` component.
 * @extends Field
 */
export default Field.create({
	displayName: 'MoneyField',
	propTypes: {
		onChange: PropTypes.func.isRequired,
		path: PropTypes.string.isRequired,
		value: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.number,
		]),
	},
	statics: {
		type: 'Money',
	},

	/**
	 * Handles a change in the value of the field.
	 * @param {Object} event The event object.
	 */
	valueChanged (event) {
		var newValue = event.target.value.replace(/[^\d\s\,\.\$€£¥]/g, '');
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
