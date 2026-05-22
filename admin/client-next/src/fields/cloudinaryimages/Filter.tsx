import type { FilterProps } from '../types.js';

type CloudinaryImageValue = {
  public_id?: string;
  url?: string;
  secure_url?: string;
  width?: number;
  height?: number;
  format?: string;
  resource_type?: string;
} | null;

/** Filter widget for cloudinaryimages fields — filter not supported. */
export function Filter({ fieldName }: FilterProps<CloudinaryImageValue[]>) {
  return (
    <input
      name={fieldName}
      type="text"
      disabled
      placeholder="Images filter not supported"
    />
  );
}
