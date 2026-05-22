/**
 * @file HtmlEditor — TipTap WYSIWYG inner component.
 *
 * This module is intentionally kept in a separate file so the parent
 * Field component can dynamically import it (React.lazy), keeping
 * TipTap out of the initial bundle.
 */

import { useCallback, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import styles from './Html.module.css';

interface HtmlEditorProps {
  value: string;
  onChange: (html: string) => void;
  isReadonly: boolean;
}

function ToolbarButton({
  onClick,
  active,
  disabled,
  title,
  label,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  label: string;
}) {
  return (
    <button
      type="button"
      className={`${styles.toolbarBtn}${active ? ` ${styles.active}` : ''}`}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}

export default function HtmlEditor({ value, onChange, isReadonly }: HtmlEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
    ],
    content: value || '',
    editable: !isReadonly,
    onUpdate({ editor: ed }) {
      onChange(ed.getHTML());
    },
  });

  // Attach the editor instance to the ProseMirror DOM element so Playwright
  // tests can call editor commands via evaluate() without React fiber hacks.
  useEffect(() => {
    if (!editor) return;
    const el = editor.view.dom as HTMLElement & { __tiptapEditor?: typeof editor };
    el.__tiptapEditor = editor;
  }, [editor]);

  // Sync external value changes into the editor (e.g. form reset / server reload)
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    // Avoid resetting if content is already equivalent to avoid cursor jumps
    if (current !== value) {
      editor.commands.setContent(value || '', { emitUpdate: false });
    }
  }, [editor, value]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('URL', prev ?? '');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  }, [editor]);

  const insertImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt('Image URL', '');
    if (!url) return;
    editor.chain().focus().setImage({ src: url }).run();
  }, [editor]);

  if (!editor) return null;

  const canUndo = editor.can().undo();
  const canRedo = editor.can().redo();

  return (
    <div className={styles.editorWrapper}>
      {!isReadonly && (
        <div className={styles.toolbar} role="toolbar" aria-label="Text formatting">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive('bold')}
            title="Bold"
            label="B"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive('italic')}
            title="Italic"
            label="I"
          />

          <span className={styles.toolbarSep} aria-hidden="true" />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            active={editor.isActive('heading', { level: 1 })}
            title="Heading 1"
            label="H1"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor.isActive('heading', { level: 2 })}
            title="Heading 2"
            label="H2"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            active={editor.isActive('heading', { level: 3 })}
            title="Heading 3"
            label="H3"
          />

          <span className={styles.toolbarSep} aria-hidden="true" />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive('bulletList')}
            title="Bullet list"
            label="• List"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive('orderedList')}
            title="Numbered list"
            label="1. List"
          />

          <span className={styles.toolbarSep} aria-hidden="true" />

          <ToolbarButton
            onClick={setLink}
            active={editor.isActive('link')}
            title="Insert / edit link"
            label="Link"
          />
          <ToolbarButton
            onClick={insertImage}
            title="Insert image by URL"
            label="Img"
          />

          <span className={styles.toolbarSep} aria-hidden="true" />

          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!canUndo}
            title="Undo"
            label="↩"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!canRedo}
            title="Redo"
            label="↪"
          />
        </div>
      )}
      <div className={styles.editorContent}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
