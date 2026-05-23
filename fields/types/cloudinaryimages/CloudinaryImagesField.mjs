/**
 * @file
 * This file defines the `CloudinaryImagesField` component, which is used to
 * render a cloudinary images field in the KeystoneJS Admin UI.
 *
 * It provides a button to upload images, and it displays thumbnails of the
 * uploaded images. It also provides a button to remove images.
 */
import _ from 'lodash';
import React, { cloneElement } from 'react';
import Field from '../Field.mjs';
import { Button, FormField, FormNote } from '../../../admin/client-legacy/App/elemental';
import Lightbox from 'react-images';
import cloudinaryResize from '../../../admin/client-legacy/utils/cloudinaryResize.mjs';
import Thumbnail from './CloudinaryImagesThumbnail.mjs';
import HiddenFileInput from '../../components/HiddenFileInput.mjs';
import FileChangeMessage from '../../components/FileChangeMessage.mjs';

const SUPPORTED_TYPES = ['image/*', 'application/pdf', 'application/postscript'];
const SUPPORTED_REGEX = new RegExp(/^image\/|application\/pdf|application\/postscript/g);
const RESIZE_DEFAULTS = {
	crop: 'fit',
	format: 'jpg',
};

let uploadInc = 1000;

function getStoredImageSource (value, secure) {
	const source = secure ? value.secure_url : value.url;
	if (!source || /^https?:\/\/res\.cloudinary\.com\//.test(source)) return null;
	return source;
}

/**
 * The `CloudinaryImagesField` component.
 * @augments Field
 */
export default Field.create({
	displayName: 'CloudinaryImagesField',
	statics: {
		type: 'CloudinaryImages',
		getDefaultValue: () => ([]),
	},
	/**
	 * Gets the initial state of the component.
	 * @returns {object} The initial state.
	 */
	getInitialState () {
		return this.buildInitialState(this.props);
	},
	/**
	 * Handles the component receiving new props.
	 * @param {object} nextProps The new props.
	 */
	UNSAFE_componentWillUpdate (nextProps) {
		// Reset the thumbnails and upload ID when the item value changes
		// TODO: We should add a check for a new item ID in the store
		const value = _.map(this.props.value, 'public_id').join();
		const nextValue = _.map(nextProps.value, 'public_id').join();
		if (value !== nextValue) {
			this.setState(this.buildInitialState(nextProps));
		}
	},
	/**
	 * Builds the initial state of the component.
	 * @param {object} props The component's props.
	 * @returns {object} The initial state.
	 */
	buildInitialState (props) {
		const uploadFieldPath = `CloudinaryImages-${props.path}-${++uploadInc}`;
		const thumbnails = props.value ? props.value.map((img, index) => {
			const storedImageSource = getStoredImageSource(img, props.secure);
			return this.getThumbnail({
				value: img,
				imageSourceSmall: storedImageSource || cloudinaryResize(img.public_id, {
					...RESIZE_DEFAULTS,
					height: 90,
					secure: props.secure,
				}),
				imageSourceLarge: storedImageSource || cloudinaryResize(img.public_id, {
					...RESIZE_DEFAULTS,
					height: 600,
					width: 900,
					secure: props.secure,
				}),
			}, index);
		}) : [];
		return { thumbnails, uploadFieldPath };
	},
	/**
	 * Gets a thumbnail component for an image.
	 * @param {object} props The props for the thumbnail.
	 * @param {number} index The index of the thumbnail.
	 * @returns {React.Element} The thumbnail component.
	 */
	getThumbnail (props, index) {
		return (
			<Thumbnail
				key={`thumbnail-${index}`}
				inputName={this.getInputName(this.props.path)}
				openLightbox={(e) => this.openLightbox(e, index)}
				shouldRenderActionButton={this.shouldRenderField()}
				toggleDelete={this.removeImage.bind(this, index)}
				{...props}
			/>
		);
	},

	// ==============================
	// HELPERS
	// ==============================

	/**
	 * Triggers the file browser.
	 */
	triggerFileBrowser () {
		this.refs.fileInput.clickDomNode();
	},
	/**
	 * Returns whether the field has files.
	 * @returns {boolean} Whether the field has files.
	 */
	hasFiles () {
		return this.refs.fileInput && this.refs.fileInput.hasValue();
	},
	/**
	 * Opens the lightbox.
	 * @param {object} event The event object.
	 * @param {number} index The index of the image to open.
	 */
	openLightbox (event, index) {
		event.preventDefault();
		this.setState({
			lightboxIsVisible: true,
			lightboxImageIndex: index,
		});
	},
	/**
	 * Closes the lightbox.
	 */
	closeLightbox () {
		this.setState({
			lightboxIsVisible: false,
			lightboxImageIndex: null,
		});
	},
	/**
	 * Goes to the previous image in the lightbox.
	 */
	lightboxPrevious () {
		this.setState({
			lightboxImageIndex: this.state.lightboxImageIndex - 1,
		});
	},
	/**
	 * Goes to the next image in the lightbox.
	 */
	lightboxNext () {
		this.setState({
			lightboxImageIndex: this.state.lightboxImageIndex + 1,
		});
	},

	// ==============================
	// METHODS
	// ==============================

	/**
	 * Removes an image from the field.
	 * @param {number} index The index of the image to remove.
	 */
	removeImage (index) {
		const newThumbnails = [...this.state.thumbnails];
		const target = newThumbnails[index];

		// Use splice + clone to toggle the isDeleted prop
		newThumbnails.splice(index, 1, cloneElement(target, {
			isDeleted: !target.props.isDeleted,
		}));

		this.setState({ thumbnails: newThumbnails });
	},
	/**
	 * Gets the count of thumbnails with a given key.
	 * @param {string} key The key to count.
	 * @returns {number} The count.
	 */
	getCount (key) {
		let count = 0;

		this.state.thumbnails.forEach((thumb) => {
			if (thumb && thumb.props[key]) count++;
		});

		return count;
	},
	/**
	 * Clears the file input.
	 */
	clearFiles () {
		this.refs.fileInput.clearValue();

		this.setState({
			thumbnails: this.state.thumbnails.filter(function (thumb) {
				return !thumb.props.isQueued;
			}),
		});
	},
	/**
	 * Handles a change in the file input.
	 * @param {object} event The event object.
	 * @returns {void}
	 */
	uploadFile (event) {
		if (!window.FileReader) {
			return alert('File reader not supported by browser.');
		}

		// FileList not a real Array; process it into one and check the types
		const files = [];
		for (let i = 0; i < event.target.files.length; i++) {
			const f = event.target.files[i];
			if (!f.type.match(SUPPORTED_REGEX)) {
				return alert('Unsupported file type. Supported formats are: GIF, PNG, JPG, BMP, ICO, PDF, TIFF, EPS, PSD, SVG');
			}
			files.push(f);
		}

		let index = this.state.thumbnails.length;
		files.reduce((chain, file) => chain.then((thumbnails) => new Promise((resolve) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = (e) => {
				resolve([...thumbnails, this.getThumbnail({
					isQueued: true,
					imageSourceSmall: e.target.result,
				}, index++)]);
			};
		})), Promise.resolve([])).then((thumbnails) => {
			this.setState({
				thumbnails: [...this.state.thumbnails, ...thumbnails],
			});
		});
	},

	// ==============================
	// RENDERERS
	// ==============================

	/**
	 * Renders the file input.
	 * @returns {React.Element} The rendered file input.
	 */
	renderFileInput () {
		if (!this.shouldRenderField()) return null;

		return (
			<HiddenFileInput
				accept={SUPPORTED_TYPES.join()}
				key={this.state.uploadFieldPath}
				multiple
				name={this.state.uploadFieldPath}
				onChange={this.uploadFile}
				ref="fileInput"
			/>
		);
	},
	/**
	 * Renders the value input.
	 * @returns {React.Element|null|undefined} The rendered value input, null if the field should not
	 *   render, or undefined if there is no pending upload or deletion.
	 */
	renderValueInput () {
		if (!this.shouldRenderField()) return null;

		// This renders an input with either the upload field reference, or an
		// empty value to reset the field if all images have been removed
		if (this.hasFiles()) {
			return (
				<input
					name={this.getInputName(this.props.path)}
					value={`upload:${this.state.uploadFieldPath}`}
					type="hidden"
				/>
			);
		} else if (this.getCount('isDeleted') === this.props.value.length) {
			return (
				<input
					name={this.getInputName(this.props.path)}
					value=""
					type="hidden"
				/>
			);
		}
	},
	/**
	 * Renders the lightbox.
	 * @returns {React.Element|undefined} The rendered lightbox, or undefined if there are no images.
	 */
	renderLightbox () {
		const { value, secure } = this.props;
		if (!value || !value.length) return;

		const images = value.map(image => ({
			src: getStoredImageSource(image, secure) || cloudinaryResize(image.public_id, {
				...RESIZE_DEFAULTS,
				height: 600,
				width: 900,
				secure,
			}),
		}));

		return (
			<Lightbox
				images={images}
				currentImage={this.state.lightboxImageIndex}
				isOpen={this.state.lightboxIsVisible}
				onClickPrev={this.lightboxPrevious}
				onClickNext={this.lightboxNext}
				onClose={this.closeLightbox}
			/>
		);
	},
	/**
	 * Renders the toolbar.
	 * @returns {React.Element} The rendered toolbar.
	 */
	renderToolbar () {
		if (!this.shouldRenderField()) return null;

		const uploadCount = this.getCount('isQueued');
		const deleteCount = this.getCount('isDeleted');

		// provide a gutter for the change message
		// only required when no cancel button, which has equiv. padding
		const uploadButtonStyles = !this.hasFiles()
			? { marginRight: 10 }
			: {};

		// prepare the change message
		const changeMessage = uploadCount || deleteCount ? (
			<FileChangeMessage>
				{uploadCount && deleteCount ? `${uploadCount} added and ${deleteCount} removed` : null}
				{uploadCount && !deleteCount ? `${uploadCount} image added` : null}
				{!uploadCount && deleteCount ? `${deleteCount} image removed` : null}
			</FileChangeMessage>
		) : null;

		// prepare the save message
		const saveMessage = uploadCount || deleteCount ? (
			<FileChangeMessage color={!deleteCount ? 'success' : 'danger'}>
				Save to {!deleteCount ? 'Upload' : 'Confirm'}
			</FileChangeMessage>
		) : null;

		// clear floating images above
		const toolbarStyles = {
			clear: 'both',
		};

		return (
			<div style={toolbarStyles}>
				<Button onClick={this.triggerFileBrowser} style={uploadButtonStyles} data-e2e-upload-button="true">
					Upload Images
				</Button>
				{this.hasFiles() && (
					<Button variant="link" color="cancel" onClick={this.clearFiles}>
						Clear selection
					</Button>
				)}
				{changeMessage}
				{saveMessage}
			</div>
		);
	},
	/**
	 * Renders the UI for the field.
	 * @returns {React.Element} The rendered UI.
	 */
	renderUI () {
		const { label, note, path } = this.props;
		const { thumbnails } = this.state;

		return (
			<FormField label={label} className="field-type-cloudinaryimages" htmlFor={path}>
				<div>
					{thumbnails}
				</div>
				{this.renderValueInput()}
				{this.renderFileInput()}
				{this.renderToolbar()}
				{!!note && <FormNote note={note} />}
				{this.renderLightbox()}
			</FormField>
		);
	},
});
