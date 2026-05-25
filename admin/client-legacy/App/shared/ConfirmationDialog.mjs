/**
 * Renders a confirmation dialog modal
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from '../elemental/index.mjs';

/**
 * A modal dialog that asks the user to confirm or cancel an action.
 *
 * Renders a Modal.Dialog containing either raw HTML or React children as the
 * body, plus a footer with a confirm button and a cancel button. Passing both
 * `children` and `html` at the same time is an error; only one should be used.
 * @param {object}        props                Component props.
 * @param {string}        props.cancelLabel       Label for the cancel button.
 * @param {React.Node}    props.children          React child nodes to render as the body.
 * @param {string}        props.confirmationLabel Label for the confirm button.
 * @param {string}        props.confirmationType  Button color variant for the confirm button
 *                                                ('danger', 'primary', 'success', or 'warning').
 * @param {string}        props.html              Raw HTML string to render as the body
 *                                                (mutually exclusive with children).
 * @param {boolean}       props.isOpen            Whether the dialog is currently visible.
 * @param {function()}    props.onCancel          Callback invoked when the user cancels.
 * @param {function()}    props.onConfirmation    Callback invoked when the user confirms.
 * @returns {React.Element} The rendered confirmation dialog.
 */
function ConfirmationDialog ({
	cancelLabel,
	children,
	confirmationLabel,
	confirmationType,
	html,
	isOpen,
	onCancel,
	onConfirmation,
	...props
}) {
	// Property Violation
	if (children && html) {
		console.error('Warning: FormNote cannot render `children` and `html`. You must provide one or the other.');
	}

	return (
		<Modal.Dialog
			backdropClosesModal
			data-confirm-dialog
			isOpen={isOpen}
			onClose={onCancel}
			width={400}
		>
			{html ? (
				<Modal.Body {...props} dangerouslySetInnerHTML={{ __html: html }} />
			) : (
				<Modal.Body {...props}>{children}</Modal.Body>
			)}
			<Modal.Footer>
				<Button
					autoFocus
					size="small"
					data-button-type="confirm"
					data-confirm-delete={confirmationLabel === 'Delete' ? true : undefined}
					color={confirmationType}
					onClick={onConfirmation}
				>
					{confirmationLabel}
				</Button>
				<Button size="small" data-button-type="cancel" variant="link" color="cancel" onClick={onCancel}>
					{cancelLabel}
				</Button>
			</Modal.Footer>
		</Modal.Dialog>
	);
};
ConfirmationDialog.propTypes = {
	body: PropTypes.string,
	cancelLabel: PropTypes.string,
	confirmationLabel: PropTypes.string,
	confirmationType: PropTypes.oneOf(['danger', 'primary', 'success', 'warning']),
	onCancel: PropTypes.func,
	onConfirmation: PropTypes.func,
};
ConfirmationDialog.defaultProps = {
	cancelLabel: 'Cancel',
	confirmationLabel: 'Okay',
	confirmationType: 'danger',
	isOpen: false,
};

export default ConfirmationDialog;
