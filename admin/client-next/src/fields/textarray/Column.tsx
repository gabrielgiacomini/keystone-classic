import type { ColumnProps } from '../types.js';

export function Column({ value }: ColumnProps<string[]>) {
  return <span>{Array.isArray(value) ? value.join(', ') : ''}</span>;
}
