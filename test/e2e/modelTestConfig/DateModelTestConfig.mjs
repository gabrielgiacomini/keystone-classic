import __fieldTestObjectsPath_mod from '../keystone-nightwatch/index.mjs';
import path from 'node:path';
const fieldTestObjectsPath = __fieldTestObjectsPath_mod.fieldTestObjectsPath;
const TextFieldTestObject = (await import(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject') + '.mjs')).default;
const DateFieldTestObject = (await import(path.resolve(fieldTestObjectsPath, 'DateFieldTestObject') + '.mjs')).default;
/**
 *
 * @param config
 */
export default function DateModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new DateFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new DateFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
	};
};
