/**
 * @fileoverview This file contains the ItemsTable component, which is used to
 * render the items table in the list view.
 */
import React, { PropTypes } from 'react';
import classnames from 'classnames';

import TableRow from './ItemsTableRow';
import DragDrop from './ItemsTableDragDrop';

import { TABLE_CONTROL_COLUMN_WIDTH } from '../../../../../constants';

/**
 * Renders the items table in the list view.
 *
 * @param {object} props The properties for the component.
 * @param {object} props.checkedItems The checked items.
 * @param {array} props.columns The columns of the table.
 * @param {function} props.deleteTableItem The function to call when an item is deleted.
 * @param {function} props.handleSortSelect The function to call when a sort is selected.
 * @param {object} props.items The items in the table.
 * @param {object} props.list The list object.
 * @param {boolean} props.manageMode Whether the list is in manage mode.
 * @param {object} props.rowAlert The row alert.
 * @returns {React.Element} The rendered component.
 */
const ItemsTable = React.createClass({
	propTypes: {
		checkedItems: PropTypes.object.isRequired,
		columns: PropTypes.array.isRequired,
		deleteTableItem: PropTypes.func.isRequired,
		handleSortSelect: PropTypes.func.isRequired,
		items: PropTypes.object.isRequired,
		list: PropTypes.object.isRequired,
		manageMode: PropTypes.bool.isRequired,
		rowAlert: PropTypes.object.isRequired,
	},
	/**
	 * Renders the columns.
	 *
	 * @returns {React.Element} The rendered columns.
	 */
	renderCols () {
		let cols = this.props.columns.map(col => (
			<col key={col.path} width={col.width} />
		));

		// add delete col when available
		if (!this.props.list.nodelete) {
			cols.unshift(
				<col width={TABLE_CONTROL_COLUMN_WIDTH} key="delete" />
			);
		}

		// add sort col when available
		if (this.props.list.sortable) {
			cols.unshift(
				<col width={TABLE_CONTROL_COLUMN_WIDTH} key="sortable" />
			);
		}

		return (
			<colgroup>
				{cols}
			</colgroup>
		);
	},
	/**
	 * Renders the headers.
	 *
	 * @returns {React.Element} The rendered headers.
	 */
	renderHeaders () {
		let listControlCount = 0;

		if (this.props.list.sortable) listControlCount++;
		if (!this.props.list.nodelete) listControlCount++;

		// set active sort
		const activeSortPath = this.props.activeSort.paths[0];

		// pad first col when controls are available
		const cellPad = listControlCount ? (
			<th colSpan={listControlCount} />
		) : null;

		// map each heading column
		const cellMap = this.props.columns.map(col => {
			const isSelected = activeSortPath && activeSortPath.path === col.path;
			const isInverted = isSelected && activeSortPath.invert;
			const buttonTitle = `Sort by ${col.label}${isSelected && !isInverted ? ' (desc)' : ''}`;
			const colClassName = classnames('ItemList__sort-button th-sort', {
				'th-sort--asc': isSelected && !isInverted,
				'th-sort--desc': isInverted,
			});

			return (
				<th key={col.path} colSpan="1">
					<button
						className={colClassName}
						onClick={() => {
							this.props.handleSortSelect(
								col.path,
								isSelected && !isInverted
							);
						}}
						title={buttonTitle}>
						{col.label}
						<span className="th-sort__icon" />
					</button>
				</th>
			);
		});

		return (
			<thead>
				<tr>
					{cellPad}
					{cellMap}
				</tr>
			</thead>
		);
	},
	/**
	 * Renders the component.
	 *
	 * @returns {React.Element} The rendered component.
	 */
	render () {
		const { items } = this.props;
		if (!items.results.length) return null;

		const tableBody = (this.props.list.sortable) ? (
			<DragDrop {...this.props} />
		) : (
			<tbody >
				{items.results.map((item, i) => {
					return (
						<TableRow key={item.id}
							deleteTableItem={this.props.deleteTableItem}
							index={i}
							sortOrder={item.sortOrder || 0}
							id={item.id}
							item={item}
							{...this.props}
						/>
					);
				})}
			</tbody>
		);

		return (
			<div className="ItemList-wrapper">
				<table cellPadding="0" cellSpacing="0" className="Table ItemList">
					{this.renderCols()}
					{this.renderHeaders()}
					{tableBody}
				</table>
			</div>
		);
	},
});

module.exports = exports = ItemsTable;
