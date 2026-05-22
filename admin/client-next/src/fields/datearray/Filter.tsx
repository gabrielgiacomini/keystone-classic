import type { FilterProps } from '../types.js';

export function Filter({ fieldName, value, onChange }: FilterProps<string>) {
  return (
    <input
      aria-label={`${fieldName} filter`}
      name={`${fieldName}-filter`}
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
