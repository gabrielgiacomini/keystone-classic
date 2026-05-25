/**
 * @file
 * This file defines the `FieldType` component, which is the main component for
 * the KeystoneJS Field Types Explorer. It renders the header for a field type,
 * and a `FieldSpec` for each of the field's specs. It also handles the display
 * of the field's readme.
 */
import React from 'react';
import Markdown from './Markdown.mjs';

import Col from './Col.mjs';
import Row from './Row.mjs';
import FieldSpec from './FieldSpec.mjs';

/**
 * A component that renders a field type, including its specs and readme.
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
			readmeIsVisible: !!this.props.readme,
			filter: this.props.FilterComponent.getDefaultValue(),
			value: this.props.value,
		};
	}

	/**
	 * Resets field/filter state after navigating to a different field type.
	 * @param {object} prevProps The previous props.
	 */
	componentDidUpdate(prevProps) {
		if (prevProps.params.type === this.props.params.type) return;

		this.setState({
			filter: this.props.FilterComponent.getDefaultValue(),
			readmeIsVisible: this.props.readme
				? this.state.readmeIsVisible
			: false,
			value: this.props.value,
		});
	}

	/**
	 * Handles a change in the field's value.
	 * @param {object} e The event object.
	 */
	onFieldChange = (e) => {
		const logValue = typeof e.value === 'string' ? `"${e.value}"` : e.value;
		console.log(`${this.props.params.type} field value changed:`, logValue);
		this.setState({
			value: e.value,
		});
	};

	/**
	 * Handles a change in the filter's value.
	 * @param {unknown} value The new filter value.
	 */
	onFilterChange = (value) => {
		console.log(`${this.props.params.type} filter value changed:`, value);
		this.setState({
			filter: value,
		});
	};

	/**
	 * Toggles the visibility of the readme.
	 */
	toggleReadme = () => {
		this.setState({ readmeIsVisible: !this.state.readmeIsVisible });
	};

	/**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */
	render() {
		const { FieldComponent, FilterComponent, readme, toggleSidebar } = this.props;
		const { readmeIsVisible } = this.state;
		const specs = Array.isArray(this.props.spec) ? this.props.spec : [this.props.spec];

		const specElements = specs.map((spec, i) => React.createElement(FieldSpec, {
			key: spec.path,
			i,
			FieldComponent,
			FilterComponent,
			spec,
			readmeIsVisible,
		}));

		return React.createElement(
			'div',
			{ className: 'fx-page' },
			React.createElement(
				'div',
				{ className: 'fx-page__header' },
				React.createElement(
					'div',
					{ className: 'fx-page__header__title' },
					React.createElement('button', {
						className: 'fx-page__header__button fx-page__header__button--sidebar mega-octicon octicon-three-bars',
						onClick: toggleSidebar,
						type: 'button',
					}),
					FieldComponent.type,
				),
				readme ? React.createElement('button', {
					className: 'fx-page__header__button fx-page__header__button--readme mega-octicon octicon-file-text',
					onClick: this.toggleReadme,
					title: readmeIsVisible ? 'Hide Readme' : 'Show Readme',
					type: 'button',
				}) : null,
			),
			React.createElement(
				'div',
				{ className: 'fx-page__content' },
				React.createElement(
					Row,
					null,
					React.createElement(
						Col,
						null,
						React.createElement(
							'div',
							{ className: 'fx-page__content__inner' },
							specElements,
						),
					),
					readmeIsVisible ? React.createElement(
						Col,
						{ width: 380 },
						React.createElement(Markdown, {
							className: 'Markdown',
							source: readme,
						}),
					) : null,
				),
			),
		);
	}
}

export default ExplorerFieldType;
