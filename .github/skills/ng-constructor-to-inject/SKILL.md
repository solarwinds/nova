---
name: ng-constructor-to-inject
description: 'Migrate Angular constructor parameter injection to inject() function syntax (Angular 14+ style). Use when: migrating constructor DI, converting constructor(private svc: Svc) to inject(), replacing constructor injection with field injection, fixing no-inject-constructor lint rule.'
argument-hint: 'path/to/file.ts or glob like packages/bits/src/**/*.ts'
---

# Constructor Injection → `inject()` Migration

Migrates Angular classes from constructor parameter injection to the `inject()` function style.

## When to Use

- A file has `constructor(private|public|protected|readonly dep: Type)` params
- A spec file instantiates the class with `new MyClass(dep1, dep2)` after migration
- A lint rule (`@angular-eslint/no-inject-constructor` or similar) flags constructor injection

## Transformation Rules

See [./references/patterns.md](./references/patterns.md) for exhaustive before/after patterns.

## Procedure

### Step 1 — Identify the target file(s)

If the user provided a path or glob, use `grep_search` to list all files matching:
```
constructor\((?:private|public|protected|readonly)
```
Otherwise work on the currently open file.

### Step 2 — For each source file

1. **Read the file** to understand its full structure.
2. **Collect constructor injected params**: extract `(modifier) (readonly?) name: Type` from the constructor signature.
3. **Determine constructor body**: check whether the constructor body contains any statements beyond super() calls.
4. **Apply the transformation**:
   - Add a class field `modifier (readonly?) name = inject(Type);` for every injected param, placed directly after the last decorator / class opening `{`.
   - Remove the matching params from the constructor signature.
   - If the constructor is now empty (no params, no body except possibly `super()`), **remove the constructor entirely**.
   - If a `super(...)` call exists without args after removing params, keep the constructor with only the super call.
   - If there is remaining body code, keep the constructor with only the body (no params).
5. **Update the `@angular/core` import**: add `inject` to the existing import if it is not already present.
6. **Preserve all other imports**: do not touch non-angular-core imports.
7. **Format**: match the surrounding code style (spacing, trailing commas).

### Step 3 — Update spec files

Find the corresponding `.spec.ts` file(s). See [./references/test-migration.md](./references/test-migration.md).

1. If the spec creates the class with `new MyClass(dep1, dep2)`, migrate it to `TestBed`-based instantiation.
2. If the spec already uses `TestBed.createComponent` / `TestBed.inject`, no change is needed.
3. Run the spec after changes: prefer `runTests` tool over terminal.

### Step 4 — Verify

Run `get_errors` on the modified files and fix any TypeScript errors before finishing.

## Quick Reference

| Before | After |
|--------|-------|
| `constructor(private svc: SvcClass) {}` | `private svc = inject(SvcClass);` (constructor removed) |
| `constructor(private readonly svc: SvcClass) {}` | `private readonly svc = inject(SvcClass);` |
| `constructor(public svc: SvcClass) {}` | `public svc = inject(SvcClass);` |
| `constructor(protected svc: SvcClass) {}` | `protected svc = inject(SvcClass);` |
| `constructor(private svc: SvcClass) { this.init(); }` | field + constructor with body only |
| `inject` already in import | add to existing named import list |
| `import { Component } from "@angular/core"` | `import { Component, inject } from "@angular/core"` |
