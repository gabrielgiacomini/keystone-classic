import type { FieldProps } from '../types.js';

function toDateText(value: unknown): string {
  const text = value instanceof Date ? value.toISOString() : String(value ?? '');
  return /^\d{4}-\d{2}-\d{2}/.test(text) ? text.slice(0, 10) : text;
}

function splitDates(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function Field({
  fieldName,
  value,
  onChange,
  isReadonly,
  errors,
}: FieldProps<string[]>) {
  return (
    <div>
      <input
        id={fieldName}
        name={fieldName}
        type="text"
        placeholder="YYYY-MM-DD, YYYY-MM-DD"
        value={Array.isArray(value) ? value.map(toDateText).join(', ') : ''}
        onChange={(e) => onChange(splitDates(e.target.value))}
        readOnly={isReadonly}
      />
      {errors.map((err, i) => (
        <span key={i} role="alert">
          {err}
        </span>
      ))}
    </div>
  );
}
