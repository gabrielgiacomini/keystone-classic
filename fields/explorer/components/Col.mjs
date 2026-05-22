/**
 * @file
 * This file defines the `Col` component, a layout component used in the
 * KeystoneJS Field Types Explorer. It's a simple column component that can be
 * used within a `Row` to create a grid layout.
 */
import React, { PropTypes } from 'react';

/**
 * A column component for the explorer.
 * @param {object} props The component's props.
 * @param {object} context The component's context.
 * @returns {React.Element} The rendered component.
 */
const ExplorerCol = (props, context) => {
	const { className, gutter, style = {}, width, ...incidentalProps } = props;
	const { isCollapsed } = context;
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
	style: PropTypes.string,
	width: PropTypes.number,
};
ExplorerCol.defaultProps = {
	gutter: 10,
};

export default ExplorerCol;
