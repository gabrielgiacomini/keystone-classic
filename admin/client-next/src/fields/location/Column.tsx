import type { ColumnProps } from '../types.js';
import type { LocationValue } from './Field.js';

/** Read-only table cell for location fields — renders a compact address string. */
export function Column({ value }: ColumnProps<LocationValue>) {
  if (!value) return <span />;
  const parts: string[] = [];
  const { number, name, street1, suburb, state, postcode } = value;
  const street = [number, name].filter(Boolean).join(' ');
  if (street) parts.push(street);
  if (street1) parts.push(street1);
  const locality = [suburb, state, postcode].filter(Boolean).join(' ');
  if (locality) parts.push(locality);
  return <span>{parts.join(', ')}</span>;
}
