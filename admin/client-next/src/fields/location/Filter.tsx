import type { FilterProps } from '../types.js';

/** Text filter widget for location fields — matches any part of the address. */
export function Filter({ fieldName, value, onChange }: FilterProps<string>) {
  return (
    <input
      name={fieldName}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Filter by address..."
    />
  );
}
