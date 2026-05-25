import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Filters } from 'FieldTypes';
import { Chip } from '../../../../elemental/index.mjs';

import Popout from '../../../../shared/Popout/index.mjs';
import { setFilter, clearFilter } from '../../actions/index.mjs';
import getFilterLabel from './getFilterLabel.mjs';

/**
 * React component that renders an active filter chip and an editable popout
 * for modifying or removing a single field filter.
 */
class Filter extends Component {
	/**
	 * Initialises method bindings and sets the default closed state.
	 */
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
	 * Opens the filter popout and copies the current filter value into local state.
	 */
	open () {
		this.setState({
			isOpen: true,
			filterValue: this.props.filter.value,
		});
	}
	/**
	 * Closes the filter popout.
	 */
	close () {
		this.setState({
			isOpen: false,
		});
	}
	/**
	 * Stores the pending filter value in local state while the popout is open.
	 * @param {object} filterValue - The new candidate filter value supplied by the field-specific filter component.
	 */
	updateValue (filterValue) {
		this.setState({
			filterValue: filterValue,
		});
	}
	/**
	 * Dispatches the setFilter action with the current pending value and closes the popout.
	 * Called on form submit; prevents the default browser form submission.
	 * @param {Event} e - The form submit event.
	 */
	updateFilter (e) {
		const { dispatch, filter } = this.props;
		dispatch(setFilter(filter.field.path, this.state.filterValue));
		this.close();
		e.preventDefault();
	}
	/**
	 * Dispatches the clearFilter action to remove this filter from the active filter set.
	 */
	removeFilter () {
		this.props.dispatch(clearFilter(this.props.filter.field.path));
	}
	/**
	 * Renders a Chip for the active filter alongside a Popout form for editing it.
	 * @returns {React.Element} The filter chip and popout form element.
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

export default Filter;
