/**
 * @fileoverview This file contains the MobileListItem component, which represents
 * a list item in the mobile navigation.
 */
import React from 'react';
import { Link } from 'react-router';

/**
 * Renders a list item in the mobile navigation.
 *
 * @param {object} props The properties for the component.
 * @param {React.Element} props.children The children to render.
 * @param {string} props.className The class name for the component.
 * @param {string} props.href The href for the link.
 * @param {function} props.onClick The function to call when the link is clicked.
 * @returns {React.Element} The rendered component.
 */
const MobileListItem = React.createClass({
	displayName: 'MobileListItem',
	propTypes: {
		children: React.PropTypes.node.isRequired,
		className: React.PropTypes.string,
		href: React.PropTypes.string.isRequired,
		onClick: React.PropTypes.func,
	},
	/**
	 * Renders the component.
	 *
	 * @returns {React.Element} The rendered component.
	 */
	render () {
		return (
			<Link
				className={this.props.className}
				to={this.props.href}
				onClick={this.props.onClick}
				tabIndex="-1"
			>
				{this.props.children}
			</Link>
		);
	},
});

module.exports = MobileListItem;
