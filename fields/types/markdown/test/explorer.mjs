import fs from 'node:fs';
import MarkdownField from '../MarkdownField.mjs';
import MarkdownFilter from '../MarkdownFilter.mjs';

export default {
	Field: MarkdownField,
	Filter: MarkdownFilter,
	readme: fs.readFileSync('./fields/types/markdown/Readme.md', 'utf8'),
	section: 'Text',
	spec: {
		label: 'Markdown',
		path: 'markdown',
		paths: {
			html: 'markdown.html',
			md: 'markdown.md',
		},
		wysiwyg: true,
		toolbarOptions: {},
		value: {
			html: '<p><em>Hello World!</em></p>',
			md: '*Hello World!*',
		},
	},
};
