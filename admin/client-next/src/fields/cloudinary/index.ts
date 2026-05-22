import { Field } from './Field.js';
import { Filter } from './Filter.js';
import { Column } from './Column.js';
import { registerField } from '../registry.js';
import type { FieldComponentSet } from '../types.js';

const set: FieldComponentSet<unknown, unknown> = {
  Field,
  Filter,
  Column,
  defaultFilterValue: '',
};

registerField('cloudinary', set);
export default set;
