import type { FieldComponentSet } from '../types.js';
import { registerField } from '../registry.js';
import { Field } from './Field.js';
import { Filter, getDefaultTextFilterValue } from './Filter.js';
import type { TextFilterValue } from './Filter.js';
import { Column } from './Column.js';

const set: FieldComponentSet<string, string | TextFilterValue> = {
  Field,
  Filter,
  Column,
  defaultFilterValue: getDefaultTextFilterValue(),
};

registerField('text', set as FieldComponentSet<unknown, unknown>);

export default set;
