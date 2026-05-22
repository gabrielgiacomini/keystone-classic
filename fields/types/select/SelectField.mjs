/**
 * @file
 * This file defines the `SelectField` component, which is used to render a
 * select field in the KeystoneJS Admin UI.
 */
import Field from '../Field.mjs';
import React from 'react';
import Select from 'react-select';
import { FormInput } from '../../../admin/client-legacy/App/elemental';

/**
 * TODO:
 * - Custom path support
 */

/**
 * The `SelectField` component.
 * @augments Field
 */
export default Field.create({

	displayName: 'SelectField',
	statics: {
		type: 'Select',
	},

	/**
	 * Handles a change in the value of the field.
	 * @param {string|number} newValue The new value selected by the user.
	 */
	valueChanged (newValue) {
		// TODO: This should be natively handled by the Select component
		if (this.props.numeric && typeof newValue === 'string') {
			newValue = newValue ? Number(newValue) : undefined;
		}
		this.props.onChange({
			path: this.props.path,
			value: newValue,
		});
	},

	/**
	 * Renders the value of the field.
	 * @returns {React.Element} The rendered value.
	 */
	renderValue () {
		const { ops, value } = this.props;
		const selected = ops.find(opt => opt.value === value);

		return (
			<FormInput noedit>
				{selected ? selected.label : null}
			</FormInput>
		);
	},

	/**
	 * Renders the field.
	 * @returns {React.Element} The rendered field.
	 */
	renderField () {
		const { numeric, ops, path, value: val } = this.props;

		// TODO: This should be natively handled by the Select component
		const options = (numeric)
			? ops.map(function (i) {
				return { label: i.label, value: String(i.value) };
			})
			: ops;
		const value = (typeof val === 'number')
			? String(val)
			: val;

		return (
			<div>
				{/* This input element fools Safari's autocorrect in certain situations that completely break react-select */}
				<input type="text" style={{ position: 'absolute', width: 1, height: 1, zIndex: -1, opacity: 0 }} tabIndex="-1"/>
				<Select
					simpleValue
					name={this.getInputName(path)}
					value={value}
					options={options}
					onChange={this.valueChanged}
				/>
			</div>
		);
	},

});
