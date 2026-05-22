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

/** Edit widget for cloudinaryimages fields. */
export function Field({
  fieldName,
  value,
  onChange,
  isRequired,
  isReadonly,
  errors,
}: FieldProps<CloudinaryImageValue[]>) {
  const images = value ?? [];

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const xsrfMatch = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/);
    const xsrfToken = xsrfMatch?.[1] != null ? decodeURIComponent(xsrfMatch[1]) : '';

    const uploaded = await Promise.all(
      files.map((file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api<CloudinaryImageValue>('/cloudinary/upload', {
          method: 'POST',
          headers: { 'x-xsrf-token': xsrfToken },
          body: formData,
        });
      }),
    );

    onChange([...images, ...uploaded]);
  }

  return (
    <div>
      <div>
        {images.map((img, i) => {
          const src = img?.secure_url ?? img?.url;
          return (
            <span key={i} style={{ display: 'inline-block', position: 'relative', marginRight: 4 }}>
              {src && <img src={src} alt="" style={{ maxHeight: 40 }} />}
              {!isReadonly && (
                <button
                  type="button"
                  aria-label="Remove image"
                  onClick={() => removeImage(i)}
                >
                  {'×'}
                </button>
              )}
            </span>
          );
        })}
      </div>
      {!isReadonly && (
        <input
          id={fieldName}
          name={fieldName}
          type="file"
          accept="image/*"
          multiple
          required={isRequired && images.length === 0}
          onChange={handleFileChange}
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
