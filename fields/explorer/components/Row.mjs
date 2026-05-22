/**
 * @file
 * This file defines the `Row` component, a layout component used in the
 * KeystoneJS Field Types Explorer. It's a simple row component that can be
 * used with `Col` components to create a grid layout.
 */
import React, { Component, PropTypes } from 'react';

/**
 * A row component for the explorer.
 * @augments React.Component
 */
class ExplorerRow extends Component {
	/**
	 * Gets the child context for the component.
	 * @returns {object} The child context.
	 */
	getChildContext () {
		return {
			isCollapsed: this.props.isCollapsed,
		};
	}
	/**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */
	render () {
		const { className, gutter, isCollapsed, style = {}, ...incidentalProps } = this.props;
		const __style__ = isCollapsed ? style : {
			display: 'flex',
			flexWrap: 'wrap',
			marginLeft: gutter * -1,
			marginRight: gutter * -1,
			...style,
		};
		const __className__ = 'ExplorerRow' + (className
			? ' ' + className
			: '');

		return (
			<div
				{...incidentalProps}
				className={__className__}
				style={__style__}
			/>
		);
	}
};
ExplorerRow.childContextTypes = {
	isCollapsed: PropTypes.bool,
};
ExplorerRow.propTypes = {
	className: PropTypes.string,
	gutter: PropTypes.number,
	isCollapsed: PropTypes.bool,
	style: PropTypes.string,
};
ExplorerRow.defaultProps = {
	gutter: 10,
};

export default ExplorerRow;
