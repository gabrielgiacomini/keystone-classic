import fs from 'node:fs';
import ColorField from '../ColorField.mjs';
import ColorFilter from '../ColorFilter.mjs';

export default {
	Field: ColorField,
	Filter: ColorFilter,
	readme: fs.readFileSync('./fields/types/color/Readme.md', 'utf8'),
	section: 'Text',
	spec: {
		label: 'Color',
		path: 'color',
		value: 'white',
	},
};
