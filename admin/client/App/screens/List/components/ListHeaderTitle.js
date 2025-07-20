/**
 * @fileoverview This file contains the ListHeaderTitle component, which is used
 * to render the title of the list header.
 */
import { css } from 'glamor';
import React, { PropTypes } from 'react';
import theme from '../../../../theme';

import ListSort from './ListSort';

/**
 * Renders the title of the list header.
 *
 * @param {object} props The properties for the component.
 * @param {object} props.activeSort The active sort.
 * @param {array} props.availableColumns The available columns.
 * @param {function} props.handleSortSelect The function to call when a sort is selected.
 * @param {string} props.title The title of the list.
 * @returns {React.Element} The rendered component.
 */
function ListHeaderTitle ({
	activeSort,
	availableColumns,
	handleSortSelect,
	title,
	...props
}) {
	return (
		<h2 className={css(classes.heading)} {...props}>
			{title}
			<ListSort
				activeSort={activeSort}
				availableColumns={availableColumns}
				handleSortSelect={handleSortSelect}
			/>
		</h2>
	);
};

ListHeaderTitle.propTypes = {
	activeSort: PropTypes.object,
	availableColumns: PropTypes.arrayOf(PropTypes.object),
	handleSortSelect: PropTypes.func.isRequired,
	title: PropTypes.string,
};

/**
 * The styles for the component.
 */
const classes = {
	heading: {
		[`@media (max-width: ${theme.breakpoint.mobileMax})`]: {
			fontSize: '1.25em',
			fontWeight: 500,
		},
	},
};

module.exports = ListHeaderTitle;
