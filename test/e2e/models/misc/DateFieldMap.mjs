import keystone from '../../../../index.mjs';
const Types = keystone.Field.Types;

// Model to demonstrate issue #2929

const DateFieldMap = new keystone.List('DateFieldMap', {
	map: { name: 'datefield' },
});

DateFieldMap.add({
	datefield: { type: Types.Date, initial: true },
});

DateFieldMap.register();
DateFieldMap.defaultColumns = 'datefield';

export default DateFieldMap;
