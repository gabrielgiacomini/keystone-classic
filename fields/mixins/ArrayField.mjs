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
import Button from '../../admin/client-legacy/compat/elemental/Button.mjs';
import FormField from '../../admin/client-legacy/compat/elemental/FormField.mjs';
import FormInput from '../../admin/client-legacy/compat/elemental/FormInput.mjs';

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
 * @type {any}
 */
const ArrayFieldMixin = {
	/**
	 * Gets the initial state of the component.
	 * @returns {object} The initial state.
	 */
	getInitialState: function () {
		this.itemRefs = {};
		return {
			values: Array.isArray(this.props.value) ? this.props.value.map(newItem) : [],
		};
	},

	/**
	 * Handles externally supplied value changes.
	 * @param {object} prevProps The previous props.
	 */
	componentDidUpdate: function (prevProps) {
		if (this.props.value === prevProps.value) return;
		if (this.props.value.join('|') !== reduceValues(this.state.values).join('|')) {
			this.setState({
				values: this.props.value.map(newItem),
			});
		}
	},

	/**
	 * Stores a rendered array input ref.
	 * @param {string} key The array item key.
	 * @param {object} target The rendered input component.
	 */
	setItemRef: function (key, target) {
		if (target) {
			this.itemRefs[key] = target;
		} else {
			delete this.itemRefs[key];
		}
	},

	/**
	 * Stores the add-item button ref.
	 * @param {object} target The rendered button component.
	 */
	setButtonRef: function (target) {
		this.buttonRef = target;
	},

	/**
	 * Moves focus to the provided item input.
	 * @param {object} item The item whose input should receive focus.
	 */
	focusItem: function (item) {
		const target = this.itemRefs[item.key];
		if (target && target.focus) target.focus();
	},

	/**
	 * Moves focus back to the add-item button.
	 */
	focusButton: function () {
		if (this.buttonRef && this.buttonRef.focus) this.buttonRef.focus();
	},

	/**
	 * Adds a new item to the array.
	 */
	addItem: function () {
		const item = newItem('');
		const newValues = this.state.values.concat(item);
		this.setState({
			values: newValues,
		}, () => {
			this.focusItem(item);
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
			this.focusButton();
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
		return React.createElement(
			'div',
			null,
			this.state.values.map(this.renderItem),
			React.createElement(Button, { ref: this.setButtonRef, onClick: this.addItem }, 'Add item')
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
		return React.createElement(
			FormField,
			{ key: item.key },
			React.createElement(Input, {
				ref: (target) => this.setItemRef(item.key, target),
				name: this.getInputName(this.props.path),
				value,
				onChange: this.updateItem.bind(this, item),
				onKeyDown: this.addItemOnEnter,
				autoComplete: 'off',
			}),
			React.createElement(
				Button,
				{
					type: 'link-cancel',
					onClick: this.removeItem.bind(this, item),
					className: 'keystone-relational-button',
				},
				React.createElement('span', { className: 'octicon octicon-x' })
			)
		);
	},

	/**
	 * Renders the value of the field.
	 * @returns {React.Element} The rendered value.
	 */
	renderValue: function () {
		const Input = this.getInputComponent ? this.getInputComponent() : FormInput;
		return React.createElement(
			'div',
			null,
			this.state.values.map((item, i) => {
				const value = this.formatValue ? this.formatValue(item.value) : item.value;
				return React.createElement(
					'div',
					{ key: i, style: i ? { marginTop: '1em' } : null },
					React.createElement(Input, { noedit: true, value })
				);
			})
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

export default ArrayFieldMixin;
