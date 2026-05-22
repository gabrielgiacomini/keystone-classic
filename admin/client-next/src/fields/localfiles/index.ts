import type { FieldComponentSet } from '../types.js';
import { registerField } from '../registry.js';
import type { FileValue } from '../fileValue.js';
import { Field } from './Field.js';
import { Filter } from './Filter.js';
import { Column } from './Column.js';

type LocalFilesValue = FileValue[];

const set: FieldComponentSet<LocalFilesValue, string> = {
  Field,
  Filter,
  Column,
  defaultFilterValue: '',
};

registerField('localfiles', set as FieldComponentSet<unknown, unknown>);

export default set;
