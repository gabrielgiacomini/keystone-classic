import CloudinaryImageColumn from '../cloudinaryimage/CloudinaryImageColumn.mjs';
import CloudinaryImagesColumn from '../cloudinaryimages/CloudinaryImagesColumn.mjs';
import React from 'react';

export default function CloudinaryColumn (props) {
	const value = props.data?.fields?.[props.col?.path];
	const Component = Array.isArray(value) ? CloudinaryImagesColumn : CloudinaryImageColumn;
	return React.createElement(Component, props);
}
