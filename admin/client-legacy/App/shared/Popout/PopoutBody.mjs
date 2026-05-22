/**
 * Render the body of a popout
 */

import React from 'react';

import classnames from 'classnames';

const PopoutBody = React.createClass({
	displayName: 'PopoutBody',
	propTypes: {
		children: React.PropTypes.node.isRequired,
		className: React.PropTypes.string,
		scrollable: React.PropTypes.bool,
	},
	render () {
		const className = classnames('Popout__body', {
			'Popout__scrollable-area': this.props.scrollable,
		}, this.props.className);
		const { className: _cn, scrollable: _sc, ...props } = this.props;

		return (
			<div className={className} {...props} />
		);
	},
});

export default PopoutBody;
