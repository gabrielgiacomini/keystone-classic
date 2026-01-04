/**
 * @fileoverview
 * This file defines the `Field` component, which is the base class for all
 * field components in the KeystoneJS Admin UI.
 *
 * It provides the basic functionality for a field, such as rendering the
 * label, note, and value of the field.
 *
 * It is not meant to be used directly, but should be extended by other field
 * components.
 */
import classnames from 'classnames';
import evalDependsOn from '../utils/evalDependsOn.js';
import React from 'react';
import { findDOMNode } from 'react-dom';
import { FormField, FormInput, FormNote } from '../../admin/client/App/elemental';
import blacklist from 'blacklist';
import CollapsedFieldLabel from '../components/CollapsedFieldLabel';

/**
 * Checks whether a value is an object.
 * @param {*} arg The value to check.
 * @returns {boolean} Whether the value is an object.
 */
function isObject (arg) {
	return Object.prototype.toString.call(arg) === '[object Object]';
}

/**
 * Validates a spec object.
 * @param {Object} spec The spec to validate.
 * @returns {Object} The validated spec.
 */
function validateSpec (spec) {
	if (!spec) spec = {};
	if (!isObject(spec.supports)) {
		spec.supports = {};
	}
	if (!spec.focusTargetRef) {
		spec.focusTargetRef = 'focusTarget';
	}
	return spec;
}

/**
 * The base class for all field components.
 * @type {Object}
 */
export const Base = {
	/**
	 * Gets the initial state of the component.
	 * @returns {Object} The initial state.
	 */
	getInitialState () {
		return {};
	},
	/**
	 * Gets the default props for the component.
	 * @returns {Object} The default props.
	 */
	getDefaultProps () {
		return {
			adminPath: Keystone.adminPath,
			inputProps: {},
			labelProps: {},
			valueProps: {},
			size: 'full',
		};
	},
	/**
	 * Gets the name of the input.
	 * @param {string} path The path of the input.
	 * @returns {string} The name of the input.
	 */
	getInputName (path) {
		// This correctly creates the path for field inputs, and supports the
		// inputNamePrefix prop that is required for nested fields to work
		return this.props.inputNamePrefix
			? `${this.props.inputNamePrefix}[${path}]`
			: path;
	},
	/**
	 * Handles a change in the value of the input.
	 * @param {Object} event The event object.
	 */
	valueChanged (event) {
		this.props.onChange({
			path: this.props.path,
			value: event.target.value,
		});
	},
	/**
	 * Determines whether the field should be collapsed.
	 * @returns {boolean} Whether the field should be collapsed.
	 */
	shouldCollapse () {
		return this.props.collapse && !this.props.value;
	},
	/**
	 * Determines whether the field should be rendered.
	 * @returns {boolean} Whether the field should be rendered.
	 */
	shouldRenderField () {
		if (this.props.mode === 'create') return true;
		return !this.props.noedit;
	},
	/**
	 * Focuses the field.
	 */
	focus () {
		if (!this.refs[this.spec.focusTargetRef]) return;
		findDOMNode(this.refs[this.spec.focusTargetRef]).focus();
	},
	/**
	 * Renders the note.
	 * @returns {React.Element} The rendered note.
	 */
	renderNote () {
		if (!this.props.note) return null;

		return <FormNote html={this.props.note} />;
	},
	/**
	 * Renders the field.
	 * @returns {React.Element} The rendered field.
	 */
	renderField () {
		const { autoFocus, value, inputProps } = this.props;
		return (
			<FormInput {...{
				...inputProps,
				autoFocus,
				autoComplete: 'off',
				name: this.getInputName(this.props.path),
				onChange: this.valueChanged,
				ref: 'focusTarget',
				value,
			}} />
		);
	},
	/**
	 * Renders the value of the field.
	 * @returns {React.Element} The rendered value.
	 */
	renderValue () {
		return <FormInput noedit>{this.props.value}</FormInput>;
	},
	/**
	 * Renders the UI for the field.
	 * @returns {React.Element} The rendered UI.
	 */
	renderUI () {
		var wrapperClassName = classnames(
			'field-type-' + this.props.type,
			this.props.className,
			{ 'field-monospace': this.props.monospace }
		);
		return (
			<FormField htmlFor={this.props.path} label={this.props.label} className={wrapperClassName} cropLabel>
				<div className={'FormField__inner field-size-' + this.props.size}>
					{this.shouldRenderField() ? this.renderField() : this.renderValue()}
				</div>
				{this.renderNote()}
			</FormField>
		);
	},
};

/**
 * A set of mixins for field components.
 * @type {Object}
 */
export const Mixins = {
	Collapse: {
		/**
		 * Sets the initial collapsed state of the field.
		 */
		componentWillMount () {
			this.setState({
				isCollapsed: this.shouldCollapse(),
			});
		},
		/**
		 * Focuses the field when it is uncollapsed.
		 * @param {Object} prevProps The previous props.
		 * @param {Object} prevState The previous state.
		 */
		componentDidUpdate (prevProps, prevState) {
			if (prevState.isCollapsed && !this.state.isCollapsed) {
				this.focus();
			}
		},
		/**
		 * Uncollapses the field.
		 */
		uncollapse () {
			this.setState({
				isCollapsed: false,
			});
		},
		/**
		 * Renders the collapse button.
		 * @returns {React.Element} The rendered collapse button.
		 */
		renderCollapse () {
			if (!this.shouldRenderField()) return null;
			return (
				<FormField>
					<CollapsedFieldLabel onClick={this.uncollapse}>+ Add {this.props.label.toLowerCase()}</CollapsedFieldLabel>
				</FormField>
			);
		},
	},
};

/**
 * Creates a new field component.
 * @param {Object} spec The spec for the field.
 * @returns {React.Component} The new field component.
 */
export const create = function (spec) {

	spec = validateSpec(spec);

	var field = {
		spec: spec,
		displayName: spec.displayName,
		mixins: [Mixins.Collapse],
		statics: {
			getDefaultValue: function (field) {
				return typeof field.defaultValue !== 'undefined' ? field.defaultValue : '';
			},
		},
		/**
		 * Renders the component.
		 * @returns {React.Element} The rendered component.
		 */
		render () {
			if (!evalDependsOn(this.props.dependsOn, this.props.values)) {
				return null;
			}
			if (this.state.isCollapsed) {
				return this.renderCollapse();
			}
			return this.renderUI();
		},
	};

	if (spec.statics) {
		Object.assign(field.statics, spec.statics);
	}

	var excludeBaseMethods = {};
	if (spec.mixins) {
		spec.mixins.forEach(function (mixin) {
			Object.keys(mixin).forEach(function (name) {
				if (Base[name]) {
					excludeBaseMethods[name] = true;
				}
			});
		});
	}

	Object.assign(field, blacklist(Base, excludeBaseMethods));
	Object.assign(field, blacklist(spec, 'mixins', 'statics'));

	if (Array.isArray(spec.mixins)) {
		field.mixins = field.mixins.concat(spec.mixins);
	}

	return React.createClass(field);

};

export default { create, Base, Mixins };
