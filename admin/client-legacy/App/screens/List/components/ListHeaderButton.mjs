import { css } from 'glamor';
import React, { PropTypes } from 'react';
import { DropdownButton, Glyph } from '../../../elemental/index.mjs';

/**
 * A responsive toolbar button that shows a glyph icon on narrow screens and a
 * text label on wider screens.
 * @param {object} props - Component props.
 * @param {string} [props.className] - Additional CSS class name.
 * @param {string} [props.label] - Text label shown on wider screens.
 * @param {string} props.glyph - Name of the Glyph icon shown on narrow screens.
 * @returns {React.Element} A DropdownButton containing a glyph and a label span.
 */
function ListHeaderButton ({ className, label, glyph, ...props }) {
	return (
		<DropdownButton block {...props}>
			<Glyph name={glyph} cssStyles={classes.glyph} />
			<span className={css(classes.label)}>{label}</span>
		</DropdownButton>
	);
};

ListHeaderButton.propTypes = {
	glyph: PropTypes.string.isRequired,
};

// show an icon on small screens where real estate is precious
// otherwise render the label
const classes = {
	glyph: {
		'display': 'none',

		'@media (max-width: 500px)': {
			display: 'inline-block',
		},
	},
	label: {
		'display': 'inline-block',

		'@media (max-width: 500px)': {
			display: 'none',
		},
	},
};

export default ListHeaderButton;
