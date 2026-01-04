import Field from '../Field';

/**
 * @fileoverview
 * This file defines the `EmailField` component, which is used to render an
 * email field in the KeystoneJS Admin UI.
 */
import PropTypes from 'prop-types';

import React from 'react';
import { FormInput } from '../../../admin/client/App/elemental';

/*
	TODO:
	- gravatar
	- validate email address
 */

/**
 * The `EmailField` component.
 * @extends Field
 */
export default Field.create({
	displayName: 'EmailField',
	propTypes: {
		path: PropTypes.string.isRequired,
		value: PropTypes.string,
	},
	statics: {
		type: 'Email',
	},
	/**
	 * Renders the field.
	 * @returns {React.Element} The rendered field.
	 */
	renderField () {
		return (
			<FormInput
				name={this.getInputName(this.props.path)}
				ref="focusTarget"
				value={this.props.value}
				onChange={this.valueChanged}
				autoComplete="off"
				type="email"
			/>
		);
	},
	/**
	 * Renders the value of the field.
	 * @returns {React.Element} The rendered value.
	 */
	renderValue () {
		return this.props.value ? (
			<FormInput noedit component="a" href={'mailto:' + this.props.value}>
				{this.props.value}
			</FormInput>
		) : (
			<FormInput noedit />
		);
	},
});
