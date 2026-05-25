import type { FieldComponentSet } from '../types.js';
import { registerField } from '../registry.js';
import { Field } from './Field.js';
import { Filter, getDefaultDateArrayFilterValue } from './Filter.js';
import type { DateArrayFilterValue } from './Filter.js';
import { Column } from './Column.js';

const set: FieldComponentSet<string[], string | DateArrayFilterValue> = {
	Field,
	Filter,
	Column,
	defaultFilterValue: getDefaultDateArrayFilterValue(),
};

registerField('datearray', set as FieldComponentSet<unknown, unknown>);
