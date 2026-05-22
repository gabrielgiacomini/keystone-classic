import __fieldTestObjectsPath_mod from '../keystone-nightwatch/index.mjs';
import path from 'node:path';
const fieldTestObjectsPath = __fieldTestObjectsPath_mod.fieldTestObjectsPath;
const NameFieldTestObject = (await import(path.resolve(fieldTestObjectsPath, 'NameFieldTestObject') + '.mjs')).default;
const TextFieldTestObject = (await import(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject') + '.mjs')).default;
/**
 *
 * @param config
 */
export default function NameModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new NameFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new NameFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
	};
};
