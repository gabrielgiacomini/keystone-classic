import fs from 'node:fs';
import NumberField from '../NumberField.mjs';
import NumberFilter from '../NumberFilter.mjs';

export default {
	Field: NumberField,
	Filter: NumberFilter,
	readme: fs.readFileSync('./fields/types/number/Readme.md', 'utf8'),
	section: 'Number',
	spec: {
		label: 'Number',
		path: 'text',
		value: 0,
	},
};
