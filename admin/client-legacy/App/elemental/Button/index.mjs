import { css } from 'glamor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as styles from './styles.mjs';

const commonClasses = styles.common;
const stylesheetCache = {};
function getStyleSheet (variant, color) {
	const cacheKey = `${variant}-${color}`;
	if (!stylesheetCache[cacheKey]) {
		const variantStyles = styles[variant](color);
		stylesheetCache[cacheKey] = variantStyles;
	}
	return stylesheetCache[cacheKey];
}

const BUTTON_SIZES = ['large', 'medium', 'small', 'xsmall'];
const BUTTON_VARIANTS = ['fill', 'hollow', 'link'];
const BUTTON_COLORS = ['default', 'primary', 'success', 'warning', 'danger', 'cancel', 'delete'];

// NOTE must NOT be functional component to allow `refs`

/**
 * A styled button component that renders as a `<button>`, `<a>`, or any
 * custom element. Supports multiple visual variants, sizes, and colors via
 * Glamor-generated CSS class names. Must be a class component so that callers
 * can attach React refs to the underlying DOM node.
 */
class Button extends Component {
	/**
	 * Renders the button element.
	 *
	 * Resolves the Glamor CSS class names for the requested variant and color,
	 * merges any additional `cssStyles` and `className` values, then returns
	 * the appropriate element. When `component` is omitted the tag is `<a>`
	 * if an `href` prop is present, otherwise `<button>`. A `type="button"`
	 * attribute is added automatically to `<button>` elements that do not
	 * already carry a `type`, preventing accidental form submission.
	 * @returns {React.Element} The rendered button element.
	 */
	render () {
		const {
			active,
			cssStyles,
			block,
			className,
			color,
			component,
			disabled,
			size,
			variant,
			...props
		} = this.props;
		let Tag = component;

		// get the styles
		const variantClasses = getStyleSheet(variant, color);
		props.className = css(
			commonClasses.base,
			commonClasses[size],
			variantClasses.base,
			block ? commonClasses.block : null,
			disabled ? commonClasses.disabled : null,
			active ? variantClasses.active : null,
			...cssStyles
		);
		if (className) {
			props.className += (' ' + className);
		}

		// return an anchor or button
		if (!Tag) {
			Tag = props.href ? 'a' : 'button';
		}
		// Ensure buttons don't submit by default
		if (Tag === 'button' && !props.type) {
			props.type = 'button';
		}

		return <Tag {...props} />;
	}
};

Button.propTypes = {
	active: PropTypes.bool,
	block: PropTypes.bool,
	color: PropTypes.oneOf(BUTTON_COLORS),
	component: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string,
	]),
	cssStyles: PropTypes.arrayOf(PropTypes.shape({
		_definition: PropTypes.object,
		_name: PropTypes.string,
	})),
	disabled: PropTypes.bool,
	href: PropTypes.string,
	size: PropTypes.oneOf(BUTTON_SIZES),
	variant: PropTypes.oneOf(BUTTON_VARIANTS),
};
Button.defaultProps = {
	cssStyles: [],
	color: 'default',
	variant: 'fill',
};

export default Button;
