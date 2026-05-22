import React, { PropTypes } from 'react';
import { css } from 'glamor';
import classes from './styles.mjs';

/**
 * Renders a container element with centering styles applied.
 *
 * Merges the glamor-based centering class with any additional `className`
 * and sets the `height` on the inline style before forwarding all remaining
 * props to the underlying `component`.
 * @param {object} props - Component props.
 * @param {string} [props.className] - Additional CSS class to merge with the centering style.
 * @param {(string|((props: object) => React.Element))} [props.component] - HTML tag name or React component to render; defaults to 'div'.
 * @param {number|string} [props.height] - CSS height value applied via inline style. Defaults to 'auto'.
 * @param {object} [props.style] - Additional inline styles merged with the height style.
 * @returns {React.Element} The rendered component with centering styles applied.
 */
function Center ({
	className,
	component: Component,
	height,
	style,
	...props
}) {
	props.className = css(classes.center, className);
	props.style = { height, ...style };

	return <Component {...props} />;
};
Center.propTypes = {
	component: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string,
	]),
	height: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string,
	]),
};
Center.defaultProps = {
	component: 'div',
	height: 'auto',
};

export default Center;
