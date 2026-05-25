import type { FieldComponentSet } from '../types.js';
import { registerField } from '../registry.js';
import { Field } from './Field.js';
import { Filter, getDefaultTextArrayFilterValue } from './Filter.js';
import type { TextArrayFilterValue } from './Filter.js';
import { Column } from './Column.js';

const set: FieldComponentSet<string[], string | TextArrayFilterValue> = {
	Field,
	Filter,
	Column,
	defaultFilterValue: getDefaultTextArrayFilterValue(),
};

registerField('textarray', set as FieldComponentSet<unknown, unknown>);
