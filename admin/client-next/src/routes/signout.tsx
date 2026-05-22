import { createRoute, redirect } from '@tanstack/react-router';
import { signout } from '../api/session.js';
import { Route as RootRoute } from './__root.js';

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/signout',
  beforeLoad: async ({ context }) => {
    try {
      await signout();
    } finally {
      context.setSessionUser(null);
    }

    throw redirect({ to: '/signin' });
  },
});
