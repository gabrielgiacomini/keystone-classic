# KeystoneJS Server Scripts

This directory contains scripts responsible for initializing, configuring, and starting the KeystoneJS server. These scripts are orchestrated by `keystone.start()` to set up the underlying Express app, bind middleware, and start listening for connections.

## File Overview

### Server Initialization and Configuration

- **`server/createApp.js`**: The main script that creates and configures the Express app instance. It orchestrates the entire server setup process, binding all necessary middleware and configurations.
- **`server/initTrustProxy.js`**: Configures the `trust proxy` setting in Express, which is essential for applications running behind a reverse proxy.
- **`server/initViewEngine.js`**: Initializes the view engine (e.g., Pug, EJS) for rendering templates.
- **`server/initViewLocals.js`**: Sets up `app.locals` for views, including default values for development environments.

### Middleware Binding

- **`server/bindBodyParser.js`**: Binds `body-parser` middleware to handle JSON and URL-encoded request bodies, and configures `multer` for file uploads.
- **`server/bindSessionMiddleware.js`**: Binds session-related middleware, including cookie parsing, session persistence, and flash messages.
- **`server/bindIPRestrictions.js`**: Binds middleware to restrict access to the application based on IP address ranges.
- **`server/bindStaticMiddleware.js`**: Configures middleware to serve static assets like images, stylesheets, and client-side scripts.
- **`server/bindLessMiddleware.js`**: Binds `less-middleware` for on-the-fly LESS to CSS compilation.
- **`server/bindSassMiddleware.js`**: Binds `node-sass-middleware` for on-the-fly SASS/SCSS to CSS compilation.
- **`server/bindStylusMiddleware.js`**: Binds `stylus` middleware for on-the-fly Stylus to CSS compilation.

### Error and Redirect Handling

- **`server/bindErrorHandlers.js`**: Binds custom 404 (Not Found) and 500 (Internal Server Error) handlers.
- **`server/bindRedirectsHandler.js`**: Binds a middleware to handle configured URL redirects.

### Server Startup

- **`server/startHTTPServer.js`**: Starts the HTTP server on the configured port and host.
- **`server/startSecureServer.js`**: Starts the secure (HTTPS/SPDY) server, handling SSL certificate loading and SNI.
- **`server/startSocketServer.js`**: Starts the server on a Unix socket for inter-process communication.

### SSL Configuration

- **`server/initSslRedirect.js`**: Sets up middleware to enforce SSL by redirecting HTTP requests to HTTPS.
- **`server/initLetsEncrypt.js`**: Configures Let's Encrypt for automatic SSL certificate generation and renewal.

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
