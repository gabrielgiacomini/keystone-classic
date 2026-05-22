import __fieldTestObjectsPath_mod from '../keystone-nightwatch/index.mjs';
import path from 'node:path';
const fieldTestObjectsPath = __fieldTestObjectsPath_mod.fieldTestObjectsPath;
const NameFieldTestObject = (await import(path.resolve(fieldTestObjectsPath, 'NameFieldTestObject') + '.mjs')).default;
const EmailFieldTestObject = (await import(path.resolve(fieldTestObjectsPath, 'EmailFieldTestObject') + '.mjs')).default;
const PasswordFieldTestObject = (await import(path.resolve(fieldTestObjectsPath, 'PasswordFieldTestObject') + '.mjs')).default;
const TextFieldTestObject = (await import(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject') + '.mjs')).default;
const BooleanFieldTestObject = (await import(path.resolve(fieldTestObjectsPath, 'BooleanFieldTestObject') + '.mjs')).default;
/**
 *
 * @param config
 */
export default function UserModelTestConfig (config) {
	return {
		name: new NameFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		email: new EmailFieldTestObject(Object.assign({}, config, {fieldName: 'email'})),
		password: new PasswordFieldTestObject(Object.assign({}, config, {fieldName: 'password'})),
		resetPasswordKey: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'resetPasswordKey'})),
		isAdmin: new BooleanFieldTestObject(Object.assign({}, config, {fieldName: 'isAdmin'})),
		isMember: new BooleanFieldTestObject(Object.assign({}, config, {fieldName: 'isMember'})),
	};
};
