import type { FieldComponentSet } from '../types.js';
import { registerField } from '../registry.js';
import { Field } from './Field.js';
import { Filter, type BooleanFilterValue } from './Filter.js';
import { Column } from './Column.js';

const set: FieldComponentSet<boolean, BooleanFilterValue> = {
  Field,
  Filter,
  Column,
  defaultFilterValue: 'any',
};

registerField('boolean', set as FieldComponentSet<unknown, unknown>);

export default set;
