import type { FilterProps } from '../types.js';

/** Numeric filter widget for number fields. */
export function Filter({ fieldName, value, onChange }: FilterProps<string>) {
  return (
    <input
      name={fieldName}
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Filter by number..."
    />
  );
}
