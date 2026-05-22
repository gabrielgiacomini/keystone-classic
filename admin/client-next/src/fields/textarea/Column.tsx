import type { ColumnProps } from '../types.js';

/** Read-only table cell for textarea fields — truncates at 100 characters. */
export function Column({ value }: ColumnProps<string>) {
  return <span>{value ? value.slice(0, 100) : null}</span>;
}
