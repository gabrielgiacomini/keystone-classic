import __fieldTestObjectsPath_mod from '../keystone-nightwatch/index.mjs';
import path from 'node:path';
const fieldTestObjectsPath = __fieldTestObjectsPath_mod.fieldTestObjectsPath;
const TextFieldTestObject = (await import(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject') + '.mjs')).default;
const TextArrayFieldTestObject = (await import(path.resolve(fieldTestObjectsPath, 'TextArrayFieldTestObject') + '.mjs')).default;
/**
 *
 * @param config
 */
export default function TextArrayModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new TextArrayFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new TextArrayFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
	};
};
