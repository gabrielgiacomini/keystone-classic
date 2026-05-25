import type { FieldComponentSet } from '../types.js';
import { registerField } from '../registry.js';
import { Field } from './Field.js';
import { Filter, getDefaultTextareaFilterValue } from './Filter.js';
import type { TextareaFilterValue } from './Filter.js';
import { Column } from './Column.js';

const set: FieldComponentSet<string, string | TextareaFilterValue> = {
  Field,
  Filter,
  Column,
  defaultFilterValue: getDefaultTextareaFilterValue(),
};

registerField('textarea', set as FieldComponentSet<unknown, unknown>);

export default set;
