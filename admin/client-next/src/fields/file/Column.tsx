import type { ColumnProps } from '../types.js';
import type { FileValue } from '../fileValue.js';

/** Read-only table cell for file fields: renders filename as a link if url is present. */
export function Column({ value }: ColumnProps<FileValue>) {
  if (value == null) return <span>&#8212;</span>;
  const name = value.filename ?? value.originalname ?? '(file)';
  if (value.url) {
    return <a href={value.url}>{name}</a>;
  }
  return <span>{name}</span>;
}
