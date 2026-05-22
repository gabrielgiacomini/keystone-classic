import { api } from '../../api/fetch.js';
import type { FieldProps } from '../types.js';

type CloudinaryImageValue = {
  public_id?: string;
  url?: string;
  secure_url?: string;
  width?: number;
  height?: number;
  format?: string;
  resource_type?: string;
} | null;

/** Edit widget for cloudinaryimage fields. */
export function Field({
  fieldName,
  value,
  onChange,
  isRequired,
  isReadonly,
  errors,
}: FieldProps<CloudinaryImageValue>) {
  const displayUrl = value?.secure_url ?? value?.url;

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const xsrfMatch = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/);
    const xsrfToken = xsrfMatch?.[1] != null ? decodeURIComponent(xsrfMatch[1]) : '';

    const result = await api<CloudinaryImageValue>('/cloudinary/upload', {
      method: 'POST',
      headers: { 'x-xsrf-token': xsrfToken },
      body: formData,
    });
    onChange(result);
  }

  return (
    <div>
      {displayUrl && (
        <div>
          <img src={displayUrl} alt="" style={{ maxWidth: 200 }} />
        </div>
      )}
      {!isReadonly && (
        <>
          <input
            id={fieldName}
            name={fieldName}
            type="file"
            accept="image/*"
            required={isRequired}
            onChange={handleFileChange}
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
