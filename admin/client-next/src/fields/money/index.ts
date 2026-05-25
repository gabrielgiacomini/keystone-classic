import type { FieldComponentSet } from '../types.js';
import { registerField } from '../registry.js';
import { Field } from './Field.js';
import { Filter, getDefaultMoneyFilterValue } from './Filter.js';
import type { MoneyFilterValue } from './Filter.js';
import { Column } from './Column.js';

const set: FieldComponentSet<string, string | MoneyFilterValue> = {
  Field,
  Filter,
  Column,
  defaultFilterValue: getDefaultMoneyFilterValue(),
};

registerField('money', set as FieldComponentSet<unknown, unknown>);

export default set;
