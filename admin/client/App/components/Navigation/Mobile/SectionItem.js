/**
 * @fileoverview This file contains the MobileSectionItem component, which represents
 * a section in the mobile navigation.
 */
import React from 'react';
import MobileListItem from './ListItem';
import { Link } from 'react-router';

/**
 * Renders a section in the mobile navigation.
 *
 * @param {object} props The properties for the component.
 * @param {React.Element} props.children The children to render.
 * @param {string} props.className The class name for the component.
 * @param {string} props.currentListKey The key of the current list.
 * @param {string} props.href The href for the link.
 * @param {array} props.lists An array of lists to display.
 * @returns {React.Element} The rendered component.
 */
const MobileSectionItem = React.createClass({
	displayName: 'MobileSectionItem',
	propTypes: {
		children: React.PropTypes.node.isRequired,
		className: React.PropTypes.string,
		currentListKey: React.PropTypes.string,
		href: React.PropTypes.string.isRequired,
		lists: React.PropTypes.array,
	},
	/**
	 * Renders the lists.
	 *
	 * @returns {React.Element} The rendered lists.
	 */
	renderLists () {
		if (!this.props.lists || this.props.lists.length <= 1) return null;

		const navLists = this.props.lists.map((item) => {
			// Get the link and the classname
			const href = item.external ? item.path : `${Keystone.adminPath}/${item.path}`;
			const className = (this.props.currentListKey && this.props.currentListKey === item.path) ? 'MobileNavigation__list-item is-active' : 'MobileNavigation__list-item';

			return (
				<MobileListItem key={item.path} href={href} className={className} onClick={this.props.onClick}>
					{item.label}
				</MobileListItem>
			);
		});

		return (
			<div className="MobileNavigation__lists">
				{navLists}
			</div>
		);
	},
	/**
	 * Renders the component.
	 *
	 * @returns {React.Element} The rendered component.
	 */
	render () {
		return (
			<div className={this.props.className}>
				<Link
					className="MobileNavigation__section-item"
					to={this.props.href}
					tabIndex="-1"
					onClick={this.props.onClick}
				>
					{this.props.children}
				</Link>
				{this.renderLists()}
			</div>
		);
	},
});

module.exports = MobileSectionItem;
