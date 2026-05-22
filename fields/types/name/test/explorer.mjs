import NameField from '../NameField.mjs';
import NameFilter from '../NameFilter.mjs';

export default {
	Field: NameField,
	Filter: NameFilter,
	section: 'Text',
	spec: {
		label: 'Name',
		path: 'name',
		paths: {
			first: 'name.first',
			last: 'name.last',
		},
		value: {
			first: 'Jed',
			last: 'Watson',
		},
	},
};
