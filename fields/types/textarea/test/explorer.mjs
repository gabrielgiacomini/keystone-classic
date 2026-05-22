import fs from 'node:fs';
import TextareaField from '../TextareaField.mjs';
import TextareaFilter from '../TextareaFilter.mjs';

export default {
	Field: TextareaField,
	Filter: TextareaFilter,
	readme: fs.readFileSync('./fields/types/textarea/Readme.md', 'utf8'),
	section: 'Text',
	spec: {
		label: 'Textarea',
		path: 'textarea',
		value: 'Hello World',
	},
};
