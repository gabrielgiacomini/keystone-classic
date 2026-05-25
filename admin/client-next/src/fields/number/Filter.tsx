import type { FilterProps } from '../types.js';

type NumberFilterMode = 'equals' | 'gt' | 'lt' | 'between';

export interface NumberFilterValue {
  mode: NumberFilterMode;
  value: string | { min: string; max: string };
}

const MODE_OPTIONS: Array<{ label: string; value: NumberFilterMode }> = [
  { label: 'Exactly', value: 'equals' },
  { label: 'Greater Than', value: 'gt' },
  { label: 'Less Than', value: 'lt' },
  { label: 'Between', value: 'between' },
];

export function getDefaultNumberFilterValue(): NumberFilterValue {
  return { mode: 'equals', value: '' };
}

/** Numeric filter widget for number fields. */
export function Filter({ fieldName, value, onChange }: FilterProps<string | NumberFilterValue>) {
  const filterValue: NumberFilterValue =
    typeof value === 'object' && value !== null && !Array.isArray(value)
      ? value
      : { mode: 'equals', value: String(value ?? '') };
  const mode = MODE_OPTIONS.some((option) => option.value === filterValue.mode)
    ? filterValue.mode
    : 'equals';

  function updateMode(nextMode: NumberFilterMode) {
    onChange({
      mode: nextMode,
      value: nextMode === 'between' ? { min: '', max: '' } : '',
    });
  }

  function updateValue(nextValue: string) {
    onChange({ mode, value: nextValue });
  }

  function updateRange(partial: Partial<{ min: string; max: string }>) {
    const current = typeof filterValue.value === 'object' && filterValue.value !== null
      ? filterValue.value
      : { min: '', max: '' };
    onChange({ mode: 'between', value: { ...current, ...partial } });
  }

  return (
    <div>
      <select
        name={`${fieldName}_mode`}
        value={mode}
        onChange={(e) => updateMode(e.target.value as NumberFilterMode)}
        data-list-filter-number-mode
      >
        {MODE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      {mode === 'between' ? (
        <span>
          <input
            name={`${fieldName}_min`}
            type="number"
            value={typeof filterValue.value === 'object' ? filterValue.value.min : ''}
            onChange={(e) => updateRange({ min: e.target.value })}
            placeholder="Min."
            data-list-filter-number-min
          />
          <input
            name={`${fieldName}_max`}
            type="number"
            value={typeof filterValue.value === 'object' ? filterValue.value.max : ''}
            onChange={(e) => updateRange({ max: e.target.value })}
            placeholder="Max."
            data-list-filter-number-max
          />
        </span>
      ) : (
        <input
          name={fieldName}
          type="number"
          value={typeof filterValue.value === 'string' ? filterValue.value : ''}
          onChange={(e) => updateValue(e.target.value)}
          placeholder="Filter by number..."
          data-list-filter-number-value
        />
      )}
    </div>
  );
}
