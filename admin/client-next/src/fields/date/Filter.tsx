import type { FilterProps } from '../types.js';

/** Date input filter widget for date fields. */
export function Filter({ fieldName, value, onChange }: FilterProps<string>) {
  return (
    <input
      name={fieldName}
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
