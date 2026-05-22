import GeoPointField from '../GeoPointField.mjs';
import GeoPointFilter from '../GeoPointFilter.mjs';

export default {
	Field: GeoPointField,
	Filter: GeoPointFilter,
	section: 'Miscellaneous',
	spec: {
		label: 'Geopoint',
		path: 'geopoint',
		value: [],
	},
};
