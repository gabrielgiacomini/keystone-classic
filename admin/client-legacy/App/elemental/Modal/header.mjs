import React, { PropTypes } from 'react';
import { css } from 'glamor';
import GlyphButton from '../GlyphButton/index.mjs';
import theme from '../../../theme.mjs';

/**
 * Renders the header section of a modal dialog.
 *
 * Displays either a text title or arbitrary children inside a flex container,
 * and optionally renders a close button on the right when `showCloseButton` is
 * true and the `onClose` context function is provided.
 *
 * Passing both `children` and `text` at the same time is not supported; a
 * console error is emitted if both are present and only `text` is rendered.
 * @param {object} props - Component props.
 * @param {React.Node} [props.children] - Content to render when `text` is not provided.
 * @param {string} [props.className] - Additional glamor CSS class applied to the header element.
 * @param {boolean} [props.showCloseButton] - When true, renders a close button if `onClose` is available in context.
 * @param {string} [props.text] - Title text rendered inside an h4 element.
 * @param {object} context - React context.
 * @param {() => void} context.onClose - Callback invoked when the close button is clicked.
 * @returns {React.Element} The rendered modal header element.
 */
function ModalHeader ({
	children,
	className,
	showCloseButton,
	text,
	...props
}, {
	onClose,
}) {
	// Property Violation
	if (children && text) {
		console.error('Warning: ModalHeader cannot render `children` and `text`. You must provide one or the other.');
	}

	return (
		<div {...props} className={css(classes.header, className)}>
			<div className={css(classes.grow)}>
				{text ? (
					<h4 className={css(classes.text)}>
						{text}
					</h4>
				) : children}
			</div>
			{!!onClose && showCloseButton && (
				<GlyphButton
					cssStyles={classes.close}
					color="cancel"
					glyph="x"
					onClick={onClose}
					variant="link"
				/>
			)}
		</div>
	);
};

ModalHeader.propTypes = {
	children: PropTypes.node,
	onClose: PropTypes.func,
	showCloseButton: PropTypes.bool,
	text: PropTypes.string,
};
ModalHeader.contextTypes = {
	onClose: PropTypes.func.isRequired,
};

const classes = {
	header: {
		alignItems: 'center',
		borderBottom: `2px solid ${theme.color.gray10}`,
		display: 'flex',
		paddingBottom: theme.modal.padding.header.vertical,
		paddingLeft: theme.modal.padding.header.horizontal,
		paddingRight: theme.modal.padding.header.horizontal,
		paddingTop: theme.modal.padding.header.vertical,
	},

	// fill space to push the close button right
	grow: {
		flexGrow: 1,
	},

	// title text
	text: {
		color: 'inherit',
		fontSize: 18,
		fontWeight: 500,
		lineHeight: 1,
		margin: 0,
	},
};

export default ModalHeader;
