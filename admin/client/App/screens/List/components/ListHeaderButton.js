/**
 * @fileoverview This file contains the ListHeaderButton component, which is
 * used to render a button in the list header.
 */
import { css } from 'glamor';
import React, { PropTypes } from 'react';
import { DropdownButton, Glyph } from '../../../elemental';

/**
 * Renders a button in the list header.
 *
 * @param {object} props The properties for the component.
 * @param {string} props.className The class name for the component.
 * @param {string} props.label The label for the button.
 * @param {string} props.glyph The glyph for the button.
 * @returns {React.Element} The rendered component.
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

/**
 * The styles for the component.
 */
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

module.exports = ListHeaderButton;
