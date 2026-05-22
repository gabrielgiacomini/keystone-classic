import fs from 'node:fs';
import TextField from '../TextField.mjs';
import TextFilter from '../TextFilter.mjs';

export default {
	Field: TextField,
	Filter: TextFilter,
	readme: fs.readFileSync('./fields/types/text/Readme.md', 'utf8'),
	section: 'Text',
	spec: {
		label: 'Text',
		path: 'text',
		value: 'Hello World',
	},
};
