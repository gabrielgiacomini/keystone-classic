import type { FilterProps, FieldMeta } from '../types.js';

type SelectMeta = Extract<FieldMeta, { fieldType: 'select' }>;

/** Dropdown filter widget for select fields — includes an "Any" option for unfiltered results. */
export function Filter({ fieldName, value, onChange, meta }: FilterProps<string>) {
  const selectMeta = meta as SelectMeta;
  const options = selectMeta.options ?? [];

  function getNextValue(rawValue: string) {
    if (rawValue === '') return '';
    return selectMeta.numeric === true ? String(Number(rawValue)) : rawValue;
  }

  return (
    <select
      name={fieldName}
      value={value}
      onChange={(e) => onChange(getNextValue(e.target.value))}
    >
      <option value="">Any</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
