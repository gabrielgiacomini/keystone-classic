import type { FilterProps } from '../types.js';

/** Text input filter widget for color fields — accepts hex values such as #ff0000. */
export function Filter({ fieldName, value, onChange }: FilterProps<string>) {
  return (
    <input
      name={fieldName}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Filter by color (e.g. #ff0000)..."
    />
  );
}
