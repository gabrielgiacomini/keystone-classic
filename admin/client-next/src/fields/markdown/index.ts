import type { FieldComponentSet } from '../types.js';
import { registerField } from '../registry.js';
import { Field } from './Field.js';
import { Filter, getDefaultMarkdownFilterValue } from './Filter.js';
import type { MarkdownFilterValue } from './Filter.js';
import { Column } from './Column.js';

interface MarkdownValue {
  md: string;
}

const set: FieldComponentSet<MarkdownValue, string | MarkdownFilterValue> = {
	Field,
	Filter,
	Column,
	defaultFilterValue: getDefaultMarkdownFilterValue(),
};

registerField('markdown', set as FieldComponentSet<unknown, unknown>);

export default set;
