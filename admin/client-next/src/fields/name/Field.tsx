import type { FieldProps } from '../types.js';

interface NameValue {
  first: string;
  last: string;
}

/** Dual text-input edit widget for name fields — separate first and last name inputs. */
export function Field({
  fieldName,
  value,
  onChange,
  isRequired,
  isReadonly,
  errors,
}: FieldProps<NameValue>) {
  return (
    <div>
      <input
        name={`${fieldName}.first`}
        type="text"
        value={value.first}
        onChange={(e) => onChange({ ...value, first: e.target.value })}
        placeholder="First name"
        required={isRequired}
        readOnly={isReadonly}
      />
      <input
        name={`${fieldName}.last`}
        type="text"
        value={value.last}
        onChange={(e) => onChange({ ...value, last: e.target.value })}
        placeholder="Last name"
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
