/**
 * @fileoverview
 * This component is a layout utility for creating columns in the Field Types
 * Explorer. It's a simple wrapper around a div that applies flexbox styles.
 *
 * @typedef {Object} ExplorerColProps
 * @property {string} [className] - Additional class names to apply.
 * @property {number} [gutter] - The gutter between columns.
 * @property {React.CSSProperties} [style] - Custom styles to apply.
 * @property {number|string} [width] - The width of the column.
 *
 * @typedef {Object} ExplorerColContext
 * @property {boolean} [isCollapsed] - Whether the column is collapsed.
 */
import React, { PropTypes } from 'react';

/**
 * A column component for the explorer.
 *
 * @param {ExplorerColProps} props The component props.
 * @param {ExplorerColContext} context The component context.
 * @returns {React.ReactElement}
 */
const ExplorerCol = (props, context) => {
	const { className, gutter, style = {}, width, ...incidentalProps } = props;
	const { isCollapsed } = context;

	// Apply styles based on whether the column is collapsed
	const __style__ = isCollapsed ? style : {
		flex: width ? null : '1 1 0',
		minHeight: 1,
		paddingLeft: gutter,
		paddingRight: gutter,
		width: width || '100%',
		...style,
	};
	const __className__ = 'ExplorerCol' + (className
		? ' ' + className
		: '');

	return (
		<div
			{...incidentalProps}
			className={__className__}
			style={__style__}
		/>
	);
};
ExplorerCol.contextTypes = {
	isCollapsed: PropTypes.bool,
};
ExplorerCol.propTypes = {
	className: PropTypes.string,
	gutter: PropTypes.number,
	style: PropTypes.object,
	width: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
	]),
};
ExplorerCol.defaultProps = {
	gutter: 10,
};

module.exports = ExplorerCol;
