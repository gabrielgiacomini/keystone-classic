import React from 'react';
import { css } from 'glamor';
import theme from '../../../theme.mjs';

/**
 * Renders the body section of a modal dialog.
 *
 * Applies modal body padding from the theme and merges any additional
 * className or props onto the underlying div element.
 * @param {object} props - Component props.
 * @param {string} [props.className] - Additional CSS class name to apply.
 * @returns {React.Element} A styled div element containing the modal body content.
 */
function ModalBody ({
	className,
	...props
}) {
	return (
		<div
			className={css(classes.body, className)}
			{...props}
		/>
	);
};

const classes = {
	body: {
		paddingBottom: theme.modal.padding.body.vertical,
		paddingLeft: theme.modal.padding.body.horizontal,
		paddingRight: theme.modal.padding.body.horizontal,
		paddingTop: theme.modal.padding.body.vertical,
	},
};

export default ModalBody;
