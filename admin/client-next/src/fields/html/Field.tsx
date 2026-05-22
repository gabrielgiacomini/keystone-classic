import { Suspense, lazy } from 'react';
import type { FieldProps } from '../types.js';
import styles from './Html.module.css';

/**
 * TipTap editor is lazy-loaded so it stays out of the initial JS bundle.
 * The dynamic import resolves to HtmlEditor.tsx which pulls in \@tiptap/* deps.
 */
const HtmlEditor = lazy(() => import('./HtmlEditor.js'));

function LoadingFallback() {
  return (
    <div className={styles.editorWrapper}>
      <div className={styles.loadingPlaceholder}>Loading editor…</div>
    </div>
  );
}

/** WYSIWYG edit widget for html fields — powered by TipTap. */
export function Field({
  fieldName,
  value,
  onChange,
  isRequired,
  isReadonly,
  errors,
}: FieldProps<string>) {
  return (
    <div>
      {/*
       * Hidden textarea keeps the value in DOM for any form serialisation
       * that bypasses React state, and provides a fallback input with the
       * correct `id` so `<label htmlFor>` linkage still works.
       */}
      <input
        type="hidden"
        id={fieldName}
        name={fieldName}
        value={value}
        required={isRequired}
        readOnly={isReadonly}
      />
      <Suspense fallback={<LoadingFallback />}>
        <HtmlEditor
          value={value}
          onChange={onChange}
          isReadonly={isReadonly}
        />
      </Suspense>
      {errors.map((err, i) => (
        <span key={i} role="alert">
          {err}
        </span>
      ))}
    </div>
  );
}
