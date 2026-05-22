import { useCallback, useEffect, useMemo, useState } from 'react';
import { RouterProvider } from '@tanstack/react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { router } from './router.js';
import { queryClient } from './queryClient.js';
import { getSession, type SessionUser } from './api/session.js';
import type { AdminRouterContext } from './routes/__root.js';
import './styles/global.css';

type SessionState = Pick<AdminRouterContext, 'user' | 'isSessionLoading'>;

let sessionRequest: ReturnType<typeof getSession> | null = null;

function loadSession() {
  sessionRequest ??= getSession();
  return sessionRequest;
}

/**
 * Root component for the admin next app. Wires up the QueryClient
 * provider (TanStack Query) and the RouterProvider (TanStack Router).
 */
export default function App() {
  const [session, setSession] = useState<SessionState>({
    user: null,
    isSessionLoading: true,
  });

  const setSessionUser = useCallback((user: SessionUser | null) => {
    const nextSession: SessionState = {
      user,
      isSessionLoading: false,
    };

    router.update({
      ...router.options,
      context: {
        ...router.options.context,
        ...nextSession,
      },
    });
    setSession(nextSession);
  }, []);

  useEffect(() => {
    let cancelled = false;

    void loadSession()
      .then(({ user }) => {
        if (!cancelled) setSessionUser(user);
      })
      .catch(() => {
        if (!cancelled) setSessionUser(null);
      });

    return () => {
      cancelled = true;
    };
  }, [setSessionUser]);

  const routerContext = useMemo<AdminRouterContext>(
    () => ({
      ...session,
      setSessionUser,
    }),
    [session, setSessionUser],
  );

  return (
    <QueryClientProvider client={queryClient}>
      {session.isSessionLoading ? (
        <main aria-busy="true">Loading…</main>
      ) : (
        <RouterProvider router={router} context={routerContext} />
      )}
    </QueryClientProvider>
  );
}
