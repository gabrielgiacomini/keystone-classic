import type { FieldComponentSet } from '../types.js';
import { registerField } from '../registry.js';
import { Field } from './Field.js';
import { Filter } from './Filter.js';
import { Column } from './Column.js';

type BooleanFilterValue = 'any' | 'true' | 'false';

const set: FieldComponentSet<boolean, BooleanFilterValue> = {
  Field,
  Filter,
  Column,
  defaultFilterValue: 'any',
};

registerField('boolean', set as FieldComponentSet<unknown, unknown>);

export default set;
