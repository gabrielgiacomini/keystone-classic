import __fieldTestObjectsPath_mod from '../keystone-nightwatch/index.mjs';
import path from 'node:path';
const fieldTestObjectsPath = __fieldTestObjectsPath_mod.fieldTestObjectsPath;
const TextFieldTestObject = (await import(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject') + '.mjs')).default;
const GeoPointFieldTestObject = (await import(path.resolve(fieldTestObjectsPath, 'GeoPointFieldTestObject') + '.mjs')).default;
/**
 *
 * @param config
 */
export default function GeoPointModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new GeoPointFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new GeoPointFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
	};
};
