import fs from 'node:fs';
import RelationshipField from '../RelationshipField.mjs';
import RelationshipFilter from '../RelationshipFilter.mjs';

export default {
	Field: RelationshipField,
	Filter: RelationshipFilter,
	readme: fs.readFileSync('./fields/types/relationship/Readme.md', 'utf8'),
	section: 'Miscellaneous',
	spec: [{
		label: 'Single Relationship',
		path: 'relationship',
		// createInline isn't available in the explorer because it depends on
		// real list definitions and the FieldTypes bundle
		// createInline: true,
		refList: {
			key: 'Flavour',
			path: 'flavours',
			plural: 'Flavours',
			singular: 'Flavour',
		},
		value: '',
	}, {
		label: 'Many Relationship',
		path: 'manyrelationship',
		many: true,
		// createInline: true,
		refList: {
			key: 'Flavour',
			path: 'flavours',
			plural: 'Flavours',
			singular: 'Flavour',
		},
		value: '',
	}],
};
