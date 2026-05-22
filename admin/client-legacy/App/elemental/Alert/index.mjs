import { css } from 'glamor';
import React, { cloneElement, Children, PropTypes } from 'react';
import classes from './styles.mjs';
import colors from './colors.mjs';

// clone children if a class exists for the tagname
const cloneWithClassnames = (c) => {
	const type = c.type && c.type.displayName
		? c.type.displayName
		: c.type || null;

	if (!type || !classes[type]) return c;

	return cloneElement(c, {
		className: css(classes[type]),
	});
};

/**
 * Alert component that renders a styled notification block.
 *
 * Applies colour-coded styles based on the `color` prop and clones child
 * elements with their associated elemental class names where available.
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - Content to render inside the alert.
 * @param {string} [props.className] - Additional CSS class names to apply.
 * @param {'danger'|'error'|'info'|'success'|'warning'} props.color - Alert colour variant.
 * @param {string|((props: object) => React.Element)} [props.component] - HTML tag name or React component to render as the root element. Defaults to `'div'`.
 * @returns {React.Element} The rendered alert element.
 */
function Alert ({
	children,
	className,
	color,
	component: Component,
	...props
}) {
	props.className = css(
		classes.alert,
		classes[color],
		className
	);
	props.children = Children.map(children, cloneWithClassnames);

	return <Component {...props} data-alert-type={color} />;
};

Alert.propTypes = {
	color: PropTypes.oneOf(Object.keys(colors)).isRequired,
	component: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string,
	]),
};
Alert.defaultProps = {
	component: 'div',
};

export default Alert;
