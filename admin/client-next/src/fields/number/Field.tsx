import type { FieldProps } from '../types.js';

/** Numeric edit widget for number fields. */
export function Field({
  fieldName,
  value,
  onChange,
  isRequired,
  isReadonly,
  errors,
}: FieldProps<number | string>) {
  return (
    <div>
      <input
        id={fieldName}
        name={fieldName}
        type="number"
        value={value === null || value === undefined ? '' : value}
        onChange={(e) => {
          const raw = e.target.value;
          if (raw === '' || /^-?\d*\.?\d*$/.test(raw)) {
            onChange(raw);
          }
        }}
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
