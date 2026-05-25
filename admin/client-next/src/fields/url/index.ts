import type { FieldComponentSet } from '../types.js';
import { registerField } from '../registry.js';
import { Field } from './Field.js';
import { Filter, getDefaultUrlFilterValue } from './Filter.js';
import type { UrlFilterValue } from './Filter.js';
import { Column } from './Column.js';

const set: FieldComponentSet<string, string | UrlFilterValue> = {
	Field,
	Filter,
	Column,
	defaultFilterValue: getDefaultUrlFilterValue(),
};

registerField('url', set as FieldComponentSet<unknown, unknown>);

export default set;
