/**
 * THIS IS ORPHANED AND ISN'T RENDERED AT THE MOMENT
 * THIS WAS DONE TO FINISH THE REDUX INTEGRATION, WILL REWRITE SOON
 * - `@mxstbr`
 */

import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import DropZoneTarget from './ItemsTableDragDropZoneTarget.mjs';
import classnames from 'classnames';

const ItemsTableDragDropZone = createReactClass({
	displayName: 'ItemsTableDragDropZone',
	propTypes: {
		columns: PropTypes.array,
		connectDropTarget: PropTypes.func,
		items: PropTypes.object,
		list: PropTypes.object,
	},
	renderPageDrops () {
		const { items, currentPage, pageSize } = this.props;

		const totalPages = Math.ceil(items.count / pageSize);
		const style = { display: totalPages > 1 ? null : 'none' };

		const pages = [];
		for (let i = 0; i < totalPages; i++) {
			const page = i + 1;
			const pageItems = String(page * pageSize - (pageSize - 1)) + ' - ' + String(page * pageSize);
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
	render () {
		return this.renderPageDrops();
	},
});

export default ItemsTableDragDropZone;
