/**
 * @fileoverview This file contains the ItemsTableDragDrop component, which is
 * used to render the drag and drop functionality for the items table.
 */
import React from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { Sortable } from './ItemsTableRow';
import DropZone from './ItemsTableDragDropZone';

/**
 * Renders the drag and drop functionality for the items table.
 *
 * @param {object} props The properties for the component.
 * @param {array} props.columns The columns of the table.
 * @param {any} props.id The id of the item.
 * @param {number} props.index The index of the item.
 * @param {object} props.items The items in the table.
 * @param {object} props.list The list object.
 * @returns {React.Element} The rendered component.
 */
var ItemsTableDragDrop = React.createClass({
	displayName: 'ItemsTableDragDrop',
	propTypes: {
		columns: React.PropTypes.array,
		id: React.PropTypes.any,
		index: React.PropTypes.number,
		items: React.PropTypes.object,
		list: React.PropTypes.object,
	},
	/**
	 * Renders the component.
	 *
	 * @returns {React.Element} The rendered component.
	 */
	render () {
		return (
			<tbody >
				{this.props.items.results.map((item, i) => {
					return (
						<Sortable key={item.id}
							index={i}
							sortOrder={item.sortOrder || 0}
							id={item.id}
							item={item}
							{...this.props}
						/>
					);
				})}
				<DropZone {...this.props} />
			</tbody>
		);
	},
});

module.exports = DragDropContext(HTML5Backend)(ItemsTableDragDrop);
