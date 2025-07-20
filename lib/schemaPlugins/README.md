# KeystoneJS Schema Plugins

This directory contains various schema plugins for KeystoneJS. These plugins can be used to add common functionality to your lists.

## Available Plugins

### `lib/schemaPlugins/autokey.js`

The `autokey` plugin automatically generates a unique key for a list based on the values of other fields. This is useful for creating human-readable URLs or identifiers.

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

### `lib/schemaPlugins/sortable.js`

The `sortable` plugin adds a `sortOrder` field to a list's schema and provides functionality to reorder documents.

**Usage:**

Enable the `sortable` plugin on your list:

```javascript
MyList.set('sortable', true);
```

### `lib/schemaPlugins/track.js`

The `track` plugin adds fields to a list's schema to track when a document is created and updated, and by whom.

**Usage:**

Enable the `track` plugin on your list:

```javascript
MyList.set('track', true);
```

You can also customize the fields:

```javascript
MyList.set('track', {
  createdAt: true,
  createdBy: true,
  updatedAt: true,
  updatedBy: true
});
```

### Methods

The `methods` directory contains plugins that add methods to your list's documents.

#### `lib/schemaPlugins/methods/getRelated.js`

The `getRelated` method is used to fetch and populate related data from other lists.

**Usage:**

```javascript
myDocument.getRelated('relatedField', function(err, relatedDocs) {
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
