import __fieldTestObjectsPath_mod from '../keystone-nightwatch/index.mjs';
import path from 'node:path';
const fieldTestObjectsPath = __fieldTestObjectsPath_mod.fieldTestObjectsPath;
const TextFieldTestObject = (await import(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject') + '.mjs')).default;
const EmailFieldTestObject = (await import(path.resolve(fieldTestObjectsPath, 'EmailFieldTestObject') + '.mjs')).default;
/**
 *
 * @param config
 */
export default function EmailModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new EmailFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new EmailFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
	};
};
