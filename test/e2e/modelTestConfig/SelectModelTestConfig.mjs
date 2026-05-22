import __fieldTestObjectsPath_mod from '../keystone-nightwatch/index.mjs';
import path from 'node:path';
const fieldTestObjectsPath = __fieldTestObjectsPath_mod.fieldTestObjectsPath;
const SelectFieldTestObject = (await import(path.resolve(fieldTestObjectsPath, 'SelectFieldTestObject') + '.mjs')).default;
const TextFieldTestObject = (await import(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject') + '.mjs')).default;
/**
 *
 * @param config
 */
export default function SelectModelTestConfig(config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new SelectFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new SelectFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
	};
};
