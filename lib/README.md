# KeystoneJS Library

This directory contains the core library files for KeystoneJS. These modules provide the fundamental building blocks of a Keystone application, including data modeling, session management, file storage, and more.

## Core Modules

### `lib/list.js`

The `List` class is the heart of Keystone's data modeling. It is used to define the schema and behavior of your application's data models, which are analogous to tables or collections in a database.

**Supported Options:**

*   `schema`: Mongoose schema options.
*   `noedit`: Prevents editing of items in the Admin UI.
*   `nocreate`: Prevents creating new items in the Admin UI.
*   `nodelete`: Prevents deleting items in the Admin UI.
*   `autocreate`: Automatically creates the list if it doesn't exist.
*   `sortable`: Enables drag-and-drop sorting of items in the Admin UI.
*   `hidden`: Hides the list from the Admin UI navigation.
*   `track`: Automatically adds `createdAt`, `createdBy`, `updatedAt`, and `updatedBy` fields.
*   `inherits`: Inherits the schema from another list.
*   `perPage`: The number of items to display per page in the Admin UI.
*   `searchFields`: The fields to search when using the search bar in the Admin UI.
*   `searchUsesTextIndex`: Whether to use a text index for searching.
*   `defaultSort`: The default sort order for the list.
*   `defaultColumns`: The default columns to display in the Admin UI.

**Usage:**

```javascript
var keystone = require('keystone');
var Types = keystone.Field.Types;

var User = new keystone.List('User', {
    schema: {
        collection: 'users',
    },
    noedit: false,
    nocreate: false,
    nodelete: false,
    autocreate: true,
    sortable: true,
    hidden: false,
    track: true,
    inherits: false,
    perPage: 100,
    searchFields: 'name, email',
    searchUsesTextIndex: false,
    defaultSort: '-createdAt',
    defaultColumns: 'name, email',
});

User.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, unique: true, index: true },
	password: { type: Types.Password, initial: true, required: true },
});

User.register();
```

### `lib/storage/`

The `storage` directory contains the file storage adapters for Keystone. The `lib/storage/index.js` file defines the main `Storage` class, which manages file storage and adapters. The `lib/storage/adapters/fs/index.js` file implements the file system adapter, which allows Keystone to store and manage files on the local file system.

### `lib/fieldTypes.js`

This file serves as a central registry for all available field types in Keystone. It uses getters to lazy-load each field type, which improves startup performance by only loading the field types that are actually used.

### `lib/updateHandler.js`

The `UpdateHandler` class is a utility for processing and validating form data before updating a Keystone item. It is designed to be used in routes and controllers to handle the data submitted from forms, including file uploads.

### `lib/session.js`

This file provides session management functionalities for Keystone, including user sign-in, sign-out, and session persistence. It handles creating and verifying session cookies, and provides middleware for authenticating access to the Keystone Admin UI.

### `lib/path.js`

The `Path` class is a utility for working with nested object paths. This class provides methods for getting and setting values in nested objects using a dot-separated path string.

### `lib/updates.js`

This file implements the update application system for Keystone. It is responsible for discovering, validating, and applying application updates in a sequential and controlled manner. Updates are typically used for data migrations, and this module ensures they are applied only once and in the correct order.

### `lib/safeRequire.js`

This file provides a `safeRequire` function, a utility for safely requiring modules that may not be installed. It is used throughout Keystone to handle optional dependencies, providing helpful error messages to the user if a required package is missing.

### `lib/uploads.js`

This file provides functionalities for handling file uploads in Keystone. It integrates with the `multer` middleware to process multipart form data and makes uploaded files available in a structured format.

### `lib/view.js`

The `View` class is a powerful helper for managing the logic and rendering of views in a Keystone application. It provides a structured way to handle asynchronous operations, such as database queries, before rendering a template.

### `lib/schemaPlugins.js`

This file serves as a central export point for all schema plugins available in Keystone. Schema plugins are used to extend Mongoose schemas with additional functionality, such as tracking, history, and autokey generation.

### `lib/email.js`

This file defines the `Email` class, a wrapper around the `keystone-email` package that provides a simplified and integrated way to send emails from a Keystone application.
