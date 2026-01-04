#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const fieldTypesDir = path.join(__dirname, '../fields/types');
const outputFile = path.join(__dirname, '../admin/client/FieldTypes.js');

const fieldDirs = fs.readdirSync(fieldTypesDir).filter(name => {
	const stat = fs.statSync(path.join(fieldTypesDir, name));
	return stat.isDirectory();
});

const typeMap = {};
fieldDirs.forEach(dir => {
	const files = fs.readdirSync(path.join(fieldTypesDir, dir));
	const columnFile = files.find(f => f.endsWith('Column.js'));
	const fieldFile = files.find(f => f.endsWith('Field.js'));
	const filterFile = files.find(f => f.endsWith('Filter.js'));
	
	if (columnFile && fieldFile && filterFile) {
		const prefix = columnFile.replace('Column.js', '');
		typeMap[dir] = prefix;
	}
});

let output = '';

Object.entries(typeMap).forEach(([dir, prefix]) => {
	output += `import ${prefix}Column from '../../fields/types/${dir}/${prefix}Column';\n`;
	output += `import ${prefix}Field from '../../fields/types/${dir}/${prefix}Field';\n`;
	output += `import ${prefix}Filter from '../../fields/types/${dir}/${prefix}Filter';\n`;
});

output += `\nimport IdColumn from '../../fields/components/columns/IdColumn';\n`;
output += `import InvalidColumn from '../../fields/components/columns/InvalidColumn';\n`;

output += `\nexport const Columns = {\n`;
Object.entries(typeMap).forEach(([dir, prefix]) => {
	output += `\t${dir}: ${prefix}Column,\n`;
});
output += `\tid: IdColumn,\n`;
output += `\t__unrecognised__: InvalidColumn,\n`;
output += `};\n`;

output += `\nexport const Fields = {\n`;
Object.entries(typeMap).forEach(([dir, prefix]) => {
	output += `\t${dir}: ${prefix}Field,\n`;
});
output += `};\n`;

output += `\nexport const Filters = {\n`;
Object.entries(typeMap).forEach(([dir, prefix]) => {
	output += `\t${dir}: ${prefix}Filter,\n`;
});
output += `};\n`;

output += `\nexport default { Columns, Fields, Filters };\n`;

fs.writeFileSync(outputFile, output);
console.log('Generated:', outputFile);
