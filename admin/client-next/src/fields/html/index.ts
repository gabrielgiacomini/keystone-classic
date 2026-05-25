import type { FieldComponentSet } from '../types.js';
import { registerField } from '../registry.js';
import { Field } from './Field.js';
import { Filter, getDefaultHtmlFilterValue } from './Filter.js';
import type { HtmlFilterValue } from './Filter.js';
import { Column } from './Column.js';

const set: FieldComponentSet<string, string | HtmlFilterValue> = {
	Field,
	Filter,
	Column,
	defaultFilterValue: getDefaultHtmlFilterValue(),
};

registerField('html', set as FieldComponentSet<unknown, unknown>);

export default set;
