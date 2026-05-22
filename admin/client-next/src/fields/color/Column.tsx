import type { ColumnProps } from '../types.js';
import styles from './Color.module.css';

/** Read-only table cell for color fields — renders a color swatch and hex value. */
export function Column({ value }: ColumnProps<string>) {
  if (!value) return <span />;
  return (
    <span className={styles.wrapper}>
      <span className={styles.swatch} style={{ backgroundColor: value }} />
      <span>{value}</span>
    </span>
  );
}
