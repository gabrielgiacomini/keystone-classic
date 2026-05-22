import __fieldTestObjectsPath_mod from '../keystone-nightwatch/index.mjs';
import path from 'node:path';
const fieldTestObjectsPath = __fieldTestObjectsPath_mod.fieldTestObjectsPath;
const TextFieldTestObject = (await import(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject') + '.mjs')).default;
const TextareaFieldTestObject = (await import(path.resolve(fieldTestObjectsPath, 'TextareaFieldTestObject') + '.mjs')).default;
/**
 *
 * @param config
 */
export default function TextareaModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new TextareaFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new TextareaFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
	};
};
