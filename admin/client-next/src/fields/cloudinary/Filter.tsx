import type { FilterProps } from '../types.js';

/** Filter widget for cloudinary fields — search not supported. */
export function Filter({ fieldName }: FilterProps<unknown>) {
  return (
    <input
      name={fieldName}
      type="text"
      disabled
      placeholder="Image search not supported"
    />
  );
}
