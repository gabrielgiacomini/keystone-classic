import type { FieldComponentSet } from '../types.js';
import { registerField } from '../registry.js';
import { Field } from './Field.js';
import { Filter } from './Filter.js';
import { Column } from './Column.js';
import type { LocationValue } from './Field.js';

const set: FieldComponentSet<LocationValue, string> = {
  Field,
  Filter,
  Column,
  defaultFilterValue: '',
};

registerField('location', set as FieldComponentSet<unknown, unknown>);

export default set;
