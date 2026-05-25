import type { FieldComponentSet } from '../types.js';
import { registerField } from '../registry.js';
import { Field } from './Field.js';
import { Filter, getDefaultEmailFilterValue } from './Filter.js';
import type { EmailFilterValue } from './Filter.js';
import { Column } from './Column.js';

const set: FieldComponentSet<string, string | EmailFilterValue> = {
	Field,
	Filter,
	Column,
	defaultFilterValue: getDefaultEmailFilterValue(),
};

registerField('email', set as FieldComponentSet<unknown, unknown>);

export default set;
