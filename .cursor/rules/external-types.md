# External Package Type Import Rules

## Overview

When importing types from external packages, always use the most explicit and verbose syntax to avoid namespace conflicts and improve code clarity.

## Rules

### 1. Use Namespace Imports

Always use namespace imports with `* as` syntax for external packages:

```typescript
// ✅ CORRECT
import * as express from "express";
import * as mongoose from "mongoose";
import * as moment from "moment";

// ❌ INCORRECT
import { Express, Request, Response } from "express";
import { Schema, Model } from "mongoose";
```

### 2. Reference Types with Full Namespace

Always reference types using their full namespace:

```typescript
// ✅ CORRECT
function handleRequest(req: express.Request, res: express.Response) {
	const user: mongoose.Document = req.user;
}

// ❌ INCORRECT
function handleRequest(req: Request, res: Response) {
	const user: Document = req.user;
}
```

### 3. Type Declarations

When declaring interfaces or types that reference external package types, use the full namespace:

```typescript
// ✅ CORRECT
interface CustomMiddleware {
	handler: express.RequestHandler;
	model: mongoose.Model<any>;
}

// ❌ INCORRECT
interface CustomMiddleware {
	handler: RequestHandler;
	model: Model<any>;
}
```

### 4. Generic Type Parameters

When using generic type parameters from external packages, maintain the namespace:

```typescript
// ✅ CORRECT
type DocumentQuery<T> = mongoose.QueryWithHelpers<T, mongoose.Document>;

// ❌ INCORRECT
type DocumentQuery<T> = QueryWithHelpers<T, Document>;
```

### 5. Return Types and Parameters

Use explicit namespacing in function return types and parameters:

```typescript
// ✅ CORRECT
function createRouter(): express.Router {
	return express.Router();
}

// ❌ INCORRECT
function createRouter(): Router {
	return Router();
}
```

## Benefits

- Prevents namespace collisions
- Makes dependencies explicit and clear
- Improves code maintainability
- Makes refactoring easier
- Helps with type inference and IDE support

## Exceptions

The only exceptions to these rules are:

1. When using types from TypeScript's built-in type definitions
2. When the package specifically recommends a different import style in its documentation
3. When dealing with local type definitions in your own codebase
