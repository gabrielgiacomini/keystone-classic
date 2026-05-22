import fs from 'node:fs';
import DateField from '../DateField.mjs';
import DateFilter from '../DateFilter.mjs';

export default {
	Field: DateField,
	Filter: DateFilter,
	readme: fs.readFileSync('./fields/types/date/Readme.md', 'utf8'),
	section: 'Date',
	spec: {
		label: 'Date',
		path: 'date',
		value: '2016-07-11',
	},
};
