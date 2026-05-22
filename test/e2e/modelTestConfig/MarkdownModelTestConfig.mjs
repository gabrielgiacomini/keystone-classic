import __fieldTestObjectsPath_mod from '../keystone-nightwatch/index.mjs';
import path from 'node:path';
const fieldTestObjectsPath = __fieldTestObjectsPath_mod.fieldTestObjectsPath;
const TextFieldTestObject = (await import(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject') + '.mjs')).default;
const MarkdownFieldTestObject = (await import(path.resolve(fieldTestObjectsPath, 'MarkdownFieldTestObject') + '.mjs')).default;
/**
 *
 * @param config
 */
export default function MarkdownModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new MarkdownFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new MarkdownFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
		fieldC: new MarkdownFieldTestObject(Object.assign({}, config, {fieldName: 'fieldC'})),
		fieldD: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'fieldD'})),
	};
};
