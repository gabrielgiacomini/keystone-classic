import type { FilterProps } from '../types.js';

/** Filter widget for localfiles fields — filtering by file array is not supported. */
export function Filter({ fieldName }: FilterProps<string>) {
  return (
    <input
      name={fieldName}
      type="text"
      disabled
      placeholder="Files filter not supported"
    />
  );
}
