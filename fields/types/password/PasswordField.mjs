/**
 * @file
 * This file defines the `PasswordField` component, which is used to render a
 * password field in the KeystoneJS Admin UI.
 *
 * It provides a UI for setting and changing a password, and it hides the
 * password value from the user.
 */
import React from 'react';
import Field from '../Field.mjs';
import {
	Button,
	FormInput,
	InlineGroup as Group,
	InlineGroupSection as Section,
} from '../../../admin/client-legacy/App/elemental';

/**
 * The `PasswordField` component.
 * @augments Field
 */
export default Field.create({

	displayName: 'PasswordField',
	statics: {
		type: 'Password',
	},

	/**
	 * Gets the initial state of the component.
	 * @returns {object} The initial state.
	 */
	getInitialState () {
		return {
			passwordIsSet: this.props.value ? true : false,
			showChangeUI: this.props.mode === 'create' ? true : false,
			password: '',
			confirm: '',
		};
	},

	/**
	 * Handles a change in the value of one of the password fields.
	 * @param {string} which The name of the field that changed.
	 * @param {object} event The event object.
	 */
	valueChanged (which, event) {
		const newState = {};
		newState[which] = event.target.value;
		this.setState(newState);
	},

	/**
	 * Shows the change password UI.
	 */
	showChangeUI () {
		this.setState({
			showChangeUI: true,
		}, () => this.focus());
	},

	/**
	 * Hides the change password UI.
	 */
	onCancel () {
		this.setState({
			showChangeUI: false,
		}, () => this.focus());
	},

	/**
	 * Renders the value of the field.
	 * @returns {React.Element} The rendered value.
	 */
	renderValue () {
		return <FormInput noedit>{this.props.value ? 'Password Set' : ''}</FormInput>;
	},

	/**
	 * Renders the field.
	 * @returns {React.Element} The rendered field.
	 */
	renderField () {
		return this.state.showChangeUI ? this.renderFields() : this.renderChangeButton();
	},

	/**
	 * Renders the password and confirm password fields.
	 * @returns {React.Element} The rendered fields.
	 */
	renderFields () {
		return (
			<Group block>
				<Section grow>
					<FormInput
						autoComplete="off"
						name={this.getInputName(this.props.path)}
						onChange={this.valueChanged.bind(this, 'password')}
						placeholder="New password"
						ref="focusTarget"
						type="password"
						value={this.state.password}
					/>
				</Section>
				<Section grow>
					<FormInput
						autoComplete="off"
						name={this.getInputName(this.props.paths.confirm)}
						onChange={this.valueChanged.bind(this, 'confirm')}
						placeholder="Confirm new password" value={this.state.confirm}
						type="password"
					/>
				</Section>
				{this.state.passwordIsSet ? (
					<Section>
						<Button onClick={this.onCancel}>Cancel</Button>
					</Section>
				) : null}
			</Group>
		);
	},

	/**
	 * Renders the change password button.
	 * @returns {React.Element} The rendered button.
	 */
	renderChangeButton () {
		const label = this.state.passwordIsSet
			? 'Change Password'
			: 'Set Password';

		return (
			<Button ref="focusTarget" onClick={this.showChangeUI}>{label}</Button>
		);
	},

});
