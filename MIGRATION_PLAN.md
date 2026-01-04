# Keystone-Classic Modernization Plan

**Goal**: Modernize keystone-classic with React 18, TypeScript, and modern tooling.

**Guiding Principle**: E2E tests (167 Playwright tests) validate each phase. If tests pass, the migration step is successful.

---

## ⚠️ CRITICAL: DISABLED MCP TOOLS ⚠️

**The following MCP tools are DISABLED to save context. If you need any of these, STOP and ask the user to enable them first.**

### Disabled Tools

| Tool Category | Tools | When You Might Need |
|---------------|-------|---------------------|
| **MongoDB Admin** | `mongodb-mcp-server` (~20 tools) | Direct database manipulation, schema changes, data migrations |
| **Screenshot Analysis** | `zai-mcp-server` (7 tools: ui_to_artifact, extract_text, diagnose_error, understand_technical_diagram, analyze_data_visualization, ui_diff_check, analyze_video) | Converting UI mockups to code, analyzing error screenshots, extracting text from images |
| **Browser Automation** | `mcp-playwright`, `mcp-puppeteer` | Automated browser testing, web scraping, screenshot capture |
| **Web Search (duplicate)** | `web-search-prime_webSearchPrime` | Alternative web search (websearch_exa is enabled) |

### What You CAN Use

- `context7` - Official library documentation
- `websearch_exa_web_search_exa` - Web search
- `web-reader_webReader` - Read web pages
- `zread` - GitHub repository exploration
- All file system tools (read, write, edit, glob, grep, bash)
- All LSP tools (when TypeScript LSP is installed)

**REMEMBER**: If a task requires any disabled tool, **STOP IMMEDIATELY** and tell the user:
> "This task requires [TOOL_NAME] which is currently disabled. Please enable it to proceed."

---

## Session Handoff (2026-01-04)

### Status Summary

| Phase | Status | Notes |
|-------|--------|-------|
| Phase 1: React 18 Upgrade | ✅ Complete | 15.4.2 → 18.2.0 |
| Phase 2: Vite Migration | ✅ Complete | Browserify removed |
| Phase 3: TypeScript Foundation | ⏳ **NEXT** | See detailed steps below |
| Phase 4-8 | Pending | See roadmap below |

### Quick Start for Next Session

```bash
# 1. Install dependencies (use legacy peer deps for old packages)
npm install --legacy-peer-deps

# 2. Build the admin bundles
npm run build

# 3. Start E2E server (Terminal 1)
MONGO_PORT=27020 npm run test-e2e-server

# 4. Access Admin UI
open http://localhost:3000/keystone/
# Login: user@test.e2e / test

# 5. Run E2E tests (Terminal 2)
npm run test-playwright
```

---

## Current Architecture

### Build System: Vite 7.3.0

The admin UI is built with Vite. The configuration includes custom plugins to handle legacy packages:

**File**: `vite.config.ts`

| Plugin | Purpose |
|--------|---------|
| `forceCjsPlugin` | Forces react-router@3.x to use CJS build (ESM build is broken) |
| `globalShimsPlugin` | Maps window globals: tinymce, jquery, codemirror, underscore |
| `injectReactPropTypesShim` | Patches shared chunk to add `React.PropTypes` for old packages |

**Build Output**:
```
admin/public/js/
├── admin.js        (~510 KB, gzip: 101 KB)
├── signin.js       (~10 KB, gzip: 3 KB)
├── shared-*.js     (vendor chunk, ~4.2 MB)
└── shared-*.js     (elemental chunk, ~93 KB)
```

### Module System: ESM

All client-side code has been converted to ESM. Key conversions:
- `export default require(...)` → `export { default } from '...'`
- `require()` in module scope → `import`
- `module.exports = { ... }` → `export { ... }`

### React: 18.2.0

Upgraded from React 15.4.2 through intermediate steps (15→16→17→18).

**Compatibility Shims** (handled in `vite.config.ts`):
- `React.PropTypes` - shimmed for react-day-picker, elemental
- `React.createClass` - available via create-react-class package

---

## Phase 3: TypeScript Foundation (NEXT)

**Objective**: Enable incremental TypeScript adoption without breaking existing code.

### Prerequisites
- Current `tsconfig.json` only covers unit tests
- Vite already handles TypeScript via its config

### Steps

1. **Update tsconfig.json for full project**:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowJs": true,
    "checkJs": false,
    "strict": false,
    "strictNullChecks": false,
    "noImplicitAny": false,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react",
    "baseUrl": ".",
    "paths": {
      "FieldTypes": ["admin/client/FieldTypes.js"]
    }
  },
  "include": [
    "admin/client/**/*",
    "fields/**/*",
    "lib/**/*",
    "test/**/*"
  ],
  "exclude": ["node_modules", "admin/public"]
}
```

2. **Install TypeScript dependencies** (if not present):
```bash
npm install --save-dev typescript @types/react @types/react-dom --legacy-peer-deps
```

3. **Convert entry points to TypeScript**:
   - `admin/client/App/index.js` → `admin/client/App/index.tsx`
   - `admin/client/Signin/index.js` → `admin/client/Signin/index.tsx`
   - Update `vite.config.ts` input paths

4. **Add type checking to npm scripts**:
```json
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "build": "npm run typecheck && vite build"
  }
}
```

5. **Gradually convert files**:
   - Start with utility files (simpler, fewer dependencies)
   - Add `.d.ts` files for complex legacy modules
   - Use `// @ts-nocheck` temporarily for files not ready for checking

### Success Criteria
- [ ] `npm run typecheck` passes
- [ ] `npm run build` succeeds
- [ ] All 167 E2E tests pass
- [ ] New files can be written in TypeScript

---

## Completed Phases

### Phase 1: React 18 Upgrade ✅

**Commits**: See git log for React upgrade commits

**What Was Done**:
- Upgraded `react` and `react-dom`: 15.4.2 → 18.2.0
- Upgraded `react-redux`: 5.1.2 → 8.1.3
- Added `react-transition-group`: ^4.4.5
- Migrated `ReactDOM.render` → `createRoot` API
- Added `UNSAFE_` prefix to deprecated lifecycle methods
- Shimmed `React.PropTypes` and `React.createClass` for legacy packages

**Breaking Changes Handled**:
- `react-day-picker` 2.5.0 expects `React.PropTypes` → shimmed
- `elemental` expects old React API → shimmed

### Phase 2: Build System Migration ✅

**What Was Done**:
- Created `vite.config.ts` with custom plugins (see Architecture section)
- Converted CJS→ESM in 30+ files
- Removed Browserify: `browserify`, `babelify`, `brfs`, `browserify-shim`, `watchify`
- Removed `admin/server/middleware/browserify.js`
- Simplified `admin/server/app/createStaticRouter.js`
- Renamed `build.js` → `build.browserify.js` (kept for reference)

**Files Modified** (partial list):
- `admin/client/utils/List.js` - ESM conversion
- `admin/client/utils/lists.js` - ESM conversion
- `admin/client/App/App.js` - ESM conversion
- `fields/mixins/ArrayField.js` - ESM conversion
- `fields/types/*/` - 24+ filter/column re-export files
- `fields/utils/evalDependsOn.js` - ESM conversion
- `package.json` - Scripts and dependencies updated

---

## Future Phases

### Phase 4: Dependency Updates

| Package | Current | Target | Notes |
|---------|---------|--------|-------|
| react-router | 3.0.2 | 6.x | Major API changes (consider carefully) |
| react-select | 1.2.4 | 5.x | Complete rewrite |
| react-day-picker | 2.5.0 | 8.x | API changes |
| react-dnd | 2.5.3 | 16.x | Hooks-based |
| mongoose | 5.13.x | 8.x | Query API changes |

### Phase 5: State Management

**Current**: Redux + Redux-Saga

**Options**:
- Option A: React Query + Zustand (remove Redux)
- Option B: Redux Toolkit + RTK Query
- Option C: Keep Redux + Saga (minimal changes)

### Phase 6: Styling

**Current**: Glamor + Elemental (abandoned)

**Options**:
- Option A: Tailwind CSS
- Option B: CSS Modules + Radix UI
- Option C: styled-components / Emotion

### Phase 7: React Component Modernization

Convert 83 class components to functional components with hooks.

### Phase 8: Field Types Modernization

Modernize 32 field type implementations with TypeScript and hooks.

---

## Key Files Reference

| Purpose | Location |
|---------|----------|
| Vite config | `vite.config.ts` |
| Babel config | `.babelrc` |
| TypeScript config | `tsconfig.json` |
| Package manifest | `package.json` |
| Admin entry | `admin/client/App/index.js` |
| Signin entry | `admin/client/Signin/index.js` |
| Field types registry | `admin/client/FieldTypes.js` |
| Redux store | `admin/client/App/store.js` |
| E2E tests | `test/e2e-playwright/tests/` |
| E2E server | `test/e2e/server.js` |
| Agent docs | `AGENTS.md`, `admin/AGENTS.md`, `fields/AGENTS.md` |

---

## Testing Commands

```bash
# Build
npm run build              # Production build
npm run build:dev          # Development build (with sourcemaps)

# E2E Tests (Playwright)
npm run test-playwright           # Run all 167 tests
npm run test-playwright:headed    # Run with visible browser
npm run test-playwright:ui        # Interactive UI mode
npm run test-playwright:debug     # Debug mode

# Unit Tests (Mocha)
npm run test-unit          # Run unit tests
npm run test               # Run all tests (lint + unit + admin)

# Linting
npm run lint               # ESLint check
npm run lint-fix           # ESLint with auto-fix
```

---

## Known Issues & Workarounds

### 1. react-router@3.x ESM Build Broken
**Issue**: react-router 3.0.2 has a broken ESM build that imports from non-existent paths.
**Workaround**: `forceCjsPlugin` in vite.config.ts redirects to CJS build.

### 2. Legacy Packages Need React.PropTypes
**Issue**: `react-day-picker@2.5.0` and `elemental` expect `React.PropTypes`.
**Workaround**: `injectReactPropTypesShim` plugin patches the shared chunk at build time.

### 3. Window Globals Required
**Issue**: Some packages expect globals: `window.tinymce`, `window.$`, `window.CodeMirror`.
**Workaround**: `globalShimsPlugin` provides virtual modules that return window globals.

### 4. npm install Requires Legacy Peer Deps
**Issue**: Old packages have conflicting peer dependencies.
**Workaround**: Always use `npm install --legacy-peer-deps`.

---

## Timeline Estimate

| Phase | Estimated Time | Notes |
|-------|----------------|-------|
| Phase 3: TypeScript | 1 week | Foundation only |
| Phase 4: Dependencies | 1-2 weeks | May skip router upgrade |
| Phase 5: State Management | 2-3 weeks | Decision required |
| Phase 6: Styling | 2-3 weeks | Decision required |
| Phase 7: React Hooks | 2-3 weeks | 83 components |
| Phase 8: Field Types | 3-4 weeks | 32 field types |

**Remaining: ~12-16 weeks** (3-4 months)
