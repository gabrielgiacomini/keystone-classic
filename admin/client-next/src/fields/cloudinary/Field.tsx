import { api } from '../../api/fetch.js';
import type { FieldProps } from '../types.js';

type CloudinaryValue = {
  public_id?: string;
  url?: string;
  secure_url?: string;
  width?: number;
  height?: number;
  format?: string;
  resource_type?: string;
} | null;

function getXsrfToken(): string {
  const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/);
  return match?.[1] != null ? decodeURIComponent(match[1]) : '';
}

async function uploadFile(file: File): Promise<CloudinaryValue> {
  const formData = new FormData();
  formData.append('file', file);
  return api<CloudinaryValue>('/cloudinary/upload', {
    method: 'POST',
    headers: { 'x-xsrf-token': getXsrfToken() },
    body: formData,
  });
}

/** Edit widget for cloudinary fields — single-image mode. */
function SingleField({
  fieldName,
  value,
  onChange,
  isRequired,
  isReadonly,
  errors,
}: FieldProps<CloudinaryValue>) {
  const displayUrl = value?.secure_url ?? value?.url;

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = await uploadFile(file);
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

/** Edit widget for cloudinary fields — multi-image mode. */
function MultiField({
  fieldName,
  value,
  onChange,
  isRequired,
  isReadonly,
  errors,
}: FieldProps<CloudinaryValue[]>) {
  const images = value ?? [];

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    const uploaded = await Promise.all(files.map(uploadFile));
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
                <button type="button" aria-label="Remove image" onClick={() => removeImage(i)}>
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

/** Unified edit widget for cloudinary fields. Branches on `meta.multiple`. */
export function Field(props: FieldProps<unknown>) {
  const { meta } = props;

  if (meta.fieldType === 'cloudinary' && meta.multiple === true) {
    const multiProps = props as FieldProps<CloudinaryValue[]>;
    return <MultiField {...multiProps} />;
  }

  const singleProps = props as FieldProps<CloudinaryValue>;
  return <SingleField {...singleProps} />;
}
