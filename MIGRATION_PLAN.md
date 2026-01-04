# Keystone-Classic Modernization Plan

**Goal**: Modernize keystone-classic with React 18, TypeScript, and modern tooling.

**Guiding Principle**: E2E tests (167 Playwright tests) validate each phase. If tests pass, the migration step is successful.

---

## Session Handoff (2026-01-04)

### Completed This Session

| Task | Commit/Status | Notes |
|------|---------------|-------|
| ESM Conversion | `8e4373a7` | ~230 client files converted from CommonJS to ESM |
| React Codemods | `6ed2e922` | createClass → ES6 classes, PropTypes → prop-types package |
| ESM/CJS Interop Fix | **UNCOMMITTED** | Added `babel-plugin-add-module-exports` |
| E2E Validation | ✅ 167/167 pass | All tests green |

### Pending Tasks Before Next Phase

1. **Commit current changes:**
   ```bash
   cd /Users/giaco/Projects/keystone-classic
   git add -A && git commit -m "Fix ESM/CJS interop with babel-plugin-add-module-exports"
   ```

2. **Update Node version:**
   ```bash
   echo "24.11.1" > .nvmrc
   nvm install 24.11.1
   nvm use
   npm install --legacy-peer-deps
   ```

### Uncommitted Changes

**Files modified:**
- `.babelrc` - Added `add-module-exports` plugin
- `admin/server/middleware/browserify.js` - Added plugin to babelify config
- `package.json` / `package-lock.json` - Added `babel-plugin-add-module-exports`
- `ItemsTableRow.js`, `ItemsTable.js`, `RelatedItemsListRow.js` - Fixed `export default exports = X` → `export default X`
- `Popout/index.js`, `Popout/PopoutList.js` - Fixed ESM/CJS mixing
- Various files - Removed debug console.log statements
- Several field components - Reverted `UNSAFE_componentWillMount` → `componentWillMount` (React 15 doesn't support UNSAFE_ prefix)

### Key Technical Discovery

**Problem**: After React codemods, List views showed "Loading..." forever despite data loading correctly.

**Root Cause**: Babel's `@babel/preset-env` transforms `export default X` to `module.exports = { default: X, __esModule: true }`. Without `babel-plugin-add-module-exports`, imports received the wrapper object instead of the actual component.

**Symptom**: `Columns['text']` was `{default: TextColumn, __esModule: true}` instead of `TextColumn`, causing `React.createElement` to fail.

**Solution**: Install and configure `babel-plugin-add-module-exports` in both `.babelrc` and `admin/server/middleware/browserify.js`.

### Quick Start for Next Session

```bash
# 1. Start E2E server
cd /Users/giaco/Projects/keystone-classic
MONGO_PORT=27020 KEYSTONE_DEV=true npm run test-e2e-server

# 2. Access Admin UI
open http://localhost:3000/keystone/
# Login: user@test.e2e / test

# 3. Run E2E tests
npm run test-playwright
```

---

## Current State

| Layer | Current | Target | Status |
|-------|---------|--------|--------|
| Module System | ESM (converted) | ESM | ✅ Done |
| React Components | ES6 Classes (converted) | Functional + Hooks | ✅ Codemods applied |
| Build System | Browserify + Babelify | Vite | 🔄 Next Up |
| JavaScript | ES6 with Babel | TypeScript | ⏳ Pending |
| React | 15.4.2 (2016) | 18.x | ⏳ Pending |
| State Management | Redux + Redux-Saga | TBD | ⏳ Pending |
| Styling | Glamor + Elemental | TBD | ⏳ Pending |
| Backend | Express 4 + Mongoose 5 | Express 4 + Mongoose 8 | ⏳ Pending |

---

## Pre-Migration Work (COMPLETED)

### ESM Conversion (Commit `8e4373a7`)
- Converted ~230 client-side files from CommonJS to ESM
- Pattern: `module.exports = X` → `export default X`
- Pattern: `const X = require('x')` → `import X from 'x'`

### React Codemods (Commit `6ed2e922`)
- **createClass → ES6 classes**: 83 files converted using `react-codemod`
- **PropTypes migration**: 147 files, `React.PropTypes` → `import PropTypes from 'prop-types'`
- **Lifecycle methods**: 17 files had `UNSAFE_` prefix added, then reverted (React 15 incompatible)

### ESM/CJS Interop Fix (Uncommitted)
- Installed `babel-plugin-add-module-exports`
- Fixed broken exports in:
  - `admin/client/App/screens/List/components/ItemsTable/ItemsTableRow.js`
  - `admin/client/App/screens/List/components/ItemsTable/ItemsTable.js`
  - `admin/client/App/screens/Item/components/RelatedItemsList/RelatedItemsListRow.js`
  - `admin/client/App/shared/Popout/index.js`
  - `admin/client/App/shared/Popout/PopoutList.js`

---

## Phase 1: Build System Migration (NEXT)

**Objective**: Replace Browserify with Vite without changing runtime behavior.

### Why Vite?
- 10-100x faster builds (native ES modules)
- Native TypeScript support
- Hot Module Replacement (HMR)
- Better error messages
- Modern ecosystem

### Current Browserify Setup

**Entry Points:**
- `admin/client/App/index.js` - Main admin app
- `admin/client/Signin/index.js` - Signin page (separate bundle)
- `admin/client/packages.js` - Vendor bundle (react, redux, etc.)

**Key Config (admin/server/middleware/browserify.js):**
```javascript
b.transform(babelify.configure({
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: ['add-module-exports'],
}));
b.exclude('FieldTypes');  // Aliased separately
packages.forEach(pkg => b.exclude(pkg));  // External vendor bundle
```

**Global Shims (package.json browserify-shim):**
- `tinymce` → global `tinymce`
- `codemirror` → global `CodeMirror`
- `jquery` → global `jQuery`

### Steps

#### 1.1 Analyze Current Build
- [x] Document Browserify configuration (see above)
- [ ] Identify all entry points (App, Signin, packages)
- [ ] Map browserify-shim globals
- [ ] List all transforms (babelify, brfs)

#### 1.2 Set Up Vite (Parallel)
- [ ] Install Vite and plugins
- [ ] Create vite.config.ts
- [ ] Configure aliases for existing imports
- [ ] Handle global shims (tinymce, codemirror, jquery)
- [ ] Build packages bundle equivalent

#### 1.3 Validate
- [ ] Compare bundle outputs
- [ ] Run E2E tests with Vite bundle
- [ ] Test dev server with HMR

#### 1.4 Switch Over
- [ ] Update npm scripts
- [ ] Remove Browserify dependencies
- [ ] Update documentation

### Success Criteria
- `npm run build` uses Vite
- `npm run dev` starts Vite dev server with HMR
- All 167 E2E tests pass
- Build time < 5 seconds (vs ~30s with Browserify)

---

## Phase 2: TypeScript Foundation

**Objective**: Enable incremental TypeScript adoption.

### Steps
- [ ] Add `tsconfig.json` with `allowJs: true`
- [ ] Configure path aliases
- [ ] Convert entry points to .ts/.tsx
- [ ] Add types for core utilities
- [ ] Set up strict mode for new files only

### Success Criteria
- New files can be written in TypeScript
- Existing JS files continue to work
- No type errors in converted files
- E2E tests pass

---

## Phase 3: React 18 Upgrade

**Objective**: Upgrade from React 15 to React 18.

### Pre-work Completed
- ✅ `React.createClass` → ES6 classes (83 files)
- ✅ `React.PropTypes` → `prop-types` package (147 files)
- ⚠️ Lifecycle methods still use old names (`componentWillMount`, etc.) - React 15 doesn't support `UNSAFE_` prefix

### Remaining Challenges
- `react-addons-css-transition-group` deprecated
- New root API (`createRoot` vs `render`)
- Strict Mode changes
- Some dependencies may be incompatible

### Steps

#### 3.1 Preparation
- [ ] Audit remaining React 15-specific APIs
- [ ] List incompatible dependencies
- [ ] Test with `create-react-class` polyfill if needed

#### 3.2 Upgrade to React 16 (Intermediate)
- [ ] Update react, react-dom to 16.x
- [ ] Add `UNSAFE_` prefix to lifecycle methods (now supported)
- [ ] Fix any remaining createClass usages
- [ ] Run E2E tests

#### 3.3 Upgrade to React 18
- [ ] Update to React 18
- [ ] Migrate to createRoot API
- [ ] Fix Strict Mode issues
- [ ] Run E2E tests

#### 3.4 Modernize Components (Incremental)
- [ ] Convert class components to functional
- [ ] Add hooks where beneficial
- [ ] Update one screen at a time

### Success Criteria
- React 18.x installed
- No deprecation warnings
- E2E tests pass
- Dev experience improved (Fast Refresh)

---

## Phase 4: Dependency Updates

**Objective**: Update backend and shared dependencies.

### Backend
| Package | Current | Target | Breaking Changes |
|---------|---------|--------|------------------|
| mongoose | 5.13.x | 8.x | Yes - query API |
| express | 4.x | 4.x or 5.x | Minor |
| Node.js | 14+ | 20+ | Check APIs |

### Frontend
| Package | Current | Target | Notes |
|---------|---------|--------|-------|
| react-router | 3.x | 6.x | Major rewrite |
| react-redux | 5.x | 8.x | Hooks API |
| react-select | 1.x | 5.x | API changes |
| react-day-picker | 2.x | 8.x | API changes |

### Steps
- [ ] Update backend deps (Mongoose focus)
- [ ] Run unit tests
- [ ] Update frontend deps one by one
- [ ] Run E2E tests after each

---

## Phase 5: State Management (Decision Required)

**Objective**: Simplify or modernize state management.

### Current Architecture
```
Redux Store
├── lists (reducer)
├── home (reducer)
├── item (reducer)
└── active (reducer)

Side Effects: Redux-Saga
API Calls: Manual fetch in sagas
```

### Options (To Be Decided)

#### Option A: React Query + Zustand
- React Query for server state (API calls, caching)
- Zustand for client state (UI state, modals)
- Remove Redux entirely

#### Option B: Redux Toolkit
- Keep Redux, modernize with RTK
- Use RTK Query for API calls
- Gradual migration

#### Option C: Minimal Changes
- Keep Redux + Saga
- Just update to latest versions
- Focus effort elsewhere

### Decision Criteria
- Developer experience
- Bundle size
- Migration effort
- Team familiarity

---

## Phase 6: Styling (Decision Required)

**Objective**: Replace Glamor + Elemental with modern solution.

### Current Architecture
- Glamor: CSS-in-JS (runtime)
- Elemental: Component library (abandoned)
- Inline styles in some places
- LESS for server-rendered pages

### Options (To Be Decided)

#### Option A: Tailwind CSS
- Utility-first, no runtime
- Good DX with IDE support
- Requires design system rebuild

#### Option B: CSS Modules + Radix UI
- Scoped CSS, no runtime
- Radix for accessible primitives
- More manual work

#### Option C: styled-components / Emotion
- Similar to Glamor (easier migration)
- Runtime CSS-in-JS
- Larger bundle

---

## Phase 7: Field Types Modernization

**Objective**: Modernize the 32 field type implementations.

### Current Structure (per field)
```
fields/types/{name}/
├── {Name}Type.js      # Server-side type definition
├── {Name}Field.js     # React edit component
├── {Name}Column.js    # React list column
└── {Name}Filter.js    # React filter component
```

### Steps
- [ ] Convert to TypeScript
- [ ] Modernize React components
- [ ] Add proper prop types / interfaces
- [ ] Improve accessibility
- [ ] Add unit tests

---

## Testing Strategy

### E2E Tests (Playwright)
- **167 tests** covering all major functionality
- Run after EVERY migration step
- Primary validation mechanism

### Unit Tests (Mocha)
- Existing tests for lib/ and some components
- Add tests for new TypeScript code
- Consider migrating to Vitest (Vite-native)

### Type Checking
- TypeScript compiler as a test
- Strict mode for new code
- Gradual strictness increase

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Breaking changes undetected | E2E tests after every change |
| Migration stalls | Small, incremental steps |
| Dependency conflicts | Update one at a time |
| Knowledge loss | Document decisions in AGENTS.md |
| Scope creep | Defer decisions until relevant |

---

## Timeline Estimate

| Phase | Estimated Duration | Dependencies |
|-------|-------------------|--------------|
| Phase 1: Build System | 1-2 weeks | None |
| Phase 2: TypeScript | 1 week | Phase 1 |
| Phase 3: React 18 | 2-4 weeks | Phase 1, 2 |
| Phase 4: Dependencies | 1-2 weeks | Phase 3 |
| Phase 5: State Management | 2-3 weeks | Phase 3, 4 |
| Phase 6: Styling | 2-3 weeks | Phase 3 |
| Phase 7: Field Types | 3-4 weeks | Phase 2, 3, 6 |

**Total: 12-19 weeks** (3-5 months)

---

## Quick Reference

### Validate Current State
```bash
npm run test-playwright
```

### Development Workflow
```bash
# Terminal 1: Start E2E server
MONGO_PORT=27020 KEYSTONE_DEV=true npm run test-e2e-server

# Terminal 2: Run tests
npm run test-playwright

# Access Admin UI
open http://localhost:3000/keystone/
# Login: user@test.e2e / test
```

### Key Files
| Purpose | Location |
|---------|----------|
| Browserify config | `admin/server/middleware/browserify.js` |
| Babel config | `.babelrc` |
| Field types registry | `admin/client/FieldTypes.js` |
| Redux store | `admin/client/App/store.js` |
| E2E tests | `test/e2e-playwright/tests/` |
| Agent docs | `AGENTS.md`, `admin/AGENTS.md`, `fields/AGENTS.md` |
