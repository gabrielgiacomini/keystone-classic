import fs from 'node:fs';
import UrlField from '../UrlField.mjs';
import UrlFilter from '../UrlFilter.mjs';

export default {
	Field: UrlField,
	Filter: UrlFilter,
	readme: fs.readFileSync('./fields/types/url/Readme.md', 'utf8'),
	section: 'Text',
	spec: {
		label: 'Url',
		path: 'textarea',
		value: 'http://keystonejs.com',
	},
};
