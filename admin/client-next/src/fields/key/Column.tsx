import type { ColumnProps } from '../types.js';

/** Read-only table cell for key fields. */
export function Column({ value }: ColumnProps<string>) {
  return <span>{value}</span>;
}
