/**
 * Render a popout pane, calls props.onLayout when the component mounts
 */

import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const PopoutPane = createReactClass({
	displayName: 'PopoutPane',
	propTypes: {
		children: PropTypes.node.isRequired,
		className: PropTypes.string,
		onLayout: PropTypes.func,
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
