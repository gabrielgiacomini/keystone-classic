import CloudinaryImagesField from '../CloudinaryImagesField.mjs';
import CloudinaryImagesFilter from '../CloudinaryImagesFilter.mjs';

export default {
	Field: CloudinaryImagesField,
	Filter: CloudinaryImagesFilter,
	section: 'Miscellaneous',
	spec: {
		label: 'CloudinaryImages',
		path: 'cloudinaryimages',
		paths: {
			action: 'cloudinaryimages_action',
			folder: 'cloudinaryimages.folder',
			order: 'cloudinaryimages_order',
			upload: 'cloudinaryimages_upload',
			uploads: 'cloudinaryimages_uploads',
		},
		value: [],
	},
};
