/**
 * @fileoverview This file contains the PopoutListHeading component, which is
 * used to render a heading for a popout list.
 */
import React from 'react';
import blacklist from 'blacklist';
import classnames from 'classnames';

/**
 * Renders a popout list heading.
 *
 * @param {object} props The properties for the component.
 * @param {React.Element} props.children The children to render.
 * @param {string} props.className The class name for the component.
 * @returns {React.Element} The rendered component.
 */
var PopoutListHeading = React.createClass({
	displayName: 'PopoutListHeading',
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
		const className = classnames('PopoutList__heading', this.props.className);
		const props = blacklist(this.props, 'className');

		return (
			<div className={className} {...props} />
		);
	},
});

module.exports = PopoutListHeading;
