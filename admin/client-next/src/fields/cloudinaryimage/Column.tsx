import type { ColumnProps } from '../types.js';

type CloudinaryImageValue = {
  public_id?: string;
  url?: string;
  secure_url?: string;
  width?: number;
  height?: number;
  format?: string;
  resource_type?: string;
} | null;

/** Read-only table cell for cloudinaryimage fields. */
export function Column({ value }: ColumnProps<CloudinaryImageValue>) {
  if (value?.secure_url) {
    return <img src={value.secure_url} alt="" style={{ maxHeight: 40 }} />;
  }
  return <span>{'—'}</span>;
}
