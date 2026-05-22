import type { ColumnProps } from '../types.js';

type CloudinaryValue = {
  public_id?: string;
  url?: string;
  secure_url?: string;
  width?: number;
  height?: number;
  format?: string;
  resource_type?: string;
} | null;

/** Read-only table cell for cloudinary fields. Branches on `meta.multiple`. */
export function Column({ value, meta }: ColumnProps<unknown>) {
  if (meta.fieldType === 'cloudinary' && meta.multiple === true) {
    const images = (value as CloudinaryValue[] | null | undefined) ?? [];
    if (images.length === 0) {
      return <span>{'—'}</span>;
    }
    const first = images[0];
    const src = first?.secure_url ?? first?.url;
    return (
      <span>
        {src && <img src={src} alt="" style={{ maxHeight: 40, marginRight: 4 }} />}
        {`${images.length} ${images.length === 1 ? 'image' : 'images'}`}
      </span>
    );
  }

  const single = value as CloudinaryValue | undefined;
  const displayUrl = single?.secure_url ?? single?.url;
  if (displayUrl) {
    return <img src={displayUrl} alt="" style={{ maxHeight: 40 }} />;
  }
  return <span>{'—'}</span>;
}
