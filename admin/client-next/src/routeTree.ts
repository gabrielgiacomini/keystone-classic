import { Route as RootRoute } from './routes/__root.js';
import { Route as HomeRoute } from './routes/home.js';
import { Route as SigninRoute } from './routes/signin.js';
import { Route as SignoutRoute } from './routes/signout.js';
import { Route as ListRoute } from './routes/$list.js';
import { Route as CreateRoute } from './routes/$list.create.js';
import { Route as ItemEditRoute } from './routes/$list.$id.js';

export const routeTree = RootRoute.addChildren([
  HomeRoute,
  SigninRoute,
  SignoutRoute,
  ListRoute,
  CreateRoute,
  ItemEditRoute,
]);
