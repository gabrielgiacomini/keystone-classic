import type { FieldComponentSet } from '../types.js';
import { registerField } from '../registry.js';
import { Field } from './Field.js';
import { Filter } from './Filter.js';
import { Column } from './Column.js';

interface MarkdownValue {
  md: string;
}

const set: FieldComponentSet<MarkdownValue, string> = {
  Field,
  Filter,
  Column,
  defaultFilterValue: '',
};

registerField('markdown', set as FieldComponentSet<unknown, unknown>);

export default set;
