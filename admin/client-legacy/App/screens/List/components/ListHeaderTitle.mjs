import { css } from 'glamor';
import React, { PropTypes } from 'react';
import theme from '../../../../theme.mjs';

import ListSort from './ListSort.mjs';

/**
 * Renders the list screen heading together with the ListSort popout for changing
 * the active sort order.
 * @param {object} props - Component props.
 * @param {object} [props.activeSort] - The currently active sort descriptor.
 * @param {object[]} [props.availableColumns] - All columns available for sorting.
 * @param {function(string): void} props.handleSortSelect - Called when the user selects a new sort column.
 * @param {string} [props.title] - The list name displayed as the heading text.
 * @returns {React.Element} An h2 heading element containing the title and sort control.
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

const classes = {
	heading: {
		[`@media (max-width: ${theme.breakpoint.mobileMax})`]: {
			fontSize: '1.25em',
			fontWeight: 500,
		},
	},
};

export default ListHeaderTitle;
