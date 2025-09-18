var objectAssign = require('object-assign');
var fieldTestObjectsPath = require('../keystone-nightwatch').fieldTestObjectsPath;
var path = require('path');
var SelectFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'SelectFieldTestObject'));
var TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));

module.exports = function SelectModelTestConfig(config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new SelectFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new SelectFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
