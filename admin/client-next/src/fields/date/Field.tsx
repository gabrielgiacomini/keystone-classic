import type { FieldProps } from '../types.js';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function pad2(value: number): string {
  return value.toString().padStart(2, '0');
}

function todayYmd(): string {
  const now = new Date();
  return `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`;
}

/**
 * Date picker edit widget for date fields. Matches the legacy admin's shape:
 * a text input expecting `YYYY-MM-DD` paired with a small "Today" button that
 * fills in today's date in the local timezone.
 */
export function Field({
  fieldName,
  value,
  onChange,
  isRequired,
  isReadonly,
  errors,
}: FieldProps<string>) {
  const wrapperStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'stretch',
    gap: 4,
    width: '100%',
  };

  const inputStyle: React.CSSProperties = {
    flex: '1 1 auto',
    minWidth: 0,
  };

  const todayBtnStyle: React.CSSProperties = {
    flex: '0 0 auto',
    padding: '0 12px',
    background: 'var(--ks-bg-muted, #eee)',
    color: 'var(--ks-text, #333)',
    border: '1px solid var(--ks-border, #ccc)',
    borderRadius: 4,
    cursor: 'pointer',
    font: 'inherit',
    lineHeight: 1,
    minWidth: 50,
  };

  function handleChange(raw: string) {
    // The legacy field accepts loosely-typed YYYY-MM-DD text; we forward as-is.
    onChange(raw);
  }

  function handleBlur(raw: string) {
    // Light validation: if the value isn't blank and doesn't match YYYY-MM-DD,
    // leave it for the user to fix — the server-side validates on save.
    if (raw === '' || DATE_RE.test(raw)) return;
  }

  return (
    <div>
      <div style={wrapperStyle}>
        <input
          id={fieldName}
          name={fieldName}
          type="text"
          placeholder="YYYY-MM-DD"
          value={value ?? ''}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={(e) => handleBlur(e.target.value)}
          required={isRequired}
          readOnly={isReadonly}
          style={inputStyle}
          data-field-date-input
        />
        {!isReadonly && (
          <button
            type="button"
            onClick={() => onChange(todayYmd())}
            style={todayBtnStyle}
            data-field-date-today
          >
            Today
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
