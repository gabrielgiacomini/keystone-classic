import type { FilterProps } from '../types.js';

type BooleanFilterValue = 'any' | 'true' | 'false';

/** Dropdown filter for boolean fields (Any / Yes / No). */
export function Filter({
  fieldName,
  value,
  onChange,
}: FilterProps<BooleanFilterValue>) {
  return (
    <select
      name={fieldName}
      value={value}
      onChange={(e) => onChange(e.target.value as BooleanFilterValue)}
    >
      <option value="any">Any</option>
      <option value="true">Yes</option>
      <option value="false">No</option>
    </select>
  );
}
