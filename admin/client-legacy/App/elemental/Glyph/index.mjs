import { css } from 'glamor';
import React from 'react';
import PropTypes from 'prop-types';

import octicons from './octicons.mjs';
import colors from './colors.mjs';
import sizes from './sizes.mjs';
import classes from './styles.mjs';

// FIXME static octicon classes leaning on Elemental to avoid duplicate
// font and CSS; inflating the project size

/**
 * Renders an octicon glyph icon as a configurable component.
 *
 * Applies glamor-generated class names for the base glyph style, the chosen
 * predefined color variant, and the chosen size variant, then appends the
 * octicon-specific CSS class for the requested icon name.  When `color` is not
 * one of the predefined color keys it is applied as an inline `color` style
 * instead, allowing arbitrary CSS color strings.
 * @param {object} props - Component props.
 * @param {object} [props.cssStyles] - A glamor style object merged into the generated class name.
 * @param {string} [props.className] - Additional CSS class names appended after the generated ones.
 * @param {string} [props.color] - Predefined color key or any CSS color string. Defaults to 'inherit'.
 * @param {string} [props.component] - HTML tag or React component used as the root element. Defaults to 'i'.
 * @param {string} props.name - Octicon icon name; must be a key of the octicons map.
 * @param {string} [props.size] - Predefined size key from the sizes map. Defaults to 'small'.
 * @param {object} [props.style] - Inline styles merged with the generated color style.
 * @returns {React.Element} The rendered icon element.
 */
function Glyph ({
	cssStyles,
	className,
	color,
	component: Component,
	name,
	size,
	style,
	...props
}) {
	const colorIsValidType = Object.keys(colors).includes(color);
	props.className = css(
		classes.glyph,
		colorIsValidType && classes['color__' + color],
		classes['size__' + size],
		cssStyles
	) + ` ${octicons[name]}`;
	if (className) {
		props.className += (' ' + className);
	}

	// support random color strings
	props.style = {
		color: !colorIsValidType ? color : null,
		...style,
	};

	return <Component {...props} />;
};

Glyph.propTypes = {
	color: PropTypes.oneOfType([
		PropTypes.oneOf(Object.keys(colors)),
		PropTypes.string, // support random color strings
	]),
	cssStyles: PropTypes.shape({
		_definition: PropTypes.object,
		_name: PropTypes.string,
	}),
	name: PropTypes.oneOf(Object.keys(octicons)).isRequired,
	size: PropTypes.oneOf(Object.keys(sizes)),
};
Glyph.defaultProps = {
	component: 'i',
	color: 'inherit',
	size: 'small',
};

export default Glyph;
