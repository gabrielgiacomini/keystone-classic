# KeystoneJS List Library

This directory contains the core functionality for KeystoneJS lists. Lists are the central concept in Keystone, and they are used to define the data models for your application.

## Files and Functionalities

### `lib/list/add.js`
Adds one or more fields to the list. This is the primary way to define the schema for a list.

### `lib/list/addFiltersToQuery.js`
Adds filters to a Mongoose query based on the list's fields.

### `lib/list/addSearchToQuery.js`
Adds a search query to a Mongoose query, using either a text index or regular expressions.

### `lib/list/apiForGet.js`
Returns JSON API middleware for a GET /:id endpoint, allowing for easy creation of API endpoints for your lists.

### `lib/list/automap.js`
Automatically maps a field path to itself if it is currently unmapped.

### `lib/list/buildSearchTextIndex.js`
Builds a text index definition for the list's search fields.

### `lib/list/declaresTextIndex.js`
Checks if a text index is defined in the current list schema.

### `lib/list/ensureTextIndex.js`
Ensures that a collection has an appropriate text index.

### `lib/list/expandColumns.js`
Expands a comma-separated string or array of columns into valid column objects.

### `lib/list/expandPaths.js`
Expands a comma-separated string or array of paths into valid path objects.

### `lib/list/expandSort.js`
Expands a sort string into a sort object.

### `lib/list/field.js`
Creates a new field at a specified path with the provided options.

### `lib/list/getAdminURL.js`
Gets the Admin URL to view the list or an item.

### `lib/list/getCSVData.js`
Gets the data from an item ready to be serialized to CSV for download.

### `lib/list/getData.js`
Gets the data from an item ready to be serialized for client-side use.

### `lib/list/getDocumentName.js`
Gets the name of a document from the correct path.

### `lib/list/getOptions.js`
Gets the options for the list, as used by the React components.

### `lib/list/getPages.js`
Generates an array of page numbers for pagination.

### `lib/list/getSearchFilters.js` (deprecated)
Gets filters for a Mongoose query that will search for the provided string.

### `lib/list/getUniqueValue.js`
Gets a unique value from a generator method by checking for documents with the same value.

### `lib/list/isReserved.js`
Checks whether a given path is a reserved path.

### `lib/list/map.js`
Maps a built-in field (e.g., name) to a specific path.

### `lib/list/paginate.js`
Gets a special Query object that will paginate documents in the list.

### `lib/list/processFilters.js` (deprecated)
Processes a filter string into a filters object.

### `lib/list/register.js`
Registers the list's schema with Mongoose and Keystone.

### `lib/list/relationship.js`
Registers relationships to this list defined on other lists.

### `lib/list/selectColumns.js`
Specifies select and populate options for a Mongoose query based on the provided columns.

### `lib/list/set.js`
Gets and sets list options.

### `lib/list/underscoreMethod.js`
Adds a method to the underscoreMethods collection on the list.

### `lib/list/updateItem.js`
Updates a Keystone item with new data.
