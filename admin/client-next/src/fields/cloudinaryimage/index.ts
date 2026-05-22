import type { FieldComponentSet } from '../types.js';
import { registerField } from '../registry.js';
import { Field } from './Field.js';
import { Filter } from './Filter.js';
import { Column } from './Column.js';

type CloudinaryImageValue = {
  public_id?: string;
  url?: string;
  secure_url?: string;
  width?: number;
  height?: number;
  format?: string;
  resource_type?: string;
} | null;

const set: FieldComponentSet<CloudinaryImageValue, CloudinaryImageValue> = {
  Field,
  Filter,
  Column,
  defaultFilterValue: null,
};

registerField('cloudinaryimage', set as FieldComponentSet<unknown, unknown>);

export default set;
