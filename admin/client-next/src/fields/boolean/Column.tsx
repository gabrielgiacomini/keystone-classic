import type { ColumnProps } from '../types.js';

/** Read-only table cell for boolean fields — renders a check icon for true, empty for false. */
export function Column({ value }: ColumnProps<boolean>) {
  if (value === true) {
    return (
      <span
        aria-label="Yes"
        title="Yes"
        style={{ color: 'var(--ks-primary, #1385e5)', display: 'inline-flex' }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 5l-1.41-1.42L6 8.17 3.41 5.59 2 7l4 4 6-6z" />
        </svg>
      </span>
    );
  }
  return <span aria-label="No" />;
}
