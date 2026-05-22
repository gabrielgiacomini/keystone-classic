import type { ColumnProps } from '../types.js';

/** Read-only table cell for email fields — renders as a mailto: link. */
export function Column({ value }: ColumnProps<string>) {
  if (value === undefined || value === null || value === '') {
    return <span />;
  }
  return (
    <a
      href={`mailto:${value}`}
      style={{ color: 'var(--ks-primary, #1385e5)' }}
      onClick={(e) => e.stopPropagation()}
    >
      {value}
    </a>
  );
}
