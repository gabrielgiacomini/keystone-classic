# KeystoneJS Core Library

This directory, `lib/core`, contains the essential functionalities of KeystoneJS. These files manage everything from application initialization and server configuration to database interactions and request handling.

## Files Edited in This Directory

The following files in this directory have been updated with comprehensive JSDoc documentation:

- `closeDatabaseConnection.js`
- `createItems.js`
- `createKeystoneHash.js`
- `createRouter.js`
- `getOrphanedLists.js`
- `importer.js`
- `init.js`
- `initDatabaseConfig.js`
- `initExpressApp.js`
- `initExpressSession.js`
- `initNav.js`
- `list.js`
- `openDatabaseConnection.js`
- `options.js`
- `populateRelated.js`
- `redirect.js`
- `start.js`
- `wrapHTMLError.js`

## Core Functionalities and Usage

Below is a detailed description of each file's purpose and its role within the KeystoneJS project.

### `lib/core/init.js`
- **Purpose:** Initializes a Keystone instance with a given set of options.
- **Usage:** This is the primary entry point for configuring the Keystone application. It is where you define your application's name, database connection, and other critical settings.
- **Supported Options:** Accepts an object with various configuration keys, such as `name`, `brand`, `mongo`, `auth`, `user model`, and `nav`.

### `lib/core/options.js`
- **Purpose:** Contains methods for managing Keystone's configuration options.
- **Usage:** Provides `set`, `get`, `options`, and `getPath` methods to manage application settings. These methods are used internally to handle the options passed to `init.js`.

### `lib/core/start.js`
- **Purpose:** Configures and launches a Keystone application.
- **Usage:** This function orchestrates the entire startup process, including initializing the Express app, connecting to the database, and starting the server. It supports lifecycle events like `onStart` and `onMount`.

### `lib/core/initExpressApp.js`
- **Purpose:** Initializes the Express application instance for Keystone.
- **Usage:** Creates a new Express app or wraps a custom one, and applies essential middleware for sessions, routing, and error handling.

### `lib/core/initExpressSession.js`
- **Purpose:** Configures and initializes Express session management.
- **Usage:** Sets up the session middleware, with support for various session stores like `connect-mongo` and `connect-redis`. This is crucial for authentication and user management.
- **Supported Options:** `session store`, `session store options`, `cookie secret`.

### `lib/core/createRouter.js`
- **Purpose:** A shorthand method for creating a new Express router.
- **Usage:** Simplifies the creation of custom route handlers, allowing for modular and organized routing within a Keystone application.

### `lib/core/redirect.js`
- **Purpose:** Sets up URL redirections.
- **Usage:** Used to configure permanent (301) redirects for specific URLs. This is useful for handling moved content, legacy URLs, or other routing requirements.

### `lib/core/wrapHTMLError.js`
- **Purpose:** Generates a simple HTML response for displaying errors.
- **Usage:** A utility for creating user-friendly error pages, often used for 404 (Not Found) or other HTTP error responses.

### `lib/core/openDatabaseConnection.js`
- **Purpose:** Handles the process of connecting to the MongoDB database.
- **Usage:** A critical part of the startup process that ensures the application is connected to its database before it starts accepting requests. Supports replica sets and custom MongoDB options.

### `lib/core/closeDatabaseConnection.js`
- **Purpose:** Closes the connection to the MongoDB database.
- **Usage:** This is typically used during application shutdown to ensure a graceful disconnection from the database, preventing resource leaks.

### `lib/core/initDatabaseConfig.js`
- **Purpose:** Sets up the MongoDB connection string if it has not been provided.
- **Usage:** Simplifies database configuration by automatically detecting the connection string from environment variables (e.g., `MONGO_URI`, `MONGODB_URI`) or using default settings.

### `lib/core/list.js`
- **Purpose:** Retrieves a registered Keystone List by its key or path.
- **Usage:** A fundamental part of Keystone's data management, providing access to the schema and model for a specific data structure.

### `lib/core/createItems.js`
- **Purpose:** Provides a function to bulk-create and link items across multiple lists.
- **Usage:** Extremely useful for database seeding, running automated tests, or performing data migrations. It can handle relationships between items, even when they are created in the same operation.

### `lib/core/populateRelated.js`
- **Purpose:** Populates relationship fields on Mongoose documents.
- **Usage:** A convenient way to load related data for a single document or an array of documents, simplifying the process of working with related data.

### `lib/core/getOrphanedLists.js`
- **Purpose:** Retrieves lists that are not assigned to any navigation section.
- **Usage:** Primarily used by the Admin UI to display lists that have been defined but not explicitly organized in the main navigation structure.

### `lib/core/initNav.js`
- **Purpose:** Initializes the navigation structure for the Admin UI.
- **Usage:** Processes the `nav` option from the Keystone configuration to build a structured navigation object, which determines how lists are grouped and displayed in the sidebar.

### `lib/core/importer.js`
- **Purpose:** A utility for recursively importing modules from a directory.
- **Usage:** Useful for organizing routes, models, or other components into separate files and directories, which are then loaded into the application.

### `lib/core/createKeystoneHash.js`
- **Purpose:** Generates a unique hash based on the Keystone version and list configurations.
- **Usage:** This hash can be used for cache-busting or as a quick identifier for the current state of the application's data model, helping to detect changes that might require invalidating caches.
