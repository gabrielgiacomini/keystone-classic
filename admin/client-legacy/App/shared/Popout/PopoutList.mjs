/**
 * Render a popout list. Can also use PopoutListItem and PopoutListHeading
 */

import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';

import classnames from 'classnames';
import PopoutListItem from './PopoutListItem.mjs';
import PopoutListHeading from './PopoutListHeading.mjs';

const PopoutList = createReactClass({
	displayName: 'PopoutList',
	propTypes: {
		children: PropTypes.node.isRequired,
		className: PropTypes.string,
	},
	render () {
		const className = classnames('PopoutList', this.props.className);
		const { className: _cn, ...props } = this.props;

		return (
			<div className={className} {...props} />
		);
	},
});

PopoutList.Item = PopoutListItem;
PopoutList.Heading = PopoutListHeading;

export default PopoutList;

// expose the child to the top level export
export {
	PopoutListItem as Item,
	PopoutListHeading as Heading,
};
