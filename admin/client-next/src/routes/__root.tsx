import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import type { SessionUser } from '../api/session.js';

export interface AdminRouterContext {
  user: SessionUser | null;
  isSessionLoading: boolean;
  setSessionUser: (user: SessionUser | null) => void;
}

export const Route = createRootRouteWithContext<AdminRouterContext>()({
  component: RootLayout,
});

function RootLayout() {
  const { isSessionLoading } = Route.useRouteContext();

  if (isSessionLoading) {
    return <main aria-busy="true">Loading…</main>;
  }

  return <Outlet />;
}
