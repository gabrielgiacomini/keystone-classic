import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { Sortable } from './ItemsTableRow.mjs';
import DropZone from './ItemsTableDragDropZone.mjs';

const ItemsTableDragDrop = createReactClass({
	displayName: 'ItemsTableDragDrop',
	propTypes: {
		columns: PropTypes.array,
		id: PropTypes.any,
		index: PropTypes.number,
		items: PropTypes.object,
		list: PropTypes.object,
	},
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

export default DragDropContext(HTML5Backend)(ItemsTableDragDrop);
