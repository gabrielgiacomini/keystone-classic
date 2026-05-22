import type { FieldProps } from '../types.js';

function splitList(value: string): string[] {
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
        value={Array.isArray(value) ? value.join(', ') : ''}
        onChange={(e) => onChange(splitList(e.target.value))}
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
