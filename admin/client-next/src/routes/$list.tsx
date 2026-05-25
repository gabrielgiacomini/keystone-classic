import { useState, useEffect, useMemo, useRef } from 'react';
import { createRoute, useNavigate } from '@tanstack/react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Route as RootRoute } from './__root.js';
import { useAdminMeta, useList } from '../hooks/useList.js';
import {
  deleteItems,
  fetchList,
  fetchCounts,
  getAdminListRoutePaths,
  getFallbackTextField,
  getFieldComponentValue,
  getItemFieldValue,
  resolveAdminField,
  resolveListMeta,
  toFieldMeta,
} from '../api/list.js';
import type { AdminFieldMeta, AdminListMeta, ListItem } from '../api/list.js';
import { getFieldComponents } from '../fields/registry.js';
import { Layout } from '../components/Layout/Layout.js';
import { ConfirmDialog } from '../components/ConfirmDialog/ConfirmDialog.js';
import { CreateItemModal } from '../components/CreateItemModal/CreateItemModal.js';
import { buildAdminNextPath, getAdminApiBasepath } from '../adminNextPath.js';
import {
	buildApiFilters,
	buildListDownloadUrl,
	buildPageWindow,
	formatCount,
	formatFilterDisplay,
	getActiveColumnPaths,
	getDefaultColumnPaths as getSharedDefaultColumnPaths,
	getFilterFields,
	getFilterValuesFromSearch,
	isIdColumnPath,
	pluralizeCount,
	serializeColumnPaths,
	validateListSearch,
} from '../../../shared/state/listRoute.js';
import type { ListSearch } from '../../../shared/state/listRoute.js';
import { requireAuth } from './requireAuth.js';
import styles from './$list.module.css';

const ESC_KEY = 'Escape';
const WIDTH_LS_KEY = 'keystone-next:list:expanded';
const SEARCH_DEBOUNCE_MS = 500;

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/$list',
  validateSearch: validateListSearch,
  beforeLoad: ({ context }) => requireAuth(context),
  component: ListPage,
});

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getDefaultColumnPaths(listMeta: AdminListMeta | undefined): string[] {
  if (listMeta === undefined) return [];
  return getSharedDefaultColumnPaths({
    columns: listMeta.columns,
    defaultColumns: listMeta.defaultColumns,
    fields: listMeta.fields,
    resolveField: (column) => resolveAdminField(listMeta, column),
  });
}

function resolveColumns(
  listMeta: AdminListMeta | undefined,
  activePaths: string[],
): AdminFieldMeta[] {
  if (listMeta === undefined) return [];
  return activePaths
    .map((path) => {
      if (isIdColumnPath(path)) return ID_COLUMN_FIELD;
      return resolveAdminField(listMeta, path);
    })
    .filter((field): field is AdminFieldMeta => field !== undefined && field.hidden !== true);
}

function getAvailableColumnFields(listMeta: AdminListMeta | undefined): AdminFieldMeta[] {
  if (listMeta === undefined) return [];
  const fields = Object.values(listMeta.fields).filter(
    (field) => field.hidden !== true && field.nocol !== true,
  );
  // Surface ID as a selectable column (matches legacy Columns dropdown).
  return [ID_COLUMN_FIELD, ...fields];
}

function getNoResultsText(plural: string, searchQuery: string, filterCount: number): string {
  let matching = searchQuery;
  if (filterCount > 0) {
    matching += `${matching ? ' and ' : ''}${filterCount} ${filterCount === 1 ? 'filter' : 'filters'}`;
  }
  return `No ${plural.toLowerCase()}${matching ? ` found matching ${matching}` : '.'}`;
}

const ID_COLUMN_FIELD: AdminFieldMeta = {
  path: 'id',
  label: 'ID',
  fieldType: '__id__',
  nosort: false,
};

function getFallbackColumns(items: ListItem[]): AdminFieldMeta[] {
  const firstItem = items[0];
  if (firstItem === undefined) return [];
  if (isRecord(firstItem.fields)) {
    return Object.keys(firstItem.fields).map(getFallbackTextField);
  }
  return Object.keys(firstItem)
    .filter((key) => key !== 'id' && key !== '_id' && key !== '__v' && key !== 'fields')
    .map(getFallbackTextField);
}

// ---------------------------------------------------------------------------
// Filter widget (used inside the filter chip popout)
// ---------------------------------------------------------------------------

function FieldFilterControl({
  field,
  value,
  onChange,
}: {
  field: AdminFieldMeta;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  const { Filter } = getFieldComponents(field.fieldType);
  return (
    <div
      className={styles.filterControl}
      data-field-filter
      data-field-name={field.path}
      data-field-type={field.fieldType}
    >
      <Filter
        fieldName={field.path}
        value={value}
        onChange={onChange}
        meta={toFieldMeta(field)}
      />
    </div>
  );
}

function ListCell({ field, item }: { field: AdminFieldMeta; item: ListItem }) {
  const { Column } = getFieldComponents(field.fieldType);
  return (
    <Column
      fieldName={field.path}
      value={getFieldComponentValue(field, getItemFieldValue(item, field.path))}
      meta={toFieldMeta(field)}
    />
  );
}

// ---------------------------------------------------------------------------
// Toolbar dropdown — reused for Filter, Columns, Download
// ---------------------------------------------------------------------------

interface ToolbarDropdownProps {
  id: string;
  label: string;
  icon?: 'eye' | 'columns' | 'download';
  children: (close: () => void) => React.ReactNode;
  dataAttr?: string;
}

function ToolbarDropdown({ id, label, icon, children, dataAttr }: ToolbarDropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (rootRef.current === null) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === ESC_KEY) setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const dataProps: Record<string, string> = {};
  if (dataAttr !== undefined) dataProps[dataAttr] = '';

  return (
    <div className={styles.dropdown} ref={rootRef} {...dataProps}>
      <button
        type="button"
        id={id}
        className={`${styles.btn} ${styles.btnDropdown}${open ? ` ${styles.btnActive}` : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        {icon !== undefined && <DropdownIcon name={icon} />}
        <span>{label}</span>
        <Caret />
      </button>
      {open && (
        <div className={styles.dropdownMenu} role="menu">
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}

function DropdownIcon({ name }: { name: 'eye' | 'columns' | 'download' }) {
  switch (name) {
    case 'eye':
      return (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M8.06 2C3 2 0 8 0 8s3 6 8.06 6c4.95 0 7.94-6 7.94-6S13 2 8.06 2zm-.06 10a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
        </svg>
      );
    case 'columns':
      return (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M0 1v14h16V1H0zm6 13H2V2h4v12zm4 0H7V2h3v12zm4 0h-3V2h3v12z" />
        </svg>
      );
    case 'download':
      return (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M9 12h2L8 15.5 5 12h2V8h2v4zm5-7c0-.44-.91-3-4.5-3C5.92 2 5 4.83 5 6 3 6.44 1 6.69 1 9c0 1.55 1.45 3 3 3h3v-1H4c-1.45 0-2-1.45-2-2 0-2.31 2.96-1.96 3-2 0-1.51.04-4 3.5-4 3.41 0 3.41 2.59 3.5 4 0 0 4 .44 4 3 0 .58-.44 2-2 2h-3v1h3c1.55 0 3-1.45 3-3 0-2.39-2.07-2.93-4-3z" />
        </svg>
      );
  }
}

function Caret() {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor" aria-hidden="true" style={{ marginLeft: 4 }}>
      <path d="M1 3l3 3 3-3z" />
    </svg>
  );
}

function MagnifierIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M15.7 13.3l-3.81-3.83A5.93 5.93 0 0 0 13 6c0-3.31-2.69-6-6-6S1 2.69 1 6s2.69 6 6 6c1.3 0 2.48-.41 3.47-1.11l3.83 3.81c.19.2.45.3.7.3.25 0 .52-.09.7-.3a.996.996 0 0 0 0-1.41v.02zM7 10.7c-2.59 0-4.7-2.11-4.7-4.7 0-2.59 2.11-4.7 4.7-4.7 2.59 0 4.7 2.11 4.7 4.7 0 2.59-2.11 4.7-4.7 4.7z" />
    </svg>
  );
}

function MirrorIcon() {
  // expand/collapse toggle
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M9 1v2H7V1h2zM3 3l2 2v6L3 13V3zm10 0v10l-2-2V5l2-2zM9 13v2H7v-2h2z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" style={{ marginRight: 6 }}>
      <path d="M12 9H7v5H5V9H0V7h5V2h2v5h5v2z" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M11 2H9c0-.55-.45-1-1-1H5c-.55 0-1 .45-1 1H2c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1v9c0 .55.45 1 1 1h7c.55 0 1-.45 1-1V5c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zM10 14H3V5h1v8h1V5h1v8h1V5h1v8h1V5h1v9zm1-10H2V3h9v1z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M7.48 8L11.24 11.76 9.76 13.24 6 9.48 2.24 13.24 0.76 11.76 4.52 8 0.76 4.24 2.24 2.76 6 6.52 9.76 2.76 11.24 4.24z" transform="scale(0.85) translate(1, -1)" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

function ListPage() {
  const { list: routeList } = Route.useParams();
  const searchParams = Route.useSearch();
  const navigate = useNavigate({ from: '/$list' });
  const queryClient = useQueryClient();
  const { data: adminMeta } = useAdminMeta();
  const listMeta = resolveListMeta(adminMeta, routeList);
  const apiListKey = listMeta?.key ?? routeList;
  const listPath = listMeta?.path ?? routeList;
  const listLabel = listMeta?.label ?? routeList;
  const singular = (listMeta?.singular as string | undefined) ?? listLabel.replace(/s$/, '');
  const plural = (listMeta?.plural as string | undefined) ?? listLabel;
  const nodelete = listMeta?.nodelete === true;

  const defaultColumnPaths = useMemo(() => getDefaultColumnPaths(listMeta), [listMeta]);
  const availableColumnFields = useMemo(() => getAvailableColumnFields(listMeta), [listMeta]);
  const filterFields = useMemo(() => getFilterFields(listMeta?.fields), [listMeta]);

  const page = searchParams.page;
  const searchQuery = searchParams.search;
  const sort = searchParams.sort;
  const PAGE_SIZE = listMeta?.perPage ?? 50;

  // Active columns from URL `cols=path1,path2` or default
  const activeColumnPaths = useMemo(() => {
    return getActiveColumnPaths(searchParams.cols, defaultColumnPaths, {
      prependIdWhenExplicitColumnsOmitId: true,
    });
  }, [searchParams.cols, defaultColumnPaths]);

  const activeColumns = useMemo(
    () => resolveColumns(listMeta, activeColumnPaths),
    [listMeta, activeColumnPaths],
  );
  const expandRelationshipFields = activeColumns.some((f) => f.fieldType === 'relationship');

  // Filter values come straight from URL search (`f.{path}=value`)
  const filterValues: Record<string, unknown> = useMemo(
    () => getFilterValuesFromSearch(searchParams),
    [searchParams],
  );
  const relationshipCreateValues = useMemo(() => {
    if (listMeta === undefined) return {};
    const values: Record<string, unknown> = {};
    for (const [path, rawValue] of Object.entries(filterValues)) {
      const field = resolveAdminField(listMeta, path);
      if (field?.fieldType === 'relationship' && typeof rawValue === 'string' && rawValue.length > 0) {
        values[path] = rawValue;
      }
    }
    return values;
  }, [filterValues, listMeta]);

  const apiFilters = useMemo(
    () => buildApiFilters(filterFields, filterValues),
    [filterFields, filterValues],
  );

  // Debounced search
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  function handleSearchChange(value: string) {
    setLocalSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.length === 0) {
      void navigate({ search: (prev) => ({ ...prev, search: '', page: 1 }) });
      return;
    }
    debounceRef.current = setTimeout(() => {
      void navigate({ search: (prev) => ({ ...prev, search: value, page: 1 }) });
    }, SEARCH_DEBOUNCE_MS);
  }

  function handleSearchKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === ESC_KEY) {
      setLocalSearch('');
      void navigate({ search: (prev) => ({ ...prev, search: '', page: 1 }) });
    }
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // Width toggle (localStorage-backed)
  const [expanded, setExpanded] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(WIDTH_LS_KEY) === '1';
  });
  function toggleExpanded() {
    setExpanded((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(WIDTH_LS_KEY, next ? '1' : '0');
      }
      return next;
    });
  }

  // Fetch list data
  const { items, count, isLoading, isError } = useList(apiListKey, {
    page,
    pageSize: PAGE_SIZE,
    search: searchQuery,
    sort,
    filters: apiFilters,
    fields: activeColumnPaths.length > 0 ? activeColumnPaths : undefined,
    expandRelationshipFields,
    enabled: adminMeta !== undefined && listMeta !== undefined,
  });

  // Counts for sidebar nav
  const { data: countsData } = useQuery({
    queryKey: ['counts'],
    queryFn: fetchCounts,
  });
  const navListKeys = getAdminListRoutePaths(adminMeta);
  const listKeys = navListKeys.length > 0 ? navListKeys : Object.keys(countsData?.counts ?? {});

  // Selection state
  const [manageMode, setManageMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [selectAllItemsLoading, setSelectAllItemsLoading] = useState(false);

  useEffect(() => {
    setSelected(new Set());
    setManageMode(false);
  }, [apiListKey]);

  function toggleRowSelection(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectVisible() {
    setSelected(new Set(items.map((item) => item.id)));
  }

  async function selectAllItems() {
    setSelectAllItemsLoading(true);
    try {
      const params: Record<string, string> = {
        limit: String(count),
        skip: '0',
      };
      if (searchQuery) params['search'] = searchQuery;
      if (sort) params['sort'] = sort;
      if (Object.keys(apiFilters).length > 0) params['filters'] = JSON.stringify(apiFilters);
      const data = await fetchList(apiListKey, params);
      setSelected(new Set(data.results.map((item) => item.id).filter(Boolean)));
    } finally {
      setSelectAllItemsLoading(false);
    }
  }

  function selectNone() {
    setSelected(new Set());
  }

  // Delete mutation
  const [confirmState, setConfirmState] = useState<
    { open: false } | { open: true; ids: string[]; message: string }
  >({ open: false });

  const deleteMutation = useMutation({
    mutationFn: (ids: string[]) => deleteItems(apiListKey, ids),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['list', apiListKey] });
      void queryClient.invalidateQueries({ queryKey: ['counts'] });
      setSelected(new Set());
      setConfirmState({ open: false });
    },
  });

  function askDeleteSelected() {
    if (selected.size === 0) return;
    setConfirmState({
      open: true,
      ids: [...selected],
      message: `Delete ${pluralizeCount(selected.size, singular.toLowerCase(), plural.toLowerCase())}? This cannot be undone.`,
    });
  }

  function askDeleteSingle(item: ListItem) {
    const label =
      typeof item.name === 'string' && item.name.length > 0 ? item.name : item.id;
    setConfirmState({
      open: true,
      ids: [item.id],
      message: `Delete "${label}"? This cannot be undone.`,
    });
  }

  function handleDeleteConfirm() {
    if (confirmState.open) deleteMutation.mutate(confirmState.ids);
  }

  // Sort toggle
  function handleSort(colKey: string) {
    let newSort: string;
    if (sort === colKey) newSort = `-${colKey}`;
    else if (sort === `-${colKey}`) newSort = '';
    else newSort = colKey;
    void navigate({ search: (prev) => ({ ...prev, sort: newSort, page: 1 }) });
  }

  // Pagination
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));
  function goToPage(p: number) {
    void navigate({ search: (prev) => ({ ...prev, page: p }) });
  }

  // Create modal — driven by ?create=true so the URL is shareable.
  const createModalOpen = searchParams.create === true;
  function openCreateModal() {
    void navigate({ search: (prev) => ({ ...prev, create: true }) });
  }
  function closeCreateModal() {
    void navigate({
      search: (prev) => {
        const next = { ...prev };
        delete (next as Record<string, unknown>).create;
        return next;
      },
    });
  }
  function handleCreated(newId: string) {
    void navigate({ to: '/$list/$id', params: { list: listPath, id: newId } });
  }

  // Filter mutation helpers
  function addFilter(field: AdminFieldMeta, value: string) {
    void navigate({
      search: (prev) => {
        const next = { ...prev, [`f.${field.path}`]: value, page: 1 };
        return next;
      },
    });
  }
  function removeFilter(path: string) {
    void navigate({
      search: (prev) => {
        const next = { ...prev };
        delete (next as Record<string, unknown>)[`f.${path}`];
        next.page = 1;
        return next;
      },
    });
  }
  function clearAllFilters() {
    void navigate({
      search: (prev) => {
        const next = { ...prev };
        for (const key of Object.keys(next)) {
          if (key.startsWith('f.')) {
            delete (next as Record<string, unknown>)[key];
          }
        }
        next.page = 1;
        return next;
      },
    });
  }

  // Columns mutation helpers
  function setColumns(paths: string[]) {
    void navigate({
      search: (prev) => ({
        ...prev,
        cols: serializeColumnPaths(paths),
        page: 1,
      }),
    });
  }
  function toggleColumn(path: string) {
    const current = activeColumnPaths;
    const next = current.includes(path)
      ? current.filter((p) => p !== path)
      : [...current, path];
    setColumns(next);
  }

  const displayColumns =
    activeColumns.length > 0 ? activeColumns : getFallbackColumns(items);

  const sortIndicator = (colKey: string): 'asc' | 'desc' | null => {
    if (sort === colKey) return 'asc';
    if (sort === `-${colKey}`) return 'desc';
    return null;
  };

  const activeFilterPaths = Object.keys(filterValues);
  const showBlankState =
    !isLoading &&
    !isError &&
    items.length === 0 &&
    searchQuery.length === 0 &&
    activeFilterPaths.length === 0;

  // Header title — show spinner while loading
  const titleText = isLoading
    ? null
    : pluralizeCount(count, singular, plural);

  if (adminMeta !== undefined && listMeta === undefined) {
    return (
      <Layout listKeys={listKeys.length > 0 ? listKeys : [listPath]}>
        <p className={styles.error} role="alert">List not found!</p>
        <p><a href={buildAdminNextPath('/')}>Go back home</a></p>
      </Layout>
    );
  }

  return (
    <Layout listKeys={listKeys.length > 0 ? listKeys : [listPath]}>
      {/* Breadcrumb-style secondary navbar */}
      <div className={styles.secondaryNavbar} data-list-secondary-nav>
        <span className={styles.crumb}>{listLabel}</span>
      </div>

      <div className={`${styles.contentContainer} ${expanded ? styles.contentExpanded : ''}`}>
        {/* Title */}
        <h1 className={styles.title}>
          {titleText === null ? (
            <span className={styles.titleSpinner} aria-label="Loading">
              <span className={styles.spinner} />
            </span>
          ) : (
            titleText
          )}
        </h1>

        {/* Toolbar */}
        <div className={styles.toolbar} data-list-toolbar>
          <div className={styles.searchWrap}>
            <input
              type="search"
              className={styles.searchInput}
              placeholder="Search"
              value={localSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyUp={handleSearchKey}
              data-search-input-field
            />
            <span className={styles.searchIcon}>
              <MagnifierIcon />
            </span>
          </div>

          <div className={styles.toolbarActions}>
            {filterFields.length > 0 && (
              <ToolbarDropdown id="listHeaderFilterButton" label="Filter" icon="eye" dataAttr="data-list-filters-add">
                {(close) => (
                  <FilterAddPanel
                    fields={filterFields}
                    activeFilterPaths={activeFilterPaths}
                    onSelect={(field, value) => {
                      addFilter(field, value);
                      close();
                    }}
                  />
                )}
              </ToolbarDropdown>
            )}
            <ToolbarDropdown id="listHeaderColumnButton" label="Columns" icon="columns" dataAttr="data-list-columns">
              {() => (
                <ColumnsPanel
                  availableFields={availableColumnFields}
                  activePaths={activeColumnPaths}
                  defaultPaths={defaultColumnPaths}
                  onToggle={toggleColumn}
                  onReset={() => setColumns([])}
                />
              )}
            </ToolbarDropdown>
            <ToolbarDropdown id="listHeaderDownloadButton" label="Download" icon="download" dataAttr="data-list-download">
              {() => (
                <DownloadPanel
                  listPath={listPath}
                  columns={activeColumns}
                  availableFields={availableColumnFields}
                  search={searchQuery}
                  filters={apiFilters}
                  sort={sort}
                />
              )}
            </ToolbarDropdown>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnIcon}${expanded ? ` ${styles.btnActive}` : ''}`}
              onClick={toggleExpanded}
              title="Expand table width"
              aria-label="Expand table width"
              data-list-width-toggle
            >
              <MirrorIcon />
            </button>
            {listMeta?.nocreate !== true && (
              <button
                type="button"
                onClick={() => openCreateModal()}
                className={`${styles.btn} ${styles.btnSuccess}`}
                data-list-create
                data-e2e-list-create-button="header"
                data-list-key={apiListKey}
                data-list-path={listPath}
              >
                <PlusIcon />
                <span>{`Create ${singular}`}</span>
              </button>
            )}
          </div>
        </div>

        {/* Active filters */}
        {activeFilterPaths.length > 0 && (
          <div className={styles.filtersRow} data-list-filters>
            {activeFilterPaths.map((path) => {
              const field = listMeta?.fields[path];
              const rawValue = String(filterValues[path] ?? '');
              const label = field?.label ?? path;
              const displayValue = field !== undefined ? formatFilterDisplay(field, rawValue) : rawValue;
              return (
                <span
                  key={path}
                  className={styles.filterChip}
                  data-list-filter-chip
                  data-field-name={path}
                >
                  <strong>{label}:</strong>
                  <span className={styles.filterChipValue}>{displayValue}</span>
                  <button
                    type="button"
                    className={styles.filterChipClose}
                    onClick={() => removeFilter(path)}
                    aria-label={`Remove filter ${label}`}
                  >
                    <XIcon />
                  </button>
                </span>
              );
            })}
            {activeFilterPaths.length > 1 && (
              <button
                type="button"
                className={styles.filterChipClear}
                onClick={clearAllFilters}
              >
                Clear All
              </button>
            )}
          </div>
        )}

        {/* Management bar */}
        <div className={styles.managementBar} data-list-management>
          <div className={styles.managementLeft}>
            {nodelete ? null : (
              <button
                type="button"
                className={`${styles.btn}${manageMode ? ` ${styles.btnActive}` : ''}`}
                onClick={() => {
                  setManageMode((m) => !m);
                  setSelected(new Set());
                }}
                data-list-management-toggle
              >
                Manage
              </button>
            )}
            {manageMode && (
              <>
                {count > items.length && (
                  <button
                    type="button"
                    className={`${styles.btn}${selected.size === count ? ` ${styles.btnActive}` : ''}`}
                    onClick={() => void selectAllItems()}
                    disabled={selectAllItemsLoading}
                    data-list-management-select-all
                    title="Select all rows, including rows on other pages"
                  >
                    {selectAllItemsLoading ? 'Loading' : 'All'} <small className={styles.btnNote}>({count})</small>
                  </button>
                )}
                <button
                  type="button"
                  className={`${styles.btn}${selected.size === items.length && items.length > 0 ? ` ${styles.btnActive}` : ''}`}
                  onClick={selectVisible}
                  data-list-management-select-visible
                  title="Select all visible rows"
                >
                  All <small className={styles.btnNote}>({items.length})</small>
                </button>
                <button
                  type="button"
                  className={`${styles.btn}${selected.size === 0 ? ` ${styles.btnActive}` : ''}`}
                  onClick={selectNone}
                  data-list-management-select-none
                  title="Deselect all"
                >
                  None
                </button>
                <button
                  type="button"
                  className={styles.linkDelete}
                  onClick={askDeleteSelected}
                  disabled={selected.size === 0 || deleteMutation.isPending}
                  data-list-management-delete
                  data-list-management-selected-count={selected.size}
                >
                  <TrashIcon /> <span>Delete</span>
                </button>
                <span
                  className={styles.selectedCount}
                  data-list-management-selected-count={selected.size}
                >
                  {selected.size} selected
                </span>
              </>
            )}
          </div>
          <div className={styles.managementRight}>
            {!showBlankState && !manageMode && count > 0 && (
              <span className={styles.showingText} data-list-management-showing data-list-pagination-summary>
                {count > PAGE_SIZE
                  ? `Showing ${(PAGE_SIZE * (page - 1)) + 1} to ${Math.min(PAGE_SIZE * page, count)} of ${formatCount(count)}`
                  : `Showing ${pluralizeCount(count, singular, plural)}`}
              </span>
            )}
          </div>
        </div>

        {/* Error / loading / table */}
        {isError && <p className={styles.error}>Failed to load items.</p>}
        {showBlankState && (
          <div className={styles.empty}>
            <p>No {plural.toLowerCase()} found...</p>
            {listMeta?.nocreate !== true && (
              <button
                type="button"
                onClick={() => openCreateModal()}
                className={`${styles.btn} ${styles.btnSuccess}`}
                data-list-create
                data-e2e-list-create-button="no-results"
                data-list-key={apiListKey}
                data-list-path={listPath}
              >
                <PlusIcon />
                <span>{`Create ${singular}`}</span>
              </button>
            )}
          </div>
        )}

        {!isError && !showBlankState && (
          <div className={styles.tableWrapper}>
            <table
              className={styles.table}
              data-list-table
              data-list-key={apiListKey}
              data-list-path={listPath}
            >
              <colgroup>
                {!nodelete && <col className={styles.colControl} />}
                {displayColumns.map((field) => (
                  <col
                    key={field.path}
                    className={isIdColumnPath(field.path) ? styles.colId : undefined}
                  />
                ))}
              </colgroup>
              <thead>
                <tr>
                  {!nodelete && <th className={styles.thControl} aria-label="Delete" />}
                  {displayColumns.map((field) => {
                    const ind = sortIndicator(field.path);
                    const sortable = field.nosort !== true;
                    return (
                      <th
                        key={field.path}
                        className={isIdColumnPath(field.path) ? styles.thControl : undefined}
                        data-list-column-header
                        data-field-name={field.path}
                      >
                        {sortable ? (
                          <button
                            type="button"
                            className={`${styles.thSort}${
                              ind === 'asc' ? ` ${styles.thSortAsc}` : ''
                            }${ind === 'desc' ? ` ${styles.thSortDesc}` : ''}`}
                            onClick={() => handleSort(field.path)}
                            title={`Sort by ${field.label}${ind === 'asc' ? ' (desc)' : ''}`}
                          >
                            {field.label}
                            <span className={styles.thSortIcon} aria-hidden="true" />
                          </button>
                        ) : (
                          <span className={styles.thStatic}>{field.label}</span>
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr>
                    <td
                      colSpan={displayColumns.length + (nodelete ? 0 : 1)}
                      className={styles.loadingRow}
                    >
                      <span className={styles.spinner} aria-label="Loading" />
                    </td>
                  </tr>
                )}
                {!isLoading && items.length === 0 && (
                  <tr>
                    <td
                      colSpan={displayColumns.length + (nodelete ? 0 : 1)}
                      className={styles.empty}
                    >
                      {searchQuery.length > 0 || activeFilterPaths.length > 0
                        ? getNoResultsText(plural, searchQuery, activeFilterPaths.length)
                        : `No ${plural.toLowerCase()} yet.`}
                    </td>
                  </tr>
                )}
                {!isLoading &&
                  items.map((item) => (
                    <tr
                      key={item.id}
                      className={`${styles.row}${
                        selected.has(item.id) ? ` ${styles.rowSelected}` : ''
                      }${manageMode ? ` ${styles.rowManage}` : ''}`}
                      data-list-row
                      data-list-row-edit
                      data-list-key={apiListKey}
                      data-list-path={listPath}
                      data-item-id={item.id}
                      data-selected={selected.has(item.id) ? 'true' : 'false'}
                      onClick={
                        manageMode
                          ? () => toggleRowSelection(item.id)
                          : undefined
                      }
                    >
                      {!nodelete && (
                        <td className={styles.tdControl} onClick={(e) => e.stopPropagation()}>
                          {manageMode ? (
                            <input
                              type="checkbox"
                              className={styles.checkbox}
                              checked={selected.has(item.id)}
                              onChange={() => toggleRowSelection(item.id)}
                              aria-label={`Select ${item.id}`}
                              data-list-row-select
                              data-list-key={apiListKey}
                              data-list-path={listPath}
                              data-item-id={item.id}
                            />
                          ) : (
                            <button
                              type="button"
                              className={styles.btnTrash}
                              onClick={(e) => {
                                e.stopPropagation();
                                askDeleteSingle(item);
                              }}
                              title="Delete"
                              aria-label="Delete"
                              data-list-row-delete
                              data-item-id={item.id}
                            >
                              <TrashIcon />
                            </button>
                          )}
                        </td>
                      )}
                      {displayColumns.map((field, colIndex) => {
                        const isId = isIdColumnPath(field.path);
                        const isFirstDataCol = colIndex === 0;
                        const linkHref = buildAdminNextPath(`/${listPath}/${item.id}`);
                        const cellContent = isId ? (
                          <code>{shortId(item.id)}</code>
                        ) : (
                          <ListCell field={field} item={item} />
                        );
                        return (
                          <td
                            key={field.path}
                            className={isId ? styles.tdId : styles.cell}
                            data-list-cell
                            data-field-name={field.path}
                            data-field-type={field.fieldType}
                          >
                            {isId ? (
                              <a
                                href={linkHref}
                                className={styles.idLink}
                                data-list-row-edit-id
                                data-item-id={item.id}
                                onClick={(e) => {
                                  if (manageMode) {
                                    e.preventDefault();
                                    toggleRowSelection(item.id);
                                  }
                                }}
                              >
                                {cellContent}
                              </a>
                            ) : isFirstDataCol ? (
                              <a
                                href={linkHref}
                                className={styles.cellLink}
                                data-list-row-edit
                                data-item-id={item.id}
                                onClick={(e) => {
                                  if (manageMode) {
                                    e.preventDefault();
                                    toggleRowSelection(item.id);
                                  }
                                }}
                              >
                                {cellContent}
                              </a>
                            ) : (
                              cellContent
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!showBlankState && !isLoading && !isError && totalPages > 1 && (
          <nav className={styles.paginationRow} aria-label="Pagination" data-list-pagination>
            <button
              type="button"
              className={styles.pageBtn}
              disabled={page <= 1}
              onClick={() => goToPage(page - 1)}
              aria-label="Previous page"
            >
              ‹
            </button>
            {buildPageWindow(page, totalPages).map((p, i, arr) => {
              const prev = arr[i - 1];
              const showEllipsis = prev !== undefined && p - prev > 1;
              return (
                <span key={p} style={{ display: 'inline-flex' }}>
                  {showEllipsis && <span className={styles.pageEllipsis}>…</span>}
                  <button
                    type="button"
                    className={`${styles.pageBtn}${p === page ? ` ${styles.pageBtnActive}` : ''}`}
                    onClick={() => goToPage(p)}
                    aria-current={p === page ? 'page' : undefined}
                    data-list-page-button
                    data-page={p}
                  >
                    {p}
                  </button>
                </span>
              );
            })}
            <button
              type="button"
              className={styles.pageBtn}
              disabled={page >= totalPages}
              onClick={() => goToPage(page + 1)}
              aria-label="Next page"
            >
              ›
            </button>
          </nav>
        )}
      </div>

      <ConfirmDialog
        open={confirmState.open}
        message={confirmState.open ? confirmState.message : ''}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmState({ open: false })}
      />

      <CreateItemModal
        listKey={apiListKey}
        isOpen={createModalOpen}
        onClose={closeCreateModal}
        onCreated={handleCreated}
        initialValues={relationshipCreateValues}
      />
    </Layout>
  );
}

function shortId(id: string): string {
  if (id.length <= 24) return id;
  return `${id.slice(0, 6)}…${id.slice(-4)}`;
}

// ---------------------------------------------------------------------------
// Dropdown panels
// ---------------------------------------------------------------------------

function FilterAddPanel({
  fields,
  activeFilterPaths,
  onSelect,
}: {
  fields: AdminFieldMeta[];
  activeFilterPaths: string[];
  onSelect: (field: AdminFieldMeta, value: string) => void;
}) {
  const [search, setSearch] = useState('');
  const [selectedField, setSelectedField] = useState<AdminFieldMeta | null>(null);
  const [draftValue, setDraftValue] = useState<unknown>('');

  const visibleFields = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (q.length === 0) return fields;
    return fields.filter((f) => f.label.toLowerCase().includes(q));
  }, [fields, search]);

  if (selectedField !== null) {
    return (
      <div className={styles.dropdownPane}>
        <div className={styles.dropdownPaneHeader}>
          <button
            type="button"
            className={styles.dropdownBack}
            onClick={() => {
              setSelectedField(null);
              setDraftValue('');
            }}
            aria-label="Back"
          >
            ‹
          </button>
          <strong>{selectedField.label}</strong>
        </div>
        <div className={styles.dropdownBody}>
          <FieldFilterControl
            field={selectedField}
            value={draftValue}
            onChange={(v) => setDraftValue(v)}
          />
        </div>
        <div className={styles.dropdownFooter}>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnPrimary}`}
            data-list-filter-apply
            onClick={() => {
              const raw = draftValue;
              const text =
                raw === null || raw === undefined
                  ? ''
                  : typeof raw === 'object'
                    ? JSON.stringify(raw)
                    : String(raw);
              if (text.length === 0) return;
              onSelect(selectedField, text);
            }}
          >
            Apply
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dropdownPane}>
      <div className={styles.dropdownBody}>
        <input
          type="text"
          placeholder="Find a filter…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.dropdownSearch}
          autoFocus
        />
        <ul className={styles.popoutList}>
          {visibleFields.map((field) => {
            const isActive = activeFilterPaths.includes(field.path);
            return (
              <li key={field.path}>
                <button
                  type="button"
                  className={`${styles.popoutItem}${isActive ? ` ${styles.popoutItemActive}` : ''}`}
                  onClick={() => {
                    setSelectedField(field);
                    setDraftValue('');
                  }}
                  data-list-filter-option
                  data-field-name={field.path}
                >
                  <span>{field.label}</span>
                  <span className={styles.popoutItemArrow}>›</span>
                </button>
              </li>
            );
          })}
          {visibleFields.length === 0 && (
            <li className={styles.popoutEmpty}>No matching fields</li>
          )}
        </ul>
      </div>
    </div>
  );
}

function ColumnsPanel({
  availableFields,
  activePaths,
  defaultPaths,
  onToggle,
  onReset,
}: {
  availableFields: AdminFieldMeta[];
  activePaths: string[];
  defaultPaths: string[];
  onToggle: (path: string) => void;
  onReset: () => void;
}) {
  const [search, setSearch] = useState('');
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (q.length === 0) return availableFields;
    return availableFields.filter((f) => f.label.toLowerCase().includes(q));
  }, [availableFields, search]);

  const allDefault =
    activePaths.length === defaultPaths.length &&
    activePaths.every((p, i) => p === defaultPaths[i]);

  return (
    <div className={styles.dropdownPane}>
      <div className={styles.dropdownBody}>
        <input
          type="text"
          placeholder="Find a column…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.dropdownSearch}
          data-list-column-search
          autoFocus
        />
        <ul className={styles.popoutList}>
          {filtered.map((field) => {
            const isActive = activePaths.includes(field.path);
            return (
              <li key={field.path}>
                <button
                  type="button"
                  className={`${styles.popoutItem}${isActive ? ` ${styles.popoutItemActive}` : ''}`}
                  onClick={() => onToggle(field.path)}
                  data-list-column-option
                  data-field-name={field.path}
                >
                  <span className={styles.popoutCheck} aria-hidden="true">
                    {isActive ? '✓' : ''}
                  </span>
                  <span>{field.label}</span>
                </button>
              </li>
            );
          })}
          {filtered.length === 0 && (
            <li className={styles.popoutEmpty}>No matching columns</li>
          )}
        </ul>
      </div>
      {!allDefault && (
        <div className={styles.dropdownFooter}>
          <button
            type="button"
            className={styles.btn}
            onClick={() => onReset()}
            data-list-column-reset
          >
            Reset to default
          </button>
        </div>
      )}
    </div>
  );
}

function DownloadPanel({
  listPath,
  columns,
  availableFields,
  search,
  filters,
  sort,
}: {
  listPath: string;
  columns: AdminFieldMeta[];
  availableFields: AdminFieldMeta[];
  search: string;
  filters: Record<string, unknown>;
  sort: string;
}) {
  const [format, setFormat] = useState<'csv' | 'json'>('csv');
  const [useCurrentColumns, setUseCurrentColumns] = useState(true);
  const [selectedPaths, setSelectedPaths] = useState<string[]>(() => columns.map((field) => field.path));

  useEffect(() => {
    setSelectedPaths(columns.map((field) => field.path));
  }, [columns]);

  const selectedPathSet = new Set(selectedPaths);
  const exportColumns = useCurrentColumns
    ? columns
    : selectedPaths
      .map((path) => columns.find((field) => field.path === path) ?? availableFields.find((field) => field.path === path))
      .filter((field): field is AdminFieldMeta => field !== undefined);
  const allColumnsSelected = availableFields.length > 0 &&
    availableFields.every((field) => selectedPathSet.has(field.path));

  function toggleSelectedPath(path: string) {
    setSelectedPaths((current) => (
      current.includes(path)
        ? current.filter((entry) => entry !== path)
        : [...current, path]
    ));
  }

  function toggleAllColumns() {
    setSelectedPaths(allColumnsSelected ? [] : availableFields.map((field) => field.path));
  }

  function handleDownload() {
    window.location.href = buildListDownloadUrl({
      adminApiBasepath: getAdminApiBasepath(),
      columns: exportColumns,
      filters,
      format,
      listPath,
      origin: window.location.origin,
      search,
      sort,
    });
  }

  return (
    <div className={styles.dropdownPane}>
      <div className={styles.dropdownBody}>
        <div className={styles.dropdownFormRow}>
          <label className={styles.dropdownLabel}>File format</label>
          <div className={styles.segmented}>
            <button
              type="button"
              className={`${styles.segmentedBtn}${format === 'csv' ? ` ${styles.segmentedBtnActive}` : ''}`}
              onClick={() => setFormat('csv')}
            >
              CSV
            </button>
            <button
              type="button"
              className={`${styles.segmentedBtn}${format === 'json' ? ` ${styles.segmentedBtnActive}` : ''}`}
              onClick={() => setFormat('json')}
            >
              JSON
            </button>
          </div>
        </div>
        <div className={styles.dropdownFormRow}>
          <label>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={useCurrentColumns}
              onChange={(e) => setUseCurrentColumns(e.target.checked)}
              data-list-download-use-current-columns
            />{' '}
            Use currently selected
          </label>
        </div>
        {!useCurrentColumns ? (
          <div className={styles.dropdownFormRow} data-list-download-column-options>
            <label>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={allColumnsSelected}
                onChange={toggleAllColumns}
                data-list-download-toggle-all-columns
              />{' '}
              {allColumnsSelected ? 'Select None' : 'Select All'}
            </label>
            <ul className={styles.popoutList}>
              {availableFields.map((field) => {
                const isSelected = selectedPathSet.has(field.path);
                return (
                  <li key={field.path}>
                    <button
                      type="button"
                      className={`${styles.popoutItem}${isSelected ? ` ${styles.popoutItemActive}` : ''}`}
                      onClick={() => toggleSelectedPath(field.path)}
                      data-list-download-column-option
                      data-field-name={field.path}
                    >
                      <span className={styles.popoutCheck} aria-hidden="true">
                        {isSelected ? '✓' : ''}
                      </span>
                      <span>{field.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </div>
      <div className={styles.dropdownFooter}>
        <button
          type="button"
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={handleDownload}
          data-list-download-submit
        >
          Download
        </button>
      </div>
    </div>
  );
}
