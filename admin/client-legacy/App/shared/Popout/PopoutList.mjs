/**
 * Render a popout list. Can also use PopoutListItem and PopoutListHeading
 */

import React from 'react';

import classnames from 'classnames';
import PopoutListItem from './PopoutListItem.mjs';
import PopoutListHeading from './PopoutListHeading.mjs';

const PopoutList = React.createClass({
	displayName: 'PopoutList',
	propTypes: {
		children: React.PropTypes.node.isRequired,
		className: React.PropTypes.string,
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
