/**
 * @fileoverview This file contains the PopoutPane component, which is used to
 * render a pane in a popout. It calls props.onLayout when the component mounts.
 */
import React from 'react';
import blacklist from 'blacklist';
import classnames from 'classnames';

/**
 * Renders a popout pane.
 *
 * @param {object} props The properties for the component.
 * @param {React.Element} props.children The children to render.
 * @param {string} props.className The class name for the component.
 * @param {function} props.onLayout The function to call when the component mounts.
 * @returns {React.Element} The rendered component.
 */
var PopoutPane = React.createClass({
	displayName: 'PopoutPane',
	propTypes: {
		children: React.PropTypes.node.isRequired,
		className: React.PropTypes.string,
		onLayout: React.PropTypes.func,
	},
	getDefaultProps () {
		return {
			onLayout: () => {},
		};
	},
	componentDidMount () {
		this.props.onLayout(this.refs.el.offsetHeight);
	},
	/**
	 * Renders the component.
	 *
	 * @returns {React.Element} The rendered component.
	 */
	render () {
		const className = classnames('Popout__pane', this.props.className);
		const props = blacklist(this.props, 'className', 'onLayout');

		return (
			<div ref="el" className={className} {...props} />
		);
	},
});

module.exports = PopoutPane;
