import type { FieldProps } from '../types.js';
import type { FileValue } from '../fileValue.js';

/** Edit widget for localfile fields: shows current file info and a file picker. */
export function Field({
  fieldName,
  value,
  onChange,
  isRequired,
  isReadonly,
  errors,
}: FieldProps<FileValue>) {
  const displayName = value?.filename ?? value?.originalname ?? null;
  const displaySize = value?.size != null ? `${value.size} bytes` : null;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    onChange({
      filename: file.name,
      size: file.size,
      filetype: file.type || undefined,
    });
  }

  return (
    <div>
      {displayName != null && (
        <div>
          <span>{displayName}</span>
          {displaySize != null && <span> ({displaySize})</span>}
        </div>
      )}
      {!isReadonly && (
        <input
          id={fieldName}
          name={fieldName}
          type="file"
          onChange={handleFileChange}
          required={isRequired && value == null}
        />
      )}
      {errors.map((err, i) => (
        <span key={i} role="alert">
          {err}
        </span>
      ))}
    </div>
  );
}
