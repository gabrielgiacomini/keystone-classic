import type { FieldComponentSet } from '../types.js';
import { registerField } from '../registry.js';
import { Field } from './Field.js';
import { Filter, getDefaultColorFilterValue } from './Filter.js';
import type { ColorFilterValue } from './Filter.js';
import { Column } from './Column.js';

const set: FieldComponentSet<string, string | ColorFilterValue> = {
	Field,
	Filter,
	Column,
	defaultFilterValue: getDefaultColorFilterValue(),
};

registerField('color', set as FieldComponentSet<unknown, unknown>);

export default set;
