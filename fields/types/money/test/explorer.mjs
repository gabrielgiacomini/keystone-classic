import fs from 'node:fs';
import MoneyField from '../MoneyField.mjs';
import MoneyFilter from '../MoneyFilter.mjs';

export default {
	Field: MoneyField,
	Filter: MoneyFilter,
	readme: fs.readFileSync('./fields/types/money/Readme.md', 'utf8'),
	section: 'Number',
	spec: {
		label: 'Money',
		path: 'text',
		value: 0,
	},
};
