/**
 * @fileoverview This file contains the mobile navigation component, which is
 * displayed on screens smaller than 768px.
 */
import React from 'react';
import Transition from 'react-addons-css-transition-group';

import MobileSectionItem from './SectionItem';

const ESCAPE_KEY_CODE = 27;

/**
 * The mobile navigation component.
 *
 * @param {object} props The properties for the component.
 * @param {string} props.brand The brand name.
 * @param {string} props.currentListKey The key of the current list.
 * @param {string} props.currentSectionKey The key of the current section.
 * @param {array} props.sections An array of sections to display.
 * @param {string} props.signoutUrl The URL for the signout link.
 * @returns {React.Element} The rendered component.
 */
const MobileNavigation = React.createClass({
	displayName: 'MobileNavigation',
	propTypes: {
		brand: React.PropTypes.string,
		currentListKey: React.PropTypes.string,
		currentSectionKey: React.PropTypes.string,
		sections: React.PropTypes.array.isRequired,
		signoutUrl: React.PropTypes.string,
	},
	getInitialState () {
		return {
			barIsVisible: false,
		};
	},
	// Handle showing and hiding the menu based on the window size when
	// resizing
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
			barIsVisible: window.innerWidth < 768,
		});
	},
	/**
	 * Toggles the menu.
	 */
	toggleMenu () {
		this[this.state.menuIsVisible ? 'hideMenu' : 'showMenu']();
	},
	/**
	 * Shows the menu.
	 */
	showMenu () {
		this.setState({
			menuIsVisible: true,
		});

		// Make the body unscrollable, so you can only scroll in the menu
		document.body.style.overflow = 'hidden';
		document.body.addEventListener('keyup', this.handleEscapeKey, false);
	},
	/**
	 * Hides the menu.
	 */
	hideMenu () {
		this.setState({
			menuIsVisible: false,
		});

		// Make the body scrollable again
		document.body.style.overflow = null;
		document.body.removeEventListener('keyup', this.handleEscapeKey, false);
	},
	/**
	 * If the escape key was pressed, hide the menu.
	 *
	 * @param {Event} event The event object.
	 */
	handleEscapeKey (event) {
		if (event.which === ESCAPE_KEY_CODE) {
			this.hideMenu();
		}
	},
	/**
	 * Renders the navigation.
	 *
	 * @returns {React.Element} The rendered navigation.
	 */
	renderNavigation () {
		if (!this.props.sections || !this.props.sections.length) return null;

		return this.props.sections.map((section) => {
			// Get the link and the classname
			const href = section.lists[0].external ? section.lists[0].path : `${Keystone.adminPath}/${section.lists[0].path}`;
			const className = (this.props.currentSectionKey && this.props.currentSectionKey === section.key) ? 'MobileNavigation__section is-active' : 'MobileNavigation__section';

			// Render a SectionItem
			return (
				<MobileSectionItem
					key={section.key}
					className={className}
					href={href}
					lists={section.lists}
					currentListKey={this.props.currentListKey}
					onClick={this.toggleMenu}
				>
					{section.label}
				</MobileSectionItem>
			);
		});
	},
	/**
	 * Renders a blockout.
	 *
	 * @returns {React.Element} The rendered blockout.
	 */
	renderBlockout () {
		if (!this.state.menuIsVisible) return null;

		return <div className="MobileNavigation__blockout" onClick={this.toggleMenu} />;
	},
	/**
	 * Renders the sidebar menu.
	 *
	 * @returns {React.Element} The rendered menu.
	 */
	renderMenu () {
		if (!this.state.menuIsVisible) return null;

		return (
			<nav className="MobileNavigation__menu">
				<div className="MobileNavigation__sections">
					{this.renderNavigation()}
				</div>
			</nav>
		);
	},
	/**
	 * Renders the component.
	 *
	 * @returns {React.Element} The rendered component.
	 */
	render () {
		if (!this.state.barIsVisible) return null;

		return (
			<div className="MobileNavigation">
				<div className="MobileNavigation__bar">
					<button
						type="button"
						onClick={this.toggleMenu}
						className="MobileNavigation__bar__button MobileNavigation__bar__button--menu"
					>
						<span className={'MobileNavigation__bar__icon octicon octicon-' + (this.state.menuIsVisible ? 'x' : 'three-bars')} />
					</button>
					<span className="MobileNavigation__bar__label">
						{this.props.brand}
					</span>
					<a
						href={this.props.signoutUrl}
						className="MobileNavigation__bar__button MobileNavigation__bar__button--signout"
					>
						<span className="MobileNavigation__bar__icon octicon octicon-sign-out" />
					</a>
				</div>
				<div className="MobileNavigation__bar--placeholder" />
				<Transition
					transitionName="MobileNavigation__menu"
					transitionEnterTimeout={260}
					transitionLeaveTimeout={200}
				>
					{this.renderMenu()}
				</Transition>
				<Transition
					transitionName="react-transitiongroup-fade"
					transitionEnterTimeout={0}
					transitionLeaveTimeout={0}
				>
					{this.renderBlockout()}
				</Transition>
			</div>
		);
	},
});

module.exports = MobileNavigation;
