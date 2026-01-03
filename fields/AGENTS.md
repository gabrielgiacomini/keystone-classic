# FIELDS — TYPE SYSTEM

32 field types with 4-part architecture: Type, Field, Column, Filter.

## STRUCTURE

```
fields/
├── types/              # 32 field type implementations
│   ├── Type.js         # Base class (all types inherit)
│   ├── Field.js        # Base React component
│   ├── text/           # Example field type
│   │   ├── TextType.js     # Backend: validation, schema, update
│   │   ├── TextField.js    # React: form input
│   │   ├── TextColumn.js   # React: list display
│   │   ├── TextFilter.js   # React: filter UI
│   │   └── test/           # Unit tests
│   └── ...             # 31 more types
├── components/         # Shared React components
├── utils/              # Field utilities
└── explorer/           # Field types explorer
```

## CREATING A NEW FIELD TYPE

### 1. Create Type (Backend)
```javascript
// fields/types/myfield/MyFieldType.js
var FieldType = require('../Type');
var util = require('util');

function myfield(list, path, options) {
  this._nativeType = String;        // MongoDB type
  this._properties = [];            // Exposed to React
  this._underscoreMethods = [];     // item._.fieldName.method()
  myfield.super_.call(this, list, path, options);
}
myfield.properName = 'MyField';
util.inherits(myfield, FieldType);

// REQUIRED: Validate input format
myfield.prototype.validateInput = function(data, callback) {
  var value = this.getValueFromData(data);
  utils.defer(callback, value === undefined || typeof value === 'string');
};

// REQUIRED: Validate required field has value
myfield.prototype.validateRequiredInput = function(item, data, callback) {
  var value = this.getValueFromData(data);
  utils.defer(callback, !!value || (value === undefined && item.get(this.path)));
};

// REQUIRED: Save value to item
myfield.prototype.updateItem = function(item, data, callback) {
  var value = this.getValueFromData(data);
  if (value !== undefined) item.set(this.path, value);
  process.nextTick(callback);
};

// OPTIONAL: Filter support for Admin UI
myfield.prototype.addFilterToQuery = function(filter) {
  var query = {};
  query[this.path] = new RegExp(filter.value, 'i');
  return query;
};

module.exports = myfield;
```

### 2. Create Field Component (React)
```javascript
// fields/types/myfield/MyFieldField.js
var Field = require('../Field');
module.exports = Field.create({
  displayName: 'MyFieldField',
  statics: { type: 'MyField' },
  renderField() { /* input element */ },
});
```

### 3. Create Column & Filter (React)
Similar pattern — see `text/TextColumn.js` and `text/TextFilter.js`

### 4. Register in lib/fieldTypes.js
```javascript
get MyField() { return require('../fields/types/myfield/MyFieldType'); },
```

## KEY CONVENTIONS

| Convention | Example |
|------------|---------|
| Type naming | lowercase function: `function text()` |
| properName | PascalCase: `text.properName = 'Text'` |
| Inheritance | `util.inherits(text, FieldType)` |
| Async validation | Callback with `utils.defer()` |
| Native type | `this._nativeType = String/Number/Date/Boolean/ObjectId` |

## AVAILABLE FIELD TYPES

**Simple**: Text, Textarea, Number, Boolean, Email, Url, Password, Key, Code, Html, Markdown, Color  
**Date/Time**: Date, Datetime, DateArray  
**Selection**: Select, TextArray, NumberArray  
**Relationships**: Relationship  
**Files**: File, LocalFile, LocalFiles, S3File, AzureFile, CloudinaryImage, CloudinaryImages  
**Complex**: Location, GeoPoint, Name, Money, Embedly

## UTILITIES (fields/utils/)

| Utility | Purpose |
|---------|---------|
| `evalDependsOn.js` | Conditional field rendering |
| `bindFunctions.js` | React method binding |
| `addPresenceToQuery.js` | Array field filtering |
| `definePrototypeGetters.js` | Computed properties |

## ANTI-PATTERNS

- **Never** skip `validateInput` — breaks form submission
- **Never** skip `validateRequiredInput` — breaks required fields
- **Avoid** sync operations in `updateItem` — use `process.nextTick(callback)`
