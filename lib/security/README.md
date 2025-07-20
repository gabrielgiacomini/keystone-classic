# Security Modules

This directory contains various security-related modules for KeystoneJS. These modules provide essential security features like CSRF protection, clickjacking prevention, IP-based access control, and data sanitization.

## CSRF Protection (`lib/security/csrf.js`)

Provides CSRF (Cross-Site Request Forgery) protection middleware using the synchronizer token pattern. This is a critical security feature to prevent unauthorized commands from being performed on behalf of an authenticated user.

### How it Works

A unique, secret token is generated and stored in the user's session. For any state-changing request (e.g., POST, PUT, DELETE), this token must be included in the request (either in the body, query string, or headers). The middleware validates the token against the one stored in the session, rejecting any request where the token is missing or invalid.

### Usage

The CSRF protection is enabled by default and used throughout the Admin UI. It is automatically applied to all non-safe HTTP methods.

-   **Initialization:** The `middleware.init` function ensures that a CSRF token is generated and available for each request. It is added to `res.locals` and also sent as a cookie (`XSRF-TOKEN`).
-   **Validation:** The `middleware.validate` function checks for a valid CSRF token on incoming requests.

The main consumer of this middleware is `server/createApp.js`, which applies it to the Express app.

### Options

This module can be disabled for development purposes by setting the `DISABLE_CSRF` environment variable to `true`.

```
DISABLE_CSRF=true node keystone.js
```

**Note:** This should never be done in a production environment.

## Frame Guard (`lib/security/frameGuard.js`)

Provides middleware to set the `X-Frame-Options` header, which protects against clickjacking attacks by controlling whether the site can be embedded in an `<iframe>`, `<frame>`, `<embed>`, or `<object>`.

### Usage and Supported Options

The `frameGuard` middleware is configured via the `'frame guard'` option in your `keystone.js` file.

-   **`'deny'`**: Prevents the page from being displayed in a frame.

    ```javascript
    keystone.set('frame guard', 'deny');
    ```

-   **`'sameorigin'`**: Allows the page to be displayed in a frame on the same origin as the page itself. This is the recommended setting for most applications.

    ```javascript
    keystone.set('frame guard', 'sameorigin');
    ```

-   **`'allow-from <uri>'`**: Allows the page to be displayed in a frame on the specified URI.

    ```javascript
    keystone.set('frame guard', 'allow-from https://example.com/');
    ```

If the `'frame guard'` option is not set, the `X-Frame-Options` header will not be sent. This middleware is applied in `server/createApp.js`.

## IP Range Restriction (`lib/security/ipRangeRestrict.js`)

Provides middleware to restrict access to the application based on the client's IP address. This is useful for limiting access to the Admin UI to a trusted network.

### Usage and Supported Options

The `ipRangeRestrict` middleware is configured via the `'ip range restrict'` option in your `keystone.js` file. The option should be a string containing one or more CIDR ranges, separated by spaces or commas.

-   **Single IP Address:**

    ```javascript
    keystone.set('ip range restrict', '127.0.0.1');
    ```

-   **Multiple IP Addresses (comma-separated):**

    ```javascript
    keystone.set('ip range restrict', '127.0.0.1, 192.168.0.1');
    ```

-   **CIDR Range:**

    ```javascript
    keystone.set('ip range restrict', '192.168.0.0/16');
    ```

-   **Mixed IP Addresses and CIDR Ranges (space-separated):**

    ```javascript
    keystone.set('ip range restrict', '127.0.0.1 192.168.0.0/16');
    ```

This middleware is applied in `server/bindIPRestrictions.js`.

**Note:** For this middleware to work correctly behind a proxy, the Express `'trust proxy'` setting must be enabled.

## Excel Value Escaping (`lib/security/escapeValueForExcel.js`)

Provides a utility function to escape values that are being exported to a CSV file. This prevents macro injection vulnerabilities in spreadsheet software like Microsoft Excel, which can occur if data starting with characters like `=`, `+`, `-`, or `@` is interpreted as a formula.

### How it Works

The function checks if a value starts with one of the formula-triggering characters. If it does, it prepends a space to the value, which prevents Excel from treating it as a formula while generally preserving its numeric type.

### Usage

This utility is used automatically when generating CSV exports of list data. It is called from `lib/list/getCSVData.js` and `admin/server/api/download.js` to sanitize data before it is included in the CSV output. There is no special configuration required to use this feature.
