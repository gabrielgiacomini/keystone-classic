/**
 * @file
 * This file defines the `CodeField` component, which is used to render a
 * code field in the KeystoneJS Admin UI.
 *
 * It uses the CodeMirror library to provide a rich code editing experience.
 */
import Field from '../Field.mjs';
import React from 'react';
import FormInput from '../../../admin/client-legacy/App/elemental/FormInput/index.mjs';
import classnames from '../../utils/classnames.mjs';

// See CodeMirror docs for API:
// http://codemirror.net/doc/manual.html
const getCodeMirror = () => {
	if (typeof window === 'undefined' || !window.CodeMirror) {
		throw new Error('CodeMirror global is required for the legacy Code field');
	}
	return window.CodeMirror;
};

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
		if (!this.codemirrorInput || !this.codemirrorInput.target) {
			return;
		}

		const options = {
			lineNumbers: true,
			readOnly: this.shouldRenderField() ? false : true,
			...this.props.editor,
		};

		this.codeMirror = getCodeMirror().fromTextArea(this.codemirrorInput.target, options);
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
	 * Handles externally supplied value changes.
	 * @param {object} prevProps The previous props.
	 */
	componentDidUpdate (prevProps) {
		if (this.props.value === prevProps.value) return;
		if (this.codeMirror && this._currentCodemirrorValue !== this.props.value) {
			this.codeMirror.setValue(this.props.value);
		}
	},
	/**
	 * Stores the textarea component used to initialize CodeMirror.
	 * @param {object} target The rendered FormInput instance.
	 */
	setCodemirrorInput (target) {
		this.codemirrorInput = target;
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

		return React.createElement(
			'div',
			{ className, 'data-field-code': this.props.path },
			React.createElement(FormInput, {
				autoComplete: 'off',
				multiline: true,
				name: this.getInputName(this.props.path),
				onChange: this.valueChanged,
				ref: this.setCodemirrorInput,
				value: this.props.value,
			})
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
