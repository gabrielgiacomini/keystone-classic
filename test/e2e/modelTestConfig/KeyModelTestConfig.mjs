import __fieldTestObjectsPath_mod from '../keystone-nightwatch/index.mjs';
import path from 'node:path';
const fieldTestObjectsPath = __fieldTestObjectsPath_mod.fieldTestObjectsPath;
const TextFieldTestObject = (await import(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject') + '.mjs')).default;
const KeyFieldTestObject = (await import(path.resolve(fieldTestObjectsPath, 'KeyFieldTestObject') + '.mjs')).default;
/**
 *
 * @param config
 */
export default function KeyModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new KeyFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new KeyFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
	};
};
