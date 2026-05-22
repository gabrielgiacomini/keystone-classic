import type { FieldComponentSet } from '../types.js';
import { registerField } from '../registry.js';
import { Field } from './Field.js';
import { Filter } from './Filter.js';
import { Column } from './Column.js';

const set: FieldComponentSet<number[], string> = {
  Field,
  Filter,
  Column,
  defaultFilterValue: '',
};

registerField('numberarray', set as FieldComponentSet<unknown, unknown>);
