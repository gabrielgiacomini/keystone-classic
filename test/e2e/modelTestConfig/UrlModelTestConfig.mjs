import __fieldTestObjectsPath_mod from '../keystone-nightwatch/index.mjs';
import path from 'node:path';
const fieldTestObjectsPath = __fieldTestObjectsPath_mod.fieldTestObjectsPath;
const TextFieldTestObject = (await import(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject') + '.mjs')).default;
const UrlFieldTestObject = (await import(path.resolve(fieldTestObjectsPath, 'UrlFieldTestObject') + '.mjs')).default;
/**
 *
 * @param config
 */
export default function UrlModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new UrlFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new UrlFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
	};
};
