var keystone = require('../../../../index.js');
var Types = keystone.Field.Types;

var FieldAttributes = new keystone.List('FieldAttributes', {
	autokey: {
		path: 'key',
		from: 'name',
		unique: true,
	},
	track: true,
});

FieldAttributes.add({
	name: {
		type: String,
		initial: true,
		required: true,
		index: true,
	},

	noEditField: {
		type: Types.Text,
		initial: true,
		noedit: true,
		label: 'No Edit Field',
	},

	noCreateField: {
		type: Types.Text,
		nocreate: true,
		label: 'No Create Field',
	},

	hiddenField: {
		type: Types.Text,
		hidden: true,
		default: 'hidden-value',
		label: 'Hidden Field',
	},

	fieldWithNote: {
		type: Types.Text,
		initial: true,
		note: 'This is a helpful note for the user',
		label: 'Field With Note',
	},

	fieldWithDefault: {
		type: Types.Text,
		default: 'Default Value',
		label: 'Field With Default',
	},

	requiredField: {
		type: Types.Text,
		required: true,
		initial: true,
		label: 'Required Field',
	},

	dependencyToggle: {
		type: Types.Boolean,
		initial: true,
		default: false,
		label: 'Show Dependent Field',
	},
	dependentField: {
		type: Types.Text,
		dependsOn: { dependencyToggle: true },
		label: 'Dependent Field',
	},

	collapsedField: {
		type: Types.Textarea,
		collapse: true,
		label: 'Collapsed Field',
	},

	textareaWithHeight: {
		type: Types.Textarea,
		height: 300,
		label: 'Textarea With Height',
	},

	selectOptionsString: {
		type: Types.Select,
		options: 'apple, banana, cherry',
		initial: true,
		label: 'Select (String Options)',
	},

	selectOptionsArray: {
		type: Types.Select,
		options: [
			{ value: 'opt1', label: 'Option One' },
			{ value: 'opt2', label: 'Option Two' },
			{ value: 'opt3', label: 'Option Three' },
		],
		label: 'Select (Array Options)',
	},

	selectNumeric: {
		type: Types.Select,
		numeric: true,
		options: [
			{ value: 1, label: 'First' },
			{ value: 2, label: 'Second' },
			{ value: 3, label: 'Third' },
		],
		label: 'Select (Numeric)',
	},

	booleanDefaultTrue: {
		type: Types.Boolean,
		default: true,
		label: 'Boolean Default True',
	},

	numberWithDefault: {
		type: Types.Number,
		default: 42,
		label: 'Number With Default',
	},

	textWithPlaceholder: {
		type: Types.Text,
		placeholder: 'Enter text here...',
		label: 'Text With Placeholder',
	},
});

FieldAttributes.defaultColumns = 'name, noEditField, fieldWithNote';
FieldAttributes.register();

module.exports = FieldAttributes;
