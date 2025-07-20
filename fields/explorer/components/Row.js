/**
 * @fileoverview
 * This component is a layout utility for creating rows in the Field Types
 * Explorer. It's a simple wrapper around a div that applies flexbox styles.
 *
 * @typedef {Object} ExplorerRowProps
 * @property {string} [className] - Additional class names to apply.
 * @property {number} [gutter] - The gutter between columns.
 * @property {boolean} [isCollapsed] - Whether the row is collapsed.
 * @property {React.CSSProperties} [style] - Custom styles to apply.
 */
import React, { Component, PropTypes } from 'react';

class ExplorerRow extends Component {
	/**
	 * Get the child context.
	 *
	 * @return {{isCollapsed: boolean}} The child context.
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
	style: PropTypes.object,
};
ExplorerRow.defaultProps = {
	gutter: 10,
};

module.exports = ExplorerRow;
