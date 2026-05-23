import { css } from 'glamor';
import React from 'react';
import PropTypes from 'prop-types';
import theme from '../../../../theme.mjs';
import { darken } from '../../../../utils/color.mjs';

import { FormInput, Glyph } from '../../../elemental/index.mjs';

/**
 * A search input with an inline clear/search icon button. When the input is
 * empty the icon is a search glyph; once text is present it becomes an X that
 * clears the query on click.
 * @param {object} props - Component props.
 * @param {boolean} [props.focusInput] - Whether the input should receive focus on mount.
 * @param {function(Event): void} props.handleChange - Called with the change event on each keystroke.
 * @param {function(): void} props.handleClear - Called when the clear (X) button is clicked.
 * @param {function(Event): void} props.handleKeyup - Called with the keyup event on each key release.
 * @param {string} [props.value] - The current search query string.
 * @returns {React.Element} The search input wrapper element.
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
				onClick={value.length ? handleClear : undefined}
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

const clearHoverAndFocusStyles = {
	color: theme.color.danger,
	outline: 0,
	textDecoration: 'none',
};

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

export default ListHeaderSearch;
