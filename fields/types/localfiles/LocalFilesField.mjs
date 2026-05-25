/**
 * @file This field type is deprecated and will be removed in a future version.
 * @see https://github.com/keystonejs/keystone/wiki/File-Fields-Upgrade-Guide
 */
/*
TODO: this file has been left as a reference for the new File type field.
Some features here, including size formatting and icons, may be ported across.
*/

import bytes from 'bytes';
import Field from '../Field.mjs';
import React from 'react';
import Button from '../../../admin/client-legacy/App/elemental/Button/index.mjs';
import FormField from '../../../admin/client-legacy/App/elemental/FormField/index.mjs';
import FormInput from '../../../admin/client-legacy/App/elemental/FormInput/index.mjs';
import FormNote from '../../../admin/client-legacy/App/elemental/FormNote/index.mjs';

const ICON_EXTS = [
	'aac', 'ai', 'aiff', 'avi', 'bmp', 'c', 'cpp', 'css', 'dat', 'dmg', 'doc', 'dotx', 'dwg', 'dxf', 'eps', 'exe', 'flv', 'gif', 'h',
	'hpp', 'html', 'ics', 'iso', 'java', 'jpg', 'js', 'key', 'less', 'mid', 'mp3', 'mp4', 'mpg', 'odf', 'ods', 'odt', 'otp', 'ots',
	'ott', 'pdf', 'php', 'png', 'ppt', 'psd', 'py', 'qt', 'rar', 'rb', 'rtf', 'sass', 'scss', 'sql', 'tga', 'tgz', 'tiff', 'txt',
	'wav', 'xls', 'xlsx', 'xml', 'yml', 'zip',
];

function LocalFilesFieldItem(props) {
	const { deleted, filename, isQueued, shouldRenderActionButton, size, toggleDelete } = props;
	const ext = filename.split('.').pop();

	let iconName = '_blank';
	if (ICON_EXTS.includes(ext)) iconName = ext;

	let note;
	if (deleted) {
		note = React.createElement(FormInput, {
			key: 'delete-note',
			noedit: true,
			className: 'field-type-localfiles__note field-type-localfiles__note--delete',
		}, 'save to delete');
	} else if (isQueued) {
		note = React.createElement(FormInput, {
			key: 'upload-note',
			noedit: true,
			className: 'field-type-localfiles__note field-type-localfiles__note--upload',
		}, 'save to upload');
	}

	let actionButton = null;
	if (shouldRenderActionButton && !isQueued) {
		const buttonLabel = deleted ? 'Undo' : 'Remove';
		const buttonType = deleted ? 'link' : 'link-cancel';
		actionButton = React.createElement(Button, {
			key: 'action-button',
			type: buttonType,
			onClick: toggleDelete,
		}, buttonLabel);
	}

	return React.createElement(
		FormField,
		null,
		React.createElement('img', {
			key: 'file-type-icon',
			className: 'file-icon',
			src: Keystone.adminLegacyPath + '/images/icons/32/' + iconName + '.png',
		}),
		React.createElement(
			FormInput,
			{ key: 'file-name', noedit: true, className: 'field-type-localfiles__filename' },
			filename,
			size ? ' (' + bytes(size) + ')' : null
		),
		note,
		actionButton
	);
}


let tempId = 0;

export default Field.create({

	getInitialState () {
		const items = [];

		(this.props.value || []).forEach((item) => {
			this.pushItem(item, items);
		});

		return { items: items };
	},

	removeItem (id) {
		const thumbs = [];
		this.state.items.forEach((thumb) => {
			const newProps = Object.assign({}, thumb.props);
			if (thumb.props._id === id) {
				newProps.deleted = !thumb.props.deleted;
			}
			this.pushItem(newProps, thumbs);
		});

		this.setState({ items: thumbs });
	},

	pushItem (args, thumbs) {
		thumbs = thumbs || this.state.items;
		args.toggleDelete = this.removeItem.bind(this, args._id);
		args.shouldRenderActionButton = this.shouldRenderField();
		args.adminLegacyPath = Keystone.adminLegacyPath;
		thumbs.push(React.createElement(LocalFilesFieldItem, { key: args._id || tempId++, ...args }));
	},

	fileFieldNode () {
		return this.fileField;
	},

	renderFileField () {
		return React.createElement('input', {
			ref: (fileField) => { this.fileField = fileField; },
			type: 'file',
			name: this.props.paths.upload,
			multiple: true,
			className: 'field-upload',
			onChange: this.uploadFile,
			tabIndex: '-1',
		});
	},

	clearFiles () {
		this.fileFieldNode().value = '';

		this.setState({
			items: this.state.items.filter(function (thumb) {
				return !thumb.props.isQueued;
			}),
		});
	},

	uploadFile (event) {
		const files = event.target.files;
		Array.from(files).forEach((f) => {
			this.pushItem({ isQueued: true, filename: f.name });
			this.forceUpdate();
		});
	},

	changeFiles () {
		this.fileFieldNode().click();
	},

	hasFiles () {
		return this.fileFieldNode() && this.fileFieldNode().value;
	},

	renderToolbar () {
		if (!this.shouldRenderField()) return null;

		let clearFilesButton;
		if (this.hasFiles()) {
			clearFilesButton = React.createElement(Button, {
				type: 'link-cancel',
				className: 'ml-5',
				onClick: this.clearFiles,
			}, 'Clear Uploads');
		}

		return React.createElement(
			'div',
			{ className: 'files-toolbar' },
			React.createElement(Button, { onClick: this.changeFiles }, 'Upload'),
			clearFilesButton
		);
	},

	renderPlaceholder () {
		return React.createElement(
			'div',
			{ className: 'file-field file-upload', onClick: this.changeFiles },
			React.createElement(
				'div',
				{ className: 'file-preview' },
				React.createElement(
					'span',
					{ className: 'file-thumbnail' },
					React.createElement('span', { className: 'file-dropzone' }),
					React.createElement('div', { className: 'ion-picture file-uploading' })
				)
			),
			React.createElement(
				'div',
				{ className: 'file-details' },
				React.createElement('span', { className: 'file-message' }, 'Click to upload')
			)
		);
	},

	renderContainer () {
		return React.createElement('div', { className: 'files-container clearfix' }, this.state.items);
	},

	renderFieldAction () {
		let value = '';
		const remove = [];
		this.state.items.forEach(function (thumb) {
			if (thumb && thumb.props.deleted) remove.push(thumb.props._id);
		});
		if (remove.length) value = 'delete:' + remove.join(',');

		return React.createElement('input', {
			className: 'field-action',
			type: 'hidden',
			value,
			name: this.props.paths.action,
		});
	},

	renderUploadsField () {
		return React.createElement('input', {
			className: 'field-uploads',
			type: 'hidden',
			name: this.props.paths.uploads,
		});
	},

	renderNote: function () {
		if (!this.props.note) return null;
		return React.createElement(FormNote, { html: this.props.note });
	},

	renderUI () {
		return React.createElement(
			FormField,
			{
				label: this.props.label,
				className: 'field-type-localfiles',
				htmlFor: this.props.path,
			},
			this.renderFieldAction(),
			this.renderUploadsField(),
			this.renderFileField(),
			this.renderContainer(),
			this.renderToolbar(),
			this.renderNote()
		);
	},
});
