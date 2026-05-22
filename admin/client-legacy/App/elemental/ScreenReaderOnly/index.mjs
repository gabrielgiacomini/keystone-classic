import React from 'react';
import { css } from 'glamor';

/**
 * Renders a visually hidden `<span>` that remains accessible to screen readers.
 *
 * Applies the standard "sr-only" CSS technique (position absolute, 1×1 px,
 * clipped, overflow hidden) via glamor, merged with any additional `className`
 * supplied by the caller.
 * @param {object} props - Component props.
 * @param {string} [props.className] - Optional extra glamor class to merge with the sr-only styles.
 * @returns {React.Element} A `<span>` element with screen-reader-only styles applied.
 */
function ScreenReaderOnly ({ className, ...props }) {
	props.className = css(classes.srOnly, className);

	return <span {...props} />;
};

const classes = {
	srOnly: {
		border: 0,
		clip: 'rect(0,0,0,0)',
		height: 1,
		margin: -1,
		overflow: 'hidden',
		padding: 0,
		position: 'absolute',
		width: 1,
	},
};

export default ScreenReaderOnly;
