/**
 * @fileoverview This file contains the UpdateForm component, which is used to
 * render a form for updating multiple items in a list.
 */
import React from 'react';
import Select from 'react-select';
import { findDOMNode } from 'react-dom';
import assign from 'object-assign';
import { Fields } from 'FieldTypes';
import InvalidFieldType from '../../../shared/InvalidFieldType';
import { plural } from '../../../../utils/string';
import { BlankState, Button, Form, Modal } from '../../../elemental';

/**
 * Renders a form for updating multiple items in a list.
 *
 * @param {object} props The properties for the component.
 * @param {boolean} props.isOpen Whether the form is open.
 * @param {array} props.itemIds The ids of the items to update.
 * @param {object} props.list The list object.
 * @param {function} props.onCancel The function to call when the form is cancelled.
 * @returns {React.Element} The rendered component.
 */
var UpdateForm = React.createClass({
	displayName: 'UpdateForm',
	propTypes: {
		isOpen: React.PropTypes.bool,
		itemIds: React.PropTypes.array,
		list: React.PropTypes.object,
		onCancel: React.PropTypes.func,
	},
	getDefaultProps () {
		return {
			isOpen: false,
		};
	},
	getInitialState () {
		return {
			fields: [],
		};
	},
	componentDidMount () {
		this.doFocus();
	},
	componentDidUpdate () {
		this.doFocus();
	},
	/**
	 * Focuses the first field in the form.
	 */
	doFocus () {
		if (this.refs.focusTarget) {
			findDOMNode(this.refs.focusTarget).focus();
		}
	},
	/**
	 * Gets the options for the select input.
	 *
	 * @returns {array} The options.
	 */
	getOptions () {
		const { fields } = this.props.list;
		return Object.keys(fields).map(key => ({ value: fields[key].path, label: fields[key].label }));
	},
	/**
	 * Gets the props for a field.
	 *
	 * @param {object} field The field object.
	 * @returns {object} The props for the field.
	 */
	getFieldProps (field) {
		var props = assign({}, field);
		props.value = this.state.fields[field.path];
		props.values = this.state.fields;
		props.onChange = this.handleChange;
		props.mode = 'create';
		props.key = field.path;
		return props;
	},
	/**
	 * Updates the options for the select input.
	 *
	 * @param {array} fields The new fields.
	 */
	updateOptions (fields) {
		this.setState({
			fields: fields,
		}, this.doFocus);
	},
	/**
	 * Handles a change in the form.
	 *
	 * @param {object} value The new value.
	 */
	handleChange (value) {
		console.log('handleChange:', value);
	},
	/**
	 * Handles the close event.
	 */
	handleClose () {
		this.setState({
			fields: [],
		});
		this.props.onCancel();
	},
	/**
	 * Renders the fields in the form.
	 *
	 * @returns {React.Element} The rendered fields.
	 */
	renderFields () {
		const { list } = this.props;
		const { fields } = this.state;
		const formFields = [];
		let focusRef;

		fields.forEach((fieldOption) => {
			const field = list.fields[fieldOption.value];

			if (typeof Fields[field.type] !== 'function') {
				formFields.push(React.createElement(InvalidFieldType, { type: field.type, path: field.path, key: field.path }));
				return;
			}
			var fieldProps = this.getFieldProps(field);
			if (!focusRef) {
				fieldProps.ref = focusRef = 'focusTarget';
			}
			formFields.push(React.createElement(Fields[field.type], fieldProps));
		});

		const fieldsUI = formFields.length ? formFields : (
			<BlankState
				heading="Choose a field above to begin"
				style={{ padding: '3em 2em' }}
			/>
		);

		return (
			<div style={{ borderTop: '1px dashed rgba(0,0,0,0.1)', marginTop: 20, paddingTop: 20 }}>
				{fieldsUI}
			</div>
		);
	},
	/**
	 * Renders the form.
	 *
	 * @returns {React.Element} The rendered form.
	 */
	renderForm () {
		const { itemIds, list } = this.props;
		const itemCount = plural(itemIds, ('* ' + list.singular), ('* ' + list.plural));
		const formAction = `${Keystone.adminPath}/${list.path}`;

		return (
			<Form layout="horizontal" action={formAction} noValidate="true">
				<Modal.Header
					onClose={this.handleClose}
					showCloseButton
					text={'Update ' + itemCount}
				/>
				<Modal.Body>
					<Select
						key="field-select"
						multi
						onChange={this.updateOptions}
						options={this.getOptions()}
						ref="initialFocusTarget"
						value={this.state.fields}
					/>
					{this.renderFields()}
				</Modal.Body>
				<Modal.Footer>
					<Button color="primary" submit>Update</Button>
					<Button color="cancel" variant="link" onClick={this.handleClose}>Cancel</Button>
				</Modal.Footer>
			</Form>
		);
	},
	/**
	 * Renders the component.
	 *
	 * @returns {React.Element} The rendered component.
	 */
	render () {
		return (
			<Modal.Dialog isOpen={this.props.isOpen} onClose={this.handleClose} backdropClosesModal>
				{this.renderForm()}
			</Modal.Dialog>
		);
	},
});

module.exports = UpdateForm;
