/**
 * @fileoverview
 * This file defines the `FileField` component, which is used to render a file
 * field in the KeystoneJS Admin UI.
 *
 * It provides a button to upload a file, and it displays the name of the
 * uploaded file. It also provides a button to remove the file.
 */
import Field from '../Field';
import React, { PropTypes } from 'react';
import {
	Button,
	FormField,
	FormInput,
	FormNote,
} from '../../../admin/client/App/elemental';
import FileChangeMessage from '../../components/FileChangeMessage';
import HiddenFileInput from '../../components/HiddenFileInput';
import ImageThumbnail from '../../components/ImageThumbnail';

let uploadInc = 1000;

/**
 * Returns the initial state of the component.
 * @param {Object} props The component's props.
 * @returns {Object} The initial state.
 */
const buildInitialState = (props) => ({
	action: null,
	removeExisting: false,
	uploadFieldPath: `File-${props.path}-${++uploadInc}`,
	userSelectedFile: null,
});

/**
 * The `FileField` component.
 * @extends Field
 */
module.exports = Field.create({
	propTypes: {
		autoCleanup: PropTypes.bool,
		collapse: PropTypes.bool,
		label: PropTypes.string,
		note: PropTypes.string,
		path: PropTypes.string.isRequired,
		thumb: PropTypes.bool,
		value: PropTypes.shape({
			filename: PropTypes.string,
			// TODO: these are present but not used in the UI,
			//       should we start using them?
			// filetype: PropTypes.string,
			// originalname: PropTypes.string,
			// path: PropTypes.string,
			// size: PropTypes.number,
		}),
	},
	statics: {
		type: 'File',
		getDefaultValue: () => ({}),
	},
	/**
	 * Gets the initial state of the component.
	 * @returns {Object} The initial state.
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
	 * @param {Object} nextProps The new props.
	 */
	componentWillUpdate (nextProps) {
		// Show the new filename when it's finished uploading
		if (this.props.value.filename !== nextProps.value.filename) {
			this.setState(buildInitialState(nextProps));
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
		this.refs.fileInput.clickDomNode();
	},
	/**
	 * Handles a change in the file input.
	 * @param {Object} event The event object.
	 */
	handleFileChange (event) {
		const userSelectedFile = event.target.files[0];

		this.setState({
			userSelectedFile: userSelectedFile,
		});
	},
	/**
	 * Handles the removal of a file.
	 * @param {Object} e The event object.
	 */
	handleRemove (e) {
		var state = {};

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
		return (
			<div>
				{(this.hasFile() && !this.state.removeExisting) ? (
					<FileChangeMessage component={href ? 'a' : 'span'} href={href} target="_blank">
						{this.getFilename()}
					</FileChangeMessage>
				) : null}
				{this.renderChangeMessage()}
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
					File {this.props.autoCleanup ? 'deleted' : 'removed'} - save to confirm
				</FileChangeMessage>
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
			return (
				<Button variant="link" onClick={this.undoRemove}>
					Undo Remove
				</Button>
			);
		} else {
			var clearText;
			if (this.state.userSelectedFile) {
				clearText = 'Cancel Upload';
			} else {
				clearText = (this.props.autoCleanup ? 'Delete File' : 'Remove File');
			}
			return (
				<Button variant="link" color="cancel" onClick={this.handleRemove}>
					{clearText}
				</Button>
			);
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
	 * Renders the image preview.
	 * @returns {React.Element} The rendered image preview.
	 */
	renderImagePreview () {
		const imageSource = this.getFileUrl();
		return (
			<ImageThumbnail
				component="a"
				href={imageSource}
				target="__blank"
				style={{ float: 'left', marginRight: '1em', maxWidth: '50%' }}
			>
				<img src={imageSource} style={{ 'max-height': 100, 'max-width': '100%' }} />
			</ImageThumbnail>
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

		const previews = (
			<div style={(isImage && thumb) ? { marginBottom: '1em' } : null}>
				{isImage && thumb && this.renderImagePreview()}
				{hasFile && this.renderFileNameAndChangeMessage()}
			</div>
		);
		const buttons = (
			<div style={hasFile ? { marginTop: '1em' } : null}>
				<Button onClick={this.triggerFileBrowser}>
					{hasFile ? 'Change' : 'Upload'} File
				</Button>
				{hasFile && this.renderClearButton()}
			</div>
		);
		return (
			<div data-field-name={path} data-field-type="file">
				<FormField label={label} htmlFor={path}>
					{this.shouldRenderField() ? (
						<div>
							{previews}
							{buttons}
							<HiddenFileInput
								key={this.state.uploadFieldPath}
								name={this.state.uploadFieldPath}
								onChange={this.handleFileChange}
								ref="fileInput"
							/>
							{this.renderActionInput()}
						</div>
					) : (
						<div>
							{hasFile
								? this.renderFileNameAndChangeMessage()
								: <FormInput noedit>no file</FormInput>}
						</div>
					)}
					{!!note && <FormNote html={note} />}
				</FormField>
			</div>
		);
	},

});
