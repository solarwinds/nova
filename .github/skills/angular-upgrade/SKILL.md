---
name: ng-migration-agent
description:
  Migrate Angular applications to newer versions. Use this skill when the user
  asks to upgrade or migrate an Angular project — including updating
  dependencies, refactoring deprecated APIs, replacing removed modules, adapting
  to new standalone component patterns, and resolving breaking changes across
  major Angular versions (e.g., v12 → v17, v15 → v19, v19 → v21).
---

This skill guides step-by-step migration of Angular applications from older to
newer versions. It handles dependency updates, breaking-change fixes, API
replacements, and architectural shifts (e.g., NgModules → standalone
components).

The user provides a description of their Angular project (current version,
target version, or a package.json / error output). The goal is a working,
idiomatic Angular application at the target version.

## Phase 0 — Intake (REQUIRED before any changes)

**Before touching a single file**, collect the following. If any item is
unknown, ask the user directly — do not guess or assume.

### 0a. Determine current version

Check `package.json` for `@angular/core` version. If unavailable, ask:

> "What Angular version is the project currently on?"

### 0b. Determine target version

If the user has not stated a target version, **always ask**:

> "What version would you like to migrate to? (e.g., v19, v20, v21, or latest)"

Do **not** silently assume latest. Some projects must stay below a certain
version due to library compatibility.

### 0c. Confirm migration path

Once both versions are known, compute the hop sequence and **show it to the user
for confirmation** before proceeding:

```
Current: Angular 14
Target:  Angular 21
Migration path: 14 → 15 → 16 → 17 → 18 → 19 → 20 → 21  (7 hops)
```

If the gap is a single major version, confirm anyway:

```
Current: Angular 20
Target:  Angular 21
Migration path: 20 → 21  (1 hop)
```

### 0d. Gather project context

- Read `package.json` — note all `@angular/*`, `@ngrx/*`, `@angular/material`,
  `rxjs`, `typescript`, `zone.js`, and any UI library versions
- Read `angular.json` — note builders, project structure
- Identify architecture: NgModule-based, standalone, or mixed
- Flag any third-party libraries that may not support the target version

---

## Phase 1 — Migration Plan

After intake, **produce a written migration plan** and present it to the user
before making any code changes. The plan must list every hop with its required
actions:

```
## Migration Plan: Angular 14 → 21

### Hop 1: v14 → v15
- [ ] Update @angular/* to ^15, typescript to ~4.8, zone.js to ~0.12
- [ ] Replace ComponentFactoryResolver → ViewContainerRef.createComponent()
- [ ] Change zone.js import: 'zone.js/dist/zone' → 'zone.js'
- [ ] Remove ngcc from prepare script
- [ ] Verify: ng build + ng test

### Hop 2: v15 → v16
- [ ] Update @angular/* to ^16, typescript to ~5.0, zone.js to ~0.13
- [ ] Remove TRANSLATIONS / TRANSLATIONS_FORMAT providers
- [ ] Verify: ng build + ng test

### Hop 3: v16 → v17
- [ ] Update @angular/* to ^17, typescript to ~5.2, zone.js to ~0.14
- [ ] Update tsconfig: target ES2022, moduleResolution bundler
- [ ] Verify: ng build + ng test

### Hop 4: v17 → v18
- [ ] Update @angular/* to ^18, typescript to ~5.4, zone.js to ~0.14
- [ ] Verify: ng build + ng test

### Hop 5: v18 → v19
- [ ] Update @angular/* to ^19, typescript to ~5.5, zone.js to ~0.15
- [ ] Add standalone: false to all NgModule-declared components/pipes/directives
- [ ] Switch angular.json builder: browser → application (rename main→browser,
      polyfills string→array, remove webpack-only flags, browserTarget→buildTarget)
- [ ] Migrate HttpClientModule → provideHttpClient() in AppModule providers
- [ ] Verify: ng build + ng test + ng lint (or yarn assemble)

### Hop 6: v19 → v20
- [ ] Update @angular/* to ^20, typescript to ~5.8, zone.js to ~0.15
- [ ] Update @angular-eslint/* to ^20, @angular/cdk to ^20, @angular/material to ^20 (if used)
- [ ] Update any Nova UI / third-party Angular libs to ^20 compatible versions
- [ ] Run `ng generate @angular/core:inject --defaults` to fix new `@angular-eslint/prefer-inject` errors
- [ ] Run prettier-fix after schematic changes
- [ ] Verify: ng build + ng test + ng lint (or yarn assemble)

### Hop 7: v20 → v21
- [ ] Update @angular/* to ^21, typescript to ~5.8, zone.js to ~0.15
- [ ] Update @angular-eslint/* to ^21, @angular/cdk to ^21, @angular/material to ^21 (if used)
- [ ] Update any Nova UI / third-party Angular libs to ^21 compatible versions
- [ ] Verify: ng build + ng test + ng lint (or yarn assemble)
```

Wait for user approval (or a "proceed" signal) before executing the plan.

---

## Migration Thinking

Before making changes, gather context and build a clear migration plan:

- **Current version** – Detected from `package.json` or confirmed with the user
- **Target version** – Explicitly confirmed with the user (see Phase 0b)
- **Scope** – Libraries used (Angular Material, CDK, NgRx, RxJS, etc.) and their
  required version bumps
- **Architecture** – NgModule-based, standalone, or mixed?
- **Risk areas** – Identify deprecated APIs, removed features, and required
  refactors

Always migrate **one major version at a time** when jumping multiple versions
(e.g., v14 → v15 → v16 → v17), unless the user explicitly requests a direct
jump. Mark each hop's checklist item as done only after `ng build` **and**
`ng test` both pass for that hop.

## Step-by-Step Migration Process

### 1. Dependency Update

- Update `@angular/core`, `@angular/cli`, and all `@angular/*` packages to the
  target version
- Update peer dependencies: `typescript`, `rxjs`, `zone.js`
- Update related libraries: `@angular/material`, `@ngrx/*`, etc.
- Use `ng update` commands where applicable:
  ```bash
  ng update @angular/core@<target> @angular/cli@<target>
  ng update @angular/material@<target>   # if used
  ```

### 2. Breaking Change Resolution

- Consult the Angular [update guide](https://update.angular.io) for the specific
  version range
- Fix removed or renamed APIs (e.g., `ComponentFactoryResolver` removed in v15,
  `HttpClientModule` deprecated in v15+)
- Replace deprecated RxJS patterns (e.g., `subscribe(observer)` signature
  changes)
- Update `tsconfig.json` for new TypeScript strictness requirements

### 3. Standalone Components (v14+)

If migrating to v14 or later, offer to convert NgModule-based components to
standalone:

```bash
ng generate @angular/core:standalone
```

- Convert components, directives, and pipes to `standalone: true`
- Remove unnecessary `NgModule` declarations
- Update `bootstrapApplication()` in `main.ts` if moving fully standalone

### 4. New API Adoption (optional but recommended)

Suggest modern Angular patterns appropriate for the target version:

- **Signals** (v17+): Replace `@Input()` + `ngOnChanges` with `input()` signal
  inputs
- **Control Flow** (v17+): Replace `*ngIf` / `*ngFor` with `@if` / `@for` blocks
- **`inject()`** (v14+): Replace constructor injection with `inject()` where
  cleaner
- **`provideRouter()`** (v14+): Replace `RouterModule.forRoot()` in standalone
  apps

### 5. Build, Test & Lint Verification

After every migration step, run all three checks in order. Do **not** skip any:

#### 5a. Production build

```bash
ng build --configuration production
# or with yarn/npm scripts:
yarn build:prod
```

Expected: zero errors, zero warnings about removed APIs.

#### 5b. Unit tests — run headless, single-run

```bash
# Preferred (non-interactive, CI-safe):
ng test --watch=false --browsers=ChromeHeadless
# Or via npm/yarn script:
yarn test
```

- Confirm **all specs pass** and the summary line reads `X specs, 0 failures`.
- If the project's `karma.conf.js` already sets `browsers: ['ChromeHeadless']`
  and `singleRun: true`, plain `ng test` / `yarn test` is sufficient.
- Read every `FAILED` block — do **not** ignore failures as "pre-existing"; a
  migration may have introduced regressions.

#### 5c. Interpreting test output

| Output line                        | Meaning                                    | Action                                                              |
| ---------------------------------- | ------------------------------------------ | ------------------------------------------------------------------- |
| `X specs, 0 failures`              | All passing                                | ✅ done                                                             |
| `X specs, Y failures`              | Broken specs                               | Fix each failure before continuing                                  |
| `ERROR: 'NG0XXX'` in console       | Runtime Angular DI/compilation error       | Check providers, `standalone` flags, imports                        |
| `NullInjectorError`                | Missing provider in test bed               | Add missing provider or `provideRouter([])`                         |
| `TypeError: X is not a function`   | API removed/renamed between major versions | Apply the relevant fix from the Deprecated API section              |
| `Cannot find module 'X'`           | Missing or mis-spelled import path         | Check RxJS/zone.js/library import paths                             |
| `ChromeHeadless ... exited with 1` | Browser failed to start                    | Install Chrome or set `CHROME_BIN`; install `karma-chrome-launcher` |

#### 5d. Lint

```bash
ng lint
# or:
yarn lint
```

Fix all errors before committing. Warnings may be deferred but should be noted.

#### 5e. Full assemble (if available)

If the project has an `assemble` script that chains `prettier-check`, `lint`,
and `build:prod`, run it as a final gate:

```bash
yarn assemble
```

Report any remaining errors and resolve them before handing back to the user.

## Peer Dependency Version Matrix

Use these exact version ranges per Angular target to avoid `ERESOLVE` errors:

| Angular | TypeScript | zone.js | RxJS | Node types |
| ------- | ---------- | ------- | ---- | ---------- |
| 14      | ~4.7       | ~0.11   | ^7.5 | ^16        |
| 15      | ~4.8–4.9   | ~0.12   | ^7.5 | ^18        |
| 16      | ~5.0–5.1   | ~0.13   | ^7.5 | ^18        |
| 17      | ~5.2–5.3   | ~0.14   | ^7.8 | ^18        |
| 18      | ~5.4       | ~0.14   | ^7.8 | ^20        |
| 19      | ~5.5       | ~0.15   | ^7.8 | ^22        |
| 20      | ~5.8       | ~0.15   | ^7.8 | ^22        |
| 21      | ~5.8       | ~0.15   | ^7.8 | ^22        |

Always do a **clean install** when upgrading major versions:

```bash
rm -rf node_modules package-lock.json
npm install
```

---

## Deprecated API Reference & Fixes (with code)

### 1. `zone.js` import path (v15 → v0.14+)

**Why:** `zone.js` restructured its exports; `dist/zone` no longer exists.

```typescript
// ❌ Before (polyfills.ts)
import "zone.js/dist/zone";

// ✅ After
import "zone.js";
```

---

### 2. `HttpClientModule` → `provideHttpClient()` (deprecated v15, removed v19)

**Why:** Angular moved HTTP to a functional provider pattern compatible with
standalone and NgModule apps alike.

```typescript
// ❌ Before (app.module.ts)
import { HttpClientModule } from "@angular/common/http";

@NgModule({
  imports: [HttpClientModule],
  providers: [],
})
export class AppModule {}
```

```typescript
// ✅ After
import { provideHttpClient } from "@angular/common/http";

@NgModule({
  imports: [],
  providers: [provideHttpClient()],
})
export class AppModule {}
```

To enable interceptors with the new API:

```typescript
provideHttpClient(withInterceptors([myInterceptor]));
// or legacy class-based interceptors:
provideHttpClient(withInterceptorsFromDi());
```

---

### 3. `TRANSLATIONS` / `TRANSLATIONS_FORMAT` removed (v16)

**Why:** Angular dropped the legacy `@angular/core` i18n tokens in v16. Use
`@angular/localize` instead.

```typescript
// ❌ Before (app.module.ts)
import { NgModule, TRANSLATIONS, TRANSLATIONS_FORMAT } from "@angular/core";

providers: [
  { provide: TRANSLATIONS_FORMAT, useValue: "xlf" },
  { provide: TRANSLATIONS, useValue: "" },
];
```

```typescript
// ✅ After — simply remove both providers entirely
import { NgModule } from "@angular/core";

providers: [
  // TRANSLATIONS / TRANSLATIONS_FORMAT removed
];
```

If you need runtime i18n, use `$localize` from `@angular/localize` and compile
with `ng build --localize`.

---

### 4. `ngcc` removed (v16) — remove from `prepare` script

**Why:** `ngcc` (Angular Compatibility Compiler) post-processed View Engine
libraries to Ivy. As of v16, all libraries must ship Ivy-native code; `ngcc` is
gone.

```json
// ❌ Before (package.json)
"scripts": {
  "prepare": "ngcc"
}
```

```json
// ✅ After — delete the prepare script entirely
"scripts": {
  // no "prepare" needed
}
```

---

### 5. `standalone: false` required on NgModule components/pipes (v19)

**Why:** Angular 19 changed the default of `standalone` from `false` to `true`.
Any component or pipe that lives inside an `@NgModule` `declarations` array must
now explicitly opt out.

```typescript
// ❌ Before — implicit standalone:false worked in v13–v18
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
})
export class AppComponent {}

@Pipe({ name: "safe" })
export class SafePipe implements PipeTransform {}
```

```typescript
// ✅ After — explicit opt-out required in v19
@Component({
  standalone: false, // 👈 required
  selector: "app-root",
  templateUrl: "./app.component.html",
})
export class AppComponent {}

@Pipe({ name: "safe", standalone: false }) // 👈 required
export class SafePipe implements PipeTransform {}
```

Error you'll see without this fix:

```
Error NG6008: Component AppComponent is standalone, and cannot be declared in an NgModule.
```

---

### 6. `ComponentFactoryResolver` removed (v15)

**Why:** Dynamic component creation was unified into
`ViewContainerRef.createComponent()`.

```typescript
// ❌ Before
constructor(private cfr: ComponentFactoryResolver, private vcr: ViewContainerRef) {}

ngOnInit() {
  const factory = this.cfr.resolveComponentFactory(MyComponent);
  this.vcr.createComponent(factory);
}
```

```typescript
// ✅ After
constructor(private vcr: ViewContainerRef) {}

ngOnInit() {
  this.vcr.createComponent(MyComponent);
}
```

---

### 7. `RouterModule.forRoot()` → `provideRouter()` (v14+ standalone)

**Why:** Functional router providers are tree-shakeable and required for
standalone apps.

```typescript
// ❌ Before (app.module.ts)
imports: [
  RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
];
```

```typescript
// ✅ After (app.config.ts or providers array)
import {
  provideRouter,
  withPreloading,
  PreloadAllModules,
} from "@angular/router";

providers: [provideRouter(routes, withPreloading(PreloadAllModules))];
```

---

### 8. tsconfig — `moduleResolution` and `target` updates

**Why:** Angular 17+ uses esbuild by default, which requires `"bundler"`
resolution. `ES2022` enables native class fields, needed for signal support.

```jsonc
// ❌ Before
{
  "compilerOptions": {
    "target": "ES2015",
    "moduleResolution": "Node",
    "lib": ["ES2020", "DOM"],
    "downlevelIteration": true // redundant with ES2022+
  }
}
```

```jsonc
// ✅ After
{
  "compilerOptions": {
    "target": "ES2022",
    "moduleResolution": "bundler",
    "lib": ["ES2022", "DOM"]
    // downlevelIteration: removed
  }
}
```

---

### 9. `ModuleWithProviders` generic required (v13)

**Why:** The non-generic `ModuleWithProviders` was removed; the type parameter
is required.

```typescript
// ❌ Before
static forRoot(): ModuleWithProviders { ... }

// ✅ After
static forRoot(): ModuleWithProviders<MyModule> { ... }
```

---

### 10. `*ngIf` / `*ngFor` → built-in control flow (v17+, optional)

**Why:** The new `@if` / `@for` / `@switch` syntax is more performant and
type-safe. Migration is optional but recommended.

```html
<!-- ❌ Before -->
<div *ngIf="isVisible">Hello</div>
<li *ngFor="let item of items; trackBy: trackById">{{ item.name }}</li>
```

```html
<!-- ✅ After -->
@if (isVisible) {
<div>Hello</div>
} @for (item of items; track item.id) {
<li>{{ item.name }}</li>
}
```

Auto-migrate with the Angular schematic:

```bash
ng generate @angular/core:control-flow
```

---

### 11. `TestBed.get()` → `TestBed.inject()` (v9+, removed v16)

**Why:** `TestBed.get()` was deprecated in v9 and removed in v16.
`TestBed.inject()` is type-safe.

```typescript
// ❌ Before (*.spec.ts)
const service = TestBed.get(MyService);
```

```typescript
// ✅ After
const service = TestBed.inject(MyService);
```

---

### 12. `test.ts` — remove webpack `require.context`, move `zone.js/testing` to `angular.json` (v17+ `application` builder)

**Why:** The old `test.ts` used webpack's `require.context()` to discover spec
files at runtime. The esbuild-based `application` builder does not support
`require.context`; specs are discovered automatically from `tsconfig.spec.json`
`include` globs. Additionally, `zone.js/testing` no longer belongs as an import
inside `test.ts` — it must be declared in `angular.json`
`test.options.polyfills`.

// jira for this skill
// 5 projective angular 14/15 - crud generate with AI
// use this skill to migrate to angular 21 
// what result it be gave

// skill can be placeded in public resource

```typescript
// ❌ Before (src/test.ts — webpack pattern)
import "zone.js/dist/zone-testing"; // or 'zone.js/testing'
import { getTestBed } from "@angular/core/testing";
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";

declare const require: {
  context(
    path: string,
    deep?: boolean,
    filter?: RegExp
  ): {
    keys(): string[];
    <T>(id: string): T;
  };
};

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

const context = require.context("./", true, /\.spec\.ts$/);
context.keys().map(context);
```

```typescript
// ✅ After (src/test.ts — esbuild/application builder)
import { getTestBed } from "@angular/core/testing";
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
// No require.context — specs discovered via tsconfig.spec.json
```

And in `angular.json`, add `zone.js/testing` to the test target polyfills:

```json
// ✅ angular.json — test target
"test": {
  "builder": "@angular-devkit/build-angular:karma",
  "options": {
    "polyfills": ["zone.js", "zone.js/testing"],
    "tsConfig": "tsconfig.spec.json"
  }
}
```

Error you'll see without this fix:

```
TypeError: __webpack_require__(...).context is not a function
```

---

### 13. `Renderer` → `Renderer2` (v9)

**Why:** The original `Renderer` was removed in Angular v9 (Ivy). `Renderer2` is
the stable, Ivy-compatible replacement.

```typescript
// ❌ Before
import { Renderer } from '@angular/core';
constructor(private renderer: Renderer) {}
```

```typescript
// ✅ After
import { Renderer2 } from '@angular/core';
constructor(private renderer: Renderer2) {}
```

Note: `Renderer2` methods differ slightly — e.g., `renderer.setElementClass` →
`renderer.addClass`.

---

### 13. RxJS legacy import paths (v7+)

**Why:** RxJS v6 unified all imports under `'rxjs'` and `'rxjs/operators'`. Deep
path imports (`rxjs/Observable`, `rxjs/BehaviorSubject`, etc.) no longer exist
in RxJS v7+.

```typescript
// ❌ Before
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { map, filter } from "rxjs/operators";
```

```typescript
// ✅ After
import { Observable, BehaviorSubject } from "rxjs";
import { map, filter } from "rxjs";
```

---

### 14. `bootstrapModule` → `bootstrapApplication` (fully standalone, v14+)

**Why:** Fully standalone apps no longer need `AppModule`.
`bootstrapApplication` bootstraps a standalone root component directly.

```typescript
// ❌ Before (main.ts)
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { AppModule } from "./app/app.module";

platformBrowserDynamic().bootstrapModule(AppModule);
```

```typescript
// ✅ After (main.ts)
import { bootstrapApplication } from "@angular/platform-browser";
import { AppComponent } from "./app/app.component";
import { appConfig } from "./app/app.config";

bootstrapApplication(AppComponent, appConfig);
```

And create `app.config.ts`:

```typescript
import { ApplicationConfig } from "@angular/core";
import { provideRouter } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient()],
};
```

---

### 15. `angular.json` builder — `browser` → `application` (v17+, required v19)

**Why:** The webpack-based `browser` builder was deprecated in v17 and removed
in v19. The new `application` builder uses esbuild and has different option
names. Several obsolete webpack-only options must also be removed.

Key changes:

- `builder`: `@angular-devkit/build-angular:browser` →
  `@angular-devkit/build-angular:application`
- `options.main` → `options.browser`
- `options.polyfills` string → array (`"src/polyfills.ts"` →
  `["src/polyfills.ts"]`)
- `options.aot`, `buildOptimizer`, `commonChunk`, `deleteOutputPath`,
  `vendorChunk` — **remove** (not supported / always-on in the new builder)
- `serve` / `extract-i18n` option `browserTarget` → `buildTarget`
- The `e2e` protractor builder is removed entirely (Protractor is no longer
  supported)

```json
// ❌ Before (angular.json)
"build": {
  "builder": "@angular-devkit/build-angular:browser",
  "options": {
    "aot": true,
    "buildOptimizer": true,
    "commonChunk": true,
    "deleteOutputPath": true,
    "main": "src/main.ts",
    "polyfills": "src/polyfills.ts",
    "vendorChunk": true
  }
},
"serve": {
  "builder": "@angular-devkit/build-angular:dev-server",
  "options": {
    "browserTarget": "my-app:build"
  },
  "configurations": {
    "production": { "browserTarget": "my-app:build:production" }
  }
},
"extract-i18n": {
  "builder": "@angular-devkit/build-angular:extract-i18n",
  "options": { "browserTarget": "my-app:build" }
},
"e2e": {
  "builder": "@angular-devkit/build-angular:protractor",
  ...
}
```

```json
// ✅ After (angular.json)
"build": {
  "builder": "@angular-devkit/build-angular:application",
  "options": {
    "browser": "src/main.ts",
    "polyfills": ["src/polyfills.ts"]
    // aot, buildOptimizer, commonChunk, deleteOutputPath, vendorChunk removed
  }
},
"serve": {
  "builder": "@angular-devkit/build-angular:dev-server",
  "options": {
    "buildTarget": "my-app:build"             // ← browserTarget renamed
  },
  "configurations": {
    "production": { "buildTarget": "my-app:build:production" }
  }
},
"extract-i18n": {
  "builder": "@angular-devkit/build-angular:extract-i18n",
  "options": { "buildTarget": "my-app:build" } // ← browserTarget renamed
}
// e2e protractor target removed entirely
```

---

### 16. `DEFAULT_CURRENCY_CODE` explicit provision (v10+)

**Why:** Before v10, `USD` was the implicit default. Since v10, the default is
the project locale's currency. Specify it explicitly to avoid unexpected
formatting changes.

```typescript
// ✅ After (app.module.ts or app.config.ts providers)
import { DEFAULT_CURRENCY_CODE } from "@angular/core";

providers: [{ provide: DEFAULT_CURRENCY_CODE, useValue: "USD" }];
```

---

### 17. Constructor injection → `inject()` function (`@angular-eslint/prefer-inject`, enforced v20)

**Why:** `@angular-eslint` v20 enables the `prefer-inject` rule by default,
which requires all dependency injection to use the `inject()` function instead
of constructor parameter injection. Angular ships a schematic to auto-migrate:

```bash
ng generate @angular/core:inject --defaults
```

```typescript
// ❌ Before
import { Component } from '@angular/core';
import { MyService } from './my.service';

@Component({ ... })
export class MyComponent {
  constructor(private myService: MyService) {}
}
```

```typescript
// ✅ After
import { Component, inject } from '@angular/core';
import { MyService } from './my.service';

@Component({ ... })
export class MyComponent {
  private myService = inject(MyService);
}
```

After running the schematic, run `prettier-fix` because the generated code may
not match your project's formatting style.

---

## Common Pitfalls

| Symptom                                                                  | Root Cause                                                             | Fix                                                                                                                                                                                                                          |
| ------------------------------------------------------------------------ | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ERESOLVE could not resolve` on `npm install`                            | Stale `node_modules` with old lock file                                | `rm -rf node_modules package-lock.json && npm install`                                                                                                                                                                       |
| `Module not found: "./dist/zone"`                                        | Old `zone.js/dist/zone` import in polyfills                            | Change to `import 'zone.js'`                                                                                                                                                                                                 |
| `NG6008: Component is standalone, cannot be declared in NgModule`        | Angular 19 default `standalone: true`                                  | Add `standalone: false` to `@Component`/`@Pipe`                                                                                                                                                                              |
| `Can't resolve 'lz-string'`                                              | Missing peer dependency of `@nova-ui/bits` or similar lib              | `npm install lz-string`                                                                                                                                                                                                      |
| `notarget No matching version found for karma-jasmine-html-reporter@^4`  | Package only goes to v2.x                                              | Use `^2.1.0`                                                                                                                                                                                                                 |
| `prepare: ngcc` script error                                             | `ngcc` removed in v16                                                  | Delete the `prepare` script                                                                                                                                                                                                  |
| Build error about `defaultProject` workspace extension                   | Deprecated `angular.json` field                                        | Remove `defaultProject` from `angular.json`, use `--project` CLI flag instead                                                                                                                                                |
| `An error occurred for target: browser` or unknown builder error         | `browser` builder removed in v19                                       | Change `angular.json` builder to `@angular-devkit/build-angular:application`, rename `main` → `browser`, `polyfills` to array, remove webpack-only options, rename `browserTarget` → `buildTarget` in `serve`/`extract-i18n` |
| `TypeError: __webpack_require__(...).context is not a function`          | `require.context` webpack API used in `test.ts` with esbuild builder   | Remove `require.context` block and spec-loading from `test.ts`; move `zone.js/testing` to `angular.json` test `polyfills` array                                                                                              |
| `Module not found: "./dist/zone-testing"`                                | Old `zone.js/dist/zone-testing` import in `test.ts`                    | Remove the import from `test.ts`; add `"zone.js/testing"` to `angular.json` test `polyfills` array                                                                                                                           |
| `NullInjectorError` for `ActivatedRoute` / `Router` in tests             | Missing `RouterTestingModule` or `provideRouter([])` in test providers | Add `provideRouter([])` to `TestBed.configureTestingModule` providers                                                                                                                                                        |
| `Property 'X' does not exist on type 'Renderer2'`                        | `Renderer2` API differs from `Renderer`                                | Map old `Renderer` methods: `setElementClass` → `addClass`, `setElementStyle` → `setStyle`                                                                                                                                   |
| `Cannot find module 'rxjs/Observable'` or `'rxjs/BehaviorSubject'`       | Legacy RxJS deep import paths                                          | Change to `import { ... } from 'rxjs'`                                                                                                                                                                                       |
| `TestBed.get is not a function`                                          | `TestBed.get()` removed in v16                                         | Replace with `TestBed.inject()`                                                                                                                                                                                              |
| `TS2314: Generic type 'ModuleWithProviders<T>' requires 1 type argument` | Non-generic `ModuleWithProviders` used                                 | Add the module type: `ModuleWithProviders<MyModule>`                                                                                                                                                                         |
| Currency pipe shows wrong symbol after upgrade                           | `DEFAULT_CURRENCY_CODE` now defaults to locale currency                | Provide `{ provide: DEFAULT_CURRENCY_CODE, useValue: 'USD' }` explicitly                                                                                                                                                     |
| `@angular-eslint/prefer-inject` lint errors after upgrading to v20+      | `@angular-eslint` v20 enforces `prefer-inject` rule by default         | Run `ng generate @angular/core:inject --defaults`, then `yarn prettier-fix`                                                                                                                                                  |

---

## Common Migration Patterns (Quick Reference)

| Old API                                             | Replacement                                                               | Removed/Deprecated in           |
| --------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------- |
| `import 'zone.js/dist/zone'`                        | `import 'zone.js'`                                                        | v0.14 (zone.js)                 |
| `TRANSLATIONS` / `TRANSLATIONS_FORMAT`              | `@angular/localize`                                                       | v16                             |
| `ngcc` in prepare script                            | (remove entirely)                                                         | v16                             |
| `ComponentFactoryResolver`                          | `ViewContainerRef.createComponent()`                                      | v15                             |
| `HttpClientModule`                                  | `provideHttpClient()`                                                     | deprecated v15                  |
| `RouterModule.forRoot()`                            | `provideRouter()`                                                         | v14+ (standalone)               |
| `ModuleWithProviders` (non-generic)                 | `ModuleWithProviders<T>`                                                  | v13                             |
| `*ngIf` / `*ngFor`                                  | `@if` / `@for`                                                            | replaced v17                    |
| `@Input()` + `ngOnChanges`                          | `input()` signal                                                          | v17+                            |
| `EventEmitter @Output()`                            | `output()` signal                                                         | v17+                            |
| `ModuleWithProviders`                               | `EnvironmentProviders`                                                    | v15+                            |
| `standalone` default `false`                        | `standalone: false` explicit in NgModule components                       | v19                             |
| `@angular-devkit/build-angular:browser`             | `@angular-devkit/build-angular:application`                               | removed v19                     |
| `angular.json` `options.main`                       | `options.browser` (application builder)                                   | v17+                            |
| `angular.json` `options.polyfills` (string)         | `options.polyfills` (array)                                               | v17+                            |
| Constructor parameter injection                     | `inject()` function + `ng generate @angular/core:inject --defaults`       | enforced by @angular-eslint v20 |
| `angular.json` `browserTarget` (serve/extract-i18n) | `buildTarget`                                                             | v17+                            |
| `TestBed.get()`                                     | `TestBed.inject()`                                                        | v9 (removed v16)                |
| `require.context()` in `test.ts`                    | remove — specs auto-discovered via tsconfig                               | v17+ (esbuild builder)          |
| `import 'zone.js/testing'` in `test.ts`             | `polyfills: ["zone.js", "zone.js/testing"]` in `angular.json` test target | v17+ (esbuild builder)          |
| `Renderer`                                          | `Renderer2`                                                               | v9                              |
| `rxjs/Observable`, `rxjs/BehaviorSubject`, etc.     | `import { ... } from 'rxjs'`                                              | v6 (rxjs)                       |
| `platformBrowserDynamic().bootstrapModule()`        | `bootstrapApplication()`                                                  | v14+ (fully standalone)         |
| `DEFAULT_CURRENCY_CODE` implicit USD                | provide `DEFAULT_CURRENCY_CODE` explicitly                                | v10                             |

## Guidelines

- Always explain _why_ a change is needed, not just what to change
- Provide before/after code snippets for every breaking change
- Never silently skip a migration step — list all required changes upfront
- When unsure about project structure, ask for `package.json` or `angular.json`
  before proceeding
- Flag any third-party libraries that may not yet support the target Angular
  version
- After every `package.json` edit, do a clean install:
  `rm -rf node_modules package-lock.json && npm install`
- Always run `ng build --configuration production` after applying fixes — do not
  assume it compiles until verified
- After the build passes, always run
  `ng test --watch=false --browsers=ChromeHeadless` (or `yarn test`) and confirm
  `0 failures` before considering the migration done
- Read every failing spec individually — do not dismiss test failures as
  pre-existing without checking
- If `karma.conf.js` exists, verify it has `browsers: ['ChromeHeadless']` and
  `singleRun: true` so tests are CI-safe
- If the project has a `yarn assemble` (or equivalent) script, run it as the
  final gate — it should combine prettier, lint, and production build
- When migrating test files, search for `TestBed.get(` across all `*.spec.ts`
  files and replace with `TestBed.inject(`
- When adding `standalone: false`, grep for all `@Component({`, `@Pipe({`, and
  `@Directive({` declarations in `NgModule` `declarations` arrays — each one
  needs the explicit flag in v19
- Check third-party libraries (e.g., `@nova-ui/bits`, `@ngrx/*`) for their own
  Angular version compatibility before upgrading — they must be updated in
  lockstep
