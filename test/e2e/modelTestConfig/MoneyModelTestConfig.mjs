import __fieldTestObjectsPath_mod from '../keystone-nightwatch/index.mjs';
import path from 'node:path';
const fieldTestObjectsPath = __fieldTestObjectsPath_mod.fieldTestObjectsPath;
const TextFieldTestObject = (await import(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject') + '.mjs')).default;
const MoneyFieldTestObject = (await import(path.resolve(fieldTestObjectsPath, 'MoneyFieldTestObject') + '.mjs')).default;
/**
 *
 * @param config
 */
export default function MoneyModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new MoneyFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new MoneyFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
		fieldC: new MoneyFieldTestObject(Object.assign({}, config, {fieldName: 'fieldC'})),
		fieldD: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'fieldD'})),
	};
};
