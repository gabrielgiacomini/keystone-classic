import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import ListControl from '../ListControl.mjs';

import { Columns } from 'FieldTypes';
import { DropTarget, DragSource } from 'react-dnd';

import {
	setDragBase,
	resetItems,
	reorderItems,
	setRowAlert,
	moveItem,
} from '../../actions/index.mjs';

const ItemsRow = createReactClass({
	propTypes: {
		columns: PropTypes.array,
		id: PropTypes.any,
		index: PropTypes.number,
		items: PropTypes.object,
		list: PropTypes.object,
		// Injected by React DnD:
		isDragging: PropTypes.bool,
		connectDragSource: PropTypes.func,
		connectDropTarget: PropTypes.func,
		connectDragPreview: PropTypes.func,
	},
	renderRow (item) {
		const itemId = item.id;
		const rowClassname = classnames({
			'ItemList__row--dragging': this.props.isDragging,
			'ItemList__row--selected': this.props.checkedItems[itemId],
			'ItemList__row--manage': this.props.manageMode,
			'ItemList__row--success': this.props.rowAlert.success === itemId,
			'ItemList__row--failure': this.props.rowAlert.fail === itemId,
		});
		// item fields
		const cells = this.props.columns.map((col, i) => {
			const ColumnType = Columns[col.type] || Columns.__unrecognised__;
			const linkTo = !i ? `${Keystone.adminLegacyPath}/${this.props.list.path}/${itemId}` : undefined;
			return <ColumnType key={col.path} list={this.props.list} col={col} data={item} linkTo={linkTo} />;
		});

		// add sortable icon when applicable
		if (this.props.list.sortable) {
			cells.unshift(<ListControl key="_sort" type="sortable" itemId={itemId} dragSource={this.props.connectDragSource} />);
		}

		// add delete/check icon when applicable
		if (!this.props.list.nodelete) {
			cells.unshift(this.props.manageMode ? (
				<ListControl key="_check" type="check" itemId={itemId} active={this.props.checkedItems[itemId]} />
			) : (
				<ListControl key="_delete" onClick={(e) => this.props.deleteTableItem(item, e)} type="delete" itemId={itemId} />
			));
		}

		const addRow = (
			<tr
				key={'i' + item.id}
				onClick={this.props.manageMode ? (e) => this.props.checkTableItem(item, e) : null}
				className={rowClassname}
				data-list-row
				data-list-row-edit
				data-list-key={this.props.list.key}
				data-list-path={this.props.list.path}
				data-item-id={itemId}
				data-selected={this.props.checkedItems[itemId] ? 'true' : 'false'}
			>
				{cells}
			</tr>
		);

		if (this.props.list.sortable) {
			return (
				// we could add a preview container/image
				// this.props.connectDragPreview(this.props.connectDropTarget(addRow))
				this.props.connectDropTarget(addRow)
			);
		} else {
			return (addRow);
		}
	},
	render () {
		return this.renderRow(this.props.item);
	},
});

export default ItemsRow;

// Expose Sortable

/**
 * Implements drag source.
 */
const dragItem = {
	beginDrag (props) {
		const send = { ...props };
		props.dispatch(setDragBase(props.item, props.index));
		return { ...send };
	},
	endDrag (props, monitor, component) {
		if (!monitor.didDrop()) {
			props.dispatch(resetItems(props.id));
			return;
		}
		// If we were dropped onto a page change target, then droppedOn.prevSortOrder etc will be
		// set by that target, and we should use those values. If we were just dropped onto a new row
		// then we need to calculate these values ourselves.
		const droppedOn = monitor.getDropResult();

		const prevSortOrder = droppedOn.prevSortOrder || props.sortOrder;
		// To explain the following line, suppose we are on page 3 and there are 10 items per page.
		// Previous to this page, there are (3 - 1)*10 = 20 items before us. If we have index 6
		// on this page, then we're the 7th item to display (index starts from 0), and so we
		// want to update the display order to 20 + 7 = 27.
		const droppedIndex = typeof droppedOn.index === 'number'
			? droppedOn.index
			: (typeof monitor.getItem().index === 'number' ? monitor.getItem().index : props.index);
		const page = Number(props.currentPage) || 1;
		const pageSize = Number(props.pageSize)
			|| (props.items && props.items.results && props.items.results.length)
			|| 0;
		const newSortOrder = droppedOn.newSortOrder || (page - 1) * pageSize + droppedIndex + 1;

		// If we were dropped on a page change target, then droppedOn.gotToPage will be set, and we should
		// pass this to reorderItems, which will then change the page for the user.
		props.dispatch(reorderItems(props.item, prevSortOrder, newSortOrder, Number(droppedOn.goToPage)));
	},
};
/**
 * Implements drag target.
 */
const dropItem = {
	drop (props, monitor, component) {
		return { ...props };
	},
	hover (props, monitor, component) {
		// reset row alerts
		if (props.rowAlert.success || props.rowAlert.fail) {
			props.dispatch(setRowAlert({
				reset: true,
			}));
		}

		const dragged = monitor.getItem().index;
		const over = props.index;

		// self
		if (dragged === over) {
			return;
		}

		props.dispatch(moveItem(dragged, over, props));
		monitor.getItem().index = over;
	},
};

/**
 * Specifies the props to inject into the drag-source component.
 * @param {object} connect - The react-dnd connector object used to attach drag-source behaviour to a DOM node.
 * @param {object} monitor - The react-dnd monitor providing drag-state information.
 * @returns {object} Props object containing `connectDragSource`, `isDragging`, and `connectDragPreview`.
 */
function dragProps (connect, monitor) {
	return {
		connectDragSource: connect.dragSource(),
		isDragging: monitor.isDragging(),
		connectDragPreview: connect.dragPreview(),
	};
}

function dropProps (connect) {
	return {
		connectDropTarget: connect.dropTarget(),
	};
};

export const Sortable = DragSource('item', dragItem, dragProps)(DropTarget('item', dropItem, dropProps)(ItemsRow));
