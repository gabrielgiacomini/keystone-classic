/**
 * @file
 * This file defines the `FieldSpec` component, which is used to render a single
 * field type in the KeystoneJS Field Types Explorer. It displays the field
 * itself, a Domify component to show the field's value, and a filter component.
 */
import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import { Form } from '../../../admin/client-legacy/App/elemental';

import Col from './Col.mjs';
import Row from './Row.mjs';

function ValuePreview ({ className, value }) {
	return (
		<pre className={className}>{JSON.stringify(value, null, 2)}</pre>
	);
}

ValuePreview.propTypes = {
	className: PropTypes.string,
	value: PropTypes.any,
};

/**
 * A component that renders a field spec, including the field itself, its value,
 * and a filter.
 * @augments React.Component
 */
const ExplorerFieldType = createReactClass({
	propTypes: {
		FieldComponent: PropTypes.func.isRequired,
		FilterComponent: PropTypes.func.isRequired,
		i: PropTypes.number,
		readmeIsVisible: PropTypes.bool,
		spec: PropTypes.object.isRequired,
		value: PropTypes.any,
	},
	/**
	 * Gets the initial state of the component.
	 * @returns {object} The initial state.
	 */
	getInitialState () {
		return {
			filter: this.props.FilterComponent.getDefaultValue(),
			value: this.props.value,
		};
	},
	/**
	 * Handles a change in the field's value.
	 * @param {object} e The event object.
	 */
	onFieldChange (e) {
		const logValue = typeof e.value === 'string' ? `"${e.value}"` : e.value;
		console.log(`${this.props.FieldComponent.type} field value changed:`, logValue);
		this.setState({
			value: e.value,
		});
	},
	/**
	 * Handles a change in the filter's value.
	 * @param {unknown} value The new filter value.
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
							<ValuePreview
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
								<ValuePreview
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

export default ExplorerFieldType;
