import type { FieldProps, FieldMeta } from '../types.js';

type SelectMeta = Extract<FieldMeta, { fieldType: 'select' }>;

/** Dropdown edit widget for select fields — options are sourced from field metadata. */
export function Field({
  fieldName,
  value,
  onChange,
  isRequired,
  isReadonly,
  errors,
  meta,
}: FieldProps<string | number>) {
  const selectMeta = meta as SelectMeta;
  const options = selectMeta.options ?? [];
  const hasEmptyOption = selectMeta.emptyOption !== false;
  const hasValue = value !== null && value !== undefined && value !== '';

  function getNextValue(rawValue: string) {
    if (rawValue === '') return '';
    return selectMeta.numeric === true ? Number(rawValue) : rawValue;
  }

  const wrapperStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    width: '100%',
  };

  const selectStyle: React.CSSProperties = {
    flex: '1 1 auto',
    minWidth: 0,
  };

  const clearBtnStyle: React.CSSProperties = {
    background: 'none',
    border: 0,
    color: 'var(--ks-text-light)',
    cursor: 'pointer',
    font: 'inherit',
    padding: '0 0.4em',
    lineHeight: 1,
    fontSize: '1.1rem',
  };

  return (
    <div>
      <div style={wrapperStyle}>
        <select
          id={fieldName}
          name={fieldName}
          style={selectStyle}
          value={value == null ? '' : String(value)}
          onChange={(e) => onChange(getNextValue(e.target.value))}
          required={isRequired}
          disabled={isReadonly}
          data-field-select
        >
          {hasEmptyOption && <option value="" />}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {hasValue && !isReadonly && hasEmptyOption && (
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label={`Clear ${fieldName}`}
            title="Clear"
            style={clearBtnStyle}
            data-field-select-clear
          >
            {'×'}
          </button>
        )}
      </div>
      {errors.map((err, i) => (
        <span key={i} role="alert">
          {err}
        </span>
      ))}
    </div>
  );
}
