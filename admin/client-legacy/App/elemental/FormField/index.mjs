import { css } from 'glamor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classes from './styles.mjs';
import FormLabel from '../FormLabel/index.mjs';

/**
 * A form field wrapper component that renders a labelled container around its
 * children. Generates a unique `formFieldId` and exposes it via React child
 * context so descendant inputs can synchronise their `id`/`htmlFor` attributes
 * without requiring the parent to pass the value down manually.
 */
class FormField extends Component {
	/**
	 * Initialises the component and assigns a randomly-generated `formFieldId`
	 * that is stable for the lifetime of the instance.
	 */
	constructor () {
		super();
		this.formFieldId = generateId();
	}
	/**
	 * Provides the generated `formFieldId` to all descendant components through
	 * React's legacy context API.
	 * @returns {object} Child context object containing `formFieldId`.
	 */
	getChildContext () {
		return {
			formFieldId: this.formFieldId,
		};
	}
	/**
	 * Renders a `<div>` wrapper that applies glamor-generated CSS classes based
	 * on the current form layout and an optional `<FormLabel>` when a `label`
	 * prop is provided. When `offsetAbsentLabel` is true and `labelWidth` is
	 * available in context, the wrapper receives a matching `paddingLeft` to
	 * align labelless fields with labelled siblings.
	 * @returns {React.Element} The rendered form-field container element.
	 */
	render () {
		const { formLayout = 'basic', labelWidth } = this.context;
		const {
			cssStyles,
			children,
			className,
			cropLabel,
			htmlFor,
			label,
			offsetAbsentLabel,
			...props
		} = this.props;

		props.className = css(
			classes.FormField,
			classes['FormField--form-layout-' + formLayout],
			offsetAbsentLabel ? classes['FormField--offset-absent-label'] : null,
			cssStyles
		);
		if (className) {
			props.className += (' ' + className);
		}
		if (offsetAbsentLabel && labelWidth) {
			props.style = {
				paddingLeft: labelWidth,
				...props.style,
			};
		}

		// elements
		const componentLabel = label ? (
			<FormLabel htmlFor={htmlFor} cropText={cropLabel}>
				{label}
			</FormLabel>
		) : null;

		return (
			<div {...props} htmlFor={htmlFor}>
				{componentLabel}
				{children}
			</div>
		);
	}
};

const stylesShape = {
	_definition: PropTypes.object,
	_name: PropTypes.string,
};

FormField.contextTypes = {
	formLayout: PropTypes.oneOf(['basic', 'horizontal', 'inline']),
	labelWidth: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string,
	]),
};
FormField.childContextTypes = {
	formFieldId: PropTypes.string,
};
FormField.propTypes = {
	children: PropTypes.node,
	cropLabel: PropTypes.bool,
	cssStyles: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.shape(stylesShape)),
		PropTypes.shape(stylesShape),
	]),
	htmlFor: PropTypes.string,
	label: PropTypes.string,
	offsetAbsentLabel: PropTypes.bool,
};

function generateId () {
	return Math.random().toString(36).slice(2, 11);
};

export default FormField;
