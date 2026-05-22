# Cloudinary Field

Unified Cloudinary field type that replaces the separate `CloudinaryImage` and `CloudinaryImages` types.

## Overview

`Types.Cloudinary` handles both single-image and multi-image use cases through a single `multiple` option. Setting `multiple: false` (the default) stores a flat image object on the document. Setting `multiple: true` stores an array of image sub-documents, each exposing the same transformation methods as the single-image mode.

## Usage

```js
const keystone = require('keystone');
const Types = keystone.Field.Types;

Post.add({
  // Single image (default)
  coverImage: { type: Types.Cloudinary },

  // Multiple images
  gallery: { type: Types.Cloudinary, multiple: true },

  // Single image with a fixed upload folder
  avatar: { type: Types.Cloudinary, folder: 'avatars', autoCleanup: true },
});
```

## Options

| Option              | Type       | Default          | Description |
|---------------------|------------|------------------|-------------|
| `multiple`          | `Boolean`  | `false`          | When `true`, stores an array of image sub-documents instead of a flat object. |
| `folder`            | `String`   | —                | Custom Cloudinary folder for uploads. Honoured when `cloudinary folders` is set or the option is provided directly. |
| `autoCleanup`       | `Boolean`  | `false`          | Deletes the existing image(s) from Cloudinary before uploading a new one. |
| `secure`            | `Boolean`  | —                | Forces `https` Cloudinary URLs. Overrides the global `cloudinary secure` setting. |
| `filenameAsPublicID`| `Boolean`  | `false`          | Uses the original filename (without extension) as the Cloudinary `public_id`. Forces `whenExists: 'overwrite'`. |
| `publicID`          | `String`   | —                | Path to a field on the document whose value is used as the Cloudinary `public_id`. Single mode only, used in `getRequestHandler`. |
| `select`            | `Boolean`  | `false`          | Shows a select dropdown in the Admin UI listing existing Cloudinary images. |
| `selectPrefix`      | `String`   | —                | Filters the Admin UI select list to images whose `public_id` starts with this prefix. |
| `generateFilename`  | `Function` | random filename  | Custom function `(file, attempt, callback)` that generates a `public_id`. Single mode only. |
| `whenExists`        | `String`   | `'overwrite'`    | Strategy when a file with the same `public_id` already exists: `'overwrite'`, `'retry'`, or `'error'`. Single mode only. |
| `retryAttempts`     | `Number`   | `3`              | Number of retry attempts when `whenExists` is `'retry'`. Single mode only. |

## Schema paths (single mode)

`public_id`, `version`, `signature`, `format`, `resource_type`, `url`, `width`, `height`, `secure_url`

**Virtuals:** `exists` (Boolean), `folder` (String)

## Deprecated names

`Types.CloudinaryImage` and `Types.CloudinaryImages` continue to work but emit a `KS_DEPRECATED` process warning on construction. Both aliases will be removed in **v6**. Migrate to `Types.Cloudinary` with the appropriate `multiple` value.

```js
// Before (deprecated)
{ type: Types.CloudinaryImage }
{ type: Types.CloudinaryImages }

// After
{ type: Types.Cloudinary }
{ type: Types.Cloudinary, multiple: true }
```
