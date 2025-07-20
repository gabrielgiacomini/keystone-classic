/**
 * @fileoverview This file contains the ListHeaderSearch component, which is
 * used to render the search input in the list header.
 */
import { css } from 'glamor';
import React, { PropTypes } from 'react';
import theme from '../../../../theme';
import { darken } from '../../../../utils/color';

import { FormInput, Glyph } from '../../../elemental';

/**
 * Renders the search input in the list header.
 *
 * @param {object} props The properties for the component.
 * @param {boolean} props.focusInput Whether to focus the input.
 * @param {function} props.handleChange The function to call when the input changes.
 * @param {function} props.handleClear The function to call when the clear button is clicked.
 * @param {function} props.handleKeyup The function to call when a key is released.
 * @param {string} props.value The value of the input.
 * @returns {React.Element} The rendered component.
 */
function ListHeaderSearch ({
	focusInput,
	handleChange,
	handleClear,
	handleKeyup,
	value,
	...props
}) {
	return (
		<div {...props} className={css(classes.wrapper)}>
			<FormInput
				data-search-input-field
				onChange={handleChange}
				onKeyUp={handleKeyup}
				placeholder="Search"
				value={value}
			/>
			<button
				className={css(classes.icon, !!value.length && classes.iconWhenClear)}
				data-search-input-field-clear-icon
				disabled={!value.length}
				onClick={value.length && handleClear}
				title="Clear search query"
				type="button"
			>
				<Glyph name={value.length ? 'x' : 'search'} />
			</button>
		</div>
	);
};

ListHeaderSearch.propTypes = {
	focusInput: PropTypes.bool,
	handleChange: PropTypes.func.isRequired,
	handleClear: PropTypes.func.isRequired,
	handleKeyup: PropTypes.func.isRequired,
	value: PropTypes.string,
};

/**
 * The styles for the clear button on hover and focus.
 */
const clearHoverAndFocusStyles = {
	color: theme.color.danger,
	outline: 0,
	textDecoration: 'none',
};

/**
 * The styles for the component.
 */
const classes = {
	wrapper: {
		position: 'relative',
	},
	icon: {
		background: 'none',
		border: 'none',
		color: theme.color.gray40,
		height: '100%',
		position: 'absolute',
		right: 0,
		textAlign: 'center',
		top: 0,
		width: '2.2em',
		zIndex: 2, // above the form field on focus
	},
	iconWhenClear: {
		':hover': clearHoverAndFocusStyles,
		':focus': clearHoverAndFocusStyles,
		':active': {
			color: darken(theme.color.danger, 10),
		},
	},
};

module.exports = ListHeaderSearch;
