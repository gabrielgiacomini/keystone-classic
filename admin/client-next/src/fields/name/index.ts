import type { FieldComponentSet } from '../types.js';
import { registerField } from '../registry.js';
import { Field } from './Field.js';
import { Filter, getDefaultNameFilterValue } from './Filter.js';
import type { NameFilterValue } from './Filter.js';
import { Column } from './Column.js';

interface NameValue {
  first: string;
  last: string;
}

const set: FieldComponentSet<NameValue, string | NameFilterValue> = {
	Field,
	Filter,
	Column,
	defaultFilterValue: getDefaultNameFilterValue(),
};

registerField('name', set as FieldComponentSet<unknown, unknown>);

export default set;
