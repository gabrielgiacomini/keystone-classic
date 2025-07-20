/**
 * @fileoverview This file contains the PopoutBody component, which is used to
 * render the body of a popout.
 */
import React from 'react';
import blacklist from 'blacklist';
import classnames from 'classnames';

/**
 * Renders the body of a popout.
 *
 * @param {object} props The properties for the component.
 * @param {React.Element} props.children The children to render.
 * @param {string} props.className The class name for the component.
 * @param {boolean} props.scrollable Whether the body should be scrollable.
 * @returns {React.Element} The rendered component.
 */
var PopoutBody = React.createClass({
	displayName: 'PopoutBody',
	propTypes: {
		children: React.PropTypes.node.isRequired,
		className: React.PropTypes.string,
		scrollable: React.PropTypes.bool,
	},
	/**
	 * Renders the component.
	 *
	 * @returns {React.Element} The rendered component.
	 */
	render () {
		const className = classnames('Popout__body', {
			'Popout__scrollable-area': this.props.scrollable,
		}, this.props.className);
		const props = blacklist(this.props, 'className', 'scrollable');

		return (
			<div className={className} {...props} />
		);
	},
});

module.exports = PopoutBody;
