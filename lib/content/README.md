# KeystoneJS Content Management System

This directory contains the core components of the KeystoneJS content management system. It provides a flexible way to define, manage, and retrieve content for your application.

## Core Concepts

The content management system is built around the following core concepts:

- **Pages:** A `Page` represents a specific content structure, such as a homepage, a blog post, or a contact page. Each page is defined by a unique key and a set of fields.
- **Fields:** Fields define the individual pieces of content within a page. KeystoneJS supports various field types, including text, HTML, and more.
- **Content Types:** Content types define the behavior and validation rules for different kinds of content. The base `Type` class can be extended to create custom content types.

## File Overview

Here's a breakdown of the files in this directory and their roles:

- **`lib/content/index.js`:** The main entry point for the content management system. It exposes the `Content` class, which provides methods for fetching, storing, and registering pages. It is the primary interface for interacting with the content system.
- **`lib/content/page.js`:** Defines the `Page` class, which is used to create and configure content pages. It allows you to add fields, set options, and register the page with KeystoneJS.
- **`lib/content/type.js`:** Defines the base `Type` class, which serves as a blueprint for all content types. It is intended to be extended by specific content type implementations.
- **`lib/content/types/`:** This directory contains the specific content type implementations.
  - **`lib/content/types/index.js`:** An index file that exports all available content types, making them easy to import in other parts of the application.
  - **`lib/content/types/text.js`:** Defines the `Text` content type for handling plain text content.
  - **`lib/content/types/html.js`:** Defines the `Html` content type for handling rich HTML content.

## Usage

To use the content management system, you typically follow these steps:

1. **Define a Page:** Create a new `Page` instance and define its fields using the `add()` method.
2. **Register the Page:** Register the page with KeystoneJS using the `register()` method.
3. **Fetch Content:** Use `keystone.content.fetch()` to retrieve the content for a specific page.
4. **Store Content:** Use `keystone.content.store()` to save or update the content for a page.

### Example

```javascript
var keystone = require('keystone');
var Page = keystone.content.Page;

// 1. Define a Page
var homePage = new Page('home', {
  title: 'Home Page',
});

homePage.add({
  heading: { type: String },
  content: { type: keystone.content.Types.Html },
});

// 2. Register the Page
homePage.register();

// 3. Fetch Content
keystone.content.fetch('home', function(err, content) {
  if (err) throw err;
  console.log(content.heading);
  console.log(content.content);
});

// 4. Store Content
keystone.content.store('home', {
  heading: 'Welcome to our Website!',
  content: '<p>This is the homepage content.</p>',
}, function(err) {
  if (err) throw err;
  console.log('Content saved successfully.');
});
```
