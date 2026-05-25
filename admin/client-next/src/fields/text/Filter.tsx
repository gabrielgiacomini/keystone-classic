import type { FilterProps } from '../types.js';

type TextFilterMode = 'contains' | 'exactly' | 'beginsWith' | 'endsWith';

export interface TextFilterValue {
  mode?: TextFilterMode;
  inverted?: boolean;
  value?: string;
}

const MODE_OPTIONS: Array<{ label: string; value: TextFilterMode }> = [
  { label: 'Contains', value: 'contains' },
  { label: 'Exactly', value: 'exactly' },
  { label: 'Begins with', value: 'beginsWith' },
  { label: 'Ends with', value: 'endsWith' },
];

export function getDefaultTextFilterValue(): TextFilterValue {
  return { mode: 'contains', inverted: false, value: '' };
}

function normalizeTextFilterValue(value: string | TextFilterValue): TextFilterValue {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    return { ...getDefaultTextFilterValue(), ...value };
  }
  return { ...getDefaultTextFilterValue(), value: String(value ?? '') };
}

/** Structured text filter widget matching the legacy text filter contract. */
export function Filter({
  fieldName,
  value,
  onChange,
}: FilterProps<string | TextFilterValue>) {
  const filterValue = normalizeTextFilterValue(value);
  const mode = MODE_OPTIONS.some((option) => option.value === filterValue.mode)
    ? filterValue.mode
    : 'contains';

  function update(partial: Partial<TextFilterValue>) {
    onChange({ ...filterValue, mode, ...partial });
  }

  return (
    <div data-list-filter-text>
      <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
        <button
          type="button"
          onClick={() => update({ inverted: false })}
          data-list-filter-text-mode-match
          style={{
            flex: 1,
            padding: '0.25rem',
            fontWeight: filterValue.inverted === true ? undefined : 'bold',
          }}
        >
          Matches
        </button>
        <button
          type="button"
          onClick={() => update({ inverted: true })}
          data-list-filter-text-mode-inverted
          style={{
            flex: 1,
            padding: '0.25rem',
            fontWeight: filterValue.inverted === true ? 'bold' : undefined,
          }}
        >
          Does NOT Match
        </button>
      </div>
      <select
        name={`${fieldName}_mode`}
        value={mode}
        onChange={(event) => update({ mode: event.target.value as TextFilterMode })}
        data-list-filter-text-mode
      >
        {MODE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      <input
        name={fieldName}
        type="text"
        value={filterValue.value ?? ''}
        onChange={(event) => update({ value: event.target.value })}
        placeholder="Filter..."
        data-list-filter-text-value
      />
    </div>
  );
}
