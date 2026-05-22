import { api } from '../../api/fetch.js';
import type { FieldProps } from '../types.js';
import type { FileValue } from '../fileValue.js';

/** Edit widget for file fields: shows current file info and a file picker. */
export function Field({
  fieldName,
  value,
  onChange,
  isRequired,
  isReadonly,
  errors,
}: FieldProps<FileValue>) {
  const displayName = value?.filename ?? value?.originalname ?? null;
  const displaySize = value?.size != null ? `${(value.size / 1024).toFixed(1)} KB` : null;

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const xsrfMatch = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/);
    const xsrfToken = xsrfMatch?.[1] != null ? decodeURIComponent(xsrfMatch[1]) : '';

    const result = await api<FileValue>('/file/upload', {
      method: 'POST',
      headers: { 'x-xsrf-token': xsrfToken },
      body: formData,
    });
    onChange(result);
  }

  return (
    <div>
      {displayName != null && (
        <div>
          <span>{displayName}</span>
          {displaySize != null && <span>{` (${displaySize})`}</span>}
        </div>
      )}
      {!isReadonly && (
        <>
          <input
            id={fieldName}
            name={fieldName}
            type="file"
            onChange={handleFileChange}
            required={isRequired && value == null}
          />
          {value && (
            <button type="button" onClick={() => onChange(null)}>
              Remove
            </button>
          )}
        </>
      )}
      {errors.map((err, i) => (
        <span key={i} role="alert">
          {err}
        </span>
      ))}
    </div>
  );
}
