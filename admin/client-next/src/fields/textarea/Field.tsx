import type { FieldProps } from '../types.js';

/** Multi-line textarea edit widget for textarea fields. */
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
      <textarea
        id={fieldName}
        name={fieldName}
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
