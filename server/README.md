# KeystoneJS Server Scripts

This directory contains scripts responsible for initializing, configuring, and starting the KeystoneJS server. These scripts are orchestrated by `keystone.start()` to set up the underlying Express app, bind middleware, and start listening for connections.

## File Overview

### Server Initialization and Configuration

- **`server/createApp.js`**: The main script that creates and configures the Express app instance. It orchestrates the entire server setup process, binding all necessary middleware and configurations.

- **`server/initTrustProxy.js`**: Configures the `trust proxy` setting in Express, which is essential for applications running behind a reverse proxy.
  - **Options**: `trust proxy` (boolean)

- **`server/initViewEngine.js`**: Initializes the view engine (e.g., Pug, EJS) for rendering templates.
  - **Options**: `view engine` (string), `views` (string), `custom engine` (function)

- **`server/initViewLocals.js`**: Sets up `app.locals` for views, including default values for development environments.
  - **Options**: `locals` (object)

### Middleware Binding

- **`server/bindBodyParser.js`**: Binds `body-parser` middleware to handle JSON and URL-encoded request bodies, and configures `multer` for file uploads.
  - **Options**: `file limit` (string), `handle uploads` (boolean), `multer options` (object)

- **`server/bindSessionMiddleware.js`**: Binds session-related middleware, including cookie parsing, session persistence, and flash messages.
  - **Options**: `session` (boolean or function), `session options` (object), `cookie secret` (string)

- **`server/bindIPRestrictions.js`**: Binds middleware to restrict access to the application based on IP address ranges.
  - **Options**: `allowed ip ranges` (string or array)

- **`server/bindStaticMiddleware.js`**: Configures middleware to serve static assets like images, stylesheets, and client-side scripts.
  - **Options**: `static` (string or array), `static options` (object)

- **`server/bindLessMiddleware.js`**: Binds Keystone's local LESS compiler middleware for on-the-fly LESS to CSS compilation.
  - **Options**: `less` (string or array), `less options` (object)

- **`server/bindSassMiddleware.mts`**: Dynamically binds `node-sass-middleware` when a host app installs it, for on-the-fly SASS/SCSS to CSS compilation.
  - **Options**: `sass` (string or array), `sass options` (object)

- **`server/bindStylusMiddleware.js`**: Binds `stylus` middleware for on-the-fly Stylus to CSS compilation.
  - **Options**: `stylus` (string or array), `stylus options` (object)

### Error and Redirect Handling

- **`server/bindErrorHandlers.js`**: Binds custom 404 (Not Found) and 500 (Internal Server Error) handlers.
  - **Options**: `404` (function or string), `500` (function or string)

- **`server/bindRedirectsHandler.js`**: Binds a middleware to handle configured URL redirects.
  - **Usage**: `keystone.redirect(from, to)`

### Server Startup

- **`server/startHTTPServer.js`**: Starts the HTTP server on the configured port and host.
  - **Options**: `port` (number), `host` (string), `listen` (string)

- **`server/startSecureServer.js`**: Starts the secure (HTTPS/SPDY) server, handling SSL certificate loading and SNI.
  - **Options**: `ssl` (boolean or 'force'), `ssl port` (number), `ssl host` (string), `ssl key` / `ssl key data`, `ssl cert` / `ssl cert data`, `ssl ca` / `ssl ca data`, `ssl pfx` / `ssl pfx data`, `ssl passphrase` (string), `ssl sni` (function)

- **`server/startSocketServer.js`**: Starts the server on a Unix socket for inter-process communication.
  - **Options**: `unix socket` (string)

### SSL Configuration

- **`server/initSslRedirect.js`**: Sets up middleware to enforce SSL by redirecting HTTP requests to HTTPS.
  - **Options**: `ssl` ('force'), `ssl public port` (number)

- **`server/initLetsEncrypt.js`**: Configures Let's Encrypt for automatic SSL certificate generation and renewal.
  - **Options**: `letsencrypt` (object) with `email`, `domains`, `tos`, and `production` properties.

## Usage

These scripts are not intended to be used directly. They are all invoked as part of the `keystone.start()` method. To configure the server, you should use the various options available in the `keystone.init()` method.

For example, to configure a custom port and a 404 handler, you would do the following in your main KeystoneJS script:

```javascript
keystone.init({
  'port': 8080,
});

keystone.set('404', function(req, res, next) {
  res.status(404).send('Custom 404 Not Found');
});

keystone.start();
```
