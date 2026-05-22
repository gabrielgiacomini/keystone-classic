import type { FieldComponentSet } from '../types.js';
import { registerField } from '../registry.js';
import { Field } from './Field.js';
import { Filter, getDefaultGeopointFilterValue } from './Filter.js';
import { Column } from './Column.js';
import type { GeopointValue } from './Field.js';
import type { GeopointFilterValue } from './Filter.js';

const set: FieldComponentSet<GeopointValue, GeopointFilterValue | null | string> = {
  Field,
  Filter,
  Column,
  defaultFilterValue: getDefaultGeopointFilterValue(),
};

registerField('geopoint', set as FieldComponentSet<unknown, unknown>);

export default set;
