import __fieldTestObjectsPath_mod from '../keystone-nightwatch/index.mjs';
import path from 'node:path';
const fieldTestObjectsPath = __fieldTestObjectsPath_mod.fieldTestObjectsPath;
const TextFieldTestObject = (await import(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject') + '.mjs')).default;
/**
 *
 * @param config
 */
export default function TextModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
	};
};
