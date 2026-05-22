import fs from 'node:fs';
import CodeField from '../CodeField.mjs';
import CodeFilter from '../CodeFilter.mjs';

export default {
	Field: CodeField,
	Filter: CodeFilter,
	readme: fs.readFileSync('./fields/types/code/Readme.md', 'utf8'),
	section: 'Text',
	spec: {
		label: 'Code',
		path: 'text',
		value: '<p>Hello World!</p>',
	},
};
