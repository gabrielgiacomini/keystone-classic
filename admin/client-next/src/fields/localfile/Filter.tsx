import type { FilterProps } from '../types.js';

/** Filter widget for localfile fields: filters by filename substring. */
export function Filter({ fieldName, value, onChange }: FilterProps<string>) {
  return (
    <input
      name={fieldName}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Filter by filename..."
    />
  );
}
