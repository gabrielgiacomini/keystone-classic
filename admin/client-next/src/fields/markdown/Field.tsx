import { useState, useEffect, useRef, useCallback } from 'react';
import type { FieldProps } from '../types.js';
import styles from './Markdown.module.css';

interface MarkdownValue {
  md: string;
}

/**
 * Markdown field with split-pane preview (wide) / tab toggle (narrow).
 *
 * Bundle strategy: `marked` and `dompurify` are imported via dynamic
 * `import()` inside a `useEffect` so they are never included in the
 * initial JS chunk. The preview renders empty until the libraries
 * resolve (typically < 50 ms after first render).
 *
 * Security: DOMPurify is called with its default config — no allowlist
 * relaxation. The sanitized HTML is injected via `dangerouslySetInnerHTML`
 * only after sanitization.
 */
export function Field({
  fieldName,
  value,
  onChange,
  isRequired,
  isReadonly,
  errors,
}: FieldProps<MarkdownValue>) {
  // 'edit' | 'preview' — only relevant on narrow viewports where the
  // tab bar is shown. Wide viewports always show both panes.
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  // Sanitized HTML for the preview pane. Empty string until marked +
  // DOMPurify have loaded AND the textarea has some content.
  const [previewHtml, setPreviewHtml] = useState('');

  // Refs to the lazily-imported modules so we don't re-import on every
  // keystroke — we just call them once loaded.
  const markedRef = useRef<((src: string) => string) | null>(null);
  const purifyRef = useRef<((dirty: string) => string) | null>(null);
  const librariesLoaded = useRef(false);
  const latestMarkdown = useRef(value.md ?? '');

  useEffect(() => {
    latestMarkdown.current = value.md ?? '';
  }, [value.md]);

  // Lazily import marked + DOMPurify once, then run an initial render.
  useEffect(() => {
    let cancelled = false;
    async function loadLibraries() {
      const [{ marked }, DOMPurify] = await Promise.all([
        import('marked'),
        import('dompurify'),
      ]);
      if (cancelled) return;
      // marked() returns string | Promise<string>; use the synchronous form.
      markedRef.current = (src: string) => marked(src) as string;
      // DOMPurify is a default export with a `.sanitize` method.
      const purify = DOMPurify.default ?? DOMPurify;
      purifyRef.current = (dirty: string) => purify.sanitize(dirty);
      librariesLoaded.current = true;
      // Run initial preview with the latest field value. The item can load
      // after this component mounts while the preview libraries are in flight.
      if (latestMarkdown.current) {
        setPreviewHtml(purifyRef.current(markedRef.current(latestMarkdown.current)));
      }
    }
    void loadLibraries();
    return () => {
      cancelled = true;
    };
    // Run once on mount only.
  }, []);

  // Re-render preview whenever the value changes (after libraries loaded).
  const updatePreview = useCallback((md: string) => {
    if (!librariesLoaded.current || !markedRef.current || !purifyRef.current) {
      return;
    }
    setPreviewHtml(purifyRef.current(markedRef.current(md)));
  }, []);

  useEffect(() => {
    updatePreview(value.md ?? '');
  }, [updatePreview, value.md]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const next = e.target.value;
      onChange({ ...value, md: next });
      updatePreview(next);
    },
    [onChange, value, updatePreview],
  );

  const isEditVisible = activeTab === 'edit';
  const isPreviewVisible = activeTab === 'preview';

  return (
    <div className={styles.wrapper} data-field-markdown>
      {/* Tab bar — visible only on narrow viewports (CSS hides it at >= md). */}
      <div className={styles.tabBar} role="tablist" aria-label="Markdown editor tabs">
        <button
          role="tab"
          type="button"
          aria-selected={isEditVisible}
          className={`${styles.tabButton} ${isEditVisible ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('edit')}
        >
          Edit
        </button>
        <button
          role="tab"
          type="button"
          aria-selected={isPreviewVisible}
          className={`${styles.tabButton} ${isPreviewVisible ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('preview')}
        >
          Preview
        </button>
      </div>

      {/* Split-pane: both panes side-by-side on wide; tab-controlled on narrow. */}
      <div className={styles.splitPane}>
        {/* Editor pane */}
        <div
          className={`${styles.editorPane} ${!isEditVisible ? styles.hiddenOnMobile : ''}`}
        >
          <textarea
            id={fieldName}
            name={fieldName}
            className={styles.textarea}
            value={value.md}
            onChange={handleChange}
            required={isRequired}
            readOnly={isReadonly}
            aria-label="Markdown source"
            data-field-markdown-textarea
          />
        </div>

        {/* Preview pane */}
        <div
          className={`${styles.previewPane} ${!isPreviewVisible ? styles.hiddenOnMobile : ''}`}
        >
          <div className={styles.previewLabel} aria-hidden="true">Preview</div>
          {previewHtml ? (
            <div
              className={styles.preview}
              data-field-markdown-preview
              // Safe: HTML has been run through DOMPurify.sanitize() with defaults.
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          ) : (
            <div
              className={`${styles.preview} ${styles.previewEmpty}`}
              data-field-markdown-preview
            >
              {value.md ? 'Loading preview…' : 'Nothing to preview'}
            </div>
          )}
        </div>
      </div>

      {errors.length > 0 && (
        <div className={styles.errorList}>
          {errors.map((err, i) => (
            <span key={i} role="alert">
              {err}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
