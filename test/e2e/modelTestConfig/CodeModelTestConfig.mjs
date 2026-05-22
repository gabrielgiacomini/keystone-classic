import __fieldTestObjectsPath_mod from '../keystone-nightwatch/index.mjs';
import path from 'node:path';
const fieldTestObjectsPath = __fieldTestObjectsPath_mod.fieldTestObjectsPath;
const CodeFieldTestObject = (await import(path.resolve(fieldTestObjectsPath, 'CodeFieldTestObject') + '.mjs')).default;
const TextFieldTestObject = (await import(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject') + '.mjs')).default;
/**
 *
 * @param config
 */
export default function CodeModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new CodeFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new CodeFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
	};
};
