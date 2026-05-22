import type { FieldProps } from '../types.js';

/** Numeric edit widget for money fields — accepts decimal amounts. */
export function Field({
  fieldName,
  value,
  onChange,
  isRequired,
  isReadonly,
  errors,
}: FieldProps<string>) {
  return (
    <div>
      <input
        id={fieldName}
        name={fieldName}
        type="number"
        step="0.01"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={isRequired}
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
