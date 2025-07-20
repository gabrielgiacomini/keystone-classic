/**
 * @fileoverview This file contains the ListFiltersAddForm component, which is
 * used to render the form for adding a new filter to the list.
 */
import React from 'react';
import { findDOMNode } from 'react-dom';
import Popout from '../../../../shared/Popout';

import { Filters } from 'FieldTypes';

/**
 * Renders the form for adding a new filter to the list.
 *
 * @param {object} props The properties for the component.
 * @param {object} props.field The field to filter by.
 * @param {number} props.maxHeight The maximum height of the popout.
 * @param {function} props.onApply The function to call when the filter is applied.
 * @param {function} props.onCancel The function to call when the filter is cancelled.
 * @param {function} props.onHeightChange The function to call when the height of the popout changes.
 * @returns {React.Element} The rendered component.
 */
var ListFiltersAddForm = React.createClass({
	propTypes: {
		field: React.PropTypes.object.isRequired,
		maxHeight: React.PropTypes.number,
		onApply: React.PropTypes.func,
		onCancel: React.PropTypes.func,
		onHeightChange: React.PropTypes.func,
	},
	getInitialState () {
		const filterComponent = Filters[this.props.field.type];
		let filterValue = this.props.activeFilters.filter(i => i.field.path === this.props.field.path)[0];
		if (filterValue) {
			filterValue = filterValue.value;
		} else {
			filterValue = filterComponent && filterComponent.getDefaultValue ? filterComponent.getDefaultValue() : {};
		}
		return {
			filterComponent: filterComponent,
			filterValue: filterValue,
		};
	},
	/**
	 * Updates the height of the popout.
	 *
	 * @param {number} bodyHeight The height of the popout body.
	 */
	updateHeight (bodyHeight) {
		bodyHeight += 40; // TODO: remove magic number, currently accounts for padding
		const footerHeight = findDOMNode(this.refs.footer).offsetHeight;
		const maxBodyHeight = this.props.maxHeight - footerHeight;
		const newHeight = bodyHeight + footerHeight;
		// console.log(bodyHeight, maxBodyHeight, '|', newHeight, this.props.maxHeight);
		this.setState({
			bodyHeight: Math.min(bodyHeight, maxBodyHeight),
		}, () => {
			this.props.onHeightChange(Math.min(newHeight, this.props.maxHeight));
		});
	},
	/**
	 * Updates the value of the filter.
	 *
	 * @param {object} filterValue The new value of the filter.
	 */
	updateValue (filterValue) {
		this.setState({
			filterValue: filterValue,
		});
	},
	/**
	 * Handles the form submission.
	 *
	 * @param {Event} e The event object.
	 */
	handleFormSubmit (e) {
		e.preventDefault();
		this.props.onApply(this.state.filterValue);
	},
	/**
	 * Renders an invalid filter.
	 *
	 * @returns {React.Element} The rendered invalid filter.
	 */
	renderInvalidFilter () {
		return (
			<div>Error: type {this.props.field.type} has no filter UI.</div>
		);
	},
	/**
	 * Renders the component.
	 *
	 * @returns {React.Element} The rendered component.
	 */
	render () {
		var FilterComponent = this.state.filterComponent;
		return (
			<form onSubmit={this.handleFormSubmit}>
				<Popout.Body ref="body" scrollable style={{ height: this.state.bodyHeight }}>
					{FilterComponent ? <FilterComponent field={this.props.field} filter={this.state.filterValue} onChange={this.updateValue} onHeightChange={this.updateHeight} /> : this.renderInvalidFilter()}
				</Popout.Body>
				<Popout.Footer
					ref="footer"
					primaryButtonIsSubmit
					primaryButtonLabel="Apply"
					secondaryButtonAction={this.props.onCancel}
					secondaryButtonLabel="Cancel" />
			</form>
		);
	},
});

module.exports = ListFiltersAddForm;
