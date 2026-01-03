# KEYSTONE-CLASSIC KNOWLEDGE BASE

**Generated:** 2026-01-03  
**Commit:** adf9d7c1  
**Branch:** 2025-01-02  
**Status:** Archived (v4) — Use Keystone 6 for new projects

## OVERVIEW

Node.js CMS framework built on Express + Mongoose. Singleton pattern exports `keystone` instance. Auto-generates Admin UI from data models (Lists).

## STRUCTURE

```
keystone-classic/
├── index.js          # Main entry, Keystone singleton + exports
├── lib/              # Core framework (81+ modules)
│   ├── core/         # Init, start, db connection (20 modules)
│   ├── list/         # List class methods (27 modules)
│   ├── middleware/   # API, CORS, language
│   ├── schemaPlugins/# Mongoose plugins (autokey, history, track)
│   ├── security/     # CSRF, frameGuard, IP restrict
│   └── storage/      # File storage adapters
├── fields/           # 32 field types + base classes
│   ├── types/        # Field implementations (4-part pattern)
│   └── utils/        # Field utilities
├── admin/            # Admin UI
│   ├── client/       # React + Redux frontend
│   └── server/       # Express API routes
├── server/           # Server middleware (18 modules)
└── test/             # Mocha + Nightwatch tests
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Add data model | `keystone.list('Name', {...})` | See lib/list.js |
| Create field type | `fields/types/{name}/` | 4 files: Type, Field, Column, Filter |
| Add API endpoint | `admin/server/api/` | Follow existing patterns |
| Custom middleware | `keystone.pre('routes', fn)` | Hook system via GrapplingHook |
| Database migrations | `updates/` directory | Numbered JS files (0.0.1-migration.js) |
| Storage adapter | `lib/storage/adapters/` | Implement adapter interface |
| Schema plugin | `lib/schemaPlugins/` | Mongoose plugin pattern |

## CONVENTIONS

### Naming
- **Classes**: PascalCase (`Keystone`, `List`, `Storage`)
- **Field types**: lowercase function (`function text()`) with `properName` property
- **Files**: PascalCase for components (`TextField.js`), lowercase for utilities

### Indentation
- **JS**: Tabs (2-space width)
- **JSON/YAML**: 2 spaces

### Exports
- Factory pattern for modules needing `keystone`: `module.exports = function(keystone) { return Class; }`
- Singleton export for main entry: `module.exports = new Keystone()`
- Lazy-load getters for field types registry

### Documentation
- JSDoc with `@fileoverview`, `@module`, `@requires`, `@see`
- Comprehensive parameter docs

## ANTI-PATTERNS (FORBIDDEN)

| Pattern | Location | Reason |
|---------|----------|--------|
| `DISABLE_CSRF=true` in production | lib/security/csrf.js | CRITICAL security bypass |
| Modify `_id` schema options | List options | Keystone requires default behavior |
| Nested list inheritance | lib/list.js | Only one level of inheritance allowed |
| `process.cwd()` for paths | index.js | Breaks module encapsulation |

## CRITICAL WARNINGS

1. **CSRF**: `DISABLE_CSRF` env var must NEVER be set in production
2. **Race condition**: `getUniqueValue()` has race condition — use DB unique index + error handling
3. **Deprecated**: Array-based logo format → use object format
4. **Global pollution**: AzureFile overwrites global env (known issue)

## COMMANDS

```bash
# Development
npm run build-dev       # Browserify bundle (dev)
npm run watch           # Lint on file changes
npm run fields-explorer # Field types explorer

# Testing
npm test                # Unit + admin tests
npm run test-unit       # Unit tests only
npm run test-e2e        # E2E with Nightwatch

# Production
npm run build           # Minified bundle
npm run lint            # ESLint check
```

## ARCHITECTURE DECISIONS

- **Singleton**: Single Keystone instance per app — testing requires cleanup
- **GrapplingHook**: Event-driven middleware via pre:* hooks
- **Lazy loading**: Field types loaded on first access
- **Circular deps**: Exports BEFORE attaching classes (see index.js:229)
- **Browserify**: Client bundle (legacy, not Webpack)

## STARTUP FLOW

```
keystone.init(options)
  → lib/core/init.js → options()

keystone.start()
  → lib/core/start.js
    → initExpressApp() → server/createApp.js
      → Middleware chain (14+ bind* functions)
    → openDatabaseConnection()
    → startHTTPServer() / startSecureServer()
```

## ENV VARIABLES

| Variable | Purpose |
|----------|---------|
| `NODE_ENV=production` | Production optimizations |
| `KEYSTONE_DEV=true` | Admin UI file watching |
| `KEYSTONE_PREBUILD_ADMIN=true` | Pre-build admin bundle |
| `COOKIE_SECRET` | Session cookie secret |
| `MONGO_URI` / `MONGODB_URI` | Database connection |

## NOTES

- **React 15.4.2**: Legacy React, no hooks
- **Mongoose 5.x**: Not latest Mongoose
- **No TypeScript source**: JS with separate .d.ts files
- **Multiple CSS preprocessors**: LESS, Sass, Stylus all supported
