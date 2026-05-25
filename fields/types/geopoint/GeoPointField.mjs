/**
 * @file
 * This file defines the `GeoPointField` component, which is used to render
 * a geopoint field in the KeystoneJS Admin UI.
 */
import Field from '../Field.mjs';
import React from 'react';
import FormInput from '../../../admin/client-legacy/App/elemental/FormInput/index.mjs';
import Grid from '../../../admin/client-legacy/App/elemental/Grid/index.mjs';

/**
 * The `GeoPointField` component.
 * @augments Field
 */
export default Field.create({

	displayName: 'GeopointField',
	statics: {
		type: 'Geopoint',
	},

	focusTargetRef: 'lat',

	/**
	 * Handles a change in the latitude value.
	 * @param {object} event The event object.
	 */
	handleLat (event) {
		const { value = [], path, onChange } = this.props;
		const newVal = event.target.value;
		onChange({
			path,
			value: [value[0], newVal],
		});
	},

	/**
	 * Handles a change in the longitude value.
	 * @param {object} event The event object.
	 */
	handleLong (event) {
		const { value = [], path, onChange } = this.props;
		const newVal = event.target.value;
		onChange({
			path,
			value: [newVal, value[1]],
		});
	},

	/**
	 * Renders the value of the field.
	 * @returns {React.Element} The rendered value.
	 */
	renderValue () {
		const { value } = this.props;
		if (value && value[1] && value[0]) {
			return React.createElement(FormInput, { noedit: true }, value[1], ', ', value[0]);
		}
		return React.createElement(FormInput, { noedit: true }, '(not set)');
	},

	/**
	 * Renders the field.
	 * @returns {React.Element} The rendered field.
	 */
	renderField () {
		const { value = [], path } = this.props;
		return React.createElement(
			Grid.Row,
			{ xsmall: 'one-half', gutter: 10 },
			React.createElement(
				Grid.Col,
				null,
				React.createElement(FormInput, {
					autoComplete: 'off',
					name: this.getInputName(path + '[1]'),
					onChange: this.handleLat,
					placeholder: 'Latitude',
					ref: this.getFocusTargetRef('lat'),
					value: value[1],
				})
			),
			React.createElement(
				Grid.Col,
				{ width: 'one-half' },
				React.createElement(FormInput, {
					autoComplete: 'off',
					name: this.getInputName(path + '[0]'),
					onChange: this.handleLong,
					placeholder: 'Longitude',
					ref: this.getFocusTargetRef('lng'),
					value: value[0],
				})
			)
		);
	},

});
