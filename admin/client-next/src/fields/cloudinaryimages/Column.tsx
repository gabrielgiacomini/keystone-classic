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

/** Read-only table cell for cloudinaryimages fields. */
export function Column({ value }: ColumnProps<CloudinaryImageValue[]>) {
  const images = value ?? [];
  if (images.length === 0) {
    return <span>{'—'}</span>;
  }
  return <span>{`${images.length} ${images.length === 1 ? 'image' : 'images'}`}</span>;
}
