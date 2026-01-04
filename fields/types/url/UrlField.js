/**
 * @fileoverview
 * This file defines the `UrlField` component, which is used to render a URL
 * field in the KeystoneJS Admin UI.
 */
import React from 'react';
import Field from '../Field';
import { FormInput } from '../../../admin/client/App/elemental';

/**
 * The `UrlField` component.
 * @extends Field
 */
export default Field.create({
	displayName: 'URLField',
	statics: {
		type: 'Url',
	},
	/**
	 * Opens the URL in a new window.
	 */
	openValue () {
		var href = this.props.value;
		if (!href) return;
		if (!/^(mailto\:)|(\w+\:\/\/)/.test(href)) {
			href = 'http://' + href;
		}
		window.open(href);
	},
	/**
	 * Renders the field.
	 * @returns {React.Element} The rendered field.
	 */
	renderField () {
		const { value } = this.props;
		return (
			<div>
				<FormInput
					autoComplete="off"
					name={this.getInputName(this.props.path)}
					onChange={this.valueChanged}
					ref="focusTarget"
					type="url"
					value={value}
				/>
				{ this.renderThumb() }
			</div>
		);
	},
	/**
	 * Renders the value of the field.
	 * @returns {React.Element} The rendered value.
	 */
	renderValue () {
		const { value } = this.props;
		return (
			<div>
				<FormInput noedit onClick={value && this.openValue}>
					{value}
				</FormInput>
				{ this.renderThumb() }
			</div>
		);
	},
	/**
	 * Renders a thumbnail of the URL, if the `thumb` prop is true.
	 * @returns {React.Element} The rendered thumbnail.
	 */
	renderThumb () {
		const { thumb, value } = this.props;
		if (thumb === true) {
			return (
				<img src={value}/>
			);
		}
		return ('');
	},
});
