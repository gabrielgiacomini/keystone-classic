<div align="center">
  <h1>:warning: Archived :warning:</h1>
  <p>Keystone classic is not receiving any new updates.</p>
    <p>We recommend using <a href="https://github.com/keystonejs/keystone" target="_blank">Keystone 6</a> for new projects.</p>
  <br>
</div>
<br>

---

## ⚠️ FOR AI AGENTS: DISABLED MCP TOOLS ⚠️

**CRITICAL**: The following MCP tools are **DISABLED** to save context. If you need any of these tools, **STOP IMMEDIATELY** and ask the user to enable them first.

### Disabled Tools
- **MongoDB Admin**: `mongodb-mcp-server` (~20 tools) - Database manipulation, schema changes
- **Screenshot Analysis**: `zai-mcp-server` (7 tools) - UI mockup conversion, error screenshot analysis
- **Browser Automation**: `playwright`, `puppeteer`, `mcp-playwright`, `mcp-puppeteer` - Automated testing, web scraping, E2E test creation
- **Web Scraping**: `firecrawl` - Advanced web scraping, structured data extraction
- **Duplicate Web Search**: `web-search-prime_webSearchPrime` - Use `websearch_exa` instead

**What you CAN use**: `context7`, `websearch_exa`, `web-reader`, `zread`, file tools, LSP tools (when installed)

**Agent Policy**: You CAN and SHOULD suggest enabling disabled tools when they would significantly help with a task. Just explain why it's useful and ask the user first.

**If a task REQUIRES a disabled tool**: Tell the user immediately and wait for them to enable it.

---

# ![KeystoneJS](http://v3.keystonejs.com/images/logo.svg)

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

For Keystone v0.3 documentation, see [v3.keystonejs.com](https://v3.keystonejs.com).

## Getting Started

This section provides a short intro to Keystone. Check out the [Getting Started Guide](https://keystonejs.com/getting-started) in the Keystone documentation for a more comprehensive introduction.

### Installation

The easiest way to get started with Keystone is to use the Yeoman generator:

```bash
$ npm install -g generator-keystone
$ yo keystone
```

Answer the questions, and the generator will create a new project based on the options you select, and install the required packages from **npm**.

Alternatively, to include Keystone in an existing project or start from scratch (without Yeoman), specify `keystone: "4.0.0"` in the `dependencies` array of your `package.json` file, and run `npm install` from your terminal.

Then read through the [Documentation](https://keystonejs.com/documentation) and the [Example Projects](http://v3.keystonejs.com/examples) to understand how to use it.

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
  var keystone = require('keystone');
  ```

- **`build.js`**: This script bundles the client-side packages required for the Admin UI. It uses Browserify to create a bundle of all the packages specified in `./admin/client/packages.js` and outputs it to `stdout`. This is typically used during the build process to generate the client-side JavaScript bundle that powers the KeystoneJS Admin UI.

  **Usage**:
  ```bash
  node build.js > public/js/bundle.js
  ```

### Running KeystoneJS in Production

When you deploy your KeystoneJS app to production, be sure to set your `ENV` environment variable to `production`.

You can do this by setting `NODE_ENV=production` in your `.env` file, which gets handled by [dotenv](https://github.com/motdotla/dotenv).

Setting your environment enables certain features (including template caching, simpler error reporting, and HTML minification) that are important in production but annoying in development.

## Community

We have a friendly, growing community and welcome everyone to get involved:

- Follow [@KeystoneJS](https://twitter.com/KeystoneJS) on twitter for news and announcements.
- Ask technical questions on [Stack Overflow](http://stackoverflow.com/questions/tagged/keystone.js) and tag them `keystonejs.`
- Report bugs and feature suggestions on our GitHub [issue tracker](https://github.com/keystonejs/keystone/issues).
- Join the [KeystoneJS Slack](https://launchpass.com/keystonejs) for general discussion with the Keystone community and contributors.

We love to hear feedback about Keystone and the projects you're using it for. Ping us at [@KeystoneJS](https://twitter.com/KeystoneJS) on Twitter.

### Contributing

If you can, please contribute by reporting issues, discussing ideas, helping answer questions from other developers, or submitting pull requests with patches and new features. We do our best to respond to all issues and pull requests, and make patch releases to npm regularly.

If you're going to contribute code, please follow our [coding standards](https://github.com/keystonejs/keystone/wiki/Coding-Standards) and read our [Contributing Guide](https://github.com/keystonejs/keystone/blob/master/CONTRIBUTING.md).

### Related Projects

If you are using KeystoneJS in any projects we encourage you to add to our [Related Projects Page](https://github.com/keystonejs/keystone/wiki/Related-Projects). This is also the place to find generators and other projects that bundle KeystoneJS.

### Thanks

KeystoneJS is a free and open source community-driven project. Thanks to our many [contributors](https://github.com/keystonejs/keystone/graphs/contributors) and [users](https://github.com/keystonejs/keystone/stargazers) for making it great.

Keystone's development has been led by key contributors including [Jed Watson](https://github.com/JedWatson), [Joss Mackison](https://github.com/jossmac), and [Max Stoiber](https://github.com/mxstbr) and is proudly supported by [Thinkmill](https://thinkmill.com.au) in Sydney, Australia.

## License

(The MIT License)

Copyright (c) 2016-2019 Jed Watson

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
