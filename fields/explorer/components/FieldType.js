/**
 * @fileoverview
 * This file defines the `FieldType` component, which is the main component for
 * the KeystoneJS Field Types Explorer. It renders the header for a field type,
 * and a `FieldSpec` for each of the field's specs. It also handles the display
 * of the field's readme.
 */
import React from 'react';
import Markdown from 'react-markdown';

import Col from './Col';
import Row from './Row';
import FieldSpec from './FieldSpec';

/**
 * A component that renders a field type, including its specs and readme.
 * @extends React.Component
 */
const ExplorerFieldType = React.createClass({
	propTypes: {
		FieldComponent: React.PropTypes.func.isRequired,
		FilterComponent: React.PropTypes.func.isRequired,
		params: React.PropTypes.object.isRequired,
		readme: React.PropTypes.string,
		spec: React.PropTypes.oneOfType([
			React.PropTypes.object,
			React.PropTypes.arrayOf(React.PropTypes.object),
		]).isRequired,
		toggleSidebar: React.PropTypes.func.isRequired,
		value: React.PropTypes.any,
	},
	/**
	 * Gets the initial state of the component.
	 * @returns {Object} The initial state.
	 */
	getInitialState () {
		return {
			readmeIsVisible: !!this.props.readme,
			filter: this.props.FilterComponent.getDefaultValue(),
			value: this.props.value,
		};
	},
	/**
	 * Handles the component receiving new props.
	 * @param {Object} newProps The new props.
	 */
	componentWillReceiveProps (newProps) {
		if (this.props.params.type === newProps.params.type) return;

		this.setState({
			filter: newProps.FilterComponent.getDefaultValue(),
			readmeIsVisible: newProps.readme
				? this.state.readmeIsVisible
				: false,
			value: newProps.value,
		});
	},
	/**
	 * Handles a change in the field's value.
	 * @param {Object} e The event object.
	 */
	onFieldChange (e) {
		var logValue = typeof e.value === 'string' ? `"${e.value}"` : e.value;
		console.log(`${this.props.params.type} field value changed:`, logValue);
		this.setState({
			value: e.value,
		});
	},
	/**
	 * Handles a change in the filter's value.
	 * @param {*} value The new filter value.
	 */
	onFilterChange (value) {
		console.log(`${this.props.params.type} filter value changed:`, value);
		this.setState({
			filter: value,
		});
	},
	/**
	 * Toggles the visibility of the readme.
	 */
	toggleReadme () {
		this.setState({ readmeIsVisible: !this.state.readmeIsVisible });
	},
	/**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */
	render () {
		const { FieldComponent, FilterComponent, readme, toggleSidebar } = this.props;
		const { readmeIsVisible } = this.state;
		const specs = Array.isArray(this.props.spec) ? this.props.spec : [this.props.spec];

		return (
			<div className="fx-page">
				<div className="fx-page__header">
					<div className="fx-page__header__title">
						<button
							className="fx-page__header__button fx-page__header__button--sidebar mega-octicon octicon-three-bars"
							onClick={toggleSidebar}
							type="button"
						/>
						{FieldComponent.type}
					</div>
					{!!readme && (
						<button
							className="fx-page__header__button fx-page__header__button--readme mega-octicon octicon-file-text"
							onClick={this.toggleReadme}
							title={readmeIsVisible ? 'Hide Readme' : 'Show Readme'}
							type="button"
						/>
					)}
				</div>
				<div className="fx-page__content">
					<Row>
						<Col>
							<div className="fx-page__content__inner">
								{specs.map((spec, i) => (
									<FieldSpec
										key={spec.path}
										i={i}
										FieldComponent={FieldComponent}
										FilterComponent={FilterComponent}
										spec={spec}
										readmeIsVisible={readmeIsVisible}
									/>
								))}
							</div>
						</Col>
						{!!readmeIsVisible && (
							<Col width={380}>
								<Markdown
									className="Markdown"
									source={readme}
								/>
							</Col>
						)}
					</Row>
				</div>
			</div>
		);
	},
});

export default ExplorerFieldType;
