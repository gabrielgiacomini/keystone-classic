# SERVER — MIDDLEWARE & STARTUP

Express middleware binding and server startup. 18 modules orchestrated by `createApp.js`.

## STRUCTURE

```
server/
├── createApp.js            # Main orchestrator
├── init*.js                # Initialization functions (5)
│   ├── initTrustProxy.js
│   ├── initViewEngine.js
│   ├── initViewLocals.js
│   ├── initLetsEncrypt.js
│   └── initSslRedirect.js
├── bind*.js                # Middleware binding (9)
│   ├── bindBodyParser.js
│   ├── bindSessionMiddleware.js
│   ├── bindStaticMiddleware.js
│   ├── bindIPRestrictions.js
│   ├── bindLessMiddleware.js
│   ├── bindSassMiddleware.js
│   ├── bindStylusMiddleware.js
│   ├── bindRedirectsHandler.js
│   └── bindErrorHandlers.js
└── start*.js               # Server startup (3)
    ├── startHTTPServer.js
    ├── startSecureServer.js
    └── startSocketServer.js
```

## MIDDLEWARE ORDER (CRITICAL)

Defined in `createApp.js` — order matters:

1. **SSL/Security**: Let's Encrypt, SSL redirect
2. **Trust Proxy**: For reverse proxies
3. **View Engine**: Template setup
4. **IP Restrictions**: Allowlist/blocklist
5. **Compression**: Gzip
6. **`pre:static` hook**: User middleware
7. **Static Assets**: Favicon, Admin UI, CSS preprocessors
8. **Session**: Cookie parser, express-session, flash
9. **`pre:logger` hook**: User middleware
10. **Logging**: Morgan
11. **`pre:admin` hook**: User middleware
12. **Admin Routes**: Dynamic admin router
13. **`pre:bodyparser` hook**: User middleware
14. **Body Parser**: JSON, URL-encoded, method-override
15. **Language**: Locale detection
16. **Frame Guard**: Clickjacking protection
17. **`pre:routes` hook**: User middleware
18. **User Routes**: Application routes
19. **Redirects**: URL redirects
20. **`pre:error` hook**: User middleware
21. **Error Handlers**: 404, 500

## PATTERNS

### Middleware Binding Function
```javascript
// server/bind{Feature}.js
module.exports = function bind{Feature}(keystone, app) {
  if (keystone.get('feature enabled')) {
    app.use(require('middleware')({
      option: keystone.get('feature option')
    }));
  }
};
```

### Init Function
```javascript
// server/init{Feature}.js
module.exports = function init{Feature}(keystone, app) {
  var setting = keystone.get('setting');
  if (setting) {
    app.set('property', value);
  }
};
```

### Server Startup
```javascript
// server/start{Type}Server.js
module.exports = function start{Type}Server(keystone, app, callback) {
  var server = http.createServer(app);
  server.listen(keystone.get('port'), callback);
  return server;
};
```

## HOOKS FOR CUSTOMIZATION

| Hook | When | Use Case |
|------|------|----------|
| `pre:static` | Before static middleware | Custom static handling |
| `pre:logger` | Before Morgan | Custom logging |
| `pre:admin` | Before admin routes | Admin customization |
| `pre:bodyparser` | Before body parsing | Raw body access |
| `pre:routes` | Before user routes | Global middleware |
| `pre:error` | Before error handlers | Custom error handling |

### Usage
```javascript
keystone.pre('routes', function(req, res, next) {
  // Custom middleware
  next();
});
```

## KEY OPTIONS

| Option | Default | Purpose |
|--------|---------|---------|
| `compress` | true | Enable gzip |
| `logger` | ':method :url :status' | Morgan format |
| `ssl` | false | 'force', true, or false |
| `trust proxy` | false | Enable for reverse proxy |
| `frame guard` | 'sameorigin' | X-Frame-Options |
| `headless` | false | Disable Admin UI |

## ANTI-PATTERNS

- **Never** modify middleware order without understanding dependencies
- **Never** add middleware after error handlers
- **Avoid** blocking operations in middleware — use async patterns
