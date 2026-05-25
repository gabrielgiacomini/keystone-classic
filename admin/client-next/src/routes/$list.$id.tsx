import { useEffect, useMemo, useRef, useState } from 'react';
import { createRoute, useNavigate } from '@tanstack/react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { Route as RootRoute } from './__root.js';
import { useItem, useItemMutations } from '../hooks/useItem.js';
import { useAdminMeta } from '../hooks/useList.js';
import { CreateItemModal } from '../components/CreateItemModal/CreateItemModal.js';
import {
  deleteItems,
  fetchList,
  getAdminListRoutePaths,
  getAdminLists,
  getFallbackTextField,
  getFieldComponentValue,
  getItemFieldValue,
  prepareItemData,
  resolveAdminField,
  resolveListMeta,
  toFieldMeta,
} from '../api/list.js';
import { getValidationFieldErrors } from '../api/errors.js';
import type { FieldErrors } from '../api/errors.js';
import type {
  AdminFieldMeta,
  AdminListMeta,
  AdminMetaResponse,
  ListItem,
  ListResponse,
  RelationshipMeta,
} from '../api/list.js';
import { getFieldComponents } from '../fields/registry.js';
import { FieldShell } from '../components/FieldShell/FieldShell.js';
import { Layout } from '../components/Layout/Layout.js';
import { ConfirmDialog } from '../components/ConfirmDialog/ConfirmDialog.js';
import { InverseRelationshipPanel } from '../components/InverseRelationshipPanel/InverseRelationshipPanel.js';
import { buildAdminNextPath } from '../adminNextPath.js';
import { requireAuth } from './requireAuth.js';
import styles from './$list.$id.module.css';

const ESC_KEY = 'Escape';

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/$list/$id',
  beforeLoad: ({ context }) => requireAuth(context),
  component: ItemEditPage,
});

type FormElement =
  | { type: 'field'; field: AdminFieldMeta }
  | { type: 'heading'; content: string };

function getMetadataFormElements(listMeta: AdminListMeta | undefined): FormElement[] {
  if (listMeta === undefined) return [];

  const elements: FormElement[] = [];
  for (const element of listMeta.uiElements ?? []) {
    if (element.type === 'heading' && typeof element.content === 'string') {
      elements.push({ type: 'heading', content: element.content });
      continue;
    }

    if (element.type === 'field') {
      const field = resolveAdminField(listMeta, element.field as string | AdminFieldMeta);
      if (field !== undefined && field.hidden !== true) {
        elements.push({ type: 'field', field });
      }
    }
  }

  if (elements.some((element) => element.type === 'field')) return elements;

  return Object.values(listMeta.fields)
    .filter((field) => field.hidden !== true)
    .map((field) => ({ type: 'field', field }));
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

function getFallbackFormElements(item: ListItem | undefined): FormElement[] {
  if (item === undefined) return [];

  if (isRecord(item.fields)) {
    return Object.keys(item.fields).map((path) => ({
      type: 'field',
      field: getFallbackTextField(path),
    }));
  }

  return Object.keys(item)
    .filter((key) => key !== 'id' && key !== '_id' && key !== '__v' && key !== 'fields')
    .map((path) => ({
      type: 'field',
      field: getFallbackTextField(path),
    }));
}

function getFormFields(elements: FormElement[]): AdminFieldMeta[] {
  return elements
    .filter((element): element is { type: 'field'; field: AdminFieldMeta } => element.type === 'field')
    .map((element) => element.field);
}

function buildDefaultValues(elements: FormElement[], item: ListItem | undefined): Record<string, unknown> {
  const values: Record<string, unknown> = {};
  for (const field of getFormFields(elements)) {
    values[field.path] = getFieldComponentValue(field, getItemFieldValue(item, field.path));
  }
  return values;
}

function getFormKey(elements: FormElement[], item: ListItem | undefined): string {
  return `${item?.id ?? 'loading'}:${getFormFields(elements).map((field) => field.path).join(',')}`;
}

function getSubtitleSecondary(
  item: ListItem | undefined,
  listMeta: AdminListMeta | undefined,
): { label: string; value: string } | null {
  if (item === undefined || listMeta === undefined) return null;
  // Prefer a slug field when present; otherwise look for the next-best
  // distinguishing field (key/name/title) different from `id`.
  // `slug` is special: when set up via `autokey` it lives at the item root
  // (e.g. `item.slug`) rather than under `item.fields.slug`, and isn't
  // exposed in `listMeta.fields`. Falling back to `item[path]` covers that.
  const candidatePaths = ['slug', 'key', 'name', 'title'];
  for (const path of candidatePaths) {
    const field = listMeta.fields[path];
    if (field !== undefined && field.hidden === true) continue;
    const raw = getItemFieldValue(item, path);
    if (raw === undefined || raw === null || raw === '') continue;
    if (typeof raw === 'object') continue;
    return { label: path, value: String(raw) };
  }
  return null;
}

// ---------------------------------------------------------------------------
// Inverse relationship helpers
// ---------------------------------------------------------------------------

function getInverseRelationships(listMeta: AdminListMeta | undefined): RelationshipMeta[] {
  if (listMeta === undefined) return [];
  const relationships = listMeta.relationships;
  if (relationships === undefined || relationships === null) return [];
  if (typeof relationships !== 'object') return [];
  return Object.values(relationships as Record<string, RelationshipMeta>).filter(
    (rel): rel is RelationshipMeta =>
      rel !== null &&
      typeof rel === 'object' &&
      typeof rel.ref === 'string' &&
      typeof rel.refPath === 'string',
  );
}

function resolveRefListMeta(
  adminMeta: AdminMetaResponse | undefined,
  refKey: string,
): AdminListMeta | undefined {
  if (adminMeta === undefined) return undefined;
  return getAdminLists(adminMeta).find((l) => l.key === refKey || l.path === refKey);
}

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

function MagnifierIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M15.7 13.3l-3.81-3.83A5.93 5.93 0 0 0 13 6c0-3.31-2.69-6-6-6S1 2.69 1 6s2.69 6 6 6c1.3 0 2.48-.41 3.47-1.11l3.83 3.81c.19.2.45.3.7.3.25 0 .52-.09.7-.3a.996.996 0 0 0 0-1.41v.02zM7 10.7c-2.59 0-4.7-2.11-4.7-4.7 0-2.59 2.11-4.7 4.7-4.7 2.59 0 4.7 2.11 4.7 4.7 0 2.59-2.11 4.7-4.7 4.7z" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M11.5 14.5L10.1 16l-8-8 8-8 1.4 1.5L5 8l6.5 6.5z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" style={{ marginRight: 4 }}>
      <path d="M12 9H7v5H5V9H0V7h5V2h2v5h5v2z" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// SearchDropdown — toolbar widget that navigates to another item by name/id
// ---------------------------------------------------------------------------

interface SearchDropdownProps {
  listKey: string;
  listPath: string;
  listLabel: string;
}

function SearchDropdown({ listKey, listPath, listLabel }: SearchDropdownProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (wrapRef.current === null) return;
      if (!wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === ESC_KEY) {
        setOpen(false);
        setQuery('');
      }
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const trimmedQuery = query.trim();
  const searchResults = useQuery<ListResponse>({
    queryKey: ['item-search', listKey, trimmedQuery],
    queryFn: () =>
      fetchList(listKey, {
        search: trimmedQuery,
        skip: '0',
        limit: '10',
      }),
    enabled: open && trimmedQuery.length > 0,
  });

  const results = searchResults.data?.results ?? [];

  return (
    <div className={styles.searchWrap} ref={wrapRef} data-item-search>
      {!open ? (
        <button
          type="button"
          className={styles.searchToggle}
          onClick={() => setOpen(true)}
          data-e2e-search-icon
          aria-label="Search items"
          title={`Search ${listLabel}`}
        >
          <MagnifierIcon />
          <span>Search</span>
        </button>
      ) : (
        <div className={styles.searchActive}>
          <MagnifierIcon />
          <input
            ref={inputRef}
            type="search"
            className={styles.searchInput}
            placeholder={`Search ${listLabel}…`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            data-search-input-field
          />
        </div>
      )}
      {open && trimmedQuery.length > 0 && (
        <div className={styles.searchResults} role="listbox">
          {searchResults.isFetching && (
            <div className={styles.searchEmpty}>Searching…</div>
          )}
          {!searchResults.isFetching && results.length === 0 && (
            <div className={styles.searchEmpty}>No matches</div>
          )}
          {!searchResults.isFetching &&
            results.map((item) => {
              const label =
                typeof item.name === 'string' && item.name.length > 0
                  ? item.name
                  : item.id;
              return (
                <a
                  key={item.id}
                  href={buildAdminNextPath(`/${listPath}/${item.id}`)}
                  className={styles.searchResultItem}
                  data-search-result
                  data-item-id={item.id}
                >
                  {label}
                </a>
              );
            })}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function ItemEditPage() {
  const { list: routeList, id } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: adminMeta } = useAdminMeta();
  const listMeta = resolveListMeta(adminMeta, routeList);
  const apiListKey = listMeta?.key ?? routeList;
  const listPath = listMeta?.path ?? routeList;
  const listLabel = listMeta?.label ?? routeList;
  const singular =
    (listMeta?.singular as string | undefined) ?? listLabel.replace(/s$/, '');
  const plural = (listMeta?.plural as string | undefined) ?? listLabel;
  const nodelete = listMeta?.nodelete === true;
  const nocreate = listMeta?.nocreate === true;
  const noedit = listMeta?.noedit === true;

  const navListKeys = getAdminListRoutePaths(adminMeta);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const metadataElements = useMemo(() => getMetadataFormElements(listMeta), [listMeta]);
  const metadataFields = useMemo(() => getFormFields(metadataElements), [metadataElements]);
  const requestedFields = useMemo(
    () => metadataFields.map((field) => field.path),
    [metadataFields],
  );
  const expandRelationshipFields = useMemo(
    () => metadataFields.some((field) => field.fieldType === 'relationship'),
    [metadataFields],
  );
  const { item, isLoading, isError } = useItem(apiListKey, id, {
    fields: requestedFields.length > 0 ? requestedFields : undefined,
    expandRelationshipFields,
    enabled: adminMeta !== undefined && listMeta !== undefined,
  });
  const { update, isUpdating } = useItemMutations(apiListKey, id);

  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [deleteStatus, setDeleteStatus] = useState<'idle' | 'error'>('idle');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const formElements = useMemo(
    () => metadataElements.length > 0 ? metadataElements : getFallbackFormElements(item),
    [metadataElements, item],
  );
  const defaultValues = useMemo(
    () => buildDefaultValues(formElements, item),
    [formElements, item],
  );
  const formKey = useMemo(() => getFormKey(formElements, item), [formElements, item]);

	const {
		control,
		handleSubmit,
		reset,
		watch,
		formState: { isDirty },
	} = useForm<Record<string, unknown>>({
    defaultValues,
  });
  const formValues = watch();

  useEffect(() => {
    reset(defaultValues);
    setFieldErrors({});
  }, [defaultValues, formKey, reset]);

  async function onSubmit(data: Record<string, unknown>) {
    try {
      await update(prepareItemData(metadataFields, data));
      setFieldErrors({});
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      setFieldErrors(getValidationFieldErrors(error));
      setSaveStatus('error');
    }
  }

  function handleResetChanges() {
    reset(defaultValues);
    setFieldErrors({});
    setSaveStatus('idle');
  }

  const deleteMutation = useMutation({
    mutationFn: () => deleteItems(apiListKey, [id]),
    onSuccess: async () => {
      setDeleteStatus('idle');
      await queryClient.invalidateQueries({ queryKey: ['list', apiListKey] });
      await queryClient.invalidateQueries({ queryKey: ['counts'] });
      await navigate({
        to: '/$list',
        params: { list: listPath },
        search: { page: 1, search: '', sort: '', cols: '' },
      });
    },
    onError: () => {
      setDeleteStatus('error');
    },
  });

  function handleDeleteConfirm() {
    setDeleteStatus('idle');
    deleteMutation.mutate();
  }

  const subtitle = getSubtitleSecondary(item, listMeta);
  const itemDeleteLabel = `delete ${singular.toLowerCase()}`;
  const itemName =
    item !== undefined &&
    item !== null &&
    typeof item.name === 'string' &&
    item.name.length > 0
      ? item.name
      : item?.id ?? id;

  if (adminMeta !== undefined && listMeta === undefined) {
    return (
      <Layout listKeys={navListKeys.length > 0 ? navListKeys : [listPath]}>
        <p className={styles.error} role="alert">List not found!</p>
        <p><a href={buildAdminNextPath('/')}>Go back home</a></p>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout listKeys={navListKeys.length > 0 ? navListKeys : [listPath]}>
        <p className={styles.loading}>Loading…</p>
      </Layout>
    );
  }

  if (isError || item == null) {
    return (
      <Layout listKeys={navListKeys.length > 0 ? navListKeys : [listPath]}>
        <p className={styles.error}>Failed to load item.</p>
      </Layout>
    );
  }

  return (
    <Layout listKeys={navListKeys.length > 0 ? navListKeys : [listPath]}>
      {/* Breadcrumb-style secondary navbar — matches list view pattern */}
      <div className={styles.secondaryNavbar} data-item-secondary-nav>
        <a href={buildAdminNextPath(`/${listPath}`)} className={styles.crumbLink}>
          {plural}
        </a>
      </div>

      {/* Toolbar: back + search left, create button right */}
      <div className={styles.toolbar} data-item-toolbar>
        <div className={styles.toolbarLeft}>
          <a
            href={buildAdminNextPath(`/${listPath}`)}
            className={styles.backLink}
            data-e2e-editform-header-back
          >
            <ChevronLeftIcon />
            <span>{plural}</span>
          </a>
          <SearchDropdown
            listKey={apiListKey}
            listPath={listPath}
            listLabel={plural}
          />
        </div>
        <div className={styles.toolbarRight}>
          {!nocreate && (
            <button
              type="button"
              className={`${styles.btn} ${styles.btnSuccess}`}
              onClick={() => setCreateModalOpen(true)}
              data-e2e-item-create-button="true"
              data-list-key={apiListKey}
              data-list-path={listPath}
              data-item-new
            >
              <PlusIcon />
              <span>{`New ${singular}`}</span>
            </button>
          )}
        </div>
      </div>

      {/* Heading: item ID in monospace + optional subtitle */}
      <div className={styles.headingBlock}>
        <h1 className={styles.idHeading} data-item-id={item.id}>
          {item.id}
        </h1>
        {subtitle && (
          <p
            className={styles.idSubtitle}
            data-item-subtitle
            data-subtitle-field={subtitle.label}
          >
            {subtitle.label}: {subtitle.value}
          </p>
        )}
      </div>

      {/* Form: key resets the form whenever the item id changes */}
      <form
        key={formKey}
        onSubmit={handleSubmit(onSubmit)}
        className={styles.form}
        data-item-form
        noValidate
      >
        {formElements.map((element) => {
          if (element.type === 'heading') {
            return (
              <h3
                key={`heading:${element.content}`}
                className={styles.formHeading}
              >
                {element.content}
              </h3>
            );
          }

          const fieldMeta = element.field;
          if (!fieldDependsOnMatches(fieldMeta, formValues)) return null;
          const meta = toFieldMeta(fieldMeta);
          const { Field } = getFieldComponents(meta.fieldType);
          const fieldValue = getFieldComponentValue(fieldMeta, getItemFieldValue(item, fieldMeta.path));

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
                defaultValue={fieldValue}
                render={({ field }) => (
                  <Field
                    fieldName={fieldMeta.path}
                    label={fieldMeta.label}
                    value={field.value}
                    onChange={field.onChange}
                    isRequired={fieldMeta.required === true}
                    isReadonly={fieldMeta.noedit === true || noedit}
                    errors={fieldErrors[fieldMeta.path] ?? []}
                    meta={meta}
                  />
                )}
              />
            </FieldShell>
          );
        })}

        {/* Footer bar */}
        {(!noedit || !nodelete) && (
          <div className={styles.footerBar} data-item-footer>
            <div className={styles.footerInner}>
              <div className={styles.footerLeft}>
                {!noedit && (
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className={styles.saveBtn}
                    data-button="update"
                  >
                    {isUpdating ? 'Saving…' : 'Save'}
                  </button>
                )}
                {!noedit && isDirty && (
                  <button
                    type="button"
                    onClick={handleResetChanges}
                    className={styles.linkBtn}
                    disabled={isUpdating}
                    data-button="reset"
                  >
                    reset changes
                  </button>
                )}
                {saveStatus === 'success' && (
                  <span role="status" className={styles.successMsg}>
                    Your changes have been saved successfully.
                  </span>
                )}
                {saveStatus === 'error' && (
                  <span role="status" className={styles.errorMsg}>
                    Save failed. Please try again.
                  </span>
                )}
                {deleteStatus === 'error' && (
                  <span role="status" className={styles.errorMsg} data-item-delete-error>
                    Delete failed. Please try again.
                  </span>
                )}
              </div>
              <div className={styles.footerRight}>
                {!nodelete && (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    className={`${styles.linkBtn} ${styles.linkDelete}`}
                    disabled={isUpdating || deleteMutation.isPending}
                    data-button="delete"
                  >
                    {itemDeleteLabel}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </form>

      {/* Inverse relationship panels — one per related list that points to this item */}
      {(() => {
        const inverseRels = getInverseRelationships(listMeta);
        if (inverseRels.length === 0) return null;
        return (
          <div
            className={styles.relationshipsSection}
            data-relationships-section
          >
            <h2 className={styles.relationshipsSectionTitle}>Relationships</h2>
            {inverseRels.map((rel) => (
              <InverseRelationshipPanel
                key={rel.path}
                parentListMeta={listMeta!}
                itemId={id}
                relationship={rel}
                refListMeta={resolveRefListMeta(adminMeta, rel.ref)}
              />
            ))}
          </div>
        );
      })()}

      <CreateItemModal
        listKey={apiListKey}
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreated={(newId) => {
          setCreateModalOpen(false);
          void navigate({ to: '/$list/$id', params: { list: listPath, id: newId } });
        }}
      />

      <ConfirmDialog
        open={confirmDelete}
        message={`Are you sure you want to delete "${itemName}"? This cannot be undone.`}
        onConfirm={() => {
          setConfirmDelete(false);
          handleDeleteConfirm();
        }}
        onCancel={() => setConfirmDelete(false)}
      />
    </Layout>
  );
}
