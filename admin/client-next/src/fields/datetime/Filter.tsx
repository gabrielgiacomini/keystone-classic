import type { FilterProps } from '../types.js';

/** Datetime-local input filter widget for datetime fields. */
export function Filter({ fieldName, value, onChange }: FilterProps<string>) {
  return (
    <input
      name={fieldName}
      type="datetime-local"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
