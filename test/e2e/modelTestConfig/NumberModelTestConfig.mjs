import __fieldTestObjectsPath_mod from '../keystone-nightwatch/index.mjs';
import path from 'node:path';
const fieldTestObjectsPath = __fieldTestObjectsPath_mod.fieldTestObjectsPath;
const TextFieldTestObject = (await import(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject') + '.mjs')).default;
const NumberFieldTestObject = (await import(path.resolve(fieldTestObjectsPath, 'NumberFieldTestObject') + '.mjs')).default;
/**
 *
 * @param config
 */
export default function NumberModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new NumberFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new NumberFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
	};
};
