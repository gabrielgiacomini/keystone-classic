import __fieldTestObjectsPath_mod from '../keystone-nightwatch/index.mjs';
import path from 'node:path';
const fieldTestObjectsPath = __fieldTestObjectsPath_mod.fieldTestObjectsPath;
const TextFieldTestObject = (await import(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject') + '.mjs')).default;
const PasswordFieldTestObject = (await import(path.resolve(fieldTestObjectsPath, 'PasswordFieldTestObject') + '.mjs')).default;
/**
 *
 * @param config
 */
export default function PasswordModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new PasswordFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new PasswordFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
		fieldC: new PasswordFieldTestObject(Object.assign({}, config, {fieldName: 'fieldC'})),
		fieldD: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'fieldD'})),
	};
};
