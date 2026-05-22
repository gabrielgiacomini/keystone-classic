import __fieldTestObjectsPath_mod from '../keystone-nightwatch/index.mjs';
import path from 'node:path';
const fieldTestObjectsPath = __fieldTestObjectsPath_mod.fieldTestObjectsPath;
const TextFieldTestObject = (await import(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject') + '.mjs')).default;
const LocationFieldTestObject = (await import(path.resolve(fieldTestObjectsPath, 'LocationFieldTestObject') + '.mjs')).default;
/**
 *
 * @param config
 */
export default function LocationModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new LocationFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new LocationFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
	};
};
