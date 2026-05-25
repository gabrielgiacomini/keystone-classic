import { redirect } from '@tanstack/react-router';
import type { AdminRouterContext } from './__root.js';

export function requireAuth(context: AdminRouterContext): void {
  if (!context.isSessionLoading && !context.user) {
    throw redirect({ to: '/signin' });
  }
}
