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
| ESM/CJS Interop Fix | `2156d04c` | Added `babel-plugin-add-module-exports` |
| Vite Investigation | BLOCKED | Old npm packages lack proper ESM support |
| E2E Validation | ✅ 167/167 pass | All tests green |

### Key Decision: Phase Reordering

**Problem Discovered**: Vite migration is blocked by legacy npm packages:
- `react` 15.4.2 - CJS only, no named exports
- `react-router` 3.x - ESM build imports CJS packages incorrectly
- `react-redux` 5.x - Same ESM/CJS interop issues

**Solution**: Reorder phases - upgrade React ecosystem FIRST, then migrate to Vite.

| Original Order | New Order | Rationale |
|---------------|-----------|-----------|
| Phase 1: Vite | Phase 1: React 18 | Modern React has proper ESM |
| Phase 2: TypeScript | Phase 2: Vite | Trivial with modern packages |
| Phase 3: React 18 | Phase 3: TypeScript | Build on stable foundation |

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
| Module System | ESM (client) | ESM | ✅ Done |
| React Components | ES6 Classes | Functional + Hooks | ✅ Codemods applied |
| React | 15.4.2 (2016) | 18.x | 🔄 **NEXT** |
| Build System | Browserify + Babelify | Vite | ⏳ After React 18 |
| JavaScript | ES6 with Babel | TypeScript | ⏳ Pending |
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

### ESM/CJS Interop Fix (Commit `2156d04c`)
- Installed `babel-plugin-add-module-exports`
- Fixed broken exports in ItemsTable, Popout components
- Updated .nvmrc to Node 24.11.1

---

## Phase 1: React 18 Upgrade (NEXT)

**Objective**: Upgrade from React 15 to React 18 with minimal breaking changes.

### Why React First?
- Modern React packages have proper ESM support
- Unblocks Vite migration
- Most prep work already done (ES6 classes, PropTypes extraction)

### Pre-work Completed
- ✅ `React.createClass` → ES6 classes (83 files)
- ✅ `React.PropTypes` → `prop-types` package (147 files)
- ⚠️ Lifecycle methods use old names (`componentWillMount`, etc.)

### Upgrade Strategy: Incremental

#### 1.1 React 15 → 16.14 (LTS Bridge)
React 16.14 is the last version before major breaking changes.

- [ ] Update `react`, `react-dom` to 16.14.0
- [ ] Add `UNSAFE_` prefix to deprecated lifecycle methods:
  - `componentWillMount` → `UNSAFE_componentWillMount`
  - `componentWillReceiveProps` → `UNSAFE_componentWillReceiveProps`
  - `componentWillUpdate` → `UNSAFE_componentWillUpdate`
- [ ] Replace `react-addons-css-transition-group` with `react-transition-group`
- [ ] Run E2E tests

#### 1.2 React 16.14 → 17.0
React 17 is a "stepping stone" release with no new features.

- [ ] Update to React 17.0.2
- [ ] Verify no breaking changes
- [ ] Run E2E tests

#### 1.3 React 17 → 18.x
React 18 introduces concurrent features.

- [ ] Update to React 18.2.0
- [ ] Migrate `ReactDOM.render` → `createRoot`
- [ ] Handle Strict Mode double-rendering (if enabled)
- [ ] Run E2E tests

### Dependency Upgrades (with React)

| Package | Current | Target | Notes |
|---------|---------|--------|-------|
| react | 15.4.2 | 18.2.0 | Core upgrade |
| react-dom | 15.4.2 | 18.2.0 | Core upgrade |
| react-router | 3.2.6 | 6.x | Major API changes |
| react-redux | 5.1.2 | 8.x | Hooks API |
| react-select | 1.3.0 | 5.x | Complete rewrite |
| react-day-picker | 2.5.0 | 8.x | API changes |
| react-dnd | 2.6.0 | 16.x | Hooks-based |

### Success Criteria
- React 18.x installed
- All 167 E2E tests pass
- No deprecation warnings in console
- Admin UI fully functional

---

## Phase 2: Build System Migration (After React 18)

**Objective**: Replace Browserify with Vite.

### Why Deferred?
Vite requires proper ESM from npm packages. Old React ecosystem packages have broken ESM builds that import CJS incorrectly. After React 18 upgrade, all packages will have proper ESM support.

### Current Browserify Setup (Reference)

**Entry Points:**
- `admin/client/App/index.js` - Main admin app
- `admin/client/Signin/index.js` - Signin page
- `admin/client/packages.js` - Vendor bundle

**Global Shims:**
- `tinymce` → `window.tinymce`
- `codemirror` → `window.CodeMirror`
- `jquery` → `window.$`

### Steps (Post React 18)
- [ ] Install Vite and @vitejs/plugin-react
- [ ] Create vite.config.ts with proper aliases
- [ ] Build bundles with Vite
- [ ] Update Express to serve Vite bundles
- [ ] Run E2E tests
- [ ] Remove Browserify dependencies

### Success Criteria
- `npm run build` uses Vite
- `npm run dev` starts Vite dev server with HMR
- All 167 E2E tests pass
- Build time < 5 seconds

---

## Phase 3: TypeScript Foundation

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

## Phase 4: Dependency Updates

**Objective**: Update backend and remaining frontend dependencies.

### Backend
| Package | Current | Target | Breaking Changes |
|---------|---------|--------|------------------|
| mongoose | 5.13.x | 8.x | Yes - query API |
| express | 4.x | 4.x or 5.x | Minor |
| Node.js | 24.x | 24.x | Already updated |

### Steps
- [ ] Update Mongoose to 8.x
- [ ] Fix query API changes
- [ ] Run unit tests
- [ ] Run E2E tests

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

### Options
- **Option A**: React Query + Zustand (remove Redux)
- **Option B**: Redux Toolkit + RTK Query (modernize Redux)
- **Option C**: Keep Redux + Saga (minimal changes)

---

## Phase 6: Styling (Decision Required)

**Objective**: Replace Glamor + Elemental with modern solution.

### Current Architecture
- Glamor: CSS-in-JS (runtime)
- Elemental: Component library (abandoned)
- Inline styles in some places
- LESS for server-rendered pages

### Options
- **Option A**: Tailwind CSS
- **Option B**: CSS Modules + Radix UI
- **Option C**: styled-components / Emotion

---

## Phase 7: Field Types Modernization

**Objective**: Modernize the 32 field type implementations.

### Steps
- [ ] Convert to TypeScript
- [ ] Modernize React components (hooks)
- [ ] Add proper interfaces
- [ ] Improve accessibility
- [ ] Add unit tests

---

## Testing Strategy

### E2E Tests (Playwright)
- **167 tests** covering all major functionality
- Run after EVERY migration step
- Primary validation mechanism

### Unit Tests (Mocha → Vitest)
- Existing tests for lib/ and some components
- Consider migrating to Vitest after build system change

### Type Checking
- TypeScript compiler as a test
- Strict mode for new code
- Gradual strictness increase

---

## Timeline Estimate (Revised)

| Phase | Estimated Duration | Dependencies |
|-------|-------------------|--------------|
| Phase 1: React 18 | 2-3 weeks | None |
| Phase 2: Vite | 1 week | Phase 1 |
| Phase 3: TypeScript | 1 week | Phase 2 |
| Phase 4: Dependencies | 1-2 weeks | Phase 1 |
| Phase 5: State Management | 2-3 weeks | Phase 1, 4 |
| Phase 6: Styling | 2-3 weeks | Phase 1 |
| Phase 7: Field Types | 3-4 weeks | Phase 3, 6 |

**Total: 12-17 weeks** (3-4 months)

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
