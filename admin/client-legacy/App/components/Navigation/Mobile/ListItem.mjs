/**
 * A list item of the mobile navigation
 */

import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import { Link } from '../../../../router.mjs';

const MobileListItem = createReactClass({
	displayName: 'MobileListItem',
	propTypes: {
		children: PropTypes.node.isRequired,
		className: PropTypes.string,
		href: PropTypes.string.isRequired,
		onClick: PropTypes.func,
	},
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

export default MobileListItem;
