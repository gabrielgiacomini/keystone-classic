import type { FilterProps } from '../types.js';

/** Numeric filter widget for money fields — accepts decimal amounts. */
export function Filter({ fieldName, value, onChange }: FilterProps<string>) {
  return (
    <input
      name={fieldName}
      type="number"
      step="0.01"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Filter by amount..."
    />
  );
}
