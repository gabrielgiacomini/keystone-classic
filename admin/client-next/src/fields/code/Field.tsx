import { useEffect, useRef } from 'react';
import type { EditorView } from '@codemirror/view';
import type { FieldProps } from '../types.js';
import styles from './Code.module.css';

/**
 * CodeMirror 6 edit widget for code fields.
 *
 * Lazy-loads the entire CodeMirror bundle via dynamic import() inside
 * useEffect so it never lands in the main chunk. For language === 'json',
 * mounts the json() extension + jsonParseLinter for inline lint markers.
 * Falls back to plain text mode for any other language value.
 */
export function Field({
  fieldName,
  value,
  onChange,
  isRequired,
  isReadonly,
  errors,
  meta,
}: FieldProps<string>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const valueRef = useRef(value);
  // Keep a stable ref to the current onChange so the CodeMirror listener
  // never goes stale without tearing down the editor.
  const onChangeRef = useRef(onChange);
  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);
  useEffect(() => { valueRef.current = value; }, [value]);

  // Derive language from field metadata (set by CodeType as `lang`).
  const lang = (meta as Record<string, unknown>).lang as string | undefined;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let destroyed = false;
    void (async () => {
      // Dynamic import — CodeMirror bundle is NOT in the main chunk.
      const [
        { EditorState },
        { EditorView, lineNumbers, keymap },
        { defaultKeymap, historyKeymap },
        { history },
        { defaultHighlightStyle, syntaxHighlighting },
      ] = await Promise.all([
        import('@codemirror/state'),
        import('@codemirror/view'),
        import('@codemirror/commands'),
        import('@codemirror/commands'),
        import('@codemirror/language'),
      ]);

      const extensions = [
        lineNumbers(),
        history(),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChangeRef.current(update.state.doc.toString());
          }
        }),
        EditorState.readOnly.of(isReadonly),
      ];

      if (lang === 'json') {
        const [{ json }, { lintGutter, linter }, { jsonParseLinter }] =
          await Promise.all([
            import('@codemirror/lang-json'),
            import('@codemirror/lint'),
            import('@codemirror/lang-json'),
          ]);
        extensions.push(json(), lintGutter(), linter(jsonParseLinter()));
      }

      if (destroyed) return;

      const state = EditorState.create({
        doc: valueRef.current ?? '',
        extensions,
      });

      const view = new EditorView({ state, parent: container });
      viewRef.current = view;
      (container as HTMLElement & { __codemirrorView?: EditorView }).__codemirrorView = view;
    })();

    return () => {
      destroyed = true;
      viewRef.current?.destroy();
      delete (container as HTMLElement & { __codemirrorView?: EditorView }).__codemirrorView;
      viewRef.current = null;
    };
    // We intentionally omit `value` and `onChange` from deps:
    // onChange is kept fresh via a ref, and value is synchronized below.
    // isReadonly and lang may change on re-render, and we want a fresh
    // editor when they do.
  }, [fieldName, isReadonly, lang]);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;

    const nextValue = value ?? '';
    const currentValue = view.state.doc.toString();
    if (currentValue === nextValue) return;

    view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: nextValue },
    });
  }, [value]);

  return (
    <div>
      <div
        id={fieldName}
        ref={containerRef}
        className={styles.editor}
        data-codemirror-field={fieldName}
        aria-required={isRequired}
      />
      {errors.map((err, i) => (
        <span key={i} role="alert">
          {err}
        </span>
      ))}
    </div>
  );
}
