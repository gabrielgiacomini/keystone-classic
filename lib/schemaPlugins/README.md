# KeystoneJS Schema Plugins

This directory contains various schema plugins for KeystoneJS. These plugins can be used to add common functionality to your lists.

## Available Plugins

### `lib/schemaPlugins/autokey.js`

The `autokey` plugin automatically generates a unique key for a list based on the values of other fields. This is useful for creating human-readable URLs or identifiers.

**Options:**

*   `from`: (String or Array) The field or fields to generate the key from.
*   `path`: (String) The path to store the generated key in.
*   `unique`: (Boolean or Object) Whether the key should be unique. Can be an object to specify additional uniqueness constraints.
*   `fixed`: (Boolean) If `true`, the key will not be updated after it has been set.
*   `locale`: (String) The locale to use for slug generation.
*   `ignoreIncompleteSource`: (Boolean) If `true`, a key will be generated even if the source fields are not all set. The legacy misspelling `ingoreIncompleteSource` is still accepted as an alias.

**Usage:**

```javascript
MyList.add({
  name: { type: String, required: true },
  key: { type: String, autokey: { from: 'name', path: 'key', unique: true } }
});
```

### `lib/schemaPlugins/history.js`

The `history` plugin enables document versioning by saving a revision of a document to a separate collection every time it is saved or removed.

**Usage:**

Enable the `history` plugin on your list:

```javascript
MyList.set('history', true);
```

This will create a `_revisions` collection for your list that stores the history of changes.

### `lib/schemaPlugins/sortable.js`

The `sortable` plugin adds a `sortOrder` field to a list's schema and provides functionality to reorder documents.

**Options:**

*   Can be set to `'unshift'` to add new items to the beginning of the list instead of the end.

**Usage:**

Enable the `sortable` plugin on your list:

```javascript
MyList.set('sortable', true);
```

### `lib/schemaPlugins/track.js`

The `track` plugin adds fields to a list's schema to track when a document is created and updated, and by whom.

**Options:**

Can be a boolean to enable all tracking fields, or an object to customize the fields:

*   `createdAt`: (Boolean or String) The path to store the creation timestamp. Defaults to `createdAt`.
*   `createdBy`: (Boolean or String) The path to store the user who created the document. Defaults to `createdBy`.
*   `updatedAt`: (Boolean or String) The path to store the update timestamp. Defaults to `updatedAt`.
*   `updatedBy`: (Boolean or String) The path to store the user who last updated the document. Defaults to `updatedBy`.

**Usage:**

Enable the `track` plugin on your list:

```javascript
MyList.set('track', true);
```

You can also customize the fields:

```javascript
MyList.set('track', {
  createdAt: 'createdOn',
  createdBy: 'author',
  updatedAt: 'updatedOn',
  updatedBy: 'editor'
});
```

### Methods

The `methods` directory contains plugins that add methods to your list's documents.

#### `lib/schemaPlugins/methods/getRelated.js`

The `getRelated` method is used to fetch and populate related data from other lists.

**Usage:**

```javascript
myDocument.getRelated('relatedField[name, email]', function(err, result) {
  // ...
});
```

#### `lib/schemaPlugins/methods/populateRelated.js`

The `populateRelated` method is a convenience method that fetches related data and populates it directly onto the document.

**Usage:**

```javascript
myDocument.populateRelated('relatedField', function(err, populatedDoc) {
  // ...
});
```

### Options

The `options` directory contains plugins that modify the behavior of your list's schema.

#### `lib/schemaPlugins/options/transform.js`

This transform function is used to modify the output of `toJSON` and `toObject` calls on a document. It ensures that any relationships that have been populated using `getRelated` or `populateRelated` are included in the output.

**Usage:**

This plugin is automatically applied when you use the `getRelated` or `populateRelated` methods.
