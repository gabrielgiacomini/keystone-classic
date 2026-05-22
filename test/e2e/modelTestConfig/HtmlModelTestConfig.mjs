import __fieldTestObjectsPath_mod from '../keystone-nightwatch/index.mjs';
import path from 'node:path';
const fieldTestObjectsPath = __fieldTestObjectsPath_mod.fieldTestObjectsPath;
const TextFieldTestObject = (await import(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject') + '.mjs')).default;
const HtmlFieldTestObject = (await import(path.resolve(fieldTestObjectsPath, 'HtmlFieldTestObject') + '.mjs')).default;
/**
 *
 * @param config
 */
export default function HtmlModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new HtmlFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new HtmlFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
	};
};
