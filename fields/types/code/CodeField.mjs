/**
 * @file
 * This file defines the `CodeField` component, which is used to render a
 * code field in the KeystoneJS Admin UI.
 *
 * It uses the CodeMirror library to provide a rich code editing experience.
 */
import _ from 'lodash';
import CodeMirror from 'codemirror';
import Field from '../Field.mjs';
import React from 'react';
import { findDOMNode } from 'react-dom';
import { FormInput } from '../../../admin/client-legacy/App/elemental';
import classnames from 'classnames';

/**
 * TODO:
 * - Remove dependency on lodash
 */

// See CodeMirror docs for API:
// http://codemirror.net/doc/manual.html

/**
 * The `CodeField` component.
 * @augments Field
 */
export default Field.create({
	displayName: 'CodeField',
	statics: {
		type: 'Code',
	},

	/**
	 * Gets the initial state of the component.
	 * @returns {object} The initial state.
	 */
	getInitialState () {
		return {
			isFocused: false,
		};
	},
	/**
	 * Initializes the CodeMirror instance.
	 */
	componentDidMount () {
		if (!this.refs.codemirror) {
			return;
		}

		const options = _.defaults({}, this.props.editor, {
			lineNumbers: true,
			readOnly: this.shouldRenderField() ? false : true,
		});

		this.codeMirror = CodeMirror.fromTextArea(findDOMNode(this.refs.codemirror), options);
		this.codeMirror.setSize(null, this.props.height);
		this.codeMirror.on('change', this.codemirrorValueChanged);
		this.codeMirror.on('focus', this.focusChanged.bind(this, true));
		this.codeMirror.on('blur', this.focusChanged.bind(this, false));
		this._currentCodemirrorValue = this.props.value;
	},
	/**
	 * Destroys the CodeMirror instance.
	 */
	componentWillUnmount () {
		// todo: is there a lighter-weight way to remove the cm instance?
		if (this.codeMirror) {
			this.codeMirror.toTextArea();
		}
	},
	/**
	 * Handles the component receiving new props.
	 * @param {object} nextProps The new props.
	 */
	componentWillReceiveProps (nextProps) {
		if (this.codeMirror && this._currentCodemirrorValue !== nextProps.value) {
			this.codeMirror.setValue(nextProps.value);
		}
	},
	/**
	 * Focuses the CodeMirror instance.
	 */
	focus () {
		if (this.codeMirror) {
			this.codeMirror.focus();
		}
	},
	/**
	 * Handles a change in the focus of the CodeMirror instance.
	 * @param {boolean} focused Whether the instance is focused.
	 */
	focusChanged (focused) {
		this.setState({
			isFocused: focused,
		});
	},
	/**
	 * Handles a change in the value of the CodeMirror instance.
	 * @param {object} doc The CodeMirror document.
	 * @param {object} change The change object.
	 */
	codemirrorValueChanged (doc, change) {
		const newValue = doc.getValue();
		this._currentCodemirrorValue = newValue;
		this.props.onChange({
			path: this.props.path,
			value: newValue,
		});
	},
	/**
	 * Renders the CodeMirror instance.
	 * @returns {React.Element} The rendered CodeMirror instance.
	 */
	renderCodemirror () {
		const className = classnames('CodeMirror-container', {
			'is-focused': this.state.isFocused && this.shouldRenderField(),
		});

		return (
			<div className={className}>
				<FormInput
					autoComplete="off"
					multiline
					name={this.getInputName(this.props.path)}
					onChange={this.valueChanged}
					ref="codemirror"
					value={this.props.value}
				/>
			</div>
		);
	},
	/**
	 * Renders the value of the field.
	 * @returns {React.Element} The rendered value.
	 */
	renderValue () {
		return this.renderCodemirror();
	},
	/**
	 * Renders the field.
	 * @returns {React.Element} The rendered field.
	 */
	renderField () {
		return this.renderCodemirror();
	},
});
