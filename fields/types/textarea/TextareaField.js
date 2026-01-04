/**
 * @fileoverview
 * This file defines the `TextareaField` component, which is used to render
 * a textarea field in the KeystoneJS Admin UI.
 */
import Field from '../Field';
import React from 'react';
import { FormInput } from '../../../admin/client/App/elemental';

/**
 * The `TextareaField` component.
 * @extends Field
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
		return (
			<FormInput multiline noedit style={styles}>{this.props.value}</FormInput>
		);
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
		return (
			<FormInput
				autoComplete="off"
				multiline
				name={this.getInputName(path)}
				onChange={this.valueChanged}
				ref="focusTarget"
				style={styles}
				value={value}
			/>
		);
	},
});
