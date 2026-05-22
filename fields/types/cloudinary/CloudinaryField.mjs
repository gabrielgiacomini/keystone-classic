import CloudinaryImageField from '../cloudinaryimage/CloudinaryImageField.mjs';
import CloudinaryImagesField from '../cloudinaryimages/CloudinaryImagesField.mjs';
import React from 'react';

export default function CloudinaryField (props) {
	const Component = Array.isArray(props.value) ? CloudinaryImagesField : CloudinaryImageField;
	return <Component {...props} />;
}

CloudinaryField.displayName = 'CloudinaryField';
CloudinaryField.type = 'Cloudinary';
CloudinaryField.getDefaultValue = (field) => field && field.multiple ? [] : {};
