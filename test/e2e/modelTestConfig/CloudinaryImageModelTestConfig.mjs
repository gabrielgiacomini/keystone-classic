import __fieldTestObjectsPath_mod from '../keystone-nightwatch/index.mjs';
import path from 'node:path';
const fieldTestObjectsPath = __fieldTestObjectsPath_mod.fieldTestObjectsPath;
const CloudinaryImageFieldTestObject = (await import(path.resolve(fieldTestObjectsPath, 'CloudinaryImageFieldTestObject') + '.mjs')).default;
const TextFieldTestObject = (await import(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject') + '.mjs')).default;
/**
 *
 * @param config
 */
export default function CloudinaryImageModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new CloudinaryImageFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new CloudinaryImageFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
	};
};
