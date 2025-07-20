/**
 * @fileoverview
 * This is the main view for a specific field type in the explorer. It renders
 * the field's header, the field specs, and the readme.
 */
import React from 'react';
import Markdown from 'react-markdown';

import Col from './Col';
import Row from './Row';
import FieldSpec from './FieldSpec';

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
	getInitialState () {
		return {
			readmeIsVisible: !!this.props.readme,
			filter: this.props.FilterComponent.getDefaultValue(),
			value: this.props.value,
		};
	},
	/**
	 * Updates the state when the component receives new props.
	 *
	 * @param {object} newProps The new props.
	 */
	componentWillReceiveProps (newProps) {
		// If the field type has changed, reset the state
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
	 *
	 * @param {Event} e The event object.
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
	 *
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
	render () {
		const { FieldComponent, FilterComponent, readme, toggleSidebar } = this.props;
		const { readmeIsVisible } = this.state;
		// Ensure specs is an array
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
					{/* Show the readme toggle button if a readme exists */}
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
								{/* Render a FieldSpec for each spec */}
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
						{/* Show the readme if it's visible */}
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

module.exports = ExplorerFieldType;
