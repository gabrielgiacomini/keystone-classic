/**
 * @fileoverview This file contains the primary navigation component.
 * This component is responsible for rendering the primary navigation bar on
 * desktop, which includes all sections, the home button, the website button,
 * and the signout button.
 */
import React from 'react';
import { Container } from '../../../elemental';
import PrimaryNavItem from './NavItem';

/**
 * The primary navigation component.
 *
 * @param {object} props The properties for the component.
 * @param {string} props.brand The brand name.
 * @param {string} props.currentSectionKey The key of the current section.
 * @param {array} props.sections An array of sections to display.
 * @param {string} props.signoutUrl The URL for the signout link.
 * @returns {React.Element} The rendered component.
 */
var PrimaryNavigation = React.createClass({
	displayName: 'PrimaryNavigation',
	propTypes: {
		brand: React.PropTypes.string,
		currentSectionKey: React.PropTypes.string,
		sections: React.PropTypes.array.isRequired,
		signoutUrl: React.PropTypes.string,
	},
	getInitialState () {
		return {};
	},
	// Handle resizing, hide this navigation on mobile (i.e. < 768px) screens
	componentDidMount () {
		this.handleResize();
		window.addEventListener('resize', this.handleResize);
	},
	componentWillUnmount () {
		window.removeEventListener('resize', this.handleResize);
	},
	/**
	 * Handles the resize event.
	 */
	handleResize () {
		this.setState({
			navIsVisible: window.innerWidth >= 768,
		});
	},
	/**
	 * Renders the signout button.
	 *
	 * @returns {React.Element} The rendered signout button.
	 */
	renderSignout () {
		if (!this.props.signoutUrl) return null;

		return (
			<PrimaryNavItem
				label="octicon-sign-out"
				href={this.props.signoutUrl}
				title="Sign Out"
			>
				<span className="octicon octicon-sign-out" />
			</PrimaryNavItem>
		);
	},
	/**
	 * Renders the back button.
	 *
	 * @returns {React.Element} The rendered back button.
	 */
	renderBackButton () {
		if (!Keystone.backUrl) return null;

		return (
			<PrimaryNavItem
				label="octicon-globe"
				href={Keystone.backUrl}
				title={'Front page - ' + this.props.brand}
			>
				<span className="octicon octicon-globe" />
			</PrimaryNavItem>
		);
	},
	/**
	 * Renders the link to the front page.
	 *
	 * @returns {React.Element} The rendered link.
	 */
	renderFrontLink () {
		return (
			<ul className="app-nav app-nav--primary app-nav--right">
				{this.renderBackButton()}
				{this.renderSignout()}
			</ul>
		);
	},
	/**
	 * Renders the brand.
	 *
	 * @returns {React.Element} The rendered brand.
	 */
	renderBrand () {
		// TODO: support navbarLogo from keystone config

		const { brand, currentSectionKey } = this.props;
		const className = currentSectionKey === 'dashboard' ? 'primary-navbar__brand primary-navbar__item--active' : 'primary-navbar__brand';

		return (
			<PrimaryNavItem
				className={className}
				label="octicon-home"
				title={'Dashboard - ' + brand}
				to={Keystone.adminPath}
			>
				<span className="octicon octicon-home" />
			</PrimaryNavItem>
		);
	},
	/**
	 * Renders the navigation.
	 *
	 * @returns {React.Element} The rendered navigation.
	 */
	renderNavigation () {
		if (!this.props.sections || !this.props.sections.length) return null;

		return this.props.sections.map((section) => {
			// Get the link and the class name
			const to = !section.lists[0].external && `${Keystone.adminPath}/${section.lists[0].path}`;
			const href = section.lists[0].external && section.lists[0].path;
			const isActive = this.props.currentSectionKey && this.props.currentSectionKey === section.key;
			const className = isActive ? 'primary-navbar__item--active' : null;

			return (
				<PrimaryNavItem
					active={isActive}
					key={section.key}
					label={section.label}
					className={className}
					to={to}
					href={href}
				>
					{section.label}
				</PrimaryNavItem>
			);
		});
	},
	/**
	 * Renders the component.
	 *
	 * @returns {React.Element} The rendered component.
	 */
	render () {
		if (!this.state.navIsVisible) return null;

		return (
			<nav className="primary-navbar">
				<Container clearFloatingChildren>
					<ul className="app-nav app-nav--primary app-nav--left">
						{this.renderBrand()}
						{this.renderNavigation()}
					</ul>
					{this.renderFrontLink()}
				</Container>
			</nav>
		);
	},
});

module.exports = PrimaryNavigation;
