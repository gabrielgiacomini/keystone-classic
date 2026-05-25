import type { FieldComponentSet } from '../types.js';
import { registerField } from '../registry.js';
import { Field } from './Field.js';
import { Filter, getDefaultNumberFilterValue } from './Filter.js';
import type { NumberFilterValue } from './Filter.js';
import { Column } from './Column.js';

const set: FieldComponentSet<number | string, string | NumberFilterValue> = {
  Field,
  Filter,
  Column,
  defaultFilterValue: getDefaultNumberFilterValue(),
};

registerField('number', set as FieldComponentSet<unknown, unknown>);

export default set;
