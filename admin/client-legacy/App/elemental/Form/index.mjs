import { css } from 'glamor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classes from './styles.mjs';

/**
 * A form wrapper component that provides layout context to its children.
 * Renders an arbitrary container element with glamor-generated class names
 * derived from the chosen layout variant.
 */
class Form extends Component {
	/**
	 * Exposes `formLayout` and `labelWidth` to the React context so that
	 * descendant form controls can read them without explicit prop drilling.
	 * @returns {{ formLayout: string, labelWidth: number|string }} Child context object.
	 */
	getChildContext () {
		return {
			formLayout: this.props.layout,
			labelWidth: this.props.labelWidth,
		};
	}
	/**
	 * Renders the configured container element with the computed glamor className
	 * that reflects the active layout variant.
	 * @returns {React.Element} The rendered container element.
	 */
	render () {
		// NOTE `labelWidth` is destructured only to exclude it from the forwarded props
		const {
			className,
			component: Component,
			labelWidth,
			layout,
			...props
		} = this.props;

		const generatedClassName = css(
			classes.Form,
			classes['Form__' + layout]
		);
		props.className = [
			'Form',
			layout ? `Form--${layout}` : null,
			generatedClassName,
			className,
		].filter(Boolean).join(' ');

		return <Component {...props} />;
	}
};

Form.childContextTypes = {
	formLayout: PropTypes.oneOf(['basic', 'horizontal', 'inline']),
	labelWidth: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string,
	]),
};
Form.propTypes = {
	children: PropTypes.node.isRequired,
	component: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.func,
	]),
	layout: PropTypes.oneOf(['basic', 'horizontal', 'inline']),
};
Form.defaultProps = {
	component: 'form',
	layout: 'basic',
};

export default Form;
