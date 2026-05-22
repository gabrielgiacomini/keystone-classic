import type React from 'react';
import styles from './FieldShell.module.css';

interface FieldShellProps {
  label: string;
  fieldName?: string;
  fieldType?: string;
  errors?: string[];
  children: React.ReactNode;
}

/**
 * Two-column row wrapper for form fields. Renders the field label in a
 * fixed-width left column and the control + inline errors in a flexible
 * right column. The inner Field components must NOT render their own label.
 */
export function FieldShell({ label, fieldName, fieldType, errors, children }: FieldShellProps) {
  return (
    <div
      className={styles.shell}
      data-field-name={fieldName}
      data-field-type={fieldType}
    >
      <label className={styles.label} htmlFor={fieldName}>
        {label}
      </label>
      <div className={styles.control}>
        {children}
        {errors?.map((e, i) => (
          <span key={i} role="alert" className={styles.error}>
            {e}
          </span>
        ))}
      </div>
    </div>
  );
}
