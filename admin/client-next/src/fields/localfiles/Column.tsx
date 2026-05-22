import type { ColumnProps } from '../types.js';
import type { FileValue } from '../fileValue.js';

type LocalFilesValue = FileValue[];

/** Read-only table cell for localfiles fields: renders file count or first filename. */
export function Column({ value }: ColumnProps<LocalFilesValue>) {
  const files = value ?? [];
  if (files.length === 0) {
    return <span>{'—'}</span>;
  }
  return <span>{`${files.length} ${files.length === 1 ? 'file' : 'files'}`}</span>;
}
