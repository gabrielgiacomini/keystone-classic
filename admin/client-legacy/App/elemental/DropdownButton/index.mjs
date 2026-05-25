/* eslint quote-props: ["error", "as-needed"] */

import React from 'react';
import { css } from 'glamor';
import Button from '../Button/index.mjs';

/**
 * A Button variant that appends a small CSS-triangle arrow after its children,
 * indicating a dropdown or menu trigger. All extra props are forwarded to the
 * underlying Button component.
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - Content rendered inside the button, before the arrow.
 * @returns {React.ReactElement} A Button element containing the children and a styled arrow span.
 */
function DropdownButton ({ children, ...props }) {
	return (
		<Button {...props}>
			{children}
			<span className={css(classes.arrow)} />
		</Button>
	);
};

// NOTE
// 1: take advantage of `currentColor` by leaving border top color undefined
// 2: even though the arrow is vertically centered, visually it appears too low
//    because of lowercase characters beside it
const classes = {
	arrow: {
		borderLeft: '0.3em solid transparent',
		borderRight: '0.3em solid transparent',
		borderTop: '0.3em solid', // 1
		display: 'inline-block',
		height: 0,
		marginTop: '-0.125em', // 2
		verticalAlign: 'middle',
		width: 0,

		// add spacing
		':first-child': {
			marginRight: '0.5em',
		},
		':last-child': {
			marginLeft: '0.5em',
		},
	},
};

export default DropdownButton;
