import type { FieldProps } from '../types.js';

/** Native color-picker edit widget for color fields. */
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
        type="color"
        value={value || '#000000'}
        onChange={(e) => onChange(e.target.value)}
        required={isRequired}
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
