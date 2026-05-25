import type { FieldComponentSet } from '../types.js';
import { registerField } from '../registry.js';
import { Field } from './Field.js';
import { Filter, getDefaultKeyFilterValue } from './Filter.js';
import type { KeyFilterValue } from './Filter.js';
import { Column } from './Column.js';

const set: FieldComponentSet<string, string | KeyFilterValue> = {
  Field,
  Filter,
  Column,
  defaultFilterValue: getDefaultKeyFilterValue(),
};

registerField('key', set as FieldComponentSet<unknown, unknown>);

export default set;
