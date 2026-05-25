/**
 * A mobile section
 */

import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import MobileListItem from './ListItem.mjs';
import { Link } from '../../../../router.mjs';

const MobileSectionItem = createReactClass({
	displayName: 'MobileSectionItem',
	propTypes: {
		children: PropTypes.node.isRequired,
		className: PropTypes.string,
		currentListKey: PropTypes.string,
		href: PropTypes.string.isRequired,
		lists: PropTypes.array,
	},
	// Render the lists
	renderLists () {
		if (!this.props.lists || this.props.lists.length <= 1) return null;

		const navLists = this.props.lists.map((item) => {
			// Get the link and the classname
			const href = item.external ? item.path : `${Keystone.adminLegacyPath}/${item.path}`;
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

export default MobileSectionItem;
