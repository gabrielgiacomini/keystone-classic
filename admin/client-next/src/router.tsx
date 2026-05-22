import { createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.js';
import type { AdminRouterContext } from './routes/__root.js';
import { getAdminNextBasepath } from './adminNextPath.js';

const initialRouterContext: AdminRouterContext = {
  user: null,
  isSessionLoading: true,
  setSessionUser: () => undefined,
};

export const router = createRouter({
  routeTree,
  basepath: getAdminNextBasepath(),
  context: initialRouterContext,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
