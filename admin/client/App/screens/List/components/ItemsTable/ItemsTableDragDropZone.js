/**
 * @fileoverview This file contains the ItemsTableDragDropZone component, which
 * is used to render the drag and drop zone for the items table.
 *
 * This component is currently orphaned and not rendered. It was created to
 * finish the Redux integration and will be rewritten soon.
 */
import React from 'react';
import DropZoneTarget from './ItemsTableDragDropZoneTarget';
import classnames from 'classnames';

/**
 * Renders the drag and drop zone for the items table.
 *
 * @param {object} props The properties for the component.
 * @param {array} props.columns The columns of the table.
 * @param {function} props.connectDropTarget The function to connect the drop target.
 * @param {object} props.items The items in the table.
 * @param {object} props.list The list object.
 * @returns {React.Element} The rendered component.
 */
var ItemsTableDragDropZone = React.createClass({
	displayName: 'ItemsTableDragDropZone',
	propTypes: {
		columns: React.PropTypes.array,
		connectDropTarget: React.PropTypes.func,
		items: React.PropTypes.object,
		list: React.PropTypes.object,
	},
	/**
	 * Renders the page drops.
	 *
	 * @returns {React.Element} The rendered page drops.
	 */
	renderPageDrops () {
		const { items, currentPage, pageSize } = this.props;

		const totalPages = Math.ceil(items.count / pageSize);
		const style = { display: totalPages > 1 ? null : 'none' };

		const pages = [];
		for (let i = 0; i < totalPages; i++) {
			const page = i + 1;
			const pageItems = '' + (page * pageSize - (pageSize - 1)) + ' - ' + (page * pageSize);
			const current = (page === currentPage);
			const className = classnames('ItemList__dropzone--page', {
				'is-active': current,
			});
			pages.push(
				<DropZoneTarget
					key={'page_' + page}
					page={page}
					className={className}
					pageItems={pageItems}
					pageSize={pageSize}
					currentPage={currentPage}
					drag={this.props.drag}
					dispatch={this.props.dispatch}
				/>
			);
		}

		let cols = this.props.columns.length;
		if (this.props.list.sortable) cols++;
		if (!this.props.list.nodelete) cols++;
		return (
			<tr style={style}>
				<td colSpan={cols} >
					<div className="ItemList__dropzone" >
						{pages}
						<div className="clearfix" />
					</div>
				</td>
			</tr>
		);
	},
	/**
	 * Renders the component.
	 *
	 * @returns {React.Element} The rendered component.
	 */
	render () {
		return this.renderPageDrops();
	},
});

module.exports = ItemsTableDragDropZone;
