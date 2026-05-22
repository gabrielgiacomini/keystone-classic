import __fieldTestObjectsPath_mod from '../keystone-nightwatch/index.mjs';
import path from 'node:path';
const fieldTestObjectsPath = __fieldTestObjectsPath_mod.fieldTestObjectsPath;
const TextFieldTestObject = (await import(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject') + '.mjs')).default;
const NumberArrayFieldTestObject = (await import(path.resolve(fieldTestObjectsPath, 'NumberArrayFieldTestObject') + '.mjs')).default;
/**
 *
 * @param config
 */
export default function NumberArrayModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new NumberArrayFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new NumberArrayFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
	};
};
