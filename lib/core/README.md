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

Below is a detailed description of each file's purpose, supported options, and usage examples.

### `lib/core/init.js`
- **Purpose:** Initializes a Keystone instance with a given set of options.
- **Usage:** This is the primary entry point for configuring the Keystone application.
- **Supported Options:** Accepts an object with various configuration keys, such as `name`, `brand`, `mongo`, `auth`, `user model`, and `nav`.
- **Example:**
  ```javascript
  const keystone = require('keystone');
  keystone.init({
    'name': 'My Awesome App',
    'brand': 'My Brand',
    'mongo': 'mongodb://localhost/my-db',
  });
  ```

### `lib/core/options.js`
- **Purpose:** Contains methods for managing Keystone's configuration options.
- **Usage:** Provides `set`, `get`, `options`, and `getPath` methods to manage application settings.
- **Example:**
  ```javascript
  keystone.set('name', 'My Awesome Website');
  const appName = keystone.get('name');
  ```

### `lib/core/start.js`
- **Purpose:** Configures and launches a Keystone application.
- **Usage:** Orchestrates the startup process, including database connections and server setup.
- **Supported Options:** `onStart`, `onMount`, `onHttpServerCreated`, `onHttpsServerCreated`, `onSocketServerCreated`.
- **Example:**
  ```javascript
  keystone.start({
    onStart: () => {
      console.log('Keystone has started!');
    },
  });
  ```

### `lib/core/initExpressApp.js`
- **Purpose:** Initializes the Express application instance for Keystone.
- **Usage:** Creates or wraps an Express app and applies essential middleware.
- **Example:**
  ```javascript
  // Basic initialization
  keystone.initExpressApp();

  // Using a custom Express app
  const myApp = require('express')();
  keystone.initExpressApp(myApp);
  ```

### `lib/core/initExpressSession.js`
- **Purpose:** Configures and initializes Express session management.
- **Usage:** Sets up session middleware, crucial for authentication.
- **Supported Options:** `session store`, `session store options`, `cookie secret`.

### `lib/core/createRouter.js`
- **Purpose:** A shorthand method for creating a new Express router.
- **Usage:** Simplifies the creation of custom route handlers.
- **Example:**
  ```javascript
  const apiRouter = keystone.createRouter();
  apiRouter.get('/users', (req, res) => {
    res.json({ users: [] });
  });
  keystone.app.use('/api', apiRouter);
  ```

### `lib/core/redirect.js`
- **Purpose:** Sets up URL redirections.
- **Usage:** Used to configure permanent (301) redirects.
- **Example:**
  ```javascript
  keystone.redirect('/old-url', '/new-url');
  ```

### `lib/core/wrapHTMLError.js`
- **Purpose:** Generates a simple HTML response for displaying errors.
- **Usage:** A utility for creating user-friendly error pages.
- **Example:**
  ```javascript
  const errorHtml = keystone.wrapHTMLError('Page Not Found', 'The requested page does not exist.');
  res.status(404).send(errorHtml);
  ```

### `lib/core/openDatabaseConnection.js`
- **Purpose:** Handles the process of connecting to the MongoDB database.
- **Usage:** A critical part of the startup process.
- **Example:**
  ```javascript
  keystone.openDatabaseConnection(() => {
    console.log('Successfully connected to the database.');
  });
  ```

### `lib/core/closeDatabaseConnection.js`
- **Purpose:** Closes the connection to the MongoDB database.
- **Usage:** Ensures a graceful disconnection from the database.
- **Example:**
  ```javascript
  keystone.closeDatabaseConnection(() => {
    console.log('Database connection closed.');
  });
  ```

### `lib/core/initDatabaseConfig.js`
- **Purpose:** Sets up the MongoDB connection string if not provided.
- **Usage:** Simplifies database configuration using environment variables or defaults.

### `lib/core/list.js`
- **Purpose:** Retrieves a registered Keystone List by its key or path.
- **Usage:** A fundamental part of Keystone's data management.
- **Example:**
  ```javascript
  const User = keystone.list('User');
  User.model.find().exec((err, users) => {
    console.log(users);
  });
  ```

### `lib/core/createItems.js`
- **Purpose:** Provides a function to bulk-create and link items across multiple lists.
- **Usage:** Useful for database seeding, testing, and data migrations.

### `lib/core/populateRelated.js`
- **Purpose:** Populates relationship fields on Mongoose documents.
- **Usage:** A convenient way to load related data.
- **Example:**
  ```javascript
  keystone.populateRelated(myPost, 'author categories', (err) => { ... });
  ```

### `lib/core/getOrphanedLists.js`
- **Purpose:** Retrieves lists not assigned to any navigation section.
- **Usage:** Useful for the Admin UI.
- **Example:**
  ```javascript
  const orphanedLists = keystone.getOrphanedLists();
  orphanedLists.forEach(list => {
    console.log(`Orphaned list: ${list.label}`);
  });
  ```

### `lib/core/initNav.js`
- **Purpose:** Initializes the navigation structure for the Admin UI.
- **Usage:** Processes the `nav` option to build a structured navigation object.

### `lib/core/importer.js`
- **Purpose:** A utility for recursively importing modules from a directory.
- **Usage:** Useful for organizing routes, models, and other components.
- **Example:**
  ```javascript
  const importRoutes = keystone.importer(__dirname);
  const routes = {
    site: importRoutes('./site'),
    api: importRoutes('./api')
  };
  ```

### `lib/core/createKeystoneHash.js`
- **Purpose:** Generates a unique hash based on the Keystone version and list configurations.
- **Usage:** Can be used for cache-busting.
- **Example:**
  ```javascript
  const appHash = keystone.createKeystoneHash();
  console.log(`Application hash: ${appHash}`);
  ```
