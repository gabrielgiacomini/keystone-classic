import type { ColumnProps } from '../types.js';

/** Read-only table cell for money fields — formats value as a USD currency string. */
export function Column({ value }: ColumnProps<number | string | null>) {
  if (value === null || value === undefined || value === '') return <span />;
  const num = Number(value);
  if (isNaN(num)) return <span />;
  const formatted = num.toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });
  return <span>{formatted}</span>;
}
