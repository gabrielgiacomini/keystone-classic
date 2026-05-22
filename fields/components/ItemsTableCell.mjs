import React from 'react';
import classnames from 'classnames';

/**
 * A `<td>` element styled as a column in the items list table.
 *
 * Merges the `'ItemList__col'` class with any caller-supplied `className` and
 * forwards all remaining props to the underlying `<td>`.
 * @param {object} props - Component props.
 * @param {string} [props.className] - Additional CSS class names to append.
 * @returns {React.Element} A `<td>` with the `ItemList__col` class applied.
 */
function ItemsTableCell ({ className, ...props }) {
	props.className = classnames('ItemList__col', className);

	return <td {...props} />;
};

export default ItemsTableCell;
