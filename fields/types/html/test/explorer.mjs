import fs from 'node:fs';
import HtmlField from '../HtmlField.mjs';
import HtmlFilter from '../HtmlFilter.mjs';

export default {
	Field: HtmlField,
	Filter: HtmlFilter,
	readme: fs.readFileSync('./fields/types/html/Readme.md', 'utf8'),
	section: 'Text',
	spec: {
		label: 'Html',
		path: 'html',
		value: '<p>Hello World!</p>',
		wysiwyg: true,
	},
};
