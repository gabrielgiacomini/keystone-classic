# KeystoneJS Middleware

This directory contains middleware functions for use in KeystoneJS applications.

## `lib/middleware/api.js`

This middleware adds several helper methods to the `res` object to standardize JSON API responses.

### Usage

```javascript
app.all('/api*', keystone.middleware.api);
```

### Methods

* `res.apiResponse(data)`: Sends a JSON response.
* `res.apiError(key, err, msg, code)`: Sends a JSON error response.
* `res.apiNotFound(err, msg)`: Sends a 404 Not Found response.
* `res.apiNotAllowed(err, msg)`: Sends a 403 Not Allowed response.

## `lib/middleware/cors.js`

This middleware adds CORS headers to the response, allowing for cross-origin requests. It can be configured using `keystone.get` options.

### Usage

```javascript
app.all('/api*', keystone.middleware.cors);
```

### Options

* `cors allow origin`: (String or Boolean) Sets the `Access-Control-Allow-Origin` header.
* `cors allow methods`: (String) Sets the `Access-Control-Allow-Methods` header.
* `cors allow headers`: (String) Sets the `Access-Control-Allow-Headers` header.

## `lib/middleware/language.js`

This middleware detects the user's language preferences based on the `Accept-Language` header, a cookie, or a query parameter. It uses the `express-request-language` package.

### Usage

The language middleware is typically used early in the middleware stack:

```javascript
keystone.init({
	// ...
	'language options': {
		'supported languages': ['en-US', 'es-ES'],
	}
});

// ...

app.use(keystone.middleware.language);
```

The middleware is actually applied in `server/createApp.js`, so you don't need to add it manually.
