/**
 * Render a popout pane, calls props.onLayout when the component mounts
 */

import React from 'react';
import classnames from 'classnames';

const PopoutPane = React.createClass({
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
	render () {
		const className = classnames('Popout__pane', this.props.className);
		const { className: _cn, onLayout: _ol, ...props } = this.props;

		return (
			<div ref="el" className={className} {...props} />
		);
	},
});

export default PopoutPane;
