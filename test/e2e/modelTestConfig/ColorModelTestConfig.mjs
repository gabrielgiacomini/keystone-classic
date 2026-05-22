import __fieldTestObjectsPath_mod from '../keystone-nightwatch/index.mjs';
import path from 'node:path';
const fieldTestObjectsPath = __fieldTestObjectsPath_mod.fieldTestObjectsPath;
const TextFieldTestObject = (await import(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject') + '.mjs')).default;
const ColorFieldTestObject = (await import(path.resolve(fieldTestObjectsPath, 'ColorFieldTestObject') + '.mjs')).default;
/**
 *
 * @param config
 */
export default function ColorModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new ColorFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new ColorFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
	};
};
