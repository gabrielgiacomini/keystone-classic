/**
 * @file
 * This file defines the `Field` component, which is the base class for all
 * field components in the KeystoneJS Admin UI.
 *
 * It provides the basic functionality for a field, such as rendering the
 * label, note, and value of the field.
 *
 * It is not meant to be used directly, but should be extended by other field
 * components.
 */
import classnames from '../utils/classnames.mjs';
import evalDependsOn from '../utils/evalDependsOn.mjs';
import React from 'react';
import FormField from '../../admin/client-legacy/App/elemental/FormField/index.mjs';
import FormInput from '../../admin/client-legacy/App/elemental/FormInput/index.mjs';
import FormNote from '../../admin/client-legacy/App/elemental/FormNote/index.mjs';
import CollapsedFieldLabel from '../components/CollapsedFieldLabel.mjs';

/**
 * Checks whether a value is an object.
 * @param {unknown} arg The value to check.
 * @returns {boolean} Whether the value is an object.
 */
function isObject (arg) {
	return Object.prototype.toString.call(arg) === '[object Object]';
}

/**
 * Validates a spec object.
 * @param {object} spec The spec to validate.
 * @returns {object} The validated spec.
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
 * @type {object}
 */
export const Base = {
	/**
	 * Gets the initial state of the component.
	 * @returns {object} The initial state.
	 */
	getInitialState () {
		return {};
	},
	/**
	 * Gets the default props for the component.
	 * @returns {object} The default props.
	 */
	getDefaultProps () {
		return {
			adminLegacyPath: Keystone.adminLegacyPath,
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
	 * @param {object} event The event object.
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
		const focusTarget = this.focusTargetRefs && this.focusTargetRefs[this.spec.focusTargetRef];
		if (focusTarget && typeof focusTarget.focus === 'function') {
			focusTarget.focus();
		}
	},
	/**
	 * Stores an imperative focus target for fields that override `renderField`.
	 * @param {string} name The focus target name from the field spec.
	 * @param {object|null} target The component or DOM node that supports `focus()`.
	 */
	setFocusTargetRef (name, target) {
		this.focusTargetRefs = this.focusTargetRefs || {};
		this.focusTargetRefs[name] = target;
	},
	/**
	 * Returns a callback ref for a named focus target.
	 * @param {string} name The focus target name from the field spec.
	 * @returns {function(object|null): void} Callback ref.
	 */
	getFocusTargetRef (name = this.spec.focusTargetRef) {
		return (target) => {
			this.setFocusTargetRef(name, target);
		};
	},
	/**
	 * Renders the note.
	 * @returns {React.Element} The rendered note.
	 */
	renderNote () {
		if (!this.props.note) return null;

		return React.createElement(FormNote, { html: this.props.note });
	},
	/**
	 * Renders the field.
	 * @returns {React.Element} The rendered field.
	 */
	renderField () {
		const { autoFocus, value, inputProps } = this.props;
		return React.createElement(
			FormInput,
			{
				...inputProps,
				autoFocus,
				autoComplete: 'off',
				name: this.getInputName(this.props.path),
				onChange: this.valueChanged,
				ref: this.getFocusTargetRef(),
				value,
			}
		);
	},
	/**
	 * Renders the value of the field.
	 * @returns {React.Element} The rendered value.
	 */
	renderValue () {
		return React.createElement(FormInput, { noedit: true }, this.props.value);
	},
	/**
	 * Renders the UI for the field.
	 * @returns {React.Element} The rendered UI.
	 */
	renderUI () {
		const wrapperClassName = classnames(
			'field-type-' + this.props.type,
			this.props.className,
			{ 'field-monospace': this.props.monospace }
		);
		return React.createElement(
			FormField,
			{
				htmlFor: this.props.path,
				label: this.props.label,
				className: wrapperClassName,
				cropLabel: true,
			},
			React.createElement(
				'div',
				{ className: 'FormField__inner field-size-' + this.props.size },
				this.shouldRenderField() ? this.renderField() : this.renderValue()
			),
			this.renderNote()
		);
	},
};

/**
 * A set of mixins for field components.
 * @type {object}
 */
export const Mixins = {
	Collapse: {
		/**
		 * Sets the initial collapsed state of the field.
		 */
		getInitialState () {
			return {
				isCollapsed: this.shouldCollapse(),
			};
		},
		/**
		 * Focuses the field when it is uncollapsed.
		 * @param {object} prevProps The previous props.
		 * @param {object} prevState The previous state.
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
			return React.createElement(
				FormField,
				null,
				React.createElement(
					CollapsedFieldLabel,
					{ onClick: this.uncollapse },
					'+ Add ',
					this.props.label.toLowerCase()
				)
			);
		},
	},
};

const LIFECYCLE_METHODS = new Set([
	'componentDidMount',
	'componentDidUpdate',
	'componentWillUnmount',
]);

function mergeState (target, source) {
	if (!source) return target;
	return Object.assign(target, source);
}

function getMethodsFromDefinitions (definitions) {
	const methods = {};
	const lifecycles = {};
	const initialStateGetters = [];

	definitions.forEach((definition) => {
		Object.entries(definition).forEach(([name, value]) => {
			if (name === 'getDefaultProps' || name === 'statics' || name === 'mixins') return;

			if (name === 'getInitialState') {
				initialStateGetters.push(value);
				return;
			}

			if (LIFECYCLE_METHODS.has(name) && typeof value === 'function') {
				if (!lifecycles[name]) lifecycles[name] = [];
				lifecycles[name].push(value);
				return;
			}

			methods[name] = value;
		});
	});

	Object.entries(lifecycles).forEach(([name, handlers]) => {
		methods[name] = function (...args) {
			handlers.forEach((handler) => handler.apply(this, args));
		};
	});

	if (initialStateGetters.length) {
		methods.getInitialState = function () {
			return initialStateGetters.reduce((state, getter) => {
				return mergeState(state, getter.call(this));
			}, {});
		};
	}

	return methods;
}

function getDefaultPropsFromDefinitions (definitions) {
	return definitions.reduce((props, definition) => {
		if (typeof definition.getDefaultProps !== 'function') return props;
		return Object.assign(props, definition.getDefaultProps());
	}, {});
}

function bindMethods (component, methods) {
	Object.entries(methods).forEach(([name, value]) => {
		if (name === 'render' || typeof value !== 'function') return;
		component[name] = value.bind(component);
	});
}

/**
 * Creates a new field component.
 * @param {object} spec The spec for the field.
 * @returns {React.Component} The new field component.
 */
export function create (spec) {

	spec = validateSpec(spec);

	const field = {
		spec: spec,
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

	const excludeBaseMethods = {};
	if (spec.mixins) {
		spec.mixins.forEach(function (mixin) {
			Object.keys(mixin).forEach(function (name) {
				if (Base[name]) {
					excludeBaseMethods[name] = true;
				}
			});
		});
	}

	Object.assign(field, Object.fromEntries(Object.entries(Base).filter(([k]) => !excludeBaseMethods[k])));
	const { mixins: _m, statics: _s, ...specRest } = spec;
	Object.assign(field, specRest);

	const definitions = [Mixins.Collapse].concat(Array.isArray(spec.mixins) ? spec.mixins : [], field);
	const methods = getMethodsFromDefinitions(definitions);
	const statics = field.statics;

	class FieldComponent extends React.Component {
		constructor(props) {
			super(props);
			Object.entries(methods).forEach(([name, value]) => {
				if (typeof value !== 'function') {
					this[name] = value;
				}
			});
			bindMethods(this, methods);
			this.spec = spec;
			this.state = methods.getInitialState ? methods.getInitialState.call(this) : {};
		}
	}

	Object.entries(methods).forEach(([name, value]) => {
		FieldComponent.prototype[name] = value;
	});
	Object.assign(FieldComponent, statics);
	FieldComponent.displayName = spec.displayName;
	FieldComponent.defaultProps = getDefaultPropsFromDefinitions(definitions);

	return FieldComponent;

};

export default { Base, Mixins, create };
