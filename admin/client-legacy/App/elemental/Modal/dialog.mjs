import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import ScrollLock from '../ScrollLock/index.mjs';
import Portal from '../Portal/index.mjs';

import theme from '../../../theme.mjs';

const canUseDom = !!(
	typeof window !== 'undefined'
	&& window.document
	&& window.document.createElement
);

/**
 * A modal dialog component that renders its content inside a Portal and supports
 * backdrop click and keyboard (Escape) dismissal.
 */
class ModalDialog extends Component {
	/**
	 * Initialises the component and binds event-handler methods to the instance.
	 */
	constructor () {
		super();

		this.handleBackdropClick = this.handleBackdropClick.bind(this);
		this.handleKeyboardInput = this.handleKeyboardInput.bind(this);
	}
	/**
	 * Provides the `onClose` callback to descendant components via React context.
	 * @returns {object} Child context containing the `onClose` handler.
	 */
	getChildContext () {
		return {
			onClose: this.props.onClose,
		};
	}
	/**
	 * Adds or removes the global `keydown` listener when `isOpen` or
	 * `enableKeyboardInput` changes in the incoming props.
	 * @param {object} nextProps - The incoming props before the update is applied.
	 */
	UNSAFE_componentWillReceiveProps (nextProps) {
		if (!canUseDom) return;

		// add event listeners
		if (nextProps.isOpen && nextProps.enableKeyboardInput) {
			window.addEventListener('keydown', this.handleKeyboardInput);
		}
		if (!nextProps.isOpen && nextProps.enableKeyboardInput) {
			window.removeEventListener('keydown', this.handleKeyboardInput);
		}
	}
	/**
	 * Removes the global `keydown` listener when the component is unmounted.
	 */
	componentWillUnmount () {
		if (this.props.enableKeyboardInput) {
			window.removeEventListener('keydown', this.handleKeyboardInput);
		}
	}

	// ==============================
	// Methods
	// ==============================

	/**
	 * Calls `onClose` when the Escape key (keyCode 27) is pressed.
	 * @param {KeyboardEvent} event - The keydown event fired by the browser.
	 * @returns {boolean} Always returns `false`.
	 */
	handleKeyboardInput (event) {
		if (event.keyCode === 27) this.props.onClose();

		return false;
	}
	/**
	 * Calls `onClose` when the user clicks directly on the backdrop container
	 * rather than on the dialog itself.
	 * @param {MouseEvent} e - The click or touchend event fired on the container.
	 */
	handleBackdropClick (e) {
		if (e.target !== this.refs.container) return;

		this.props.onClose();
	}

	// ==============================
	// Renderers
	// ==============================

	/**
	 * Renders the backdrop and dialog box, or an empty placeholder when the
	 * dialog is closed.
	 * @returns {React.Element} The dialog element when open, or an empty `<span>` when closed.
	 */
	renderDialog () {
		const {
			backdropClosesModal,
			children,
			isOpen,
			width,
		} = this.props;
		const dataConfirmDialog = this.props['data-confirm-dialog'];

		if (!isOpen) return <span key="closed" />;

		return (
			<div
				className={css(classes.container)}
				key="open"
				ref="container"
				onClick={backdropClosesModal ? this.handleBackdropClick : undefined}
				onTouchEnd={backdropClosesModal ? this.handleBackdropClick : undefined}
			>
				<div
					className={css(classes.dialog)}
					style={{ width }}
					data-screen-id="modal-dialog"
					data-confirm-dialog={dataConfirmDialog}
				>
					{children}
				</div>
				<ScrollLock />
			</div>
		);
	}
	/**
	 * Renders the dialog inside a Portal so it is mounted at the document root.
	 * @returns {React.Element} A Portal wrapping the dialog output.
	 */
	render () {
		return (
			<Portal>
				{this.renderDialog()}
			</Portal>
		);
	}
};

ModalDialog.propTypes = {
	backdropClosesModal: PropTypes.bool,
	enableKeyboardInput: PropTypes.bool,
	isOpen: PropTypes.bool,
	onClose: PropTypes.func.isRequired,
	'data-confirm-dialog': PropTypes.bool,
	width: PropTypes.number,
};
ModalDialog.defaultProps = {
	enableKeyboardInput: true,
	width: 768,
};
ModalDialog.childContextTypes = {
	onClose: PropTypes.func.isRequired,
};

const classes = {
	container: {
		alignItems: 'center',
		backgroundColor: theme.modal.background,
		boxSizing: 'border-box',
		display: 'flex',
		height: '100%',
		justifyContent: 'center',
		left: 0,
		position: 'fixed',
		top: 0,
		width: '100%',
		zIndex: theme.modal.zIndex,
	},
	dialog: {
		backgroundColor: 'white',
		borderRadius: theme.borderRadius.default,
		maxHeight: '90%',
		overflowY: 'auto',
		paddingBottom: theme.modal.padding.dialog.vertical,
		paddingLeft: theme.modal.padding.dialog.horizontal,
		paddingRight: theme.modal.padding.dialog.horizontal,
		paddingTop: theme.modal.padding.dialog.vertical,
		position: 'relative',
	},
};

export default ModalDialog;
