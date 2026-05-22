import React, { PropTypes } from 'react';
import { css } from 'glamor';
import theme from '../../../theme.mjs';

/**
 * Renders the footer section of a modal dialog.
 *
 * Wraps its children in a flex container with themed padding and a top border.
 * Child content is aligned horizontally according to the `align` prop.
 * @param {object} props - Component props.
 * @param {'center'|'left'|'right'} props.align - Horizontal alignment of footer content. Defaults to `'left'`.
 * @param {string} [props.className] - Additional CSS class name merged with the footer styles.
 * @returns {React.Element} A `<div>` element styled as the modal footer.
 */
function ModalFooter ({
	align,
	className,
	...props
}) {
	return (
		<div {...props} className={css(classes.footer, classes['align__' + align], className)} />
	);
};

ModalFooter.propTypes = {
	align: PropTypes.oneOf(['center', 'left', 'right']),
	children: PropTypes.node,
	onClose: PropTypes.func,
	showCloseButton: PropTypes.bool,
	text: PropTypes.string,
};
ModalFooter.defaultProps = {
	align: 'left',
};

const classes = {
	footer: {
		borderTop: `2px solid ${theme.color.gray10}`,
		display: 'flex',
		paddingBottom: theme.modal.padding.footer.vertical,
		paddingLeft: theme.modal.padding.footer.horizontal,
		paddingRight: theme.modal.padding.footer.horizontal,
		paddingTop: theme.modal.padding.footer.vertical,
	},

	// alignment
	align__left: {
		justifyContent: 'flex-start',
	},
	align__center: {
		justifyContent: 'center',
	},
	align__right: {
		justifyContent: 'flex-end',
	},
};

export default ModalFooter;
