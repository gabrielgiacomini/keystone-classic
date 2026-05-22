import keystone from 'keystone';
import type { ExplicitListOptions } from '../../lib/core/options-types.js';

const Types = keystone.Field.Types;

const dependsOnOptions: ExplicitListOptions = {
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

const DependsOn = new keystone.List('DependsOn', dependsOnOptions);

DependsOn.add({
	title: { type: String, required: true, default: '' },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft' },
	publishedDate: { type: Types.Date, dependsOn: { state: 'published' }, required: true, initial: false },
} as const);

DependsOn.register();
