import __fieldTestObjectsPath_mod from '../keystone-nightwatch/index.mjs';
import path from 'node:path';
const fieldTestObjectsPath = __fieldTestObjectsPath_mod.fieldTestObjectsPath;
const TextFieldTestObject = (await import(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject') + '.mjs')).default;
const FileFieldTestObject = (await import(path.resolve(fieldTestObjectsPath, 'FileFieldTestObject') + '.mjs')).default;
/**
 *
 * @param config
 */
export default function FileModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new FileFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new FileFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
	};
};
