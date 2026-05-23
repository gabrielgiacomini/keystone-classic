/**
 * Render the body of a popout
 */

import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';

import classnames from 'classnames';

const PopoutBody = createReactClass({
	displayName: 'PopoutBody',
	propTypes: {
		children: PropTypes.node.isRequired,
		className: PropTypes.string,
		scrollable: PropTypes.bool,
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
