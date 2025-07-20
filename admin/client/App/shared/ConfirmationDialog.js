/**
 * @fileoverview This file contains the ConfirmationDialog component, which renders a
 * confirmation dialog modal.
 */
import React, { PropTypes } from 'react';
import { Button, Modal } from '../elemental';

/**
 * Renders a confirmation dialog modal.
 *
 * @param {object} props The properties for the component.
 * @param {string} props.cancelLabel The label for the cancel button.
 * @param {React.Element} props.children The children to render in the modal body.
 * @param {string} props.confirmationLabel The label for the confirmation button.
 * @param {string} props.confirmationType The type of confirmation button.
 * @param {string} props.html The HTML to render in the modal body.
 * @param {boolean} props.isOpen Whether the modal is open.
 * @param {function} props.onCancel The function to call when the cancel button is clicked.
 * @param {function} props.onConfirmation The function to call when the confirmation button is clicked.
 * @returns {React.Element} The rendered component.
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
				<Button autoFocus size="small" data-button-type="confirm" color={confirmationType} onClick={onConfirmation}>
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
