# KeystoneJS Content Management System

This directory, `lib/content`, houses the core components of the KeystoneJS content management system. It provides a flexible and extensible framework for defining, managing, and retrieving structured content for your application.

## Core Concepts

The content management system is built around these fundamental concepts:

- **Pages:** A `Page` is a logical container for a specific content structure. It could represent a homepage, a blog post, a contact page, or any other content entity. Each page is uniquely identified by a key and contains a set of fields.

- **Fields:** Fields define the individual pieces of data within a page. KeystoneJS supports a variety of field types, including simple text, rich HTML, numbers, dates, and more.

- **Content Types:** Content types define the behavior, validation rules, and data handling for different kinds of content. The base `Type` class provides a foundation for creating custom content types to suit your specific needs.

## File Overview

Here is a detailed breakdown of the files in this directory and their respective roles:

### `lib/content/index.js`

This is the main entry point for the content management system. It exports an instance of the `Content` class, which serves as the primary interface for interacting with the content system.

**Key Functionality:**

- `fetch(page, callback)`: retrieves content for a specific page or all pages.
- `store(page, content, callback)`: saves or updates the content for a page.
- `page(key, page)`: registers a new page with the system.
- `initModel()`: initializes the Mongoose model for storing content in the database.
- `editable(user, options)`: generates data for the client-side content editor.

### `lib/content/page.js`

This file defines the `Page` class, which is used to create and configure content pages.

**`Page(key, options)` Constructor:**

- `key` (String): A unique identifier for the page.
- `options` (Object): A set of configuration options for the page.
  - `name` (String): A user-friendly name for the page. If not provided, it's generated from the key.

**Key Methods:**

- `add(fields)`: Adds one or more fields to the page. The `fields` argument is an object where keys are field paths and values are field options.
- `set(key, value)`: Sets a configuration option for the page.
- `get(key)`: Retrieves a configuration option for the page.
- `register()`: Registers the page with KeystoneJS, making it available for use.
- `populate(data)`: Populates a data structure based on the page's fields.
- `validate(data)`: Validates a data structure against the page's fields.
- `clean(data)`: Removes any fields from a data structure that are not defined in the page.

### `lib/content/type.js`

This file defines the base `Type` class, which serves as a blueprint for all content types. It's intended to be extended by specific content type implementations.

**`Type(path, options)` Constructor:**

- `path` (String): The path associated with the content type.
- `options` (Object): Configuration options for the content type.

### `lib/content/types/`

This directory contains the specific content type implementations that extend the base `Type` class.

- **`lib/content/types/index.js`**: An index file that exports all available content types, making them easy to import and use throughout the application.

- **`lib/content/types/text.js`**: Defines the `Text` content type for handling plain text content. It inherits from the base `Type` class.

- **`lib/content/types/html.js`**: Defines the `Html` content type for handling rich HTML content. It also inherits from the base `Type` class.

## Comprehensive Usage Guide

Here’s a more detailed guide on how to use the content management system:

### 1. Defining a Page

First, you need to define a page and its fields. You can also set various options for the page.

```javascript
var keystone = require('keystone');
var Page = keystone.content.Page;

// Create a new Page instance
var aboutPage = new Page('about', {
  title: 'About Us',
  author: 'John Doe',
});

// Add fields to the page
aboutPage.add({
  'content.title': { type: String, required: true },
  'content.body': { type: keystone.content.Types.Html, wysiwyg: true },
  'meta.keywords': { type: String },
});
```

### 2. Registering the Page

Once you've defined your page, you need to register it with KeystoneJS.

```javascript
aboutPage.register();
```

### 3. Storing Content

You can store content for your page using the `keystone.content.store()` method.

```javascript
keystone.content.store('about', {
  'content.title': 'Our Company History',
  'content.body': '<h2>Our Story</h2><p>We were founded in 2023...</p>',
  'meta.keywords': 'company, history, about us',
}, function(err) {
  if (err) {
    console.error('Error saving content:', err);
  } else {
    console.log('Content saved successfully.');
  }
});
```

### 4. Fetching Content

To retrieve the content you've stored, use the `keystone.content.fetch()` method.

```javascript
keystone.content.fetch('about', function(err, content) {
  if (err) {
    console.error('Error fetching content:', err);
  } else {
    // Access the content fields
    console.log('Title:', content.content.title);
    console.log('Body:', content.content.body);
    console.log('Keywords:', content.meta.keywords);
  }
});
```

### Creating Custom Content Types

You can create your own custom content types by extending the base `Type` class. This allows you to define custom validation, data handling, and rendering logic.

```javascript
var util = require('util');
var Type = require('../type');

function MyCustomType(path, options) {
  MyCustomType.super_.call(this, path, options);
  // Custom initialization logic
}

util.inherits(MyCustomType, Type);

// Add custom methods to the prototype
MyCustomType.prototype.validateInput = function(data) {
  // Custom validation logic
  return typeof data === 'string' && data.startsWith('custom:');
};

module.exports = MyCustomType;
```
