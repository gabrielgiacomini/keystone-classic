import type { FieldComponentSet } from '../types.js';
import { registerField } from '../registry.js';
import type { FileValue } from '../fileValue.js';
import { Field } from './Field.js';
import { Filter } from './Filter.js';
import { Column } from './Column.js';

const set: FieldComponentSet<FileValue, string> = {
  Field,
  Filter,
  Column,
  defaultFilterValue: '',
};

registerField('localfile', set as FieldComponentSet<unknown, unknown>);

export default set;
