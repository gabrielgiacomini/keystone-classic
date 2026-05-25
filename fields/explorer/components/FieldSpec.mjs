/**
 * @file
 * This file defines the `FieldSpec` component, which is used to render a single
 * field type in the KeystoneJS Field Types Explorer. It displays the field
 * itself, a Domify component to show the field's value, and a filter component.
 */
import React from 'react';
import Form from '../../../admin/client-legacy/App/elemental/Form/index.mjs';

import Col from './Col.mjs';
import Row from './Row.mjs';

function ValuePreview ({ className, value }) {
	return React.createElement('pre', { className }, JSON.stringify(value, null, 2));
}


/**
 * A component that renders a field spec, including the field itself, its value,
 * and a filter.
 * @augments React.Component
 */
class ExplorerFieldType extends React.Component {

	/**
	 * Gets the initial state of the component.
	 * @returns {object} The initial state.
	 */
	constructor(props) {
		super(props);
		this.state = {
			filter: this.props.FilterComponent.getDefaultValue(),
			value: this.props.value,
		};
	}

	/**
	 * Handles a change in the field's value.
	 * @param {object} e The event object.
	 */
	onFieldChange = (e) => {
		const logValue = typeof e.value === 'string' ? `"${e.value}"` : e.value;
		console.log(`${this.props.FieldComponent.type} field value changed:`, logValue);
		this.setState({
			value: e.value,
		});
	};

	/**
	 * Handles a change in the filter's value.
	 * @param {unknown} value The new filter value.
	 */
	onFilterChange = (value) => {
		console.log(`${this.props.FieldComponent.type} filter value changed:`, value);
		this.setState({
			filter: value,
		});
	};

	/**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */
	render() {
		const { FieldComponent, FilterComponent, readmeIsVisible, spec } = this.props;
		const className = this.props.i ? 'fx-page__field__bordered' : undefined;
		return React.createElement(
			'div',
			{ className },
			React.createElement(
				Form,
				{ variant: 'horizontal', component: 'div' },
				React.createElement(
					Row,
					{ isCollapsed: readmeIsVisible },
					React.createElement(
						Col,
						{ width: readmeIsVisible ? 300 : null, style: { minWidth: 300, maxWidth: 640 } },
						React.createElement(FieldComponent, {
							...spec,
							onChange: this.onFieldChange,
							value: this.state.value,
						})
					),
					React.createElement(
						Col,
						null,
						React.createElement(ValuePreview, {
							className: 'Domify',
							value: { value: this.state.value },
						})
					)
				)
			),
			React.createElement(
				'div',
				{ className: 'fx-page__filter' },
				React.createElement('div', { className: 'fx-page__filter__title' }, 'Filter'),
				React.createElement(
					Row,
					null,
					React.createElement(
						Col,
						{ width: 300 },
						React.createElement(FilterComponent, {
							field: spec,
							filter: this.state.filter,
							onChange: this.onFilterChange,
						})
					),
					React.createElement(
						Col,
						null,
						React.createElement(
							'div',
							{ style: { marginLeft: 30 } },
							React.createElement(ValuePreview, {
								className: 'Domify',
								value: this.state.filter,
							})
						)
					)
				)
			)
		);
	}
}

export default ExplorerFieldType;
