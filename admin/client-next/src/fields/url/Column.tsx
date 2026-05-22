import type { ColumnProps } from '../types.js';

/** Read-only table cell for url fields. */
export function Column({ value }: ColumnProps<string>) {
  return <span>{value}</span>;
}
