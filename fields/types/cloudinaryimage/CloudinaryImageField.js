/**
 * @fileoverview
 * This file defines the `CloudinaryImageField` component, which is used to
 * render a cloudinary image field in the KeystoneJS Admin UI.
 *
 * It provides a button to upload an image, and it displays a thumbnail of the
 * uploaded image. It also provides a button to remove the image.
 */
import PropTypes from 'prop-types';

import React from 'react';
import Field from '../Field';
import cloudinaryResize from '../../../admin/client/utils/cloudinaryResize';
import { Button, FormField, FormInput, FormNote } from '../../../admin/client/App/elemental';

import ImageThumbnail from '../../components/ImageThumbnail';
import FileChangeMessage from '../../components/FileChangeMessage';
import HiddenFileInput from '../../components/HiddenFileInput';
import Lightbox from 'react-images';

const SUPPORTED_TYPES = ['image/*', 'application/pdf', 'application/postscript'];
const SUPPORTED_REGEX = new RegExp(/^image\/|application\/pdf|application\/postscript/g);

let uploadInc = 1000;

/**
 * Returns the initial state of the component.
 * @param {Object} props The component's props.
 * @returns {Object} The initial state.
 */
const buildInitialState = (props) => ({
	removeExisting: false,
	uploadFieldPath: `CloudinaryImage-${props.path}-${++uploadInc}`,
	userSelectedFile: null,
});

/**
 * The `CloudinaryImageField` component.
 * @extends Field
 */
export default Field.create({
	propTypes: {
		collapse: PropTypes.bool,
		label: PropTypes.string,
		note: PropTypes.string,
		path: PropTypes.string.isRequired,
		value: PropTypes.shape({
			format: PropTypes.string,
			height: PropTypes.number,
			public_id: PropTypes.string,
			resource_type: PropTypes.string,
			secure_url: PropTypes.string,
			signature: PropTypes.string,
			url: PropTypes.string,
			version: PropTypes.number,
			width: PropTypes.number,
		}),
	},
	displayName: 'CloudinaryImageField',
	statics: {
		type: 'CloudinaryImage',
		getDefaultValue: () => ({}),
	},
	/**
	 * Gets the initial state of the component.
	 * @returns {Object} The initial state.
	 */
	getInitialState () {
		return buildInitialState(this.props);
	},
	componentWillReceiveProps (nextProps) {
		// console.log('CloudinaryImageField nextProps:', nextProps);
	},
	/**
	 * Handles the component receiving new props.
	 * @param {Object} nextProps The new props.
	 */
	componentWillUpdate (nextProps) {
		// Reset the action state when the value changes
		// TODO: We should add a check for a new item ID in the store
		if (this.props.value.public_id !== nextProps.value.public_id) {
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
			src = cloudinaryResize(this.props.value.public_id, {
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
		this.refs.fileInput.clickDomNode();
	},
	/**
	 * Handles a change in the file input.
	 * @param {Object} event The event object.
	 */
	handleFileChange (event) {
		const userSelectedFile = event.target.files[0];

		this.setState({ userSelectedFile });
	},

	// Toggle the lightbox
	/**
	 * Opens the lightbox.
	 * @param {Object} event The event object.
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
	 * @param {Object} e The event object.
	 */
	handleImageChange (e) {
		if (!window.FileReader) {
			return alert('File reader not supported by browser.');
		}

		var reader = new FileReader();
		var file = e.target.files[0];
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
	 * @param {Object} e The event object.
	 */
	handleRemove (e) {
		var state = {};

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
	 * Renders the lightbox.
	 * @returns {React.Element} The rendered lightbox.
	 */
	renderLightbox () {
		const { value } = this.props;

		if (!value || !value.public_id) return;

		return (
			<Lightbox
				currentImage={0}
				images={[{ src: this.getImageSource(600) }]}
				isOpen={this.state.lightboxIsVisible}
				onClose={this.closeLightbox}
				showImageCount={false}
			/>
		);
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

		return (
			<ImageThumbnail
				component="a"
				href={this.getImageSource(600)}
				onClick={shouldOpenLightbox && this.openLightbox}
				mask={mask}
				target="__blank"
				style={{ float: 'left', marginRight: '1em' }}
			>
				<img src={this.getImageSource()} style={{ height: 90 }} />
			</ImageThumbnail>
		);
	},
	/**
	 * Renders the file name and optional message.
	 * @param {boolean} showChangeMessage Whether to show the change message.
	 * @returns {React.Element} The rendered file name and message.
	 */
	renderFileNameAndOptionalMessage (showChangeMessage = false) {
		return (
			<div>
				{this.hasImage() ? (
					<FileChangeMessage>
						{this.getFilename()}
					</FileChangeMessage>
				) : null}
				{showChangeMessage && this.renderChangeMessage()}
			</div>
		);
	},
	/**
	 * Renders the change message.
	 * @returns {React.Element} The rendered change message.
	 */
	renderChangeMessage () {
		if (this.state.userSelectedFile) {
			return (
				<FileChangeMessage color="success">
					Save to Upload
				</FileChangeMessage>
			);
		} else if (this.state.removeExisting) {
			return (
				<FileChangeMessage color="danger">
					Save to Remove
				</FileChangeMessage>
			);
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

		return this.state.removeExisting ? (
			<Button variant="link" onClick={this.undoRemove}>
				Undo Remove
			</Button>
		) : (
			<Button variant="link" color="cancel" onClick={this.handleRemove}>
				{clearText}
			</Button>
		);
	},

	/**
	 * Renders the image toolbar.
	 * @returns {React.Element} The rendered image toolbar.
	 */
	renderImageToolbar () {
		return (
			<div key={this.props.path + '_toolbar'} className="image-toolbar">
				<Button onClick={this.triggerFileBrowser}>
					{this.hasImage() ? 'Change' : 'Upload'} Image
				</Button>
				{this.hasImage() ? this.renderClearButton() : null}
			</div>
		);
	},

	/**
	 * Renders the file input.
	 * @returns {React.Element} The rendered file input.
	 */
	renderFileInput () {
		if (!this.shouldRenderField()) return null;

		return (
			<HiddenFileInput
				accept={SUPPORTED_TYPES.join()}
				ref="fileInput"
				name={this.state.uploadFieldPath}
				onChange={this.handleImageChange}
			/>
		);
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
			return (
				<input
					name={this.getInputName(this.props.path)}
					type="hidden"
					value={value}
				/>
			);
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

		const imageContainer = (
			<div style={this.hasImage() ? { marginBottom: '1em' } : null}>
				{this.hasImage() && this.renderImagePreview()}
				{this.hasImage() && this.renderFileNameAndOptionalMessage(this.shouldRenderField())}
			</div>
		);

		const toolbar = this.shouldRenderField()
			? this.renderImageToolbar()
			: <FormInput noedit />;

		return (
			<FormField label={label} className="field-type-cloudinaryimage" htmlFor={path}>
				{imageContainer}
				{toolbar}
				{!!note && <FormNote note={note} />}
				{this.renderLightbox()}
				{this.renderFileInput()}
				{this.renderActionInput()}
			</FormField>
		);
	},
});
