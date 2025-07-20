/**
 * @fileoverview This file contains the Filter component, which is used to
 * render a filter chip and a popout for editing the filter.
 */
import React, { Component, PropTypes } from 'react';
import { Filters } from 'FieldTypes';
import { Chip } from '../../../../elemental';

import Popout from '../../../../shared/Popout';
import { setFilter, clearFilter } from '../../actions';
import getFilterLabel from './getFilterLabel';

/**
 * A filter chip that opens a popout for editing the filter.
 */
class Filter extends Component {
	constructor () {
		super();

		this.open = this.open.bind(this);
		this.close = this.close.bind(this);
		this.updateValue = this.updateValue.bind(this);
		this.updateFilter = this.updateFilter.bind(this);
		this.removeFilter = this.removeFilter.bind(this);

		this.state = {
			isOpen: false,
		};
	}
	/**
	 * Opens the popout.
	 */
	open () {
		this.setState({
			isOpen: true,
			filterValue: this.props.filter.value,
		});
	}
	/**
	 * Closes the popout.
	 */
	close () {
		this.setState({
			isOpen: false,
		});
	}
	/**
	 * Updates the value of the filter.
	 *
	 * @param {object} filterValue The new value of the filter.
	 */
	updateValue (filterValue) {
		this.setState({
			filterValue: filterValue,
		});
	}
	/**
	 * Updates the filter.
	 *
	 * @param {Event} e The event object.
	 */
	updateFilter (e) {
		const { dispatch, filter } = this.props;
		dispatch(setFilter(filter.field.path, this.state.filterValue));
		this.close();
		e.preventDefault();
	}
	/**
	 * Removes the filter.
	 */
	removeFilter () {
		this.props.dispatch(clearFilter(this.props.filter.field.path));
	}
	/**
	 * Renders the component.
	 *
	 * @returns {React.Element} The rendered component.
	 */
	render () {
		const { filter } = this.props;
		const filterId = `activeFilter__${filter.field.path}`;
		const FilterComponent = Filters[filter.field.type];

		return (
			<span>
				<Chip
					label={getFilterLabel(filter.field, filter.value)}
					onClick={this.open}
					onClear={this.removeFilter}
					color="primary"
					id={filterId}
				/>
				<Popout isOpen={this.state.isOpen} onCancel={this.close} relativeToID={filterId}>
					<form onSubmit={this.updateFilter}>
						<Popout.Header title="Edit Filter" />
						<Popout.Body>
							<FilterComponent
								field={filter.field}
								filter={this.state.filterValue}
								onChange={this.updateValue}
							/>
						</Popout.Body>
						<Popout.Footer
							ref="footer"
							primaryButtonIsSubmit
							primaryButtonLabel="Apply"
							secondaryButtonAction={this.close}
							secondaryButtonLabel="Cancel" />
					</form>
				</Popout>
			</span>
		);
	}
};

Filter.propTypes = {
	dispatch: PropTypes.func.isRequired,
	filter: PropTypes.shape({
		field: PropTypes.object.isRequired,
		value: PropTypes.object.isRequired,
	}).isRequired,
};

module.exports = Filter;
