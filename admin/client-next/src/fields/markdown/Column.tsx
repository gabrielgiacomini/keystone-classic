import type { ColumnProps } from '../types.js';

interface MarkdownValue {
  md: string;
}

/** Read-only table cell for markdown fields — truncates the raw markdown at 100 characters. */
export function Column({ value }: ColumnProps<MarkdownValue>) {
  const text = value?.md ?? '';
  return <span>{text ? text.slice(0, 100) : null}</span>;
}
