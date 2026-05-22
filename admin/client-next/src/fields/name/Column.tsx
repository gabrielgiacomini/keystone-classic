import type { ColumnProps } from '../types.js';

interface NameValue {
  first: string;
  last: string;
}

/** Read-only table cell for name fields — renders the full name as "first last". */
export function Column({ value }: ColumnProps<NameValue>) {
  const full = [value.first, value.last].filter(Boolean).join(' ');
  return <span>{full || null}</span>;
}
