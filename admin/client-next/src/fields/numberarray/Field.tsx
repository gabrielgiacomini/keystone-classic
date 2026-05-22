import type { FieldProps } from '../types.js';

function splitNumbers(value: string): number[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .map(Number)
    .filter((item) => Number.isFinite(item));
}

export function Field({
  fieldName,
  value,
  onChange,
  isReadonly,
  errors,
}: FieldProps<number[]>) {
  return (
    <div>
      <input
        id={fieldName}
        name={fieldName}
        type="text"
        inputMode="decimal"
        value={Array.isArray(value) ? value.join(', ') : ''}
        onChange={(e) => onChange(splitNumbers(e.target.value))}
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
