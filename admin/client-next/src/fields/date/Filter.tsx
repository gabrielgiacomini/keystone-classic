import type { FilterProps } from '../types.js';

type DateFilterMode = 'on' | 'after' | 'before' | 'between';

export interface DateFilterValue {
  mode: DateFilterMode;
  value: string | { after: string; before: string };
  inverted?: boolean;
}

const MODE_OPTIONS: Array<{ label: string; value: DateFilterMode }> = [
  { label: 'On', value: 'on' },
  { label: 'After', value: 'after' },
  { label: 'Before', value: 'before' },
  { label: 'Between', value: 'between' },
];

export function getDefaultDateFilterValue(): DateFilterValue {
  return { mode: 'on', value: '' };
}

/** Date input filter widget for date fields. */
export function Filter({ fieldName, value, onChange }: FilterProps<string | DateFilterValue>) {
  const filterValue: DateFilterValue =
    typeof value === 'object' && value !== null && !Array.isArray(value)
      ? value
      : { mode: 'on', value: String(value ?? '') };
  const mode = MODE_OPTIONS.some((option) => option.value === filterValue.mode)
    ? filterValue.mode
    : 'on';

  function updateMode(nextMode: DateFilterMode) {
    onChange({
      mode: nextMode,
      value: nextMode === 'between' ? { after: '', before: '' } : '',
      inverted: filterValue.inverted === true,
    });
  }

  function updateValue(nextValue: string) {
    onChange({ mode, value: nextValue, inverted: filterValue.inverted === true });
  }

  function updateRange(partial: Partial<{ after: string; before: string }>) {
    const current = typeof filterValue.value === 'object' && filterValue.value !== null
      ? filterValue.value
      : { after: '', before: '' };
    onChange({ mode: 'between', value: { ...current, ...partial }, inverted: filterValue.inverted === true });
  }

  return (
    <div>
      <select
        name={`${fieldName}_mode`}
        value={mode}
        onChange={(e) => updateMode(e.target.value as DateFilterMode)}
        data-list-filter-date-mode
      >
        {MODE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      <label>
        <input
          name={`${fieldName}_inverted`}
          type="checkbox"
          checked={filterValue.inverted === true}
          onChange={(e) => onChange({ ...filterValue, mode, inverted: e.target.checked })}
          data-list-filter-date-inverted
        />
        Does NOT Match
      </label>
      {mode === 'between' ? (
        <span>
          <input
            name={`${fieldName}_after`}
            type="date"
            value={typeof filterValue.value === 'object' ? filterValue.value.after : ''}
            onChange={(e) => updateRange({ after: e.target.value })}
            data-list-filter-date-after
          />
          <input
            name={`${fieldName}_before`}
            type="date"
            value={typeof filterValue.value === 'object' ? filterValue.value.before : ''}
            onChange={(e) => updateRange({ before: e.target.value })}
            data-list-filter-date-before
          />
        </span>
      ) : (
        <input
          name={fieldName}
          type="date"
          value={typeof filterValue.value === 'string' ? filterValue.value : ''}
          onChange={(e) => updateValue(e.target.value)}
          data-list-filter-date-value
        />
      )}
    </div>
  );
}
