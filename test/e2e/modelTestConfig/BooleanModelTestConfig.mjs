import __fieldTestObjectsPath_mod from '../keystone-nightwatch/index.mjs';
import path from 'node:path';
const fieldTestObjectsPath = __fieldTestObjectsPath_mod.fieldTestObjectsPath;
const TextFieldTestObject = (await import(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject') + '.mjs')).default;
const BooleanFieldTestObject = (await import(path.resolve(fieldTestObjectsPath, 'BooleanFieldTestObject') + '.mjs')).default;
/**
 *
 * @param config
 */
export default function BooleanModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new BooleanFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new BooleanFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
		fieldC: new BooleanFieldTestObject(Object.assign({}, config, {fieldName: 'fieldC'})),
		fieldD: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'fieldD'})),
	};
};
