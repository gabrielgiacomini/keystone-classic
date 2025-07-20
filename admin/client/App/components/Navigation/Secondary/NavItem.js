/**
 * @fileoverview This file contains the SecondaryNavItem component, which represents
 * a navigation item in the secondary navigation.
 */
import React from 'react';
import { Link } from 'react-router';

/**
 * Renders a navigation item for the secondary navigation.
 *
 * @param {object} props The properties for the component.
 * @param {React.Element} props.children The children to render.
 * @param {string} props.className The class name for the component.
 * @param {string} props.href The href for the link.
 * @param {function} props.onClick The function to call when the link is clicked.
 * @param {string} props.path The path for the link.
 * @param {string} props.title The title for the link.
 * @returns {React.Element} The rendered component.
 */
const SecondaryNavItem = React.createClass({
	displayName: 'SecondaryNavItem',
	propTypes: {
		children: React.PropTypes.node.isRequired,
		className: React.PropTypes.string,
		href: React.PropTypes.string.isRequired,
		onClick: React.PropTypes.func,
		path: React.PropTypes.string,
		title: React.PropTypes.string,
	},
	/**
	 * Renders the component.
	 *
	 * @returns {React.Element} The rendered component.
	 */
	render () {
		return (
			<li className={this.props.className} data-list-path={this.props.path}>
				<Link
					to={this.props.href}
					onClick={this.props.onClick}
					title={this.props.title}
					tabIndex="-1"
				>
					{this.props.children}
				</Link>
			</li>
		);
	},
});

module.exports = SecondaryNavItem;
