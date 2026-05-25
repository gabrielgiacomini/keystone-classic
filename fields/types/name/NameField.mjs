/**
 * @file
 * This file defines the `NameField` component, which is used to render a name
 * field in the KeystoneJS Admin UI.
 *
 * It provides two text inputs for the first and last name.
 */
import Field from '../Field.mjs';
import React from 'react';
import FormInput from '../../../admin/client-legacy/App/elemental/FormInput/index.mjs';
import Grid from '../../../admin/client-legacy/App/elemental/Grid/index.mjs';

/**
 * The `NameField` component.
 * @augments Field
 */
export default Field.create({
	displayName: 'NameField',
	statics: {
		type: 'Name',
		getDefaultValue: () => ({
			first: '',
			last: '',
		}),
	},

	/**
	 * Handles a change in the value of one of the name fields.
	 * @param {string} which The name of the field that changed ("first" or "last").
	 * @param {object} event The synthetic change event from the input element.
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
	 * @param {object} event The synthetic change event from the input element.
	 * @returns {void} Delegates to `valueChanged`.
	 */
	changeFirst: function (event) {
		return this.valueChanged('first', event);
	},
	/**
	 * Handles a change in the last name field.
	 * @param {object} event The synthetic change event from the input element.
	 * @returns {void} Delegates to `valueChanged`.
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

		return React.createElement(
			Grid.Row,
			{ small: 'one-half', gutter: 10 },
			React.createElement(
				Grid.Col,
				null,
				React.createElement(FormInput, { noedit: true, style: inputStyle }, value.first)
			),
			React.createElement(
				Grid.Col,
				null,
				React.createElement(FormInput, { noedit: true, style: inputStyle }, value.last)
			)
		);
	},
	/**
	 * Renders the field.
	 * @returns {React.Element} The rendered field.
	 */
	renderField () {
		const { value = {}, paths, autoFocus } = this.props;
		return React.createElement(
			Grid.Row,
			{ small: 'one-half', gutter: 10 },
			React.createElement(
				Grid.Col,
				null,
				React.createElement(FormInput, {
					autoFocus,
					autoComplete: 'off',
					name: this.getInputName(paths.first),
					onChange: this.changeFirst,
					placeholder: 'First name',
					value: value.first,
				})
			),
			React.createElement(
				Grid.Col,
				null,
				React.createElement(FormInput, {
					autoComplete: 'off',
					name: this.getInputName(paths.last),
					onChange: this.changeLast,
					placeholder: 'Last name',
					value: value.last,
				})
			)
		);
	},
});
