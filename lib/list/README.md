# KeystoneJS List Library

This directory contains the core functionality for KeystoneJS lists. Lists are the central concept in Keystone, and they are used to define the data models for your application. Each file in this directory provides a specific function that is attached to the List prototype.

## Files and Functionalities

### `lib/list/add.js`
Adds one or more fields to the list. This is the primary way to define the schema for a list. It supports adding fields with options, as well as UI hints like headings and indentation.

**Usage:**
```javascript
MyList.add({
  name: { type: Types.Name, required: true, index: true },
  email: { type: Types.Email, initial: true, required: true, index: true, unique: true },
  password: { type: Types.Password, initial: true, required: true },
});
```

### `lib/list/addFiltersToQuery.js`
Adds filters to a Mongoose query based on the list's fields. This is used internally by the Admin UI to filter items.

### `lib/list/addSearchToQuery.js`
Adds a search query to a Mongoose query, using either a text index or regular expressions. This is used by the Admin UI search functionality.

### `lib/list/apiForGet.js`
Returns JSON API middleware for a `GET /:id` endpoint, allowing for easy creation of API endpoints for your lists.

**Options:**
- `id`: The name of the express url param that contains the ID to get. Defaults to `id`.
- `query`: A function or object to modify the query.
- `transform`: A function to transform the object before it is sent as JSON.

**Usage:**
```javascript
app.get('/api/my-list/:id', keystone.middleware.api, MyList.apiForGet());
```

### `lib/list/automap.js`
Automatically maps a field path to itself if it is currently unmapped. This is used for fields that should be automatically mapped to a path, like `name`.

### `lib/list/buildSearchTextIndex.js`
Builds a text index definition for the list's search fields. This is used internally when `searchUsesTextIndex` is enabled.

### `lib/list/declaresTextIndex.js`
Checks if a text index is defined in the current list schema.

### `lib/list/ensureTextIndex.js`
Ensures that a collection has an appropriate text index. This is used to work around unreliable behavior with the Mongo driver's `ensureIndex()` method.

### `lib/list/expandColumns.js`
Expands a comma-separated string or array of columns into valid column objects. This is used by the Admin UI to display columns in the list view.

### `lib/list/expandPaths.js`
Expands a comma-separated string or array of paths into valid path objects.

### `lib/list/expandSort.js`
Expands a sort string into a sort object.

### `lib/list/field.js`
Creates a new field at a specified path with the provided options. This is the underlying method used by `List.add()`.

### `lib/list/getAdminURL.js`
Gets the Admin URL to view the list or an item.

### `lib/list/getCSVData.js`
Gets the data from an item ready to be serialized to CSV for download.

### `lib/list/getData.js`
Gets the data from an item ready to be serialized for client-side use, as used by the React components and the Admin API.

### `lib/list/getDocumentName.js`
Gets the name of a document from the correct path, as defined by the `namePath` option on the list.

### `lib/list/getOptions.js`
Gets the options for the list, as used by the React components in the Admin UI.

### `lib/list/getPages.js`
Generates an array of page numbers for pagination.

### `lib/list/getSearchFilters.js` (deprecated)
Gets filters for a Mongoose query that will search for the provided string. Use `addSearchToQuery` instead.

### `lib/list/getUniqueValue.js`
Gets a unique value from a generator method by checking for documents with the same value. This is useful for fields that need to be unique, like a slug.

### `lib/list/isReserved.js`
Checks whether a given path is a reserved path. This prevents overwriting of internal Keystone properties.

### `lib/list/map.js`
Maps a built-in field (e.g., `name`) to a specific path.

### `lib/list/paginate.js`
Gets a special Query object that will paginate documents in the list.

**Options:**
- `page`: The current page number.
- `perPage`: The number of items per page.
- `maxPages`: The maximum number of pages to display in the pagination.

**Usage:**
```javascript
MyList.paginate({
  page: req.query.page || 1,
  perPage: 10,
}).exec(function(err, results) {
  // ...
});
```

### `lib/list/processFilters.js` (deprecated)
Processes a filter string into a filters object. Use `addFiltersToQuery` instead.

### `lib/list/register.js`
Registers the list's schema with Mongoose and Keystone. This is a critical internal method that is called when Keystone is initialized.

### `lib/list/relationship.js`
Registers relationships to this list defined on other lists.

**Usage:**
```javascript
Post.relationship({ ref: 'User', path: 'author', refPath: 'posts' });
```

### `lib/list/selectColumns.js`
Specifies `select` and `populate` options for a Mongoose query based on the provided columns.

### `lib/list/set.js`
Gets and sets list options. This is used to configure the behavior of the list.

### `lib/list/underscoreMethod.js`
Adds a method to the `underscoreMethods` collection on the list, which is then added to the schema before the list is registered with Mongoose. This allows for adding custom methods to the `_` property of documents.

### `lib/list/updateItem.js`
Updates a Keystone item with new data. This handles field validation, updates, and error handling.
