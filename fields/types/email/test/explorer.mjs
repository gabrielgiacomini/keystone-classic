import EmailField from '../EmailField.mjs';
import EmailFilter from '../EmailFilter.mjs';

export default {
	Field: EmailField,
	Filter: EmailFilter,
	section: 'Text',
	spec: {
		label: 'Email',
		path: 'email',
		value: 'user@keystonejs.com',
	},
};
