import MarkdownField from '../MarkdownField.mjs';
import MarkdownFilter from '../MarkdownFilter.mjs';

export default {
	Field: MarkdownField,
	Filter: MarkdownFilter,
	readme: '',
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
