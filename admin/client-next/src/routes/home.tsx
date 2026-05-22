import { createRoute, redirect } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { Route as RootRoute } from './__root.js';
import { fetchCounts, getAdminLists } from '../api/list.js';
import { useAdminMeta } from '../hooks/useList.js';
import { Layout } from '../components/Layout/Layout.js';
import { buildAdminNextPath, getBrandName } from '../adminNextPath.js';
import styles from './home.module.css';

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/',
  beforeLoad: ({ context }) => {
    if (!context.isSessionLoading && !context.user) {
      throw redirect({ to: '/signin' });
    }
  },
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
      };
    });
  }

  return Object.keys(counts).map((key) => ({
    key,
    path: key,
    label: toTitleCase(key),
    count: counts[key] ?? 0,
    nocreate: false,
  }));
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
  const { data: adminMeta } = useAdminMeta();

  const counts = data?.counts ?? {};
  const dashboardLists = getDashboardLists(counts, getAdminLists(adminMeta));
  const listKeys = dashboardLists.map((list) => list.path);

  return (
    <Layout listKeys={listKeys}>
      <h1 className={styles.heading}>{getBrandName()}</h1>
      {isLoading ? (
        <p>Loading…</p>
      ) : (
        <div className={styles.grid}>
          {dashboardLists.map((list) => {
            const listHref = buildAdminNextPath(`/${list.path}`);
            const createHref = buildAdminNextPath(`/${list.path}/create`);
            return (
              <div
                key={list.key}
                className={styles.card}
                data-dashboard-list
                data-list-key={list.key}
                data-list-path={list.path}
              >
                <a
                  href={listHref}
                  className={styles.tileLink}
                  data-dashboard-list-manage
                  data-list-key={list.key}
                  data-list-path={list.path}
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
                    tabIndex={-1}
                  >
                    <span aria-hidden="true">+</span>
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}
