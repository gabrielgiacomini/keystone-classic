import type { FieldComponentSet } from '../types.js';
import { registerField } from '../registry.js';
import { Field } from './Field.js';
import { Filter } from './Filter.js';
import { Column } from './Column.js';

type RelationshipItemValue = { id: string; label?: string };
type RelationshipValue = RelationshipItemValue | RelationshipItemValue[] | null;

const set: FieldComponentSet<RelationshipValue, string> = {
  Field,
  Filter,
  Column,
  defaultFilterValue: '',
};

registerField('relationship', set as FieldComponentSet<unknown, unknown>);

export default set;
