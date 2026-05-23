/**
 * @file
 * This file defines the `ArrayField` mixin, which is used to create field
 * types that manage an array of values. It provides methods for adding,
 * removing, and updating items in the array, as well as for rendering the
 * field and its value.
 *
 * This mixin is used by the `DateArray`, `NumberArray`, and `TextArray`
 * field types.
 */
import React from 'react';
import { findDOMNode } from 'react-dom';
import { Button, FormField, FormInput } from '../../admin/client-legacy/App/elemental';

let lastId = 0;
const ENTER_KEYCODE = 13;

/**
 * Creates a new item for the array.
 * @param {string|number} value The value of the new item.
 * @returns {object} The new item.
 */
function newItem (value) {
	lastId = lastId + 1;
	return { key: 'i' + lastId, value: value };
}

/**
 * Reduces an array of items to an array of their values.
 * @param {Array} values The array of items.
 * @returns {Array} The array of values.
 */
function reduceValues (values) {
	return values.map(i => i.value);
}

/**
 * The `ArrayField` mixin.
 * @type {object}
 */
export default {
	/**
	 * Gets the initial state of the component.
	 * @returns {object} The initial state.
	 */
	getInitialState: function () {
		return {
			values: Array.isArray(this.props.value) ? this.props.value.map(newItem) : [],
		};
	},

	/**
	 * Handles the component receiving new props.
	 * @param {object} nextProps The new props.
	 */
	UNSAFE_componentWillReceiveProps: function (nextProps) {
		if (nextProps.value.join('|') !== reduceValues(this.state.values).join('|')) {
			this.setState({
				values: nextProps.value.map(newItem),
			});
		}
	},

	/**
	 * Adds a new item to the array.
	 */
	addItem: function () {
		const newValues = this.state.values.concat(newItem(''));
		this.setState({
			values: newValues,
		}, () => {
			if (!this.state.values.length) return;
			findDOMNode(this.refs['item_' + this.state.values.length]).focus();
		});
		this.valueChanged(reduceValues(newValues));
	},

	/**
	 * Removes an item from the array.
	 * @param {object} i The item to remove.
	 */
	removeItem: function (i) {
		const newValues = this.state.values.filter(item => item !== i);
		this.setState({
			values: newValues,
		}, function () {
			findDOMNode(this.refs.button).focus();
		});
		this.valueChanged(reduceValues(newValues));
	},

	/**
	 * Updates an item in the array.
	 * @param {object} i The item to update.
	 * @param {object} event The event object.
	 */
	updateItem: function (i, event) {
		const updatedValues = this.state.values;
		const updateIndex = updatedValues.indexOf(i);
		const newValue = event.value || event.target.value;
		if (this.isValid === undefined || this.isValid(newValue)) {
			updatedValues[updateIndex].value = this.cleanInput ? this.cleanInput(newValue) : newValue;
		}
		this.setState({
			values: updatedValues,
		});
		this.valueChanged(reduceValues(updatedValues));
	},

	/**
	 * Handles a change in the field's value.
	 * @param {Array} values The new array of values.
	 */
	valueChanged: function (values) {
		this.props.onChange({
			path: this.props.path,
			value: values,
		});
	},

	/**
	 * Renders the field.
	 * @returns {React.Element} The rendered field.
	 */
	renderField: function () {
		return (
			<div>
				{this.state.values.map(this.renderItem)}
				<Button ref="button" onClick={this.addItem}>Add item</Button>
			</div>
		);
	},

	/**
	 * Renders an item in the array.
	 * @param {object} item The item to render.
	 * @param {number} index The index of the item.
	 * @returns {React.Element} The rendered item.
	 */
	renderItem: function (item, index) {
		const Input = this.getInputComponent ? this.getInputComponent() : FormInput;
		const value = this.processInputValue ? this.processInputValue(item.value) : item.value;
		return (
			<FormField key={item.key}>
				<Input ref={'item_' + (index + 1)} name={this.getInputName(this.props.path)} value={value} onChange={this.updateItem.bind(this, item)} onKeyDown={this.addItemOnEnter} autoComplete="off" />
				<Button type="link-cancel" onClick={this.removeItem.bind(this, item)} className="keystone-relational-button">
					<span className="octicon octicon-x" />
				</Button>
			</FormField>
		);
	},

	/**
	 * Renders the value of the field.
	 * @returns {React.Element} The rendered value.
	 */
	renderValue: function () {
		const Input = this.getInputComponent ? this.getInputComponent() : FormInput;
		return (
			<div>
				{this.state.values.map((item, i) => {
					const value = this.formatValue ? this.formatValue(item.value) : item.value;
					return (
						<div key={i} style={i ? { marginTop: '1em' } : null}>
							<Input noedit value={value} />
						</div>
					);
				})}
			</div>
		);
	},

	/**
	 * Determines whether the field should be collapsed.
	 * @returns {boolean} Whether the field should be collapsed.
	 */
	shouldCollapse: function () {
		return this.props.collapse && !this.props.value.length;
	},

	/**
	 * Adds an item to the array when the enter key is pressed.
	 * @param {object} event The event object.
	 */
	addItemOnEnter: function (event) {
		if (event.keyCode === ENTER_KEYCODE) {
			this.addItem();
			event.preventDefault();
		}
	},
};
