/**
 * Render a popout list heading
 */

import React from 'react';

import classnames from 'classnames';

const PopoutListHeading = React.createClass({
	displayName: 'PopoutListHeading',
	propTypes: {
		children: React.PropTypes.node.isRequired,
		className: React.PropTypes.string,
	},
	render () {
		const className = classnames('PopoutList__heading', this.props.className);
		const { className: _cn, ...props } = this.props;

		return (
			<div className={className} {...props} />
		);
	},
});

export default PopoutListHeading;
