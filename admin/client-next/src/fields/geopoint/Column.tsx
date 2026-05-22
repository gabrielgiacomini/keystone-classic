import type { ColumnProps } from '../types.js';
import type { GeopointValue } from './Field.js';

/** Read-only table cell for geopoint fields — renders "lat, lng" or an em dash. */
export function Column({ value }: ColumnProps<GeopointValue>) {
  if (!value || (value.lat === null && value.lng === null)) {
    return <span>&#8212;</span>;
  }
  return (
    <span>
      {value.lat ?? '—'}, {value.lng ?? '—'}
    </span>
  );
}
