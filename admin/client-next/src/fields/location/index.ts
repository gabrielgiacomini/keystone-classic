import type { FieldComponentSet } from '../types.js';
import { registerField } from '../registry.js';
import { Field } from './Field.js';
import { Filter, getDefaultLocationFilterValue } from './Filter.js';
import type { LocationFilterValue } from './Filter.js';
import { Column } from './Column.js';
import type { LocationValue } from './Field.js';

const set: FieldComponentSet<LocationValue, string | LocationFilterValue> = {
  Field,
  Filter,
  Column,
  defaultFilterValue: getDefaultLocationFilterValue(),
};

registerField('location', set as FieldComponentSet<unknown, unknown>);

export default set;
