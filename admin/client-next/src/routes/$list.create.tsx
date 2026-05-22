/**
 * /{list}/create — legacy URL kept for backward compatibility.
 *
 * The create flow is now a modal overlay on the list view (parity with the
 * legacy admin). Anyone hitting the old dedicated /{list}/create URL is
 * forwarded to /{list}?create=true so the modal opens immediately.
 */
import { useEffect } from 'react';
import { createRoute, useNavigate } from '@tanstack/react-router';
import { Route as RootRoute } from './__root.js';
import { resolveListMeta } from '../api/list.js';
import { useAdminMeta } from '../hooks/useList.js';

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/$list/create',
  component: CreateRedirect,
});

function CreateRedirect() {
  const { list: routeList } = Route.useParams();
  const navigate = useNavigate();
  const { data: adminMeta } = useAdminMeta();
  const listMeta = resolveListMeta(adminMeta, routeList);
  const listPath = listMeta?.path ?? routeList;

  useEffect(() => {
    void navigate({
      to: '/$list',
      params: { list: listPath },
      search: { page: 1, search: '', sort: '', cols: '', create: true },
      replace: true,
    });
  }, [listPath, navigate]);

  return null;
}
