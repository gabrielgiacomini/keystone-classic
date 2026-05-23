/* eslint quote-props: ["error", "as-needed"] */

import React from 'react';
import PropTypes from 'prop-types';
import Field from '../FormField/index.mjs';
import Glyph from '../Glyph/index.mjs';

/**
 * A form field that renders a Glyph icon positioned to the left or right of its children.
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - Content rendered inside the field, adjacent to the icon.
 * @param {string} [props.glyph] - Name of the glyph icon to display (validated by the Glyph component).
 * @param {string} [props.glyphColor] - Color of the glyph icon (validated by the Glyph component).
 * @param {string} [props.glyphSize] - Size of the glyph icon (validated by the Glyph component).
 * @param {'left'|'right'} [props.position] - Side on which the icon is rendered relative to children.
 * @returns {React.Element} A Field element containing the positioned Glyph icon and children.
 */
function GlyphField ({
	children,
	glyph,
	glyphColor,
	glyphSize,
	position,
	...props
}) {
	const isLeft = position === 'left';
	const isRight = position === 'right';

	const glyphStyles = {};
	if (isLeft) glyphStyles.marginRight = '0.5em';
	if (isRight) glyphStyles.marginLeft = '0.5em';

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
		<Field cssStyles={classes.wrapper} {...props}>
			{isLeft && icon}
			{children}
			{isRight && icon}
		</Field>
	);
};

// For props "glyph", "glyphColor", and "glyphSize":
// prop type validation will occur within the Glyph component, no need to
// duplicate, just pass it through.
GlyphField.propTypes = {
	glyph: PropTypes.string,
	glyphColor: PropTypes.string,
	glyphSize: PropTypes.string,
	position: PropTypes.oneOf(['left', 'right']),
};
GlyphField.defaultProps = {
	position: 'left',
};

const classes = {
	wrapper: {
		alignItems: 'center',
		display: 'flex',
	},
	glyph: {
		display: 'inline-block',
		marginTop: '-0.125em', // fix icon alignment
		verticalAlign: 'middle',
	},
};

export default GlyphField;
