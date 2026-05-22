import __fieldTestObjectsPath_mod from '../keystone-nightwatch/index.mjs';
import path from 'node:path';
const fieldTestObjectsPath = __fieldTestObjectsPath_mod.fieldTestObjectsPath;
const TextFieldTestObject = (await import(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject') + '.mjs')).default;
const RelationshipFieldTestObject = (await import(path.resolve(fieldTestObjectsPath, 'RelationshipFieldTestObject') + '.mjs')).default;
/**
 *
 * @param config
 */
export default function RelationshipModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new RelationshipFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new RelationshipFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
	};
};
