import React from 'react';

const IMAGE_SIZE = 18;

const linkStyle = {
	marginRight: 8,
};
const boxStyle = {
	borderRadius: 3,
	display: 'inline-block',
	height: IMAGE_SIZE,
	overflow: 'hidden',
	verticalAlign: 'middle',
	width: IMAGE_SIZE,
};
const imageStyle = {
	display: 'block',
	height: IMAGE_SIZE,
	left: '50%',
	position: 'relative',

	WebkitTransform: 'translateX(-50%)',
	MozTransform: 'translateX(-50%)',
	msTransform: 'translateX(-50%)',
	transform: 'translateX(-50%)',
};
const textStyle = {
	color: '#888',
	display: 'inline-block',
	fontSize: '.8rem',
	marginLeft: 8,
	verticalAlign: 'middle',
};

function renderLabel({ image, label }) {
	if (!label) return null;

	const text = label === 'dimensions'
		? `${image.width} × ${image.height}`
		: `${image.public_id}.${image.format}`;

	return React.createElement('span', { style: textStyle }, text);
}

function renderImageThumbnail({ image, secure }) {
	if (!image) return null;
	const startingUrl = secure ? image.secure_url : image.url;
	const url = startingUrl.replace(/image\/upload/, `image/upload/c_thumb,g_face,h_${IMAGE_SIZE},w_${IMAGE_SIZE}`);
	return React.createElement('img', { src: url, style: imageStyle, className: 'img-load' });
}

function CloudinaryImageSummary(props) {
	return React.createElement(
		'span',
		{ style: linkStyle },
		React.createElement('span', { style: boxStyle }, renderImageThumbnail(props)),
		renderLabel(props),
	);
}


export default CloudinaryImageSummary;
