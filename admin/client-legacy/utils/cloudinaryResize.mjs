function getCloudName () {
	const keystone = typeof window !== 'undefined' ? window.Keystone : undefined;
	return keystone && keystone.cloudinary && keystone.cloudinary.cloud_name;
}

const TRANSFORM_KEYS = {
	fetch_format: 'f',
	crop: 'c',
	effect: 'e',
	flags: 'fl',
	gravity: 'g',
	height: 'h',
	radius: 'r',
	quality: 'q',
	width: 'w',
	dpr: 'dpr',
};

function buildTransformPath (options) {
	return Object.keys(options)
		.map(key => {
			const transformKey = TRANSFORM_KEYS[key];
			return transformKey ? `${transformKey}_${options[key]}` : undefined;
		})
		.filter(Boolean)
		.join(',');
}

function buildCloudinaryImageUrl (publicId, options) {
	const protocol = options.secure ? 'https' : 'http';
	const source = options.source || 'upload';
	const transforms = buildTransformPath(options);
	const version = options.version ? `v${options.version}` : undefined;

	return [
		`${protocol}://res.cloudinary.com`,
		encodeURIComponent(options.cloud_name),
		'image',
		source,
		transforms,
		version,
		publicId,
	].filter(Boolean).join('/');
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

	return buildCloudinaryImageUrl(publicId, {
		cloud_name: cloudName, // single cloud for the admin UI
		quality: 80, // 80% quality, which ~halves image download size
		...options,
	});
};

export default cloudinaryResize;
