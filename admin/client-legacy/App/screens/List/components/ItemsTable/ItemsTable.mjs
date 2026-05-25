import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import TableRow from './ItemsTableRow.mjs';
import DragDrop from './ItemsTableDragDrop.mjs';

import { TABLE_CONTROL_COLUMN_WIDTH } from '../../../../../constants.mjs';

const ItemsTable = createReactClass({
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
	renderCols () {
		const cols = this.props.columns.map(col => (
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
							{...this.props}
							deleteTableItem={this.props.deleteTableItem}
							index={i}
							sortOrder={item.sortOrder || 0}
							id={item.id}
							item={item}
						/>
					);
				})}
			</tbody>
		);

		return (
			<div className="ItemList-wrapper">
				<table
					cellPadding="0"
					cellSpacing="0"
					className="Table ItemList"
					data-list-table
					data-list-key={this.props.list.key}
					data-list-path={this.props.list.path}
				>
					{this.renderCols()}
					{this.renderHeaders()}
					{tableBody}
				</table>
			</div>
		);
	},
});

export default ItemsTable;
