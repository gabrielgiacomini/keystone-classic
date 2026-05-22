import type { FieldComponentSet } from '../types.js';
import { registerField } from '../registry.js';
import { Field } from './Field.js';
import { Filter } from './Filter.js';
import { Column } from './Column.js';

interface NameValue {
  first: string;
  last: string;
}

const set: FieldComponentSet<NameValue, string> = {
  Field,
  Filter,
  Column,
  defaultFilterValue: '',
};

registerField('name', set as FieldComponentSet<unknown, unknown>);

export default set;
