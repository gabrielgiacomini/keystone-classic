/**
 * @file
 * This file defines the `FileField` component, which is used to render a file
 * field in the KeystoneJS Admin UI.
 *
 * It provides a button to upload a file, and it displays the name of the
 * uploaded file. It also provides a button to remove the file.
 */
import Field from '../Field.mjs';
import React from 'react';
import Button from '../../../admin/client-legacy/App/elemental/Button/index.mjs';
import FormField from '../../../admin/client-legacy/App/elemental/FormField/index.mjs';
import FormInput from '../../../admin/client-legacy/App/elemental/FormInput/index.mjs';
import FormNote from '../../../admin/client-legacy/App/elemental/FormNote/index.mjs';
import FileChangeMessage from '../../components/FileChangeMessage.mjs';
import HiddenFileInput from '../../components/HiddenFileInput.mjs';
import ImageThumbnail from '../../components/ImageThumbnail.mjs';

let uploadInc = 1000;

/**
 * Returns the initial state of the component.
 * @param {object} props The component's props.
 * @returns {object} The initial state.
 */
const buildInitialState = (props) => ({
	action: null,
	removeExisting: false,
	uploadFieldPath: `File-${props.path}-${++uploadInc}`,
	userSelectedFile: null,
});

/**
 * The `FileField` component.
 * @augments Field
 */
export default Field.create({
	statics: {
		type: 'File',
		getDefaultValue: () => ({}),
	},
	/**
	 * Gets the initial state of the component.
	 * @returns {object} The initial state.
	 */
	getInitialState () {
		return buildInitialState(this.props);
	},
	/**
	 * Determines whether the field should be collapsed.
	 * @returns {boolean} Whether the field should be collapsed.
	 */
	shouldCollapse () {
		return this.props.collapse && !this.hasExisting();
	},
	/**
	 * Handles the component receiving new props.
	 * @param {object} nextProps The new props.
	 */
	componentDidUpdate (prevProps) {
		// Show the new filename when it's finished uploading
		if (prevProps.value.filename !== this.props.value.filename) {
			this.setState(buildInitialState(this.props));
		}
	},

	// ==============================
	// HELPERS
	// ==============================

	/**
	 * Returns whether the field has a file.
	 * @returns {boolean} Whether the field has a file.
	 */
	hasFile () {
		return this.hasExisting() || !!this.state.userSelectedFile;
	},
	/**
	 * Returns whether the field has an existing file.
	 * @returns {boolean} Whether the field has an existing file.
	 */
	hasExisting () {
		return this.props.value && !!this.props.value.filename;
	},
	/**
	 * Returns the name of the file.
	 * @returns {string} The name of the file.
	 */
	getFilename () {
		return this.state.userSelectedFile
			? this.state.userSelectedFile.name
			: this.props.value.filename;
	},
	/**
	 * Returns the URL of the file.
	 * @returns {string} The URL of the file.
	 */
	getFileUrl () {
		return this.props.value && this.props.value.url;
	},
	/**
	 * Returns whether the file is an image.
	 * @returns {boolean} Whether the file is an image.
	 */
	isImage () {
		const href = this.props.value ? this.props.value.url : undefined;
		return href && href.match(/\.(jpeg|jpg|gif|png|svg)$/i) != null;
	},

	// ==============================
	// METHODS
	// ==============================

	/**
	 * Triggers the file browser.
	 */
	triggerFileBrowser () {
		this.fileInput.clickDomNode();
	},
	/**
	 * Handles a change in the file input.
	 * @param {object} event The event object.
	 */
	handleFileChange (event) {
		const userSelectedFile = event.target.files[0];

		this.setState({
			userSelectedFile: userSelectedFile,
		});
	},
	/**
	 * Handles the removal of a file.
	 * @param {object} e The event object.
	 */
	handleRemove (e) {
		let state = {};

		if (this.state.userSelectedFile) {
			state = buildInitialState(this.props);
		} else if (this.hasExisting()) {
			state.removeExisting = true;

			if (this.props.autoCleanup) {
				if (e.altKey) {
					state.action = 'reset';
				} else {
					state.action = 'delete';
				}
			} else {
				if (e.altKey) {
					state.action = 'delete';
				} else {
					state.action = 'reset';
				}
			}
		}

		this.setState(state);
	},
	/**
	 * Undoes the removal of a file.
	 */
	undoRemove () {
		this.setState(buildInitialState(this.props));
	},

	// ==============================
	// RENDERERS
	// ==============================

	/**
	 * Renders the file name and change message.
	 * @returns {React.Element} The rendered file name and change message.
	 */
	renderFileNameAndChangeMessage () {
		const href = this.props.value ? this.props.value.url : undefined;
		return React.createElement(
			'div',
			null,
			(this.hasFile() && !this.state.removeExisting)
				? React.createElement(
						FileChangeMessage,
						{ component: href ? 'a' : 'span', href, target: '_blank' },
						this.getFilename()
				  )
				: null,
			this.renderChangeMessage()
		);
	},
	/**
	 * Renders the change message.
	 * @returns {React.Element} The rendered change message.
	 */
	renderChangeMessage () {
		if (this.state.userSelectedFile) {
			return React.createElement(FileChangeMessage, { color: 'success' }, 'Save to Upload');
		} else if (this.state.removeExisting) {
			return React.createElement(
				FileChangeMessage,
				{ color: 'danger' },
				'File ',
				this.props.autoCleanup ? 'deleted' : 'removed',
				' - save to confirm'
			);
		} else {
			return null;
		}
	},
	/**
	 * Renders the clear button.
	 * @returns {React.Element} The rendered clear button.
	 */
	renderClearButton () {
		if (this.state.removeExisting) {
			return React.createElement(Button, { variant: 'link', onClick: this.undoRemove }, 'Undo Remove');
		} else {
			let clearText;
			if (this.state.userSelectedFile) {
				clearText = 'Cancel Upload';
			} else {
				clearText = (this.props.autoCleanup ? 'Delete File' : 'Remove File');
			}
			return React.createElement(Button, {
				variant: 'link',
				color: 'cancel',
				onClick: this.handleRemove,
			}, clearText);
		}
	},
	/**
	 * Renders the action input.
	 * @returns {React.Element} The rendered action input.
	 */
	renderActionInput () {
		// If the user has selected a file for uploading, we need to point at
		// the upload field. If the file is being deleted, we submit that.
		if (this.state.userSelectedFile || this.state.action) {
			const value = this.state.userSelectedFile
				? `upload:${this.state.uploadFieldPath}`
				: (this.state.action === 'delete' ? 'remove' : '');
			return React.createElement('input', {
				name: this.getInputName(this.props.path),
				type: 'hidden',
				value,
			});
		} else {
			return null;
		}
	},
	/**
	 * Renders the image preview.
	 * @returns {React.Element} The rendered image preview.
	 */
	renderImagePreview () {
		const imageSource = this.getFileUrl();
		return React.createElement(
			ImageThumbnail,
			{
				component: 'a',
				href: imageSource,
				target: '__blank',
				style: { float: 'left', marginRight: '1em', maxWidth: '50%' },
			},
			React.createElement('img', { src: imageSource, style: { 'max-height': 100, 'max-width': '100%' } })
		);
	},
	/**
	 * Renders the UI for the field.
	 * @returns {React.Element} The rendered UI.
	 */
	renderUI () {
		const { label, note, path, thumb } = this.props;
		const isImage = this.isImage();
		const hasFile = this.hasFile();

		const previews = React.createElement(
			'div',
			{ style: (isImage && thumb) ? { marginBottom: '1em' } : null },
			isImage && thumb && this.renderImagePreview(),
			hasFile && this.renderFileNameAndChangeMessage()
		);
		const buttons = React.createElement(
			'div',
			{ style: hasFile ? { marginTop: '1em' } : null },
			React.createElement(Button, { onClick: this.triggerFileBrowser }, hasFile ? 'Change File' : 'Upload File'),
			hasFile && this.renderClearButton()
		);
		return React.createElement(
			'div',
			{ 'data-field-name': path, 'data-field-type': 'file' },
			React.createElement(
				FormField,
				{ label, htmlFor: path },
				this.shouldRenderField()
					? React.createElement(
							'div',
							null,
							previews,
							buttons,
							React.createElement(HiddenFileInput, {
								key: this.state.uploadFieldPath,
								name: this.state.uploadFieldPath,
								onChange: this.handleFileChange,
								ref: (fileInput) => { this.fileInput = fileInput; },
							}),
							this.renderActionInput()
					  )
					: React.createElement(
							'div',
							null,
							hasFile
								? this.renderFileNameAndChangeMessage()
								: React.createElement(FormInput, { noedit: true }, 'no file')
					  ),
				!!note && React.createElement(FormNote, { html: note })
			)
		);
	},

});
