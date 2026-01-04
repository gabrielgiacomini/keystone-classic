# [KeystoneJS](http://v4.keystonejs.com/)

[![Build Status](https://travis-ci.org/keystonejs/keystone.svg?branch=master)](https://travis-ci.org/keystonejs/keystone)

- [About Keystone](#about)
- [Getting Started](#getting-started)
- [Community](#community)
- [Contributing](#contributing)
- [License](#license)

## About Keystone

[KeystoneJS](http://v4.keystonejs.com) is a powerful Node.js content management system and web app framework built on the [Express](https://expressjs.com/) web framework and [Mongoose ODM](http://mongoosejs.com). Keystone makes it easy to create sophisticated web sites and apps, and comes with a beautiful auto-generated Admin UI.

Check out our [demo site](http://demo.keystonejs.com) to see it in action.

### Documentation

For Keystone v4 documentation and guides, see [keystonejs.com](https://v4.keystonejs.com).

### Configuration

Config variables can be passed in an object to the `keystone.init` method, or can be set any time before `keystone.start` is called using `keystone.set(key, value)`. This allows for a more flexible order of execution. For example, if you refer to Lists in your routes you can set the routes after configuring your Lists.

See the [KeystoneJS configuration documentation](https://keystonejs.com/documentation/configuration) for details and examples of the available options.

### Database field types

Keystone builds on the basic data types provided by MongoDB and allows you to easily add rich, functional fields to your application's models.

You get helper methods on your models for dealing with each field type easily (such as formatting a date or number, resizing an image, getting an array of the available options for a select field, or using Google's Places API to improve addresses) as well as a beautiful, responsive admin UI to edit your data with.

See the [KeystoneJS database documentation](https://keystonejs.com/documentation/database) for details and examples of the various field types, as well as how to set up and use database models in your application.

### Core Files

- **`index.js`**: The main entry point for the KeystoneJS framework. It initializes a new Keystone instance, configures it with default settings, and extends it with the core functionality required to run a Keystone application. It also exposes the major components of the framework such as `List`, `Field`, and `View`. The exported `keystone` object is a singleton instance of the `Keystone` class, which is the main interface for developers to interact with the framework.

  **Usage**:

  ```javascript
  var keystone = require("keystone");
  ```

- **`build.js`**: This script bundles the client-side packages required for the Admin UI. It uses Browserify to create a bundle of all the packages specified in `./admin/client/packages.js` and outputs it to `stdout`. This is typically used during the build process to generate the client-side JavaScript bundle that powers the KeystoneJS Admin UI.

  **Usage**:

  ```bash
  node build.js > public/js/bundle.js
  ```
