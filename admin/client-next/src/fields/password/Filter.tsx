import type { FilterProps } from '../types.js';

/** Stub filter for password fields — passwords cannot be filtered; renders a masked placeholder. */
export function Filter(_props: FilterProps<string>) {
  return <span>••••••</span>;
}
