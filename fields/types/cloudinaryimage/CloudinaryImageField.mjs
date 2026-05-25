/**
 * @file
 * This file defines the `CloudinaryImageField` component, which is used to
 * render a cloudinary image field in the KeystoneJS Admin UI.
 *
 * It provides a button to upload an image, and it displays a thumbnail of the
 * uploaded image. It also provides a button to remove the image.
 */
import React from 'react';
import Field from '../Field.mjs';
import cloudinaryResize from '../../../admin/client-legacy/utils/cloudinaryResize.mjs';
import Button from '../../../admin/client-legacy/compat/elemental/Button.mjs';
import FormField from '../../../admin/client-legacy/compat/elemental/FormField.mjs';
import FormInput from '../../../admin/client-legacy/compat/elemental/FormInput.mjs';
import FormNote from '../../../admin/client-legacy/compat/elemental/FormNote.mjs';

import ImageThumbnail from '../../components/ImageThumbnail.mjs';
import FileChangeMessage from '../../components/FileChangeMessage.mjs';
import HiddenFileInput from '../../components/HiddenFileInput.mjs';
import Lightbox from '../../components/Lightbox.mjs';

const SUPPORTED_TYPES = ['image/*', 'application/pdf', 'application/postscript'];
const SUPPORTED_REGEX = new RegExp(/^image\/|application\/pdf|application\/postscript/g);

let uploadInc = 1000;

function getStoredImageSource (value, secure) {
	const source = secure ? value.secure_url : value.url;
	if (!source || /^https?:\/\/res\.cloudinary\.com\//.test(source)) return null;
	return source;
}

/**
 * Returns the initial state of the component.
 * @param {object} props The component's props.
 * @returns {object} The initial state.
 */
const buildInitialState = (props) => ({
	removeExisting: false,
	uploadFieldPath: `CloudinaryImage-${props.path}-${++uploadInc}`,
	userSelectedFile: null,
});

/**
 * The `CloudinaryImageField` component.
 * @augments Field
 */
export default Field.create({
	displayName: 'CloudinaryImageField',
	statics: {
		type: 'CloudinaryImage',
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
	 * Handles updates after new props arrive.
	 * @param {object} prevProps The previous props.
	 */
	componentDidUpdate (prevProps) {
		// Reset the action state when the value changes
		// TODO: We should add a check for a new item ID in the store
		if (prevProps.value.public_id !== this.props.value.public_id) {
			this.setState({
				removeExisting: false,
				userSelectedFile: null,
			});
		}
	},

	// ==============================
	// HELPERS
	// ==============================

	/**
	 * Returns whether the field has a local file.
	 * @returns {boolean} Whether the field has a local file.
	 */
	hasLocal () {
		return !!this.state.userSelectedFile;
	},
	/**
	 * Returns whether the field has an existing file.
	 * @returns {boolean} Whether the field has an existing file.
	 */
	hasExisting () {
		return !!(this.props.value && this.props.value.url);
	},
	/**
	 * Returns whether the field has an image.
	 * @returns {boolean} Whether the field has an image.
	 */
	hasImage () {
		return this.hasExisting() || this.hasLocal();
	},
	/**
	 * Returns the name of the file.
	 * @returns {string} The name of the file.
	 */
	getFilename () {
		const { format, height, public_id, width } = this.props.value;

		return this.state.userSelectedFile
			? this.state.userSelectedFile.name
			: `${public_id}.${format} (${width}×${height})`;
	},
	/**
	 * Returns the URL of the image.
	 * @param {number} height The height of the image.
	 * @returns {string} The URL of the image.
	 */
	getImageSource (height = 90) {
		// TODO: This lets really wide images break the layout
		let src;
		if (this.hasLocal()) {
			src = this.state.dataUri;
		} else if (this.hasExisting()) {
			src = getStoredImageSource(this.props.value, this.props.secure) || cloudinaryResize(this.props.value.public_id, {
				crop: 'fit',
				height: height,
				format: 'jpg',
				secure: this.props.secure,
			});
		}

		return src;
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

		this.setState({ userSelectedFile });
	},

	// Toggle the lightbox
	/**
	 * Opens the lightbox.
	 * @param {object} event The event object.
	 */
	openLightbox (event) {
		event.preventDefault();
		this.setState({
			lightboxIsVisible: true,
		});
	},
	/**
	 * Closes the lightbox.
	 */
	closeLightbox () {
		this.setState({
			lightboxIsVisible: false,
		});
	},

	// Handle image selection in file browser
	/**
	 * Handles a change in the image input.
	 * @param {object} e The event object.
	 * @returns {void}
	 */
	handleImageChange (e) {
		if (!window.FileReader) {
			return alert('File reader not supported by browser.');
		}

		const reader = new FileReader();
		const file = e.target.files[0];
		if (!file) return;

		if (!file.type.match(SUPPORTED_REGEX)) {
			return alert('Unsupported file type. Supported formats are: GIF, PNG, JPG, BMP, ICO, PDF, TIFF, EPS, PSD, SVG');
		}

		reader.readAsDataURL(file);

		reader.onloadstart = () => {
			this.setState({
				loading: true,
			});
		};
		reader.onloadend = (upload) => {
			this.setState({
				dataUri: upload.target.result,
				loading: false,
				userSelectedFile: file,
			});
			this.props.onChange({ file: file });
		};
	},

	// If we have a local file added then remove it and reset the file field.
	/**
	 * Handles the removal of an image.
	 * @param {object} e The event object.
	 */
	handleRemove (e) {
		const state = {};

		if (this.state.userSelectedFile) {
			state.userSelectedFile = null;
		} else if (this.hasExisting()) {
			state.removeExisting = true;
		}

		this.setState(state);
	},
	/**
	 * Undoes the removal of an image.
	 */
	undoRemove () {
		this.setState(buildInitialState(this.props));
	},

	// ==============================
	// RENDERERS
	// ==============================

	/**
	 * Renders the lightbox, or nothing if there is no image.
	 * @returns {React.Element|undefined} The rendered lightbox, or undefined if no image is present.
	 */
	renderLightbox () {
		const { value } = this.props;

		if (!value || !value.public_id) return;

		return React.createElement(Lightbox, {
			currentImage: 0,
			images: [{ src: this.getImageSource(600) }],
			isOpen: this.state.lightboxIsVisible,
			onClose: this.closeLightbox,
			showImageCount: false,
		});
	},
	/**
	 * Renders the image preview.
	 * @returns {React.Element} The rendered image preview.
	 */
	renderImagePreview () {
		const { value } = this.props;

		// render icon feedback for intent
		let mask;
		if (this.hasLocal()) mask = 'upload';
		else if (this.state.removeExisting) mask = 'remove';
		else if (this.state.loading) mask = 'loading';

		const shouldOpenLightbox = value.format !== 'pdf';

		return React.createElement(
			ImageThumbnail,
			{
				component: 'a',
				href: this.getImageSource(600),
				onClick: shouldOpenLightbox && this.openLightbox,
				mask,
				target: '__blank',
				style: { float: 'left', marginRight: '1em' },
			},
			React.createElement('img', { src: this.getImageSource(), style: { height: 90 } })
		);
	},
	/**
	 * Renders the file name and optional message.
	 * @param {boolean} showChangeMessage Whether to show the change message.
	 * @returns {React.Element} The rendered file name and message.
	 */
	renderFileNameAndOptionalMessage (showChangeMessage = false) {
		return React.createElement(
			'div',
			null,
			this.hasImage() ? React.createElement(FileChangeMessage, null, this.getFilename()) : null,
			showChangeMessage && this.renderChangeMessage()
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
			return React.createElement(FileChangeMessage, { color: 'danger' }, 'Save to Remove');
		} else {
			return null;
		}
	},

	// Output [cancel/remove/undo] button
	/**
	 * Renders the clear button.
	 * @returns {React.Element} The rendered clear button.
	 */
	renderClearButton () {
		const clearText = this.hasLocal() ? 'Cancel' : 'Remove Image';

		return this.state.removeExisting
			? React.createElement(Button, { variant: 'link', onClick: this.undoRemove }, 'Undo Remove')
			: React.createElement(Button, {
					variant: 'link',
					color: 'cancel',
					onClick: this.handleRemove,
			  }, clearText);
	},

	/**
	 * Renders the image toolbar.
	 * @returns {React.Element} The rendered image toolbar.
	 */
	renderImageToolbar () {
		return React.createElement(
			'div',
			{ key: this.props.path + '_toolbar', className: 'image-toolbar' },
			React.createElement(Button, { onClick: this.triggerFileBrowser }, this.hasImage() ? 'Change Image' : 'Upload Image'),
			this.hasImage() ? this.renderClearButton() : null
		);
	},

	/**
	 * Renders the file input.
	 * @returns {React.Element} The rendered file input.
	 */
	renderFileInput () {
		if (!this.shouldRenderField()) return null;

		return React.createElement(HiddenFileInput, {
			accept: SUPPORTED_TYPES.join(),
			ref: (fileInput) => { this.fileInput = fileInput; },
			name: this.state.uploadFieldPath,
			onChange: this.handleImageChange,
		});
	},

	// This renders a hidden input that holds the payload data for how the field
	// should be updated. It should be upload:{filename}, undefined, or 'remove'
	/**
	 * Renders the action input.
	 * @returns {React.Element} The rendered action input.
	 */
	renderActionInput () {
		if (!this.shouldRenderField()) return null;

		if (this.state.userSelectedFile || this.state.removeExisting) {
			let value = '';
			if (this.state.userSelectedFile) {
				value = `upload:${this.state.uploadFieldPath}`;
			} else if (this.state.removeExisting && this.props.autoCleanup) {
				value = 'delete';
			}
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
	 * Renders the UI for the field.
	 * @returns {React.Element} The rendered UI.
	 */
	renderUI () {
		const { label, note, path } = this.props;

		const imageContainer = React.createElement(
			'div',
			{ style: this.hasImage() ? { marginBottom: '1em' } : null },
			this.hasImage() && this.renderImagePreview(),
			this.hasImage() && this.renderFileNameAndOptionalMessage(this.shouldRenderField())
		);

		const toolbar = this.shouldRenderField()
			? this.renderImageToolbar()
			: React.createElement(FormInput, { noedit: true });

		return React.createElement(
			FormField,
			{ label, className: 'field-type-cloudinaryimage', htmlFor: path },
			imageContainer,
			toolbar,
			!!note && React.createElement(FormNote, { note }),
			this.renderLightbox(),
			this.renderFileInput(),
			this.renderActionInput()
		);
	},
});
