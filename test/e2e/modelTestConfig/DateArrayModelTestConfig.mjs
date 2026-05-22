import __fieldTestObjectsPath_mod from '../keystone-nightwatch/index.mjs';
import path from 'node:path';
const fieldTestObjectsPath = __fieldTestObjectsPath_mod.fieldTestObjectsPath;
const TextFieldTestObject = (await import(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject') + '.mjs')).default;
const DateArrayFieldTestObject = (await import(path.resolve(fieldTestObjectsPath, 'DateArrayFieldTestObject') + '.mjs')).default;
/**
 *
 * @param config
 */
export default function DateArrayModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new DateArrayFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new DateArrayFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
	};
};
