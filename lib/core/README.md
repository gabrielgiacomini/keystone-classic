# KeystoneJS Core Library

This directory contains the core functionalities of KeystoneJS. Below is a summary of each file's purpose and its role within the project.

### `closeDatabaseConnection.js`
- **Purpose:** Closes the connection to the MongoDB database.
- **Usage:** This is typically used during application shutdown to ensure a graceful disconnection from the database.

### `createItems.js`
- **Purpose:** Provides a function to bulk-create and link items across multiple lists.
- **Usage:** Useful for database seeding, running tests, or performing data migrations.

### `createKeystoneHash.js`
- **Purpose:** Generates a unique hash based on the Keystone version and list configurations.
- **Usage:** Can be used for cache-busting or as an identifier for the application's data model state.

### `createRouter.js`
- **Purpose:** A shorthand method for creating a new Express router.
- **Usage:** Simplifies the creation of custom route handlers within a Keystone application.

### `getOrphanedLists.js`
- **Purpose:** Retrieves lists that are not assigned to any navigation section.
- **Usage:** Useful for the Admin UI to display lists that haven't been explicitly organized in the navigation.

### `importer.js`
- **Purpose:** A utility for recursively importing modules from a directory.
- **Usage:** Useful for organizing routes, models, or other components into separate files and directories.

### `init.js`
- **Purpose:** Initializes a Keystone instance with a given set of options.
- **Usage:** The entry point for configuring the Keystone application.

### `initDatabaseConfig.js`
- **Purpose:** Sets up the MongoDB connection string if it hasn't been provided.
- **Usage:** Simplifies database configuration by using environment variables or default settings.

### `initExpressApp.js`
- **Purpose:** Initializes the Express application instance for Keystone.
- **Usage:** Creates or wraps an Express app and initializes necessary middleware.

### `initExpressSession.js`
- **Purpose:** Configures and initializes Express session management.
- **Usage:** Sets up session middleware with support for various session stores.

### `initNav.js`
- **Purpose:** Initializes the navigation structure for the Admin UI.
- **Usage:** Processes the `nav` option to build a structured navigation object.

### `list.js`
- **Purpose:** Retrieves a registered List by its key or path.
- **Usage:** A fundamental part of Keystone's data management for accessing list schemas and models.

### `openDatabaseConnection.js`
- **Purpose:** Handles the process of connecting to the MongoDB database.
- **Usage:** A critical part of the startup process to ensure the application is connected to its database.

### `options.js`
- **Purpose:** Contains methods for managing Keystone's configuration options.
- **Usage:** Used to set, get, and process various configuration options.

### `populateRelated.js`
- **Purpose:** Populates relationship fields on Mongoose documents.
- **Usage:** A convenient way to load related data for a document or an array of documents.

### `redirect.js`
- **Purpose:** Sets up URL redirections.
-_Usage:** Used to configure permanent (301) redirects for specific URLs.

### `start.js`
- **Purpose:** Configures and launches a Keystone application.
- **Usage:** Orchestrates the entire startup process, including database connections and server setup.

### `wrapHTMLError.js`
- **Purpose:** Generates a simple HTML response for displaying errors.
- **Usage:** A utility for creating user-friendly error pages.
