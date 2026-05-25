/**
 * @file
 * This file defines the `LocationField` component, which is used to render a
 * location field in the KeystoneJS Admin UI.
 *
 * It provides a set of inputs for the different parts of a location, and it
 * can be configured to use the Google Maps API to improve the location data.
 */
import React from 'react';
import Field from '../Field.mjs';
import CollapsedFieldLabel from '../../components/CollapsedFieldLabel.mjs';
import NestedFormField from '../../components/NestedFormField.mjs';

import FormField from '../../../admin/client-legacy/App/elemental/FormField/index.mjs';
import FormInput from '../../../admin/client-legacy/App/elemental/FormInput/index.mjs';
import FormNote from '../../../admin/client-legacy/App/elemental/FormNote/index.mjs';
import Grid from '../../../admin/client-legacy/App/elemental/Grid/index.mjs';
import LabelledControl from '../../../admin/client-legacy/App/elemental/LabelledControl/index.mjs';

/**
 * TODO:
 * - Custom path support
 */

/**
 * The `LocationField` component.
 * @augments Field
 */
export default Field.create({

	displayName: 'LocationField',
	statics: {
		type: 'Location',
	},

	/**
	 * Gets the initial state of the component.
	 * @returns {object} The initial state.
	 */
	getInitialState () {
		const { value = [] } = this.props;
		const collapsedFields = {};
		['number', 'name', 'street2', 'geo'].forEach((i) => {
			if (!value[i]) {
				collapsedFields[i] = true;
			}
		});

		return {
			collapsedFields,
			improve: false,
			overwrite: false,
		};
	},

	/**
	 * Determines whether the field should be collapsed.
	 * @returns {boolean} Whether the field should be collapsed.
	 */
	shouldCollapse () {
		return this.props.collapse && !this.formatValue();
	},

	/**
	 * Uncollapses the fields.
	 */
	uncollapseFields () {
		this.setState({
			collapsedFields: {},
		});
	},

	/**
	 * Handles a change in the value of one of the location fields.
	 * @param {string} fieldPath The path of the field that changed.
	 * @param {object} event The event object.
	 */
	fieldChanged (fieldPath, event) {
		const { value = {}, path, onChange } = this.props;
		onChange({
			path,
			value: {
				...value,
				[fieldPath]: event.target.value,
			},
		});
	},

	/**
	 * Returns a function that handles a change in the value of a location field.
	 * @param {string} fieldPath The path of the field.
	 * @returns {function(object): void} The change handler.
	 */
	makeChanger (fieldPath) {
		return this.fieldChanged.bind(this, fieldPath);
	},

	/**
	 * Handles a change in the value of one of the geo fields.
	 * @param {number} i The index of the geo field.
	 * @param {object} event The event object.
	 */
	geoChanged (i, event) {
		const { value = {}, path, onChange } = this.props;
		const newVal = event.target.value;
		const geo = [
			i === 0 ? newVal : value.geo ? value.geo[0] : '',
			i === 1 ? newVal : value.geo ? value.geo[1] : '',
		];
		onChange({
			path,
			value: {
				...value,
				geo,
			},
		});
	},

	/**
	 * Returns a function that handles a change in the value of a geo field.
	 * @param {number} fieldPath The index of the geo field.
	 * @returns {function(object): void} The change handler.
	 */
	makeGeoChanger (fieldPath) {
		return this.geoChanged.bind(this, fieldPath);
	},

	/**
	 * Formats the value of the field.
	 * @returns {string} The formatted value.
	 */
	formatValue () {
		const { value = {} } = this.props;
		return [
			value.number,
			value.name,
			value.street1,
			value.street2,
			value.suburb,
			value.state,
			value.postcode,
			value.country,
		].filter(Boolean).join(', ');
	},

	/**
	 * Renders the value of the field.
	 * @returns {React.Element} The rendered value.
	 */
	renderValue () {
		return React.createElement(FormInput, { noedit: true }, this.formatValue() || '');
	},

	/**
	 * Renders a single field.
	 * @param {string} fieldPath The path of the field.
	 * @param {string} label The label of the field.
	 * @param {boolean} collapse Whether the field should be collapsible.
	 * @param {boolean} autoFocus Whether the field should be focused.
	 * @returns {React.Element} The rendered field.
	 */
	renderField (fieldPath, label, collapse, autoFocus) {
		if (this.state.collapsedFields[fieldPath]) {
			return null;
		}
		const { value = {}, path } = this.props;
		return React.createElement(
			NestedFormField,
			{ label, 'data-field-location-path': path + '.' + fieldPath },
			React.createElement(FormInput, {
				autoFocus,
				name: this.getInputName(path + '.' + fieldPath),
				onChange: this.makeChanger(fieldPath),
				placeholder: label,
				value: value[fieldPath] || '',
			})
		);
	},

	/**
	 * Renders the suburb and state fields.
	 * @returns {React.Element} The rendered fields.
	 */
	renderSuburbState () {
		const { value = {}, path } = this.props;
		return React.createElement(
			NestedFormField,
			{ label: 'Suburb / State', 'data-field-location-path': path + '.suburb_state' },
			React.createElement(
				Grid.Row,
				{ gutter: 10 },
				React.createElement(
					Grid.Col,
					{ small: 'two-thirds', 'data-field-location-path': path + '.suburb' },
					React.createElement(FormInput, {
						name: this.getInputName(path + '.suburb'),
						onChange: this.makeChanger('suburb'),
						placeholder: 'Suburb',
						value: value.suburb || '',
					})
				),
				React.createElement(
					Grid.Col,
					{ small: 'one-third', 'data-field-location-path': path + '.state' },
					React.createElement(FormInput, {
						name: this.getInputName(path + '.state'),
						onChange: this.makeChanger('state'),
						placeholder: 'State',
						value: value.state || '',
					})
				)
			)
		);
	},

	/**
	 * Renders the postcode and country fields.
	 * @returns {React.Element} The rendered fields.
	 */
	renderPostcodeCountry () {
		const { value = {}, path } = this.props;
		return React.createElement(
			NestedFormField,
			{ label: 'Postcode / Country', 'data-field-location-path': path + '.postcode_country' },
			React.createElement(
				Grid.Row,
				{ gutter: 10 },
				React.createElement(
					Grid.Col,
					{ small: 'one-third', 'data-field-location-path': path + '.postcode' },
					React.createElement(FormInput, {
						name: this.getInputName(path + '.postcode'),
						onChange: this.makeChanger('postcode'),
						placeholder: 'Post Code',
						value: value.postcode || '',
					})
				),
				React.createElement(
					Grid.Col,
					{ small: 'two-thirds', 'data-field-location-path': path + '.country' },
					React.createElement(FormInput, {
						name: this.getInputName(path + '.country'),
						onChange: this.makeChanger('country'),
						placeholder: 'Country',
						value: value.country || '',
					})
				)
			)
		);
	},

	/**
	 * Renders the geo fields.
	 * @returns {React.Element} The rendered fields.
	 */
	renderGeo () {
		if (this.state.collapsedFields.geo) {
			return null;
		}
		const { value = {}, path, paths } = this.props;
		const geo = value.geo || [];
		return React.createElement(
			NestedFormField,
			{ label: 'Lat / Lng', 'data-field-location-path': path + '.geo' },
			React.createElement(
				Grid.Row,
				{ gutter: 10 },
				React.createElement(
					Grid.Col,
					{ small: 'one-half', 'data-field-location-path': 'latitude' },
					React.createElement(FormInput, {
						name: this.getInputName(paths.geo + '[1]'),
						onChange: this.makeGeoChanger(1),
						placeholder: 'Latitude',
						value: geo[1] || '',
					})
				),
				React.createElement(
					Grid.Col,
					{ small: 'one-half', 'data-field-location-path': 'longitude' },
					React.createElement(FormInput, {
						name: this.getInputName(paths.geo + '[0]'),
						onChange: this.makeGeoChanger(0),
						placeholder: 'Longitude',
						value: geo[0] || '',
					})
				)
			)
		);
	},

	/**
	 * Handles a change in the value of one of the Google options.
	 * @param {string} key The key of the option that changed.
	 * @param {object} e The event object.
	 */
	updateGoogleOption (key, e) {
		const newState = {};
		newState[key] = e.target.checked;
		this.setState(newState);
	},

	/**
	 * Returns a function that handles a change in the value of a Google option.
	 * @param {string} key The key of the option.
	 * @returns {function(object): void} The change handler.
	 */
	makeGoogler (key) {
		return this.updateGoogleOption.bind(this, key);
	},


	/**
	 * Renders the Google options.
	 * @returns {React.Element} The rendered options.
	 */
	renderGoogleOptions () {
		const { paths, enableMapsAPI } = this.props;
		if (!enableMapsAPI) return null;
		const replace = this.state.improve ? React.createElement(LabelledControl, {
			checked: this.state.overwrite,
			'data-field-location-overwrite': true,
			label: 'Replace existing data',
			name: this.getInputName(paths.overwrite),
			onChange: this.makeGoogler('overwrite'),
			type: 'checkbox',
		}) : null;
		return React.createElement(
			FormField,
			{ offsetAbsentLabel: true },
			React.createElement(LabelledControl, {
				checked: this.state.improve,
				'data-field-location-improve': true,
				label: 'Autodetect and improve location on save',
				name: this.getInputName(paths.improve),
				onChange: this.makeGoogler('improve'),
				title: 'When checked, this will attempt to fill missing fields. It will also get the lat/long',
				type: 'checkbox',
			}),
			replace
		);
	},

	/**
	 * Renders the note.
	 * @returns {React.Element} The rendered note.
	 */
	renderNote () {
		const { note } = this.props;
		if (!note) return null;
		return React.createElement(
			FormField,
			{ offsetAbsentLabel: true },
			React.createElement(FormNote, { note })
		);
	},

	/**
	 * Renders the UI.
	 * @returns {React.Element} The rendered UI.
	 */
	renderUI () {

		if (!this.shouldRenderField()) {
			return React.createElement(FormField, { label: this.props.label }, this.renderValue());
		}

		 
		const showMore = Object.keys(this.state.collapsedFields).length > 0
			? React.createElement(CollapsedFieldLabel, { onClick: this.uncollapseFields }, '(show more fields)')
			: null;
		 

		const { label, path } = this.props;
		return React.createElement(
			'div',
			{ 'data-field-name': path, 'data-field-type': 'location' },
			React.createElement(FormField, { label, htmlFor: path }, showMore),
			this.renderField('number', 'PO Box / Shop', true, true),
			this.renderField('name', 'Building Name', true),
			this.renderField('street1', 'Street Address'),
			this.renderField('street2', 'Street Address 2', true),
			this.renderSuburbState(),
			this.renderPostcodeCountry(),
			this.renderGeo(),
			this.renderGoogleOptions(),
			this.renderNote()
		);
	},

});
