import keystone from 'keystone';
import type { ExplicitListOptions } from '../../lib/core/options-types.js';

const Types = keystone.Field.Types;

const postOptions: ExplicitListOptions = {
	sortable: false,
	track: false,
	autokey: { path: 'slug', from: 'title', unique: true },
	defaultColumns: '__name__',
	searchFields: '__name__',
	defaultSort: '__default__',
	noedit: false,
	nodelete: false,
	nocreate: false,
	hidden: false,
	searchUsesTextIndex: false,
	perPage: 100,
};

const Post = new keystone.List('Post', postOptions);

Post.add({
	title: { type: String, required: true, default: '' },
	content: { type: Types.Text, default: '' },
} as const);

Post.schema.index({
	title: 'text',
	content: 'text',
}, {
	name: 'searchIndex',
	weights: {
		content: 2,
		title: 1,
	},
});

Post.register();
