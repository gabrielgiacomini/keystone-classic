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
import { FormField } from '../../../admin/client-legacy/App/elemental';

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
	propTypes: {
		indent: React.PropTypes.bool,
		label: React.PropTypes.string,
		onChange: React.PropTypes.func.isRequired,
		path: React.PropTypes.string.isRequired,
		value: React.PropTypes.bool,
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
