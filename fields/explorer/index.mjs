/**
 * @file
 * This file is the main entry point for the KeystoneJS Field Types Explorer.
 * It sets up the React Router and renders the main `App` component.
 *
 * The explorer is a tool that allows developers to see all of the available
 * field types in KeystoneJS, and to interact with them in a live environment.
 * @see {@link http://localhost:8001}
 */
import React, { Children, cloneElement, Component, PropTypes } from 'react';
import { Link, Router, Route, browserHistory, IndexRoute } from 'react-router';
import ReactDOM from 'react-dom';
import FieldType from './components/FieldType.mjs';

import Boolean from '../types/boolean/test/explorer.mjs';
import Code from '../types/code/test/explorer.mjs';
import Color from '../types/color/test/explorer.mjs';
import CloudinaryImage from '../types/cloudinaryimage/test/explorer.mjs';
import CloudinaryImages from '../types/cloudinaryimages/test/explorer.mjs';
import Date from '../types/date/test/explorer.mjs';
import DateArray from '../types/datearray/test/explorer.mjs';
import Datetime from '../types/datetime/test/explorer.mjs';
import Email from '../types/email/test/explorer.mjs';
import Geopoint from '../types/geopoint/test/explorer.mjs';
import Html from '../types/html/test/explorer.mjs';
import Key from '../types/key/test/explorer.mjs';
import Location from '../types/location/test/explorer.mjs';
import Markdown from '../types/markdown/test/explorer.mjs';
import Money from '../types/money/test/explorer.mjs';
import Name from '../types/name/test/explorer.mjs';
import Number from '../types/number/test/explorer.mjs';
import NumberArray from '../types/numberarray/test/explorer.mjs';
import Password from '../types/password/test/explorer.mjs';
import Select from '../types/select/test/explorer.mjs';
import Relationship from '../types/relationship/test/explorer.mjs';
import Text from '../types/text/test/explorer.mjs';
import Textarea from '../types/textarea/test/explorer.mjs';
import TextArray from '../types/textarray/test/explorer.mjs';
import Url from '../types/url/test/explorer.mjs';

const Types = {
	Boolean, Code, Color, CloudinaryImage, CloudinaryImages, Date, DateArray,
	Datetime, Email, Geopoint, Html, Key, Location, Markdown, Money, Name,
	Number, NumberArray, Password, Select, Relationship, Text, Textarea,
	TextArray, Url,
};

/**
 * Generates the navigation sections for the sidebar.
 * @param {Array} arr The array of field types.
 * @returns {object} The navigation sections.
 */
function generateNavSections (arr) {
	const navSections = {};
	arr.forEach((t) => {
		if (!navSections[t.section]) navSections[t.section] = [];
	});
	arr.forEach(t => navSections[t.section].push(t.Field.type));

	return navSections;
}

const navSections = generateNavSections(Object.keys(Types).map(i => Types[i]));

/**
 * The main component for the Field Types Explorer.
 * @augments React.Component
 */
class App extends Component {
	static propTypes = {
		children: PropTypes.node,
		params: PropTypes.object,
	};
	constructor () {
		super();
		this.toggleSidebar = this.toggleSidebar.bind(this);
		this.state = { sidebarIsOpen: true };
	}
	/**
	 * Toggles the sidebar's visibility.
	 */
	toggleSidebar () {
		this.setState({ sidebarIsOpen: !this.state.sidebarIsOpen });
	}
	/**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */
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
					if (!params.type) return child;

					const Type = Types[params.type];

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

/**
 * The home page component.
 * @param {object} _props The component's props (unused; reserved for router injection).
 * @returns {React.Element} The rendered component.
 */
const Home = (_props) => {
	return (
		<div className="fx-welcome">
			<div className="fx-welcome__inner">
				<h1 className="fx-welcome__heading">Welcome!</h1>
				<div className="fx-welcome__content">Select a field on the left to begin exploring...</div>
			</div>
		</div>
	);
};

ReactDOM.render(
	<Router history={browserHistory}>
		<Route path="/" component={App}>
			<IndexRoute component={Home} />
			<Route path=":type" component={FieldType} />
		</Route>
	</Router>,
	document.getElementById('explorer')
);
