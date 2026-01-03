# LIB — CORE FRAMEWORK

Core modules for Keystone functionality. 81+ modules across 6 subsystems.

## STRUCTURE

```
lib/
├── core/           # Initialization & startup (20 modules)
├── list/           # List class methods (27 modules)
├── middleware/     # Express middleware (3 modules)
├── schemaPlugins/  # Mongoose plugins (6 modules)
├── security/       # Security utilities (4 modules)
├── storage/        # File storage adapters
├── content/        # Content management
├── list.js         # List class factory
├── fieldTypes.js   # Field type registry (lazy-loaded)
├── session.js      # Auth & session management
├── view.js         # View rendering helper
├── updateHandler.js# Form processing
├── updates.js      # Migration system
└── email.js        # Email wrapper
```

## WHERE TO LOOK

| Task | Files | Pattern |
|------|-------|---------|
| Add List method | `list/{method}.js` | Export function, attach to prototype |
| Add schema plugin | `schemaPlugins/{name}.js` | Mongoose plugin signature |
| Add security feature | `security/{name}.js` | Middleware or utility |
| Add storage adapter | `storage/adapters/{name}/` | Implement adapter interface |
| Modify startup | `core/start.js` | Hook orchestration |

## CONVENTIONS

### Module Patterns
```javascript
// Factory pattern (needs keystone instance)
module.exports = function(keystone) {
  return function methodName() { ... };
};

// Direct export (standalone)
module.exports = function methodName() { ... };
```

### List Method Addition
1. Create `lib/list/{methodName}.js`
2. Attach in `lib/list.js`: `List.prototype.methodName = require('./list/methodName');`

### Schema Plugin Pattern
```javascript
module.exports = function pluginName(schema, options) {
  schema.add({ ... });
  schema.pre('save', function(next) { ... });
};
```

## KEY FILES

| File | Lines | Responsibility |
|------|-------|----------------|
| `list.js` | 235 | List class factory, schema integration |
| `view.js` | 372 | Async queue (init→action→query→render) |
| `session.js` | 283 | Sign-in/out, cookies, keystoneAuth middleware |
| `updates.js` | 251 | Migration discovery & execution |
| `fieldTypes.js` | 100 | Lazy-load getter registry for 32 field types |

## ANTI-PATTERNS

- **Never** use `process.cwd()` — use `keystone.get('module root')`
- **Never** call `safeRequire` without error handling
- **Avoid** circular requires — export before attaching

## NOTES

- `safeRequire.js` handles optional dependencies gracefully
- `path.js` is for nested object paths, not filesystem paths
- All core/* modules are attached to Keystone.prototype in index.js
