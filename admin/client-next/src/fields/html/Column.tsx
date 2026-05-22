import type { ColumnProps } from '../types.js';

/** Read-only table cell for html fields — strips tags and truncates to 100 chars. */
export function Column({ value }: ColumnProps<string>) {
  if (!value) return <span />;
  const text = value.replace(/<[^>]*>/g, '').slice(0, 100);
  return <span>{text}</span>;
}
