import type { FilterProps } from '../types.js';

/** Text input filter widget for key fields. */
export function Filter({ fieldName, value, onChange }: FilterProps<string>) {
  return (
    <input
      name={fieldName}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Filter by key..."
    />
  );
}
