import TextArrayField from '../TextArrayField.mjs';
import TextArrayFilter from '../TextArrayFilter.mjs';

export default {
	Field: TextArrayField,
	Filter: TextArrayFilter,
	section: 'Text',
	spec: {
		label: 'Textarray',
		path: 'textarray',
		value: ['Hello', 'World'],
	},
};
