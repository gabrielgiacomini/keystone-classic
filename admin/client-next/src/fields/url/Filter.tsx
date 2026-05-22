import type { FilterProps } from '../types.js';

/** URL input filter widget for url fields. */
export function Filter({ fieldName, value, onChange }: FilterProps<string>) {
  return (
    <input
      name={fieldName}
      type="url"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Filter by URL..."
    />
  );
}
