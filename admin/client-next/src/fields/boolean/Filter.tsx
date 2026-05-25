import type { FilterProps } from '../types.js';

export type BooleanFilterValue = 'any' | 'true' | 'false' | { value: boolean };

/** Dropdown filter for boolean fields (Any / Yes / No). */
export function Filter({
  fieldName,
  value,
  onChange,
}: FilterProps<BooleanFilterValue>) {
  const selectedValue =
    typeof value === 'object' && value !== null && !Array.isArray(value)
      ? value.value ? 'true' : 'false'
      : value;

  function updateValue(nextValue: 'any' | 'true' | 'false') {
    onChange(nextValue === 'any' ? 'any' : { value: nextValue === 'true' });
  }

  return (
    <select
      name={fieldName}
      value={selectedValue}
      onChange={(e) => updateValue(e.target.value as 'any' | 'true' | 'false')}
      data-list-filter-boolean-value
    >
      <option value="any">Any</option>
      <option value="true">Yes</option>
      <option value="false">No</option>
    </select>
  );
}
