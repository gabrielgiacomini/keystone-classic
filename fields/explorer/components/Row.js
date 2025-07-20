/**
 * @fileoverview
 * This component is a layout utility for creating rows in the Field Types
 * Explorer. It's a simple wrapper around a div that applies flexbox styles.
 */
import React, { Component, PropTypes } from 'react';

class ExplorerRow extends Component {
	/**
	 * Get the child context.
	 *
	 * @return {object} The child context.
	 */
	getChildContext () {
		return {
			isCollapsed: this.props.isCollapsed,
		};
	}
	render () {
		const { className, gutter, isCollapsed, style = {}, ...incidentalProps } = this.props;

		// Apply styles based on whether the row is collapsed
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
	style: PropTypes.object, // Note: was PropTypes.string, should be object
};
ExplorerRow.defaultProps = {
	gutter: 10,
};

module.exports = ExplorerRow;
