import type { ColumnProps } from '../types.js';

function toDateText(value: unknown): string {
  const text = value instanceof Date ? value.toISOString() : String(value ?? '');
  return /^\d{4}-\d{2}-\d{2}/.test(text) ? text.slice(0, 10) : text;
}

export function Column({ value }: ColumnProps<string[]>) {
  return <span>{Array.isArray(value) ? value.map(toDateText).join(', ') : ''}</span>;
}
