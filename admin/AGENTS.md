# ADMIN — UI & API

React + Redux Admin UI with Express API backend.

## STRUCTURE

```
admin/
├── client/                 # React frontend
│   ├── App/                # Main application
│   │   ├── screens/        # Page components (Home, List, Item)
│   │   ├── components/     # Shared components
│   │   ├── shared/         # Cross-screen components
│   │   ├── elemental/      # Base UI library
│   │   ├── sagas/          # Redux-Saga effects
│   │   ├── parsers/        # Query parameter parsing
│   │   ├── store.js        # Redux store config
│   │   └── index.js        # Router setup
│   ├── Signin/             # Separate signin bundle
│   ├── utils/              # Client utilities
│   └── constants.js        # Colors, spacing, breakpoints
├── server/                 # Express backend
│   ├── api/                # REST endpoints
│   │   ├── session/        # Auth endpoints
│   │   ├── list/           # List CRUD
│   │   └── item/           # Item CRUD
│   ├── middleware/         # Express middleware
│   ├── routes/             # Page routes
│   └── app/                # Router factories
└── public/                 # Static assets
```

## CLIENT PATTERNS

### Screen Structure (Redux-connected)
```
screens/{ScreenName}/
├── index.js        # Main component, connect()
├── actions.js      # Action creators
├── reducer.js      # State reducer
├── constants.js    # Action type constants
└── components/     # Screen-specific components
```

### Redux Store
- **Middleware**: Thunk + Redux-Saga + React-Router-Redux
- **State Shape**: `{ lists, home, item, active }` per screen

### Component Conventions
- `React.createClass` (legacy, no hooks)
- `Glamor` for CSS-in-JS styling
- Field components in `fields/types/{name}/`

## SERVER PATTERNS

### API Endpoint Structure
```javascript
// admin/server/api/{resource}/{action}.js
module.exports = function(req, res) {
  var keystone = req.keystone;
  // ... logic
  res.apiResponse({ results: [...], count: N });
  // or
  res.apiError('message', { detail: 'info' });
};
```

### Middleware Chain
1. `bodyParser` (JSON, URL-encoded)
2. `multer` (file uploads)
3. `keystone` instance binding
4. `initList` (for /:list routes)
5. `apiError` handler

### API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/session` | Check auth status |
| POST | `/api/session/signin` | Login |
| POST | `/api/session/signout` | Logout |
| GET | `/api/:list` | List items (filter, sort, paginate) |
| POST | `/api/:list/create` | Create item |
| POST | `/api/:list/:id` | Update item |
| POST | `/api/:list/delete` | Delete items |
| GET | `/api/:list/export.:format` | Export CSV/JSON |
| GET | `/api/counts` | Dashboard counts |

## WHERE TO LOOK

| Task | Location |
|------|----------|
| Add dashboard widget | `client/App/screens/Home/` |
| Add list action | `client/App/screens/List/actions.js` |
| Add item form feature | `client/App/screens/Item/` |
| Add API endpoint | `server/api/{resource}/` |
| Add shared component | `client/App/shared/` |
| Modify styling | `client/constants.js` or component styles |

## CONVENTIONS

- **API responses**: `{ results: [], count: N }` or `{ error: 'message' }`
- **CSRF**: All POST requests validated
- **Flash messages**: Via `connect-flash`, displayed by `FlashMessages` component
- **Modal pattern**: Use `Popout` component from `shared/`

## ANTI-PATTERNS

- **Never** bypass CSRF in API routes
- **Avoid** direct DOM manipulation — use React state
- **Avoid** inline styles — use Glamor or elemental
