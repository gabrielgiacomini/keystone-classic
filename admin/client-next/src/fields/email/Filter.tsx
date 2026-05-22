import type { FilterProps } from '../types.js';

/** Email input filter widget for email fields. */
export function Filter({ fieldName, value, onChange }: FilterProps<string>) {
  return (
    <input
      name={fieldName}
      type="email"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Filter by email..."
    />
  );
}
