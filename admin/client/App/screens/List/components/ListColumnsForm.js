/**
 * @fileoverview This file contains the ListColumnsForm component, which is used
 * to render the form for selecting the columns to display in the list.
 */
import React from 'react';
import assign from 'object-assign';

import Popout from '../../../shared/Popout';
import PopoutList from '../../../shared/Popout/PopoutList';
import { FormInput } from '../../../elemental';
import ListHeaderButton from './ListHeaderButton';

import { setActiveColumns } from '../actions';

var ListColumnsForm = React.createClass({
	displayName: 'ListColumnsForm',
	getInitialState () {
		return {
			selectedColumns: {},
			searchString: '',
		};
	},
	/**
	 * Gets the selected columns from the store.
	 *
	 * @returns {object} The selected columns.
	 */
	getSelectedColumnsFromStore () {
		var selectedColumns = {};
		this.props.activeColumns.forEach(col => {
			selectedColumns[col.path] = true;
		});
		return selectedColumns;
	},
	/**
	 * Toggles the popout.
	 *
	 * @param {boolean} visible Whether the popout should be visible.
	 */
	togglePopout (visible) {
		this.setState({
			selectedColumns: this.getSelectedColumnsFromStore(),
			isOpen: visible,
			searchString: '',
		});
	},
	/**
	 * Toggles a column.
	 *
	 * @param {string} path The path of the column to toggle.
	 * @param {boolean} value Whether the column should be selected.
	 */
	toggleColumn (path, value) {
		const newColumns = assign({}, this.state.selectedColumns);

		if (value) {
			newColumns[path] = value;
		} else {
			delete newColumns[path];
		}

		this.setState({
			selectedColumns: newColumns,
		});
	},
	/**
	 * Applies the selected columns.
	 */
	applyColumns () {
		this.props.dispatch(setActiveColumns(Object.keys(this.state.selectedColumns)));
		this.togglePopout(false);
	},
	/**
	 * Updates the search string.
	 *
	 * @param {Event} e The event object.
	 */
	updateSearch (e) {
		this.setState({ searchString: e.target.value });
	},
	/**
	 * Renders the columns.
	 *
	 * @returns {React.Element} The rendered columns.
	 */
	renderColumns () {
		const availableColumns = this.props.availableColumns;
		const { searchString } = this.state;
		let filteredColumns = availableColumns;

		if (searchString) {
			filteredColumns = filteredColumns
				.filter(column => column.type !== 'heading')
				.filter(column => new RegExp(searchString).test(column.field.label.toLowerCase()));
		}

		return filteredColumns.map((el, i) => {
			if (el.type === 'heading') {
				return <PopoutList.Heading key={'heading_' + i}>{el.content}</PopoutList.Heading>;
			}

			const path = el.field.path;
			const selected = this.state.selectedColumns[path];

			return (
				<PopoutList.Item
					key={'column_' + el.field.path}
					icon={selected ? 'check' : 'dash'}
					iconHover={selected ? 'dash' : 'check'}
					isSelected={!!selected}
					label={el.field.label}
					onClick={() => { this.toggleColumn(path, !selected); }} />
			);
		});
	},
	/**
	 * Renders the component.
	 *
	 * @returns {React.Element} The rendered component.
	 */
	render () {
		const formFieldStyles = {
			borderBottom: '1px dashed rgba(0,0,0,0.1)',
			marginBottom: '1em',
			paddingBottom: '1em',
		};
		return (
			<div>
				<ListHeaderButton
					active={this.state.isOpen}
					id="listHeaderColumnButton"
					glyph="list-unordered"
					label="Columns"
					onClick={() => this.togglePopout(!this.state.isOpen)}
				/>
				<Popout isOpen={this.state.isOpen} onCancel={() => this.togglePopout(false)} relativeToID="listHeaderColumnButton">
					<Popout.Header title="Columns" />
					<Popout.Body scrollable>
						<div style={formFieldStyles}>
							<FormInput
								autoFocus
								onChange={this.updateSearch}
								placeholder="Find a column..."
								value={this.state.searchString}
							/>
						</div>
						<PopoutList>
							{this.renderColumns()}
						</PopoutList>
					</Popout.Body>
					<Popout.Footer
						primaryButtonAction={this.applyColumns}
						primaryButtonLabel="Apply"
						secondaryButtonAction={() => this.togglePopout(false)}
						secondaryButtonLabel="Cancel" />
				</Popout>
			</div>
		);
	},
});

module.exports = ListColumnsForm;
