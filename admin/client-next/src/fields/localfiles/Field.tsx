import type { FieldProps } from '../types.js';
import type { FileValue } from '../fileValue.js';

type LocalFilesValue = FileValue[];

/** Edit widget for localfiles fields: shows a list of files with remove buttons and a multi-file picker. */
export function Field({
  fieldName,
  value,
  onChange,
  isRequired,
  isReadonly,
  errors,
}: FieldProps<LocalFilesValue>) {
  const files = value ?? [];

  function removeFile(index: number) {
    onChange(files.filter((_, i) => i !== index));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    if (selected.length === 0) return;
    const added: FileValue[] = selected.map((f) => ({
      filename: f.name,
      size: f.size,
      filetype: f.type || undefined,
    }));
    onChange([...files, ...added]);
    // Reset the input so the same file can be re-added later if needed.
    e.target.value = '';
  }

  return (
    <div>
      <div>
        {files.map((file, i) => {
          const name = file?.filename ?? file?.originalname ?? '(file)';
          const size = file?.size != null ? ` (${file.size} bytes)` : '';
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              {file?.url ? (
                <a href={file.url} target="_blank" rel="noreferrer">{name}</a>
              ) : (
                <span>{name}</span>
              )}
              {size && <span>{size}</span>}
              {!isReadonly && (
                <button
                  type="button"
                  aria-label="Remove file"
                  onClick={() => removeFile(i)}
                >
                  {'×'}
                </button>
              )}
            </div>
          );
        })}
      </div>
      {!isReadonly && (
        <input
          id={fieldName}
          name={fieldName}
          type="file"
          multiple
          required={isRequired && files.length === 0}
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
