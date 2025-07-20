/**
 * @fileoverview
 * This file defines the `FieldSpec` component, which is used to render a single
 * field type in the KeystoneJS Field Types Explorer. It displays the field
 * itself, a Domify component to show the field's value, and a filter component.
 */
import Domify from 'react-domify';
import React from 'react';
import { Form } from '../../../admin/client/App/elemental';

import Col from './Col';
import Row from './Row';

/**
 * A component that renders a field spec, including the field itself, its value,
 * and a filter.
 * @extends React.Component
 */
const ExplorerFieldType = React.createClass({
	/**
	 * Gets the initial state of the component.
	 * @returns {Object} The initial state.
	 */
	getInitialState () {
		return {
			filter: this.props.FilterComponent.getDefaultValue(),
			value: this.props.value,
		};
	},
	/**
	 * Handles a change in the field's value.
	 * @param {Object} e The event object.
	 */
	onFieldChange (e) {
		var logValue = typeof e.value === 'string' ? `"${e.value}"` : e.value;
		console.log(`${this.props.FieldComponent.type} field value changed:`, logValue);
		this.setState({
			value: e.value,
		});
	},
	/**
	 * Handles a change in the filter's value.
	 * @param {*} value The new filter value.
	 */
	onFilterChange (value) {
		console.log(`${this.props.FieldComponent.type} filter value changed:`, value);
		this.setState({
			filter: value,
		});
	},
	/**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */
	render () {
		const { FieldComponent, FilterComponent, readmeIsVisible, spec } = this.props;
		const className = this.props.i ? 'fx-page__field__bordered' : undefined;
		return (
			<div className={className}>
				<Form variant="horizontal" component="div">
					<Row isCollapsed={readmeIsVisible}>
						<Col width={readmeIsVisible ? 300 : null} style={{ minWidth: 300, maxWidth: 640 }}>
							<FieldComponent
								{...spec}
								onChange={this.onFieldChange}
								value={this.state.value}
							/>
						</Col>
						<Col>
							<Domify
								className="Domify"
								value={{ value: this.state.value }}
							/>
						</Col>
					</Row>
				</Form>
				<div className="fx-page__filter">
					<div className="fx-page__filter__title">Filter</div>
					<Row>
						<Col width={300}>
							<FilterComponent
								field={spec}
								filter={this.state.filter}
								onChange={this.onFilterChange}
							/>
						</Col>
						<Col>
							<div style={{ marginLeft: 30 }}>
								<Domify
									className="Domify"
									value={this.state.filter}
								/>
							</div>
						</Col>
					</Row>
				</div>
			</div>
		);
	},
});

module.exports = ExplorerFieldType;
