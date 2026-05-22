import { useEffect, useRef } from 'react';
import styles from './ConfirmDialog.module.css';

interface ConfirmDialogProps {
  open: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ open, message, onConfirm, onCancel }: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (open) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [open]);

  return (
    <dialog ref={dialogRef} className={styles.dialog} onClose={onCancel} data-confirm-dialog>
      <p className={styles.message}>{message}</p>
      <div className={styles.actions}>
        <button type="button" className={styles.cancelBtn} onClick={onCancel} data-confirm-cancel>
          Cancel
        </button>
        <button type="button" className={styles.confirmBtn} onClick={onConfirm} data-confirm-delete>
          Delete
        </button>
      </div>
    </dialog>
  );
}
