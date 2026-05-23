/**
 * A navigation item of the secondary navigation
 */

import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

const SecondaryNavItem = createReactClass({
	displayName: 'SecondaryNavItem',
	propTypes: {
		children: PropTypes.node.isRequired,
		className: PropTypes.string,
		href: PropTypes.string.isRequired,
		onClick: PropTypes.func,
		path: PropTypes.string,
		title: PropTypes.string,
	},
	render () {
		return (
			<li
				className={this.props.className}
				data-nav-list-link="true"
				data-list-path={this.props.path}
			>
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

export default SecondaryNavItem;
