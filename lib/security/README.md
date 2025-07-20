# Security Modules

This directory contains various security-related modules for KeystoneJS.

## CSRF Protection (`lib/security/csrf.js`)

Provides CSRF (Cross-Site Request Forgery) protection middleware. This is a critical security feature to prevent unauthorized commands from being performed on behalf of an authenticated user.

### Usage

The CSRF protection is enabled and used throughout the Admin UI to protect against malicious requests. It is automatically applied to all non-safe HTTP methods (e.g., POST, PUT, DELETE).

-   **Initialization:** The `init` middleware ensures that a CSRF token is generated and available for each request.
-   **Validation:** The `validate` middleware checks for a valid CSRF token on incoming requests.

The main consumer of this middleware is `server/createApp.js`, which applies it to the Express app.

## Frame Guard (`lib/security/frameGuard.js`)

Provides middleware to set the `X-Frame-Options` header, which protects against clickjacking attacks.

### Usage

The `frameGuard` middleware is enabled via the `frame guard` option in `keystone.js`. It is applied in `server/createApp.js`.

```javascript
keystone.set('frame guard', 'SAMEORIGIN');
```

## IP Range Restriction (`lib/security/ipRangeRestrict.js`)

Provides middleware to restrict access to the application based on the client's IP address. This is useful for limiting access to the Admin UI to a trusted network.

### Usage

The `ipRangeRestrict` middleware is enabled via the `ip range restrict` option in `keystone.js`. It is applied in `server/bindIPRestrictions.js`.

```javascript
keystone.set('ip range restrict', '127.0.0.1');
```

## Excel Value Escaping (`lib/security/escapeValueForExcel.js`)

Provides a utility function to escape values that are being exported to a CSV file. This prevents macro injection vulnerabilities in spreadsheet software like Microsoft Excel.

### Usage

This utility is used when generating CSV exports of list data. It is called from `lib/list/getCSVData.js` and `admin/server/api/download.js` to ensure that any values that could be interpreted as formulas are safely escaped.
