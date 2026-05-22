import url from 'cloudinary-microurl';

function getCloudName () {
	const keystone = typeof window !== 'undefined' ? window.Keystone : undefined;
	return keystone && keystone.cloudinary && keystone.cloudinary.cloud_name;
}

/**
 * Takes a Cloudinary public id and an options object and returns a resized image URL.
 * Returns false if no publicId or cloud name is available.
 * @param  {string} publicId The Cloudinary public id of the image
 * @param  {object} [options] Additional Cloudinary URL options to merge in
 * @returns {string|boolean} The constructed Cloudinary URL, or false if inputs are missing
 */
function cloudinaryResize (publicId, options = {}) {
	const cloudName = getCloudName();
	if (!publicId || !cloudName) return false;

	return url(publicId, {
		cloud_name: cloudName, // single cloud for the admin UI
		quality: 80, // 80% quality, which ~halves image download size
		...options,
	});
};

export default cloudinaryResize;
