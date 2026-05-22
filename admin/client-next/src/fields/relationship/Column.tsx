import type { ColumnProps } from '../types.js';

type RelationshipItemValue = { id: string; label?: string };
type RelationshipValue = RelationshipItemValue | RelationshipItemValue[] | null;

/** Read-only table cell for relationship fields — displays labels, IDs, or an em-dash. */
export function Column({ value }: ColumnProps<RelationshipValue>) {
  if (Array.isArray(value)) {
    const labels = value.map((item) => item.label ?? item.id).filter(Boolean);
    return <span>{labels.length > 0 ? labels.join(', ') : '—'}</span>;
  }
  return <span>{value?.label ?? value?.id ?? '—'}</span>;
}
