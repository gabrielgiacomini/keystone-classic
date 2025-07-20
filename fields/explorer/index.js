/**
 * @fileoverview
 * This is the main entry point for the Field Types Explorer UI. It renders the
 * sidebar navigation and the main content area, which is handled by react-router.
 *
 * @typedef {Object} FieldTypeExplorer
 * @property {React.ComponentType<any>} Field The field component.
 * @property {React.ComponentType<any>} Filter The filter component.
 * @property {any} value The initial value for the field.
 * @property {string} readme The readme content for the field.
 * @property {string} section The section the field belongs to.
 * @property {Object | Object[]} spec The field spec or an array of specs.
 *
 * @typedef {Object.<string, FieldTypeExplorer>} TypesObject
 *
 * @typedef {Object} AppProps
 * @property {React.ReactNode} children The children to render.
 * @property {{type: string}} params The router params.
 */
import React, { Children, cloneElement, Component } from 'react';
import { Link, Router, Route, browserHistory, IndexRoute } from 'react-router';
import ReactDOM from 'react-dom';
import FieldType from './components/FieldType';

// All the field type explorers
/** @type {TypesObject} */
const Types = {
	Boolean: require('../types/boolean/test/explorer'),
	Code: require('../types/code/test/explorer'),
	Color: require('../types/color/test/explorer'),
	CloudinaryImage: require('../types/cloudinaryimage/test/explorer'),
	CloudinaryImages: require('../types/cloudinaryimages/test/explorer'),
	Date: require('../types/date/test/explorer'),
	DateArray: require('../types/datearray/test/explorer'),
	Datetime: require('../types/datetime/test/explorer'),
	Email: require('../types/email/test/explorer'),
	Geopoint: require('../types/geopoint/test/explorer'),
	Html: require('../types/html/test/explorer'),
	Key: require('../types/key/test/explorer'),
	Location: require('../types/location/test/explorer'),
	Markdown: require('../types/markdown/test/explorer'),
	Money: require('../types/money/test/explorer'),
	Name: require('../types/name/test/explorer'),
	Number: require('../types/number/test/explorer'),
	NumberArray: require('../types/numberarray/test/explorer'),
	Password: require('../types/password/test/explorer'),
	Select: require('../types/select/test/explorer'),
	Relationship: require('../types/relationship/test/explorer'),
	Text: require('../types/text/test/explorer'),
	Textarea: require('../types/textarea/test/explorer'),
	TextArray: require('../types/textarray/test/explorer'),
	Url: require('../types/url/test/explorer'),
};

/**
 * Generates the navigation sections for the sidebar.
 *
 * @param {FieldTypeExplorer[]} arr The array of field types.
 * @return {Object.<string, string[]>} The navigation sections.
 */
function generateNavSections (arr) {
	const navSections = {};
	// Group types by section
	arr.forEach((t) => {
		if (!navSections[t.section]) navSections[t.section] = [];
	});
	// Populate sections with types
	arr.forEach(t => navSections[t.section].push(t.Field.type));

	return navSections;
}

const navSections = generateNavSections(Object.keys(Types).map(i => Types[i]));

class App extends Component {
	constructor () {
		super();
		this.toggleSidebar = this.toggleSidebar.bind(this);
		this.state = { sidebarIsOpen: true };
	}
	/**
	 * Toggles the visibility of the sidebar.
	 */
	toggleSidebar () {
		this.setState({ sidebarIsOpen: !this.state.sidebarIsOpen });
	}
	render () {
		const { children, params } = this.props;
		const { sidebarIsOpen } = this.state;

		return (
			<div className={`fx-wrapper ${sidebarIsOpen ? 'fx-wrapper--sidebar-is-open' : ''}`}>
				<div className="fx-sidebar">
					<div className="fx-sidebar__header">
						{params.type
							? <Link to="/" className="fx-sidebar__header__link">Field Types</Link>
							: 'Ready'}
						<div className="fx-sidebar__header__border" />
					</div>
					{/* Render the navigation sections */}
					{Object.keys(navSections).sort().map(section => {
						let currentSection;
						const types = navSections[section].map(type => {

							if (Types[params.type]) {
								currentSection = Types[params.type].section;
							}

							const itemClassName = params.type === type
								? 'fx-sidebar__item fx-sidebar__item--active'
								: 'fx-sidebar__item';

							return (
								<Link key={type} to={`/${type}`} className={itemClassName}>
									{type}
								</Link>
							);
						});

						const sectionClassName = currentSection === section
							? 'fx-sidebar__section fx-sidebar__section--active'
							: 'fx-sidebar__section';

						return (
							<div key={section} className={sectionClassName}>
								<div key={section} className="fx-sidebar__section__title">{section}</div>
								{types}
							</div>
						);
					})}
				</div>
				<div className="fx-body">{Children.map(children, (child) => {
					// If we're on the homepage, just render the child
					if (!params.type) return child;

					// Get the current field type
					const Type = Types[params.type];

					// Clone the child and pass in the props it needs
					return cloneElement(child, {
						FieldComponent: Type.Field,
						FilterComponent: Type.Filter,
						filter: Type.Filter.getDefaultValue(),
						readme: Type.readme,
						section: Type.section,
						spec: Type.spec,
						toggleSidebar: this.toggleSidebar,
						value: Type.spec.value,
					});
				})}</div>
			</div>
		);
	}
};
App.propTypes = {
	children: React.PropTypes.node,
	params: React.PropTypes.object,
};

const Home = (props) => {
	return (
		<div className="fx-welcome">
			<div className="fx-welcome__inner">
				<h1 className="fx-welcome__heading">Welcome!</h1>
				<div className="fx-welcome__content">Select a field on the left to begin exploring...</div>
			</div>
		</div>
	);
};

// Render the router
ReactDOM.render(
	<Router history={browserHistory}>
		<Route path="/" component={App}>
			<IndexRoute component={Home} />
			<Route path=":type" component={FieldType} />
		</Route>
	</Router>,
	document.getElementById('explorer')
);
