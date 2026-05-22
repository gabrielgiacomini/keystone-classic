import type { ColumnProps, FieldMeta } from '../types.js';

type SelectMeta = Extract<FieldMeta, { fieldType: 'select' }>;

/** Read-only table cell for select fields — displays the option label, falling back to the raw value. */
export function Column({ value, meta }: ColumnProps<string | number>) {
  const options = (meta as SelectMeta).options ?? [];
  const option = options.find((o) => String(o.value) === String(value));
  return <span>{option ? option.label : value}</span>;
}
