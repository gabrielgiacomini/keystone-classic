import fs from 'node:fs';
import BooleanField from '../BooleanField.mjs';
import BooleanFilter from '../BooleanFilter.mjs';

export default {
	Field: BooleanField,
	Filter: BooleanFilter,
	readme: fs.readFileSync('./fields/types/boolean/Readme.md', 'utf8'),
	section: 'Miscellaneous',
	spec: {
		label: 'Boolean',
		path: 'boolean',
		value: false,
	},
};
