/**
 * @file
 * This file defines the `CloudinaryImagesThumbnail` component, which is used to
 * render a thumbnail for a Cloudinary image.
 */
import React, { PropTypes } from 'react';
import { Button } from '../../../admin/client-legacy/App/elemental';
import ImageThumbnail from '../../components/ImageThumbnail';

/**
 * The `CloudinaryImagesThumbnail` component.
 * @param {object} props The component's props.
 * @param {boolean} props.isDeleted Whether the image is marked for deletion.
 * @param {string} props.imageSourceLarge The URL of the large version of the image used for the lightbox.
 * @param {string} props.imageSourceSmall The URL of the small version of the image shown in the thumbnail.
 * @param {string} props.inputName The name attribute for the hidden input that stores the image value.
 * @param {boolean} props.isQueued Whether the image is queued for upload and not yet saved.
 * @param {(event: MouseEvent) => void} props.openLightbox Callback invoked when the thumbnail is clicked to open the lightbox.
 * @param {boolean} props.shouldRenderActionButton Whether the remove/undo action button should be rendered.
 * @param {() => void} props.toggleDelete Callback invoked when the action button is clicked to toggle deletion.
 * @param {object} props.value The Cloudinary image data object stored for this image.
 * @returns {React.Element} The rendered component.
 */
function CloudinaryImagesThumbnail ({
	isDeleted,
	imageSourceLarge,
	imageSourceSmall,
	inputName,
	isQueued,
	openLightbox,
	shouldRenderActionButton,
	toggleDelete,
	value,
	...props
}) {
	// render icon feedback for intent
	let mask;
	if (isQueued) mask = 'upload';
	else if (isDeleted) mask = 'remove';

	// action button
	const actionButton = (shouldRenderActionButton && !isQueued) ? (
		<Button variant="link" color={isDeleted ? 'default' : 'cancel'} block onClick={toggleDelete}>
			{isDeleted ? 'Undo' : 'Remove'}
		</Button>
	) : null;

	const input = (!isQueued && !isDeleted && value) ? (
		<input type="hidden" name={inputName} value={JSON.stringify(value)} />
	) : null;

	// provide gutter for the images
	const imageStyles = {
		float: 'left',
		marginBottom: 10,
		marginRight: 10,
	};

	return (
		<div style={imageStyles}>
			<ImageThumbnail
				component={imageSourceLarge ? 'a' : 'span'}
				href={!!imageSourceLarge && imageSourceLarge}
				onClick={!!imageSourceLarge && openLightbox}
				mask={mask}
				target={!!imageSourceLarge && '__blank'}
			>
				<img src={imageSourceSmall} style={{ height: 90 }} />
			</ImageThumbnail>
			{actionButton}
			{input}
		</div>
	);

};

CloudinaryImagesThumbnail.propTypes = {
	imageSourceLarge: PropTypes.string,
	imageSourceSmall: PropTypes.string.isRequired,
	isDeleted: PropTypes.bool,
	isQueued: PropTypes.bool,
	openLightbox: PropTypes.func.isRequired,
	shouldRenderActionButton: PropTypes.bool,
	toggleDelete: PropTypes.func.isRequired,
};

export default CloudinaryImagesThumbnail;
