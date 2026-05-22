import type { ColumnProps } from '../types.js';
import type { PasswordValue } from './Field.js';

/** Read-only table cell for password fields — always renders a masked placeholder. */
export function Column({ value }: ColumnProps<PasswordValue>) {
  if (!value) return <span>—</span>;
  return <span>••••••</span>;
}
