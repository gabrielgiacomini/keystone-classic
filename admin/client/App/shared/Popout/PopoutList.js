/**
 * @fileoverview This file contains the PopoutList component, which is used to
 * render a popout list. It can also use PopoutListItem and PopoutListHeading.
 */
import React from 'react';
import blacklist from 'blacklist';
import classnames from 'classnames';

/**
 * Renders a popout list.
 *
 * @param {object} props The properties for the component.
 * @param {React.Element} props.children The children to render.
 * @param {string} props.className The class name for the component.
 * @returns {React.Element} The rendered component.
 */
const PopoutList = React.createClass({
	displayName: 'PopoutList',
	propTypes: {
		children: React.PropTypes.node.isRequired,
		className: React.PropTypes.string,
	},
	/**
	 * Renders the component.
	 *
	 * @returns {React.Element} The rendered component.
	 */
	render () {
		const className = classnames('PopoutList', this.props.className);
		const props = blacklist(this.props, 'className');

		return (
			<div className={className} {...props} />
		);
	},
});

module.exports = PopoutList;

// expose the child to the top level export
/**
 * The PopoutListItem component.
 * @type {React.Component}
 */
module.exports.Item = require('./PopoutListItem');

/**
 * The PopoutListHeading component.
 * @type {React.Component}
 */
module.exports.Heading = require('./PopoutListHeading');
