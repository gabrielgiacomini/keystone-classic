# KeystoneJS Library

This directory contains the core library files for KeystoneJS. These modules provide the fundamental building blocks of a Keystone application, including data modeling, session management, file storage, and more.

## Core Modules

### `list.js`

The `List` class is the heart of Keystone's data modeling. It is used to define the schema and behavior of your application's data models, which are analogous to tables or collections in a database.

**Usage:**

```javascript
var keystone = require('keystone');
var Types = keystone.Field.Types;

var User = new keystone.List('User');

User.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, unique: true, index: true },
	password: { type: Types.Password, initial: true, required: true },
});

User.register();
```

### `storage/`

The `storage` directory contains the file storage adapters for Keystone. The `storage/index.js` file defines the main `Storage` class, which manages file storage and adapters. The `storage/adapters/fs/index.js` file implements the file system adapter, which allows Keystone to store and manage files on the local file system.

### `fieldTypes.js`

This file serves as a central registry for all available field types in Keystone. It uses getters to lazy-load each field type, which improves startup performance by only loading the field types that are actually used.

### `updateHandler.js`

The `UpdateHandler` class is a utility for processing and validating form data before updating a Keystone item. It is designed to be used in routes and controllers to handle the data submitted from forms, including file uploads.

### `session.js`

This file provides session management functionalities for Keystone, including user sign-in, sign-out, and session persistence. It handles creating and verifying session cookies, and provides middleware for authenticating access to the Keystone Admin UI.

### `path.js`

The `Path` class is a utility for working with nested object paths. This class provides methods for getting and setting values in nested objects using a dot-separated path string.

### `updates.js`

This file implements the update application system for Keystone. It is responsible for discovering, validating, and applying application updates in a sequential and controlled manner. Updates are typically used for data migrations, and this module ensures they are applied only once and in the correct order.

### `safeRequire.js`

This file provides a `safeRequire` function, a utility for safely requiring modules that may not be installed. It is used throughout Keystone to handle optional dependencies, providing helpful error messages to the user if a required package is missing.

### `uploads.js`

This file provides functionalities for handling file uploads in Keystone. It integrates with the `multer` middleware to process multipart form data and makes uploaded files available in a structured format.

### `view.js`

The `View` class is a powerful helper for managing the logic and rendering of views in a Keystone application. It provides a structured way to handle asynchronous operations, such as database queries, before rendering a template.

### `schemaPlugins.js`

This file serves as a central export point for all schema plugins available in Keystone. Schema plugins are used to extend Mongoose schemas with additional functionality, such as tracking, history, and autokey generation.

### `email.js`

This file defines the `Email` class, a wrapper around the `keystone-email` package that provides a simplified and integrated way to send emails from a Keystone application.
