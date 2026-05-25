import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Controller, useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import {
  createItem,
  getFallbackTextField,
  getFieldComponentValue,
  prepareItemData,
  resolveAdminField,
  resolveListMeta,
  toFieldMeta,
} from '../../api/list.js';
import type { AdminFieldMeta, AdminListMeta, ListItem } from '../../api/list.js';
import { getValidationFieldErrors, hasFieldErrors } from '../../api/errors.js';
import type { FieldErrors } from '../../api/errors.js';
import { useAdminMeta } from '../../hooks/useList.js';
import { getFieldComponents } from '../../fields/registry.js';
import { FieldShell } from '../FieldShell/FieldShell.js';
import styles from './CreateItemModal.module.css';

interface CreateItemModalProps {
  listKey: string;
  isOpen: boolean;
  onClose: () => void;
  onCreated: (id: string, item?: ListItem) => void;
  initialValues?: Record<string, unknown>;
}

const EMPTY_INITIAL_VALUES: Record<string, unknown> = {};

function getInitialFields(listMeta: AdminListMeta | undefined): AdminFieldMeta[] {
  if (listMeta === undefined) return [getFallbackTextField('name')];

  const fields = (listMeta.initialFields ?? [])
    .map((path) => resolveAdminField(listMeta, path))
    .filter((field): field is AdminFieldMeta => field !== undefined && field.hidden !== true);

  if (fields.length > 0) return fields;

  const metadataInitialFields = Object.values(listMeta.fields).filter(
    (field) => field.initial === true && field.hidden !== true,
  );
  if (metadataInitialFields.length > 0) return metadataInitialFields;

  const nameField = listMeta.namePath !== undefined
    ? resolveAdminField(listMeta, listMeta.namePath)
    : undefined;
  return nameField !== undefined && nameField.hidden !== true ? [nameField] : [];
}

function fieldDependsOnMatches(field: AdminFieldMeta, values: Record<string, unknown>): boolean {
  const dependsOn = field.dependsOn;
  if (dependsOn === undefined || dependsOn === null || typeof dependsOn !== 'object' || Array.isArray(dependsOn)) {
    return true;
  }
  return Object.entries(dependsOn as Record<string, unknown>).every(
    ([path, expected]) => values[path] === expected,
  );
}

function buildDefaultValues(fields: AdminFieldMeta[]): Record<string, unknown> {
  const values: Record<string, unknown> = {};
  for (const field of fields) {
    values[field.path] = getFieldComponentValue(field, field.defaultValue);
  }
  return values;
}

export function CreateItemModal({
  listKey,
  isOpen,
  onClose,
  onCreated,
  initialValues = EMPTY_INITIAL_VALUES,
}: CreateItemModalProps) {
  const { data: adminMeta } = useAdminMeta();
  const listMeta = resolveListMeta(adminMeta, listKey);
  const apiListKey = listMeta?.key ?? listKey;
  const singular = (listMeta?.singular as string | undefined) ?? listMeta?.label ?? listKey;

  const initialFields = useMemo(() => getInitialFields(listMeta), [listMeta]);
  const defaultValues = useMemo(
    () => ({ ...buildDefaultValues(initialFields), ...initialValues }),
    [initialFields, initialValues],
  );
  const formKey = useMemo(
    () => initialFields.map((field) => field.path).join(','),
    [initialFields],
  );
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const { control, handleSubmit, reset, setError, clearErrors, watch, formState: { errors } } = useForm<Record<string, unknown>>({
    defaultValues,
  });
  const formValues = watch();

  // Reset form whenever it (re)opens or fields change.
  useLayoutEffect(() => {
    if (isOpen) {
      reset(defaultValues);
      clearErrors();
      setFieldErrors({});
    }
  }, [isOpen, formKey, reset, clearErrors]);

  const mutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => createItem(apiListKey, data),
    onSuccess: (result) => {
      onCreated(result.item.id, result.item);
    },
  });

  async function onSubmit(data: Record<string, unknown>) {
    try {
      await mutation.mutateAsync({
        ...initialValues,
        ...prepareItemData(initialFields, data),
      });
      setFieldErrors({});
    } catch (error) {
      const validationErrors = getValidationFieldErrors(error);
      setFieldErrors(validationErrors);
      if (!hasFieldErrors(validationErrors)) {
        setError('root', { message: 'Failed to create item. Please try again.' });
      }
    }
  }

  // ESC closes; lock body scroll while open.
  useEffect(() => {
    if (!isOpen) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    }
    document.addEventListener('keydown', onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  // Auto-focus first input when the modal opens.
  const firstInputRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isOpen) return;
    const id = window.requestAnimationFrame(() => {
      const root = firstInputRef.current;
      if (root === null) return;
      const focusable = root.querySelector<HTMLElement>(
        'input:not([type="hidden"]), textarea, select, [contenteditable="true"]',
      );
      focusable?.focus();
    });
    return () => window.cancelAnimationFrame(id);
  }, [isOpen, formKey]);

  if (!isOpen) return null;

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  return createPortal(
    <div
      className={styles.backdrop}
      onClick={handleBackdropClick}
      data-create-item-backdrop
    >
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-item-modal-title"
        data-create-item-modal
        data-list-key={apiListKey}
      >
        <form key={formKey} onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className={styles.header}>
            <h2 id="create-item-modal-title" className={styles.title}>
              Create a new {singular}
            </h2>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Close"
              data-create-item-close
            >
              ×
            </button>
          </div>

          <div className={styles.body} ref={firstInputRef}>
            {errors.root && (
              <p role="alert" className={styles.errorMsg}>
                {errors.root.message}
              </p>
            )}

            {initialFields.map((fieldMeta) => {
              if (!fieldDependsOnMatches(fieldMeta, formValues)) return null;
              const meta = toFieldMeta(fieldMeta);
              const { Field } = getFieldComponents(meta.fieldType);
              const defaultValue = getFieldComponentValue(fieldMeta, fieldMeta.defaultValue);

              return (
                <FieldShell
                  key={fieldMeta.path}
                  label={fieldMeta.label}
                  fieldName={fieldMeta.path}
                  fieldType={fieldMeta.fieldType}
                >
                  <Controller
                    name={fieldMeta.path}
                    control={control}
                    defaultValue={defaultValue}
                    render={({ field }) => (
                      <Field
                        fieldName={fieldMeta.path}
                        label={fieldMeta.label}
                        value={field.value}
                        onChange={field.onChange}
                        isRequired={fieldMeta.required === true}
                        isReadonly={fieldMeta.noedit === true}
                        errors={fieldErrors[fieldMeta.path] ?? []}
                        meta={meta}
                      />
                    )}
                  />
                </FieldShell>
              );
            })}
          </div>

          <div className={styles.footer}>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={mutation.isPending}
              data-create-item-submit
            >
              {mutation.isPending ? 'Creating…' : 'Create'}
            </button>
            <button
              type="button"
              className={styles.cancelLink}
              onClick={onClose}
              data-create-item-cancel
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
