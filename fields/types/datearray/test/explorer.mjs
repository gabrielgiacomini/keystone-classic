import DateArrayField from '../DateArrayField.mjs';
import DateArrayFilter from '../DateArrayFilter.mjs';

export default {
	Field: DateArrayField,
	Filter: DateArrayFilter,
	section: 'Date',
	spec: {
		label: 'Datearray',
		path: 'datearray',
		value: ['2016-07-11', '2016-04-23', '2014-11-12'],
	},
};
