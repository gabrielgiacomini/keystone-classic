import type { FieldProps } from '../types.js';

/** Email address edit widget for email fields. */
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
        type="email"
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
