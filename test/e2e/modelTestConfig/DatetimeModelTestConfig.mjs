import __fieldTestObjectsPath_mod from '../keystone-nightwatch/index.mjs';
import path from 'node:path';
const fieldTestObjectsPath = __fieldTestObjectsPath_mod.fieldTestObjectsPath;
const TextFieldTestObject = (await import(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject') + '.mjs')).default;
const DatetimeFieldTestObject = (await import(path.resolve(fieldTestObjectsPath, 'DatetimeFieldTestObject') + '.mjs')).default;
/**
 *
 * @param config
 */
export default function DatetimeModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new DatetimeFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new DatetimeFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
	};
};
