/**
 * Render a popout list heading
 */

import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';

import classnames from 'classnames';

const PopoutListHeading = createReactClass({
	displayName: 'PopoutListHeading',
	propTypes: {
		children: PropTypes.node.isRequired,
		className: PropTypes.string,
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
