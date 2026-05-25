/* eslint quote-props: ["error", "as-needed"] */

import React from 'react';
import PropTypes from 'prop-types';
import Button from '../Button/index.mjs';
import Glyph from '../Glyph/index.mjs';

/**
 * A Button that renders an inline Glyph icon alongside its children.
 *
 * The icon is positioned to the left of children when `position` is 'default'
 * or 'left', and to the right when `position` is 'right'. An automatic
 * horizontal margin offset is applied to separate the icon from the text.
 * All extra props are forwarded to the underlying Button component.
 * @param {object} props - Component props.
 * @param {React.Node} [props.children] - Content rendered between or after the icon.
 * @param {string} [props.glyph] - Name of the glyph icon to render (validated by Glyph).
 * @param {string} [props.glyphColor] - Color passed to the Glyph component.
 * @param {string} [props.glyphSize] - Size passed to the Glyph component.
 * @param {object} [props.glyphStyle] - Additional inline styles merged onto the Glyph.
 * @param {'default'|'left'|'right'} [props.position] - Icon placement; 'default' and 'left' place the icon before children, 'right' places it after. Defaults to 'default'.
 * @returns {React.Element} A Button element containing the positioned icon and children.
 */
function GlyphButton ({
	children,
	glyph,
	glyphColor,
	glyphSize,
	glyphStyle,
	position,
	...props
}) {
	const isDefault = position === 'default';
	const isLeft = position === 'left';
	const isRight = position === 'right';

	const offset = {};
	if (isLeft) offset.marginRight = '0.5em';
	if (isRight) offset.marginLeft = '0.5em';

	const glyphStyles = {
		...offset,
		...glyphStyle,
	};

	const icon = (
		<Glyph
			cssStyles={classes.glyph}
			color={glyphColor}
			name={glyph}
			size={glyphSize}
			style={glyphStyles}
		/>
	);

	return (
		<Button {...props}>
			{(isDefault || isLeft) && icon}
			{children}
			{isRight && icon}
		</Button>
	);
};

// For props "glyph", "glyphColor", and "glyphSize":
// prop type validation will occur within the Glyph component, no need to
// duplicate, just pass it through.
GlyphButton.propTypes = {
	glyph: PropTypes.string,
	glyphColor: PropTypes.string,
	glyphSize: PropTypes.string,
	glyphStyle: PropTypes.object,
	position: PropTypes.oneOf(['default', 'left', 'right']),
};
GlyphButton.defaultProps = {
	glyphStyle: {},
	position: 'default', // no margin, assumes no children
};

const classes = {
	glyph: {
		display: 'inline-block',
		marginTop: '-0.125em', // fix icon alignment
		verticalAlign: 'middle',
	},
};

export default GlyphButton;
