import type { FieldProps } from '../types.js';

/** Checkbox edit widget for boolean fields. */
export function Field({
  fieldName,
  value,
  onChange,
  isReadonly,
  errors,
}: FieldProps<boolean>) {
  return (
    <div>
      <input
        id={fieldName}
        name={fieldName}
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        disabled={isReadonly}
      />
      {errors.map((err, i) => (
        <span key={i} role="alert">
          {err}
        </span>
      ))}
    </div>
  );
}
