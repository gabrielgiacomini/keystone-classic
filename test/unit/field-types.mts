import fs from 'node:fs';
import path from 'node:path';
import keystone from 'keystone';
import type { ExplicitListOptions } from '../../lib/core/options-types.js';
import getMongooseConnection from '../helpers/getMongooseConnection.mts';

keystone.init();

const typesLoc = path.resolve('dist/fields/types');
const types = fs.readdirSync(typesLoc);

let mongoose: typeof import('mongoose');
before(async function () {
	mongoose = await getMongooseConnection();
	keystone.mongoose = mongoose;
});

/** Minimal options used to construct throw-away test Lists for field-type tests. */
const testListOptions: ExplicitListOptions = {
	sortable: false,
	track: false,
	autokey: null,
	defaultColumns: '__name__',
	searchFields: '__name__',
	defaultSort: '__default__',
	noedit: false,
	nodelete: false,
	nocreate: true,
	hidden: false,
	searchUsesTextIndex: false,
	perPage: 100,
};

for (const name of types) {
	const typeTestPath = typesLoc + '/' + name + '/test/type.mjs';
	if (!fs.existsSync(typeTestPath)) continue;

	// nocreate: true prevents warnings for required / not initial fields
	const List = new keystone.List(name + 'Test', testListOptions);
	/** Shape expected from every field-type test module. */
	interface FieldTypeTestModule {
		initList(list: typeof List): void;
		testFieldType(list: typeof List): void;
	}
	const test = (await import(typeTestPath)) as FieldTypeTestModule;

	test.initList(List);
	List.register();
	describe('FieldType: ' + name.slice(0, 1).toUpperCase() + name.slice(1), function () {
		before(async function () {
			await List.model.deleteMany({});
		});
		test.testFieldType(List);
	});
}
