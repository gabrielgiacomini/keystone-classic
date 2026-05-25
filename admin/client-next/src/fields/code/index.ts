import type { FieldComponentSet } from '../types.js';
import { registerField } from '../registry.js';
import { Field } from './Field.js';
import { Filter, getDefaultCodeFilterValue } from './Filter.js';
import type { CodeFilterValue } from './Filter.js';
import { Column } from './Column.js';

const set: FieldComponentSet<string, string | CodeFilterValue> = {
	Field,
	Filter,
	Column,
	defaultFilterValue: getDefaultCodeFilterValue(),
};

registerField('code', set as FieldComponentSet<unknown, unknown>);

export default set;
