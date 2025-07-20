/**
 * @fileoverview The secondary navigation component. This component is used to
 * render the secondary navigation bar, which links to individual lists of a
 * section.
 */
import React from 'react';
import { connect } from 'react-redux';
import { Container } from '../../../elemental';

import {
	setActiveList,
} from '../../../screens/List/actions/active';
import SecondaryNavItem from './NavItem';

/**
 * The secondary navigation component.
 *
 * @param {object} props The component's properties.
 * @param {string} props.currentListKey The key of the current list.
 * @param {array} props.lists An array of lists to display.
 * @returns {React.Element} The rendered component.
 */
var SecondaryNavigation = React.createClass({
	displayName: 'SecondaryNavigation',
	propTypes: {
		currentListKey: React.PropTypes.string,
		lists: React.PropTypes.array.isRequired,
	},
	getInitialState () {
		return {};
	},
	// Handle resizing and hide this nav on mobile (i.e. < 768px) screens
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
			navIsVisible: this.props.lists && Object.keys(this.props.lists).length > 0 && window.innerWidth >= 768,
		});
	},
	/**
	 * Renders the navigation.
	 *
	 * @param {array} lists An array of lists to display.
	 * @returns {React.Element} The rendered navigation.
	 */
	renderNavigation (lists) {
		const navigation = Object.keys(lists).map((key) => {
			const list = lists[key];
			// Get the link and the classname
			const href = list.external ? list.path : `${Keystone.adminPath}/${list.path}`;
			const isActive = this.props.currentListKey && this.props.currentListKey === list.path;
			const className = isActive ? 'active' : null;
			const onClick = (evt) => {
				// If it's the currently active navigation item and we're not on the item view,
				// clear the query params on click
				if (isActive && !this.props.itemId) {
					evt.preventDefault();
					this.props.dispatch(
						setActiveList(this.props.currentList, this.props.currentListKey)
					);
				}
			};

			return (
				<SecondaryNavItem
					key={list.path}
					path={list.path}
					className={className}
					href={href}
					onClick={onClick}
				>
					{list.label}
				</SecondaryNavItem>
			);
		});

		return (
			<ul className="app-nav app-nav--secondary app-nav--left">
				{navigation}
			</ul>
		);
	},
	/**
	 * Renders the component.
	 *
	 * @returns {React.Element} The rendered component.
	 */
	render () {
		if (!this.state.navIsVisible) return null;

		return (
			<nav className="secondary-navbar">
				<Container clearFloatingChildren>
					{this.renderNavigation(this.props.lists)}
				</Container>
			</nav>
		);
	},
});

module.exports = connect((state) => {
	return {
		currentList: state.lists.currentList,
	};
})(SecondaryNavigation);
