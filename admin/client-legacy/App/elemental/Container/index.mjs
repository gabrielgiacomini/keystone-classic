import { css } from 'glamor';
import React from 'react';
import PropTypes from 'prop-types';
import classes from './styles.mjs';
import sizes from './sizes.mjs';

/**
 * A layout container component that applies glamor CSS classes for width sizing
 * and an optional clearfix, then renders the given component element with the
 * composed className and any remaining props.
 * @param {object} props - Component props.
 * @param {string} [props.className] - Additional CSS class name(s) to merge.
 * @param {boolean} [props.clearFloatingChildren] - When true, appends a clearfix class to clear floated children.
 * @param {React.Component|string} props.component - The element type or component to render (defaults to 'div').
 * @param {string} props.width - Container width variant; one of the keys defined in sizes ('small', 'medium', 'large'). Defaults to 'large'.
 * @returns {React.Element} The rendered component element.
 */
function Container ({
	className,
	clearFloatingChildren,
	component: Component,
	width,
	...props
}) {
	props.className = css(
		classes.container,
		classes[width],
		clearFloatingChildren ? classes.clearfix : null,
		className
	);

	return <Component {...props} />;
};

Container.propTypes = {
	clearFloatingChildren: PropTypes.bool,
	component: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string,
	]).isRequired,
	width: PropTypes.oneOf(Object.keys(sizes)).isRequired,
};
Container.defaultProps = {
	component: 'div',
	width: 'large',
};

export default Container;
