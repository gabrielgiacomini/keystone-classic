import fs from 'node:fs';
import DatetimeField from '../DatetimeField.mjs';
import DatetimeFilter from '../DatetimeFilter.mjs';

export default {
	Field: DatetimeField,
	Filter: DatetimeFilter,
	readme: fs.readFileSync('./fields/types/datetime/Readme.md', 'utf8'),
	section: 'Date',
	spec: {
		label: 'Datetime',
		path: 'datetime',
		paths: {
			date: 'datetime.date',
			time: 'datetime.time',
		},
		value: new Date(),
	},
};
