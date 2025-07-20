/**
 * @fileoverview This file contains the ListFiltersAdd component, which is used
 * to render the "add filter" button in the list view.
 */
import React from 'react';
import { findDOMNode } from 'react-dom';
import Transition
	from 'react-addons-css-transition-group';
import classnames from 'classnames';
import ListFiltersAddForm from './ListFiltersAddForm';
import Popout from '../../../../shared/Popout';
import PopoutList from '../../../../shared/Popout/PopoutList';
import { FormInput } from '../../../../elemental';
import ListHeaderButton from '../ListHeaderButton';

import { setFilter } from '../../actions';

/**
 * Renders the "add filter" button in the list view.
 *
 * @param {object} props The properties for the component.
 * @param {number} props.maxHeight The maximum height of the popout.
 * @returns {React.Element} The rendered component.
 */
var ListFiltersAdd = React.createClass({
	displayName: 'ListFiltersAdd',
	propTypes: {
		maxHeight: React.PropTypes.number,
	},
	getDefaultProps () {
		return {
			maxHeight: 360,
		};
	},
	getInitialState () {
		return {
			innerHeight: 0,
			isOpen: false,
			searchString: '',
			selectedField: false,
		};
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
	 * Opens the popout.
	 */
	openPopout () {
		this.setState({ isOpen: true }, this.focusSearch);
	},
	/**
	 * Closes the popout.
	 */
	closePopout () {
		this.setState({
			innerHeight: 0,
			isOpen: false,
			searchString: '',
			selectedField: false,
		});
	},
	/**
	 * Sets the height of the popout.
	 *
	 * @param {number} height The height of the popout.
	 */
	setPopoutHeight (height) {
		this.setState({ innerHeight: Math.min(this.props.maxHeight, height) });
	},
	/**
	 * Navigates back to the list of filters.
	 */
	navigateBack () {
		this.setState({
			selectedField: false,
			searchString: '',
			innerHeight: 0,
		}, this.focusSearch);
	},
	/**
	 * Focuses the search input.
	 */
	focusSearch () {
		findDOMNode(this.refs.search).focus();
	},
	/**
	 * Selects a field.
	 *
	 * @param {object} field The field to select.
	 */
	selectField (field) {
		this.setState({
			selectedField: field,
		});
	},
	/**
	 * Applies a filter.
	 *
	 * @param {object} value The value of the filter.
	 */
	applyFilter (value) {
		this.props.dispatch(setFilter(this.state.selectedField.path, value));
		this.closePopout();
	},
	/**
	 * Renders the list of filters.
	 *
	 * @returns {React.Element} The rendered list.
	 */
	renderList () {
		const activeFilterFields = this.props.activeFilters.map(obj => obj.field);
		const activeFilterPaths = activeFilterFields.map(obj => obj.path);
		const { searchString } = this.state;
		let filteredFilters = this.props.availableFilters;

		if (searchString) {
			filteredFilters = filteredFilters
				.filter(filter => filter.type !== 'heading')
				.filter(filter => new RegExp(searchString)
					.test(filter.field.label.toLowerCase()));
		}

		const popoutList = filteredFilters.map((el, i) => {
			if (el.type === 'heading') {
				return (
					<PopoutList.Heading key={'heading_' + i}>
						{el.content}
					</PopoutList.Heading>
				);
			}

			const filterIsActive = activeFilterPaths.length && (activeFilterPaths.indexOf(el.field.path) > -1);

			return (
				<PopoutList.Item
					key={'item_' + el.field.path}
					icon={filterIsActive ? 'check' : 'chevron-right'}
					iconHover={filterIsActive ? 'check' : 'chevron-right'}
					isSelected={!!filterIsActive}
					label={el.field.label}
					onClick={() => { this.selectField(el.field); }} />
			);
		});

		const formFieldStyles = {
			borderBottom: '1px dashed rgba(0, 0, 0, 0.1)',
			marginBottom: '1em',
			paddingBottom: '1em',
		};

		return (
			<Popout.Pane onLayout={this.setPopoutHeight} key="list">
				<Popout.Body>
					<div style={formFieldStyles}>
						<FormInput
							onChange={this.updateSearch}
							placeholder="Find a filter..."
							ref="search"
							value={this.state.searchString}
						/>
					</div>
					{popoutList}
				</Popout.Body>
			</Popout.Pane>
		);
	},
	/**
	 * Renders the form for adding a filter.
	 *
	 * @returns {React.Element} The rendered form.
	 */
	renderForm () {
		return (
			<Popout.Pane onLayout={this.setPopoutHeight} key="form">
				<ListFiltersAddForm
					activeFilters={this.props.activeFilters}
					field={this.state.selectedField}
					onApply={this.applyFilter}
					onCancel={this.closePopout}
					onBack={this.navigateBack}
					maxHeight={this.props.maxHeight}
					onHeightChange={this.setPopoutHeight}
					dispatch={this.props.dispatch}
				/>
			</Popout.Pane>
		);
	},
	/**
	 * Renders the component.
	 *
	 * @returns {React.Element} The rendered component.
	 */
	render () {
		const { isOpen, selectedField } = this.state;
		const popoutBodyStyle = this.state.innerHeight
			? { height: this.state.innerHeight }
			: null;
		const popoutPanesClassname = classnames('Popout__panes', {
			'Popout__scrollable-area': !selectedField,
		});

		return (
			<div>
				<ListHeaderButton
					active={isOpen}
					glyph="eye"
					id="listHeaderFilterButton"
					label="Filter"
					onClick={isOpen ? this.closePopout : this.openPopout}
				/>
				<Popout isOpen={isOpen} onCancel={this.closePopout} relativeToID="listHeaderFilterButton">
					<Popout.Header
						leftAction={selectedField ? this.navigateBack : null}
						leftIcon={selectedField ? 'chevron-left' : null}
						title={selectedField ? selectedField.label : 'Filter'}
						transitionDirection={selectedField ? 'next' : 'prev'} />
					<Transition
						className={popoutPanesClassname}
						component="div"
						style={popoutBodyStyle}
						transitionName={selectedField ? 'Popout__pane-next' : 'Popout__pane-prev'}
						transitionEnterTimeout={360}
						transitionLeaveTimeout={360}
					>
						{selectedField ? this.renderForm() : this.renderList()}
					</Transition>
				</Popout>
			</div>
		);
	},
});

module.exports = ListFiltersAdd;
