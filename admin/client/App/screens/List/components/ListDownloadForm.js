/**
 * @fileoverview This file contains the ListDownloadForm component, which is
 * used to render the download form in the list view.
 */
import React, { PropTypes } from 'react';
import assign from 'object-assign';
import Popout from '../../../shared/Popout';
import PopoutList from '../../../shared/Popout/PopoutList';
import ListHeaderButton from './ListHeaderButton';
import { LabelledControl, Form, FormField, SegmentedControl } from '../../../elemental';

import { downloadItems } from '../actions';
const FORMAT_OPTIONS = [
	{ label: 'CSV', value: 'csv' },
	{ label: 'JSON', value: 'json' },
];

/**
 * Renders the download form in the list view.
 *
 * @param {object} props The properties for the component.
 * @param {array} props.activeColumns The active columns.
 * @param {function} props.dispatch The dispatch function.
 * @param {object} props.list The list object.
 * @returns {React.Element} The rendered component.
 */
var ListDownloadForm = React.createClass({
	propTypes: {
		activeColumns: PropTypes.array,
		dispatch: PropTypes.func.isRequired,
		list: PropTypes.object,
	},
	getInitialState () {
		return {
			format: FORMAT_OPTIONS[0].value,
			isOpen: false,
			useCurrentColumns: true,
			selectedColumns: this.getDefaultSelectedColumns(),
		};
	},
	/**
	 * Gets the default selected columns.
	 *
	 * @returns {object} The default selected columns.
	 */
	getDefaultSelectedColumns () {
		var selectedColumns = {};
		this.props.activeColumns.forEach(col => {
			selectedColumns[col.path] = true;
		});
		return selectedColumns;
	},
	/**
	 * Gets the list UI elements.
	 *
	 * @returns {array} The list UI elements.
	 */
	getListUIElements () {
		return this.props.list.uiElements.map((el) => {
			return el.type === 'field' ? {
				type: 'field',
				field: this.props.list.fields[el.field],
			} : el;
		});
	},
	/**
	 * Checks if all columns are selected.
	 *
	 * @returns {boolean} Whether all columns are selected.
	 */
	allColumnsSelected () {
		const selectedColumns = Object.keys(this.state.selectedColumns).length;
		const columnAmount = this.getListUIElements().filter((el) => el.type !== 'heading').length;
		return selectedColumns === columnAmount;
	},
	/**
	 * Toggles the popout.
	 *
	 * @param {boolean} visible Whether the popout should be visible.
	 */
	togglePopout (visible) {
		this.setState({
			isOpen: visible,
		});
	},
	/**
	 * Toggles a column.
	 *
	 * @param {string} column The column to toggle.
	 * @param {boolean} value Whether the column should be selected.
	 */
	toggleColumn (column, value) {
		const newColumns = assign({}, this.state.selectedColumns);
		if (value) {
			newColumns[column] = value;
		} else {
			delete newColumns[column];
		}
		this.setState({
			selectedColumns: newColumns,
		});
	},
	/**
	 * Changes the format.
	 *
	 * @param {string} value The new format.
	 */
	changeFormat (value) {
		this.setState({
			format: value,
		});
	},
	/**
	 * Toggles the currently selected columns.
	 *
	 * @param {Event} e The event object.
	 */
	toggleCurrentlySelectedColumns (e) {
		const newState = {
			useCurrentColumns: e.target.checked,
			selectedColumns: this.getDefaultSelectedColumns(),
		};
		this.setState(newState);
	},
	/**
	 * Clicks the select all button.
	 */
	clickSelectAll () {
		if (this.allColumnsSelected()) {
			this.selectNoColumns();
		} else {
			this.selectAllColumns();
		}
	},
	/**
	 * Selects all columns.
	 */
	selectAllColumns () {
		const newColumns = {};
		this.getListUIElements().map((el) => {
			if (el.type !== 'heading') {
				newColumns[el.field.path] = true;
			}
		});
		this.setState({
			selectedColumns: newColumns,
		});
	},
	/**
	 * Selects no columns.
	 */
	selectNoColumns () {
		this.setState({
			selectedColumns: {},
		});
	},
	/**
	 * Handles a download request.
	 */
	handleDownloadRequest () {
		this.props.dispatch(downloadItems(this.state.format, Object.keys(this.state.selectedColumns)));
		this.togglePopout(false);
	},
	/**
	 * Renders the column select.
	 *
	 * @returns {React.Element} The rendered column select.
	 */
	renderColumnSelect () {
		if (this.state.useCurrentColumns) return null;

		const possibleColumns = this.getListUIElements().map((el, i) => {
			if (el.type === 'heading') {
				return <PopoutList.Heading key={'heading_' + i}>{el.content}</PopoutList.Heading>;
			}

			const columnKey = el.field.path;
			const columnValue = this.state.selectedColumns[columnKey];

			return (
				<PopoutList.Item
					key={'item_' + el.field.path}
					icon={columnValue ? 'check' : 'dash'}
					iconHover={columnValue ? 'dash' : 'check'}
					isSelected={columnValue}
					label={el.field.label}
					onClick={() => this.toggleColumn(columnKey, !columnValue)} />
			);
		});

		const allColumnsSelected = this.allColumnsSelected();
		const checkboxLabel = allColumnsSelected ? 'Select None' : 'Select All';

		return (
			<div>
				<FormField offsetAbsentLabel>
					<LabelledControl
						checked={allColumnsSelected}
						label={checkboxLabel}
						onChange={this.clickSelectAll}
						type="checkbox"
						value
					/>
				</FormField>
				<div style={{ borderTop: '1px dashed rgba(0,0,0,0.1)', marginTop: '1em', paddingTop: '1em' }}>
					{possibleColumns}
				</div>
			</div>
		);
	},
	/**
	 * Renders the component.
	 *
	 * @returns {React.Element} The rendered component.
	 */
	render () {
		const { useCurrentColumns } = this.state;

		return (
			<div>
				<ListHeaderButton
					active={this.state.isOpen}
					id="listHeaderDownloadButton"
					glyph="cloud-download"
					label="Download"
					onClick={() => this.togglePopout(!this.state.isOpen)}
				/>
				<Popout isOpen={this.state.isOpen} onCancel={() => this.togglePopout(false)} relativeToID="listHeaderDownloadButton">
					<Popout.Header title="Download" />
					<Popout.Body scrollable>
						<Form layout="horizontal" labelWidth={100} component="div">
							<FormField label="File format:">
								<SegmentedControl
									equalWidthSegments
									onChange={this.changeFormat}
									options={FORMAT_OPTIONS}
									value={this.state.format}
								/>
							</FormField>
							<FormField label="Columns:" style={{ marginBottom: 0 }}>
								<LabelledControl
									autoFocus
									checked={useCurrentColumns}
									label="Use currently selected"
									onChange={this.toggleCurrentlySelectedColumns}
									type="checkbox"
									value
								/>
							</FormField>
							{this.renderColumnSelect()}
						</Form>
					</Popout.Body>
					<Popout.Footer
						primaryButtonAction={this.handleDownloadRequest}
						primaryButtonLabel="Download"
						secondaryButtonAction={() => this.togglePopout(false)}
						secondaryButtonLabel="Cancel" />
				</Popout>
			</div>
		);
	},
});

module.exports = ListDownloadForm;
