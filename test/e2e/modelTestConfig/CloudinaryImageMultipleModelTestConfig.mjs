import __fieldTestObjectsPath_mod from '../keystone-nightwatch/index.mjs';
import path from 'node:path';
const fieldTestObjectsPath = __fieldTestObjectsPath_mod.fieldTestObjectsPath;
const CloudinaryImageMultipleFieldTestObject = (await import(path.resolve(fieldTestObjectsPath, 'CloudinaryImageMultipleFieldTestObject') + '.mjs')).default;
const TextFieldTestObject = (await import(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject') + '.mjs')).default;
/**
 *
 * @param config
 */
export default function CloudinaryImageMultipleModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new CloudinaryImageMultipleFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new CloudinaryImageMultipleFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
	};
};
