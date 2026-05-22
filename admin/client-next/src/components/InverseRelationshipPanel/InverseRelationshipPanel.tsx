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
import { useQuery } from '@tanstack/react-query';
import { fetchList } from '../../api/list.js';
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

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function InverseRelationshipPanel({
  itemId,
  relationship,
  refListMeta,
}: InverseRelationshipPanelProps) {
  const [page, setPage] = useState(1);

  const refListKey = relationship.ref;
  const refPath = relationship.refPath;
  const label = relationship.label ?? refListMeta?.label ?? refListKey;
  const refListPath = refListMeta?.path ?? refListKey;

  const columns = getDefaultColumns(refListMeta).filter((c) => c !== refPath);

  // The server-side addFiltersToQuery passes filters[field.path] directly to
  // field.addFilterToQuery(). For relationship fields, that method expects an
  // object with a `value` property (e.g. { value: '<id>' }), not a plain string.
  const filters = JSON.stringify({ [refPath]: { value: itemId } });
  const skip = (page - 1) * PAGE_SIZE;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['inverse-rel', refListKey, refPath, itemId, page],
    queryFn: () =>
      fetchList(refListKey, {
        filters,
        limit: String(PAGE_SIZE),
        skip: String(skip),
      }),
    staleTime: 60_000,
    // Keep previous data while fetching next page — smoother pagination
    placeholderData: (prev) => prev,
  });

  const results = data?.results ?? [];
  const total = data?.count ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const showPagination = pageCount > 1;

  // Build "Add Item" URL — pre-fill the refPath filter so the create form
  // knows which parent to link to (legacy parity).
  const addItemHref = buildAdminNextPath(`/${refListPath}/new`);

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

      {/* Panel body */}
      {isLoading && (
        <p className={styles.loading}>Loading…</p>
      )}

      {isError && (
        <p className={styles.error}>Failed to load related items.</p>
      )}

      {!isLoading && !isError && results.length === 0 && (
        <p className={styles.empty}>
          No related {(refListMeta?.plural ?? refListKey).toLowerCase()}…
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
                  {/* Edit link column */}
                  <th className={styles.thAction} />
                </tr>
              </thead>
              <tbody>
                {results.map((item) => (
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
