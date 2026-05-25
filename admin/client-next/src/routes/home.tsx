import { createRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { Route as RootRoute } from './__root.js';
import { fetchCounts, getAdminLists, resolveListMeta } from '../api/list.js';
import type { AdminMetaResponse, AdminNavListMeta } from '../api/list.js';
import { useAdminMeta } from '../hooks/useList.js';
import { Layout } from '../components/Layout/Layout.js';
import { buildAdminNextPath, getBrandName } from '../adminNextPath.js';
import { requireAuth } from './requireAuth.js';
import styles from './home.module.css';

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/',
  beforeLoad: ({ context }) => requireAuth(context),
  component: HomePage,
});

interface DashboardList {
  key: string;
  path: string;
  label: string;
  count: number;
  singular?: string;
  plural?: string;
  nocreate: boolean;
  external: boolean;
}

interface DashboardSection {
  key: string;
  label: string;
  lists: DashboardList[];
}

function toTitleCase(str: string): string {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

function getDashboardLists(
  counts: Record<string, number>,
  metaLists: ReturnType<typeof getAdminLists>,
): DashboardList[] {
  if (metaLists.length > 0) {
    return metaLists.map((list) => {
      const path = list.path || list.key;
      return {
        key: list.key,
        path,
        label: list.label || toTitleCase(path),
        count: counts[list.key] ?? counts[path] ?? 0,
        singular: typeof list.singular === 'string' ? list.singular : undefined,
        plural: typeof list.plural === 'string' ? list.plural : undefined,
        nocreate: list.nocreate === true,
        external: false,
      };
    });
  }

  return Object.keys(counts).map((key) => ({
    key,
    path: key,
    label: toTitleCase(key),
    count: counts[key] ?? 0,
    nocreate: false,
    external: false,
  }));
}

function toDashboardList(
  counts: Record<string, number>,
  adminMeta: AdminMetaResponse | undefined,
  navList: AdminNavListMeta,
): DashboardList {
  const listMeta = resolveListMeta(adminMeta, navList.key || navList.path);
  const key = listMeta?.key ?? navList.key;
  const path = listMeta?.path ?? navList.path ?? key;
  const label = navList.label || listMeta?.label || toTitleCase(path);
  return {
    key,
    path,
    label,
    count: counts[key] ?? counts[path] ?? 0,
    singular: typeof listMeta?.singular === 'string' ? listMeta.singular : undefined,
    plural: typeof listMeta?.plural === 'string' ? listMeta.plural : undefined,
    nocreate: navList.external === true || listMeta?.nocreate === true,
    external: navList.external === true,
  };
}

function getDashboardSections(
  counts: Record<string, number>,
  adminMeta: AdminMetaResponse | undefined,
  fallbackLists: DashboardList[],
): DashboardSection[] {
  if (adminMeta === undefined || adminMeta.nav.flat === true || adminMeta.nav.sections === undefined) {
    return [{ key: 'all', label: '', lists: fallbackLists }];
  }

  const sections = adminMeta.nav.sections
    .map((section) => ({
      key: section.key,
      label: section.label,
      lists: (section.lists ?? [])
        .map((list) => toDashboardList(counts, adminMeta, list)),
    }))
    .filter((section) => section.lists.length > 0);

  if (adminMeta.orphanedLists.length > 0) {
    sections.push({
      key: 'other',
      label: 'Other',
      lists: adminMeta.orphanedLists
        .map((list) => toDashboardList(counts, adminMeta, list)),
    });
  }

  return sections.length > 0 ? sections : [{ key: 'all', label: '', lists: fallbackLists }];
}

function formatItemCount(list: DashboardList): string {
  const isSingle = list.count === 1;
  const singular = list.singular ?? 'Item';
  const plural = list.plural ?? 'Items';
  return `${list.count} ${isSingle ? singular : plural}`;
}

function HomePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['counts'],
    queryFn: fetchCounts,
  });
  const { data: adminMeta, isLoading: isMetaLoading } = useAdminMeta();

  const counts = data?.counts ?? {};
  const dashboardLists = getDashboardLists(counts, getAdminLists(adminMeta));
  const dashboardSections = getDashboardSections(counts, adminMeta, dashboardLists);
  const listKeys = dashboardLists.map((list) => list.path);

  return (
    <Layout listKeys={listKeys}>
      <h1 className={styles.heading}>{getBrandName()}</h1>
      {isLoading || isMetaLoading ? (
        <p>Loading…</p>
      ) : (
        <div className={styles.sections}>
          {dashboardSections.map((section) => (
            <section
              key={section.key}
              className={styles.section}
              data-section-label={section.label || undefined}
            >
              {section.label ? <h2 className={styles.sectionHeading}>{section.label}</h2> : null}
              <div className={styles.grid}>
                {section.lists.map((list) => {
                  const listHref = list.external ? list.path : buildAdminNextPath(`/${list.path}`);
                  const createHref = list.external ? '' : buildAdminNextPath(`/${list.path}/create`);
                  return (
                    <div
                      key={list.key}
                      className={styles.card}
                      data-dashboard-list
                      data-list-key={list.key}
                      data-list-path={list.path}
                      data-external={list.external ? 'true' : undefined}
                    >
                      <a
                        href={listHref}
                        className={styles.tileLink}
                        data-dashboard-list-manage
                        data-list-key={list.key}
                        data-list-path={list.path}
                        data-external={list.external ? 'true' : undefined}
                      >
                        <div className={styles.cardTitle}>{list.label}</div>
                        <div className={styles.cardCount} data-dashboard-list-count>
                          {formatItemCount(list)}
                        </div>
                      </a>
                      {list.nocreate ? null : (
                        <a
                          href={createHref}
                          className={styles.createButton}
                          title="Create"
                          aria-label={`Create ${list.singular ?? list.label}`}
                          data-dashboard-list-create
                          data-list-key={list.key}
                          data-list-path={list.path}
                          tabIndex={-1}
                        >
                          <span aria-hidden="true">+</span>
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </Layout>
  );
}
