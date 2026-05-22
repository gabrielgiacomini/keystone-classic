import { formatOrdinalDatetime } from '../../api/list.js';
import type { ColumnProps } from '../types.js';

/** Read-only table cell for datetime fields — formats as `"May 1st 2026, 3:04:05 pm"`. */
export function Column({ value }: ColumnProps<string>) {
  if (!value) return <span />;
  const formatted = formatOrdinalDatetime(value) || value;
  return <span>{formatted}</span>;
}
