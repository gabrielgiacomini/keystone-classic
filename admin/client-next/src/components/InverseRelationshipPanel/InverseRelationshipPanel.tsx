/**
 * InverseRelationshipPanel — renders a single inverse-relationship section on
 * the item detail screen.
 *
 * When List B has a relationship field pointing to List A (e.g. Post.author:
 * ref: 'User'), the admin item detail for a User shows a panel listing all
 * Posts where author == <this user id>. This component implements that panel.
 *
 * Parity target: admin-legacy RelatedItemsList component.
 */

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchList, reorderItem } from '../../api/list.js';
import type { ListItem, RelationshipMeta, AdminListMeta } from '../../api/list.js';
import { buildAdminNextPath } from '../../adminNextPath.js';
import styles from './InverseRelationshipPanel.module.css';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface InverseRelationshipPanelProps {
  /** The list the current item belongs to (e.g. HeavyUser) */
  parentListMeta: AdminListMeta;
  /** The current item's id */
  itemId: string;
  /** Inverse relationship descriptor registered via list.relationship({...}) */
  relationship: RelationshipMeta;
  /** Metadata for the referenced list (the "B" list that points to this item) */
  refListMeta: AdminListMeta | undefined;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const PAGE_SIZE = 10;

function getDefaultColumns(meta: AdminListMeta | undefined): string[] {
  if (meta === undefined) return [];
  const raw = meta.defaultColumns ?? '';
  if (Array.isArray(raw)) return raw.map(String);
  if (typeof raw === 'string' && raw.length > 0) {
    return raw.split(',').map((s) => s.trim()).filter(Boolean);
  }
  return Object.keys(meta.fields).slice(0, 5);
}

function getColumnLabel(meta: AdminListMeta | undefined, col: string): string {
  if (meta === undefined) return col;
  return meta.fields[col]?.label ?? col;
}

function getItemCellValue(item: ListItem, col: string): string {
  let raw: unknown;
  if (typeof item.fields === 'object' && item.fields !== null && col in (item.fields as Record<string, unknown>)) {
    raw = (item.fields as Record<string, unknown>)[col];
  } else if (col in item) {
    raw = item[col];
  }
  if (raw === null || raw === undefined) return '—';
  if (typeof raw === 'object') {
    // name field: { first, last }
    const r = raw as Record<string, unknown>;
    if (typeof r['first'] === 'string' || typeof r['last'] === 'string') {
      return [r['first'], r['last']].filter(Boolean).join(' ') || '—';
    }
    // relationship field: { id, label }
    if (typeof r['label'] === 'string') return r['label'];
    if (typeof r['name'] === 'string') return r['name'];
    if (typeof r['id'] === 'string') return r['id'];
    try { return JSON.stringify(raw); } catch { return String(raw); }
  }
  return String(raw);
}

function getSortOrder(item: ListItem): number | null {
  const raw = item.sortOrder;
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw;
  if (typeof raw === 'string') {
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function isSortableInversePanel(
  parentListMeta: AdminListMeta,
  refListMeta: AdminListMeta | undefined,
  relationship: RelationshipMeta,
): boolean {
  if (refListMeta?.sortable !== true || typeof refListMeta.sortContext !== 'string') {
    return false;
  }
  const [parentKey, relationshipPath] = refListMeta.sortContext.split(':');
  return parentKey === parentListMeta.key && relationshipPath === relationship.path;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function InverseRelationshipPanel({
  parentListMeta,
  itemId,
  relationship,
  refListMeta,
}: InverseRelationshipPanelProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const refListKey = relationship.ref;
  const refPath = relationship.refPath;
  const label = relationship.label ?? refListMeta?.label ?? refListKey;
  const refListPath = refListMeta?.path ?? refListKey;

  const columns = getDefaultColumns(refListMeta).filter((c) => c !== refPath);
  const isSortable = isSortableInversePanel(parentListMeta, refListMeta, relationship);

  // The server-side addFiltersToQuery passes filters[field.path] directly to
  // field.addFilterToQuery(). For relationship fields, that method expects an
  // object with a `value` property (e.g. { value: '<id>' }), not a plain string.
  const filters = JSON.stringify({ [refPath]: { value: itemId } });
  const skip = (page - 1) * PAGE_SIZE;
  const trimmedSearch = search.trim();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['inverse-rel', refListKey, refPath, itemId, page, trimmedSearch],
    queryFn: () =>
      fetchList(refListKey, {
        filters,
        search: trimmedSearch,
        limit: String(PAGE_SIZE),
        skip: String(skip),
      }),
    staleTime: 60_000,
    // Keep previous data while fetching next page — smoother pagination
    placeholderData: (prev) => prev,
  });

  const reorderMutation = useMutation({
    mutationFn: ({ item, target }: { item: ListItem; target: ListItem }) => {
      const sortOrder = getSortOrder(item);
      const newOrder = getSortOrder(target);
      if (sortOrder === null || newOrder === null) {
        throw new Error('Missing sort order');
      }
      return reorderItem(refListKey, item.id, sortOrder, newOrder, {
        filters,
        search: trimmedSearch,
        limit: String(PAGE_SIZE),
        skip: String(skip),
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['inverse-rel', refListKey, refPath, itemId] });
    },
  });

  const results = data?.results ?? [];
  const total = data?.count ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const showPagination = pageCount > 1;

  const addItemUrl = new URL(buildAdminNextPath(`/${refListPath}`), window.location.origin);
  addItemUrl.searchParams.set('create', 'true');
  addItemUrl.searchParams.set(`f.${refPath}`, itemId);
  const addItemHref = `${addItemUrl.pathname}${addItemUrl.search}`;

  return (
    <div
      className={styles.panel}
      data-inverse-panel
      data-rel-path={relationship.path}
      data-ref-list={refListKey}
    >
      {/* Panel header */}
      <div className={styles.panelHeader}>
        <h3 className={styles.panelTitle}>
          <a
            href={buildAdminNextPath(`/${refListPath}`)}
            className={styles.panelTitleLink}
          >
            {label}
          </a>
        </h3>
        <a
          href={addItemHref}
          className={styles.addBtn}
          data-add-item
          data-ref-list={refListKey}
        >
          + Add {refListMeta?.singular ?? refListKey}
        </a>
      </div>

      <div className={styles.searchRow}>
        <input
          type="search"
          className={styles.searchInput}
          placeholder={`Search ${(refListMeta?.plural ?? refListKey).toLowerCase()}...`}
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          data-inverse-search
          aria-label={`Search ${refListMeta?.plural ?? refListKey}`}
        />
      </div>

      {/* Panel body */}
      {isLoading && (
        <p className={styles.loading}>Loading…</p>
      )}

      {isError && (
        <p className={styles.error}>Failed to load related items.</p>
      )}

      {!isLoading && !isError && results.length === 0 && (
        <p className={styles.empty}>
          {trimmedSearch.length > 0
            ? `No related ${(refListMeta?.plural ?? refListKey).toLowerCase()} matching ${trimmedSearch}...`
            : `No related ${(refListMeta?.plural ?? refListKey).toLowerCase()}...`}
        </p>
      )}

      {!isLoading && !isError && results.length > 0 && (
        <>
          <div className={styles.tableWrap}>
            <table className={styles.table} data-inverse-table>
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th key={col} className={styles.th}>
                      {getColumnLabel(refListMeta, col)}
                    </th>
                  ))}
                  {isSortable && <th className={styles.thAction}>Sort</th>}
                  {/* Edit link column */}
                  <th className={styles.thAction} />
                </tr>
              </thead>
              <tbody>
                {results.map((item, index) => (
                  <tr key={item.id} className={styles.tr}>
                    {columns.map((col, idx) => (
                      <td key={col} className={styles.td}>
                        {idx === 0 ? (
                          <a
                            href={buildAdminNextPath(`/${refListPath}/${item.id}`)}
                            className={styles.itemLink}
                            data-item-id={item.id}
                          >
                            {getItemCellValue(item, col)}
                          </a>
                        ) : (
                          getItemCellValue(item, col)
                        )}
                      </td>
                    ))}
                    {isSortable && (
                      <td className={styles.tdAction}>
                        <button
                          type="button"
                          className={styles.sortBtn}
                          aria-label={`Move ${getItemCellValue(item, columns[0] ?? 'id')} up`}
                          disabled={index === 0 || reorderMutation.isPending}
                          onClick={() => {
                            const target = results[index - 1];
                            if (target !== undefined) reorderMutation.mutate({ item, target });
                          }}
                          data-inverse-sort-up
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          className={styles.sortBtn}
                          aria-label={`Move ${getItemCellValue(item, columns[0] ?? 'id')} down`}
                          disabled={index >= results.length - 1 || reorderMutation.isPending}
                          onClick={() => {
                            const target = results[index + 1];
                            if (target !== undefined) reorderMutation.mutate({ item, target });
                          }}
                          data-inverse-sort-down
                        >
                          ↓
                        </button>
                      </td>
                    )}
                    <td className={styles.tdAction}>
                      <a
                        href={buildAdminNextPath(`/${refListPath}/${item.id}`)}
                        className={styles.editLink}
                        aria-label="Edit"
                      >
                        Edit
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showPagination && (
            <div className={styles.pagination} data-pagination>
              <button
                type="button"
                className={styles.pageBtn}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                &#8249; Prev
              </button>
              <span className={styles.pageInfo}>
                Page {page} of {pageCount}
                {' '}({total} total)
              </span>
              <button
                type="button"
                className={styles.pageBtn}
                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                disabled={page >= pageCount}
              >
                Next &#8250;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
