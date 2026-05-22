import { formatOrdinalDate } from '../../api/list.js';
import type { ColumnProps } from '../types.js';

/** Read-only table cell for date fields — formats as `"May 1st 2026"`. */
export function Column({ value }: ColumnProps<string>) {
  if (!value) return <span />;
  const formatted = formatOrdinalDate(value) || value;
  return <span>{formatted}</span>;
}
