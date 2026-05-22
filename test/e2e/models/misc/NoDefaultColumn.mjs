import keystone from '../../../../index.mjs';
const Types = keystone.Field.Types;

const NoDefaultColumn = new keystone.List('NoDefaultColumn', {
	track: true,
});

NoDefaultColumn.add({
	fieldA: {
		type: Types.Text,
		initial: true,
	},
	fieldB: {
		type: Types.Text,
	},
});

NoDefaultColumn.register();

export default NoDefaultColumn;
