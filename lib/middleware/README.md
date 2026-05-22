# KeystoneJS Middleware

This directory contains middleware functions for use in KeystoneJS applications. These middleware are designed to be used with Express.

## `lib/middleware/api.js`

This middleware adds several helper methods to the `res` object to standardize JSON API responses. This is particularly useful for building a REST API with Keystone.

### Usage

To use this middleware, add it to your Express app before your API routes.

```javascript
var keystone = require('keystone');
var app = new (require('express'))();

// Add the API middleware
app.all('/api*', keystone.middleware.api);

// Example route
app.get('/api/posts', function(req, res) {
  // Example of a successful response
  res.apiResponse({ posts: [{ title: 'Hello World' }] });
});

app.get('/api/posts/:id', function(req, res) {
  // Example of a not found response
  if (!req.post) {
    return res.apiNotFound();
  }
  res.apiResponse({ post: req.post });
});

app.post('/api/posts', function(req, res) {
  // Example of a not allowed response
  if (!req.user.can.createPosts) {
    return res.apiNotAllowed('You are not allowed to create posts.');
  }
  // ...
});

app.put('/api/posts/:id', function(req, res) {
  // Example of an error response
  req.post.save(function(err) {
    if (err) {
      return res.apiError('database error', err);
    }
    res.apiResponse({ post: req.post });
  });
});
```

### Methods

#### `res.apiResponse(data)`

Sends a standard JSON response. If the `callback` query parameter is present, it will be treated as a JSONP request.

- `data` (Object): The data to be sent in the response.

#### `res.apiError(key, err, msg, code)`

Sends a JSON error response. This is useful for returning errors from your API.

- `key` (String): A short string identifying the error. Defaults to `'unknown error'`.
- `err` (Object): An optional error object to include in the response.
- `msg` (String): A more descriptive error message. Defaults to `'Error'`.
- `code` (Number): The HTTP status code to send. Defaults to `500`.

#### `res.apiNotFound(err, msg)`

A shortcut for `res.apiError` that sends a 404 Not Found response.

- `err` (Object): An optional error object.
- `msg` (String): An optional error message. Defaults to `'not found'`.

#### `res.apiNotAllowed(err, msg)`

A shortcut for `res.apiError` that sends a 403 Forbidden response.

- `err` (Object): An optional error object.
- `msg` (String): An optional error message. Defaults to `'not allowed'`.

## `lib/middleware/cors.js`

This middleware adds CORS (Cross-Origin Resource Sharing) headers to the response, allowing for cross-origin requests from web browsers.

### Usage

To use this middleware, add it to your Express app before your API routes. You can configure the options via `keystone.set()`.

```javascript
var keystone = require('keystone');
var app = new (require('express'))();

// Configure CORS options
keystone.set('cors allow origin', 'https://example.com');
keystone.set('cors allow methods', 'GET,POST,PUT,DELETE');
keystone.set('cors allow headers', 'Content-Type, Authorization');

// Add the CORS middleware
app.all('/api*', keystone.middleware.cors);

// Your API routes
// ...
```

### Options

The CORS middleware can be configured using `keystone.set()` with the following keys:

- `cors allow origin` (String | Boolean): Sets the `Access-Control-Allow-Origin` header.
  - If `true`, it will be set to `*`, allowing any origin.
  - If a string, it will be set to that string.
- `cors allow methods` (String): Sets the `Access-Control-Allow-Methods` header. Defaults to `'GET,PUT,POST,DELETE,OPTIONS'`.
- `cors allow headers` (String): Sets the `Access-Control-Allow-Headers` header. Defaults to `'Content-Type, Authorization'`.

## `lib/middleware/language.js`

This middleware detects the user's language preferences based on the `Accept-Language` header, a cookie, or a query parameter. It uses the `express-request-language` package.

### Usage

The language middleware is automatically added to the middleware stack when you initialize Keystone. You can configure it using the `language options` setting.

```javascript
keystone.init({
  // ...
  'language options': {
    'supported languages': ['en-US', 'es-ES', 'fr-FR'],
    'language cookie': 'my-keystone-app-language',
    'language cookie options': {
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      path: '/',
    },
    'language select url': '/change-language/{language}',
    'language query name': 'lang',
  }
});
```

### Options

- `supported languages` (Array): An array of language codes that your application supports. Defaults to `['en-US']`.
- `language cookie` (String): The name of the cookie used to store the user's language preference. Defaults to `'language'`.
- `language cookie options` (Object): Options for the language cookie (e.g., `maxAge`, `path`). Defaults to `{}`.
- `language select url` (String): A URL that can be used to set the language preference. The `{language}` placeholder will be replaced with the selected language code. Defaults to `'/languages/{language}'`.
- `language query name` (String): The name of the query parameter used to specify the language. Defaults to `'language'`.
