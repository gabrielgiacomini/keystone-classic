/**
 * @fileoverview
 * This mixin provides functionality for managing an array of values for a
 * field. It includes methods for adding, removing, and updating items, as well
 * as rendering the field and its values.
 *
 * @typedef {Object} ArrayFieldItem
 * @property {string} key A unique key for the item.
 * @property {any} value The value of the item.
 *
 * @typedef {Object} ArrayFieldProps
 * @property {any[]} value The array of values.
 * @property {function(Object): void} onChange A function to call when the value changes.
 * @property {string} path The path of the field.
 * @property {boolean} [collapse] Whether the field should be collapsed.
 */
var React = require('react');

import _ from 'lodash';
import { findDOMNode } from 'react-dom';

var Button = require('elemental').Button;
var FormField = require('elemental').FormField;
var FormInput = require('elemental').FormInput;

var lastId = 0;
var ENTER_KEYCODE = 13;

/**
 * Creates a new item with a unique key.
 *
 * @param {any} value The value of the new item.
 * @return {ArrayFieldItem} The new item.
 */
function newItem (value) {
	lastId = lastId + 1;
	return { key: 'i' + lastId, value: value };
}

/**
 * Reduces an array of items to an array of their values.
 *
 * @param {ArrayFieldItem[]} values The array of items.
 * @return {any[]} The array of values.
 */
function reduceValues (values) {
	return values.map(i => i.value);
}

module.exports = {
	propTypes: {
		value: React.PropTypes.array,
		onChange: React.PropTypes.func.isRequired,
		path: React.PropTypes.string.isRequired,
		collapse: React.PropTypes.bool,
	},
	getInitialState: function () {
		return {
			values: Array.isArray(this.props.value) ? this.props.value.map(newItem) : [],
		};
	},

	/**
	 * @param {ArrayFieldProps} nextProps
	 */
	componentWillReceiveProps: function (nextProps) {
		// If the component receives new values, update the state
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
		var newValues = this.state.values.concat(newItem(''));
		this.setState({
			values: newValues,
		}, () => {
			// Focus the new item
			if (!this.state.values.length) return;
			findDOMNode(this.refs['item_' + this.state.values.length]).focus();
		});
		this.valueChanged(reduceValues(newValues));
	},

	/**
	 * Removes an item from the array.
	 *
	 * @param {ArrayFieldItem} i The item to remove.
	 */
	removeItem: function (i) {
		var newValues = _.without(this.state.values, i);
		this.setState({
			values: newValues,
		}, function () {
			// Focus the add button
			findDOMNode(this.refs.button).focus();
		});
		this.valueChanged(reduceValues(newValues));
	},

	/**
	 * Updates an item in the array.
	 *
	 * @param {ArrayFieldItem} i The item to update.
	 * @param {Object} event The change event.
	 * @param {any} [event.value] The new value.
	 * @param {Object} [event.target] The event target.
	 * @param {any} [event.target.value] The new value from the event target.
	 */
	updateItem: function (i, event) {
		var updatedValues = this.state.values;
		var updateIndex = updatedValues.indexOf(i);
		var newValue = event.value || event.target.value;
		// If the new value is valid, update the item's value
		if (this.isValid === undefined || this.isValid(newValue)) {
			updatedValues[updateIndex].value = this.cleanInput ? this.cleanInput(newValue) : newValue;
		}
		this.setState({
			values: updatedValues,
		});
		this.valueChanged(reduceValues(updatedValues));
	},

	/**
	 * Called when the values of the array have changed.
	 *
	 * @param {any[]} values The new array of values.
	 */
	valueChanged: function (values) {
		this.props.onChange({
			path: this.props.path,
			value: values,
		});
	},

	/**
	 * Renders the field.
	 *
	 * @return {React.Element}
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
	 *
	 * @param {ArrayFieldItem} item The item to render.
	 * @param {number} index The index of the item.
	 * @return {React.Element}
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
	 *
	 * @return {React.Element}
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
	 * Whether the field should be collapsed.
	 *
	 * @return {boolean}
	 */
	// Override shouldCollapse to check for array length
	shouldCollapse: function () {
		return this.props.collapse && !this.props.value.length;
	},

	/**
	 * Adds a new item when the enter key is pressed.
	 *
	 * @param {KeyboardEvent} event The keydown event.
	 */
	addItemOnEnter: function (event) {
		if (event.keyCode === ENTER_KEYCODE) {
			this.addItem();
			event.preventDefault();
		}
	},
};
