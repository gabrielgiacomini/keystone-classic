import type { FieldComponentSet } from '../types.js';
import { registerField } from '../registry.js';
import { Field } from './Field.js';
import { Filter, getDefaultNumberArrayFilterValue } from './Filter.js';
import type { NumberArrayFilterValue } from './Filter.js';
import { Column } from './Column.js';

const set: FieldComponentSet<number[], string | NumberArrayFilterValue> = {
	Field,
	Filter,
	Column,
	defaultFilterValue: getDefaultNumberArrayFilterValue(),
};

registerField('numberarray', set as FieldComponentSet<unknown, unknown>);
