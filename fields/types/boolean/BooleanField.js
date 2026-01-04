/**
 * @fileoverview
 * This file defines the `BooleanField` component, which is used to render a
 * boolean field in the KeystoneJS Admin UI.
 *
 * It provides a checkbox to toggle the value of the field.
 */
import PropTypes from 'prop-types';

import React from 'react';
import Field from '../Field';
import Checkbox from '../../components/Checkbox';
import { FormField } from '../../../admin/client/App/elemental';

const NOOP = () => {};

/**
 * The `BooleanField` component.
 * @extends Field
 */
export default Field.create({
	displayName: 'BooleanField',
	statics: {
		type: 'Boolean',
	},
	propTypes: {
		indent: PropTypes.bool,
		label: PropTypes.string,
		onChange: PropTypes.func.isRequired,
		path: PropTypes.string.isRequired,
		value: PropTypes.bool,
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
	 * Renders the form input.
	 * @returns {React.Element} The rendered form input.
	 */
	renderFormInput () {
		if (!this.shouldRenderField()) return;

		return (
			<input
				name={this.getInputName(this.props.path)}
				type="hidden"
				value={!!this.props.value}
			/>
		);
	},
	/**
	 * Renders the UI for the field.
	 * @returns {React.Element} The rendered UI.
	 */
	renderUI () {
		const { indent, value, label, path } = this.props;

		return (
			<div data-field-name={path} data-field-type="boolean">
				<FormField offsetAbsentLabel={indent}>
					<label style={{ height: '2.3em' }}>
						{this.renderFormInput()}
						<Checkbox
							checked={value}
							onChange={(this.shouldRenderField() && this.valueChanged) || NOOP}
							readonly={!this.shouldRenderField()}
						/>
						<span style={{ marginLeft: '.75em' }}>
							{label}
						</span>
					</label>
					{this.renderNote()}
				</FormField>
			</div>
		);
	},
});
