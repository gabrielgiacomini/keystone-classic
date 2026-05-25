/**
 * @file
 * This file defines the `ColorField` component, which is used to render a
 * color field in the KeystoneJS Admin UI.
 *
 */
import { css } from '../../../admin/client-legacy/utils/glamor.mjs';
import Field from '../Field.mjs';
import React from 'react';
import Button from '../../../admin/client-legacy/compat/elemental/Button.mjs';
import FormInput from '../../../admin/client-legacy/compat/elemental/FormInput.mjs';
import Group from '../../../admin/client-legacy/compat/elemental/InlineGroup.mjs';
import Section from '../../../admin/client-legacy/compat/elemental/InlineGroupSection.mjs';
import transparentSwatch from './transparent-swatch.mjs';
import coloredSwatch from './colored-swatch.mjs';
import theme from '../../../admin/client-legacy/theme.mjs';

/**
 * The `ColorField` component.
 * @augments Field
 */
const ColorField = Field.create({
	displayName: 'ColorField',
	statics: {
		type: 'Color',
	},

	/**
	 * Gets the initial state of the component.
	 * @returns {object} The initial state.
	 */
	getInitialState () {
		return {
			displayColorPicker: false,
		};
	},
	/**
	 * Updates the value of the field.
	 * @param {string} value The new value.
	 */
	updateValue (value) {
		this.props.onChange({
			path: this.props.path,
			value: value,
		});
	},
	/**
	 * Handles a change in the value of the input.
	 * @param {object} event The event object.
	 */
	handleInputChange (event) {
		let newValue = event.target.value;
		if (/^([0-9A-F]{3}){1,2}$/.test(newValue)) {
			newValue = '#' + newValue;
		}
		if (newValue === this.props.value) return;

		this.updateValue(newValue);
	},
	/**
	 * Handles a click on the swatch.
	 */
	handleClick () {
		this.setState({ displayColorPicker: !this.state.displayColorPicker });
	},
	/**
	 * Handles the closing of the color picker.
	 */
	handleClose () {
		this.setState({ displayColorPicker: false });
	},
	/**
	 * Handles a change in the native color picker.
	 * @param {object} event The change event.
	 */
	handlePickerChange (event) {
		const newValue = event.target.value;

		if (newValue === this.props.value) return;

		this.updateValue(newValue);
	},
	/**
	 * Renders the swatch.
	 * @returns {React.Element} The rendered swatch.
	 */
	renderSwatch () {
		const className = `${css(classes.swatch)} e2e-type-color__swatch`;

		return this.props.value
			? React.createElement('span', {
					className,
					style: { color: this.props.value },
					dangerouslySetInnerHTML: { __html: coloredSwatch },
			  })
			: React.createElement('span', {
					className,
					dangerouslySetInnerHTML: { __html: transparentSwatch },
			  });
	},
	/**
	 * Renders the field.
	 * @returns {React.Element} The rendered field.
	 */
	renderField () {

		const { displayColorPicker } = this.state;

		return React.createElement(
			'div',
			{ className: 'e2e-type-color__wrapper', style: { position: 'relative' } },
			React.createElement(
				Group,
				null,
				React.createElement(
					Section,
					{ grow: true },
					React.createElement(FormInput, {
						autoComplete: 'off',
						name: this.getInputName(this.props.path),
						onChange: this.handleInputChange,
						ref: this.getFocusTargetRef(),
						value: this.props.value,
					})
				),
				React.createElement(
					Section,
					null,
					React.createElement(
						Button,
						{
							onClick: this.handleClick,
							style: classes.button,
							'data-e2e-type-color__button': true,
						},
						this.renderSwatch()
					)
				)
			),
			displayColorPicker && React.createElement(
				'div',
				null,
				React.createElement('div', {
					className: css(classes.blockout),
					'data-e2e-type-color__blockout': true,
					onClick: this.handleClose,
				}),
				React.createElement(
					'div',
					{
						className: css(classes.popover),
						onClick: e => e.stopPropagation(),
						'data-e2e-type-color__popover': true,
					},
					React.createElement(FormInput, {
						autoFocus: true,
						type: 'color',
						value: normalizePickerValue(this.props.value),
						onChange: this.handlePickerChange,
					})
				)
			)
		);
	},
});

function normalizePickerValue (value) {
	return /^#[0-9a-f]{6}$/i.test(value || '') ? value : '#000000';
}

/* eslint quote-props: ["error", "as-needed"] */
const classes = {
	button: {
		background: 'white !important',
		padding: 4,
		width: theme.component.height,

		// ':hover': {
		// 	background: 'white',
		// },
	},
	blockout: {
		bottom: 0,
		left: 0,
		position: 'fixed',
		right: 0,
		top: 0,
		zIndex: 1,
	},
	popover: {
		background: 'white',
		borderRadius: 2,
		boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
		marginTop: 10,
		padding: 8,
		position: 'absolute',
		left: 0,
		zIndex: 500,
	},
	swatch: {
		borderRadius: 1,
		boxShadow: '0 0 0 1px rgba(0,0,0,0.1)',
		display: 'block',
		' svg': {
			display: 'block',
		},
	},
};

export default ColorField;
