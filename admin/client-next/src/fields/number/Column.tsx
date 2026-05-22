import type { ColumnProps } from '../types.js';

/** Read-only table cell for number fields. */
export function Column({ value }: ColumnProps<number | string | null>) {
  if (value === null || value === undefined) return <span />;
  return <span>{value}</span>;
}
