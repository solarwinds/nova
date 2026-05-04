# Migration Patterns

## Basic: single private dep, empty constructor

```ts
// BEFORE
import { Component } from "@angular/core";
import { MyService } from "./my.service";

@Component({ selector: "my-cmp", template: "" })
export class MyComponent {
    constructor(private myService: MyService) {}
}

// AFTER
import { Component, inject } from "@angular/core";
import { MyService } from "./my.service";

@Component({ selector: "my-cmp", template: "" })
export class MyComponent {
    private myService = inject(MyService);
}
```

---

## Multiple deps, empty constructor

```ts
// BEFORE
constructor(
    private serviceA: ServiceA,
    private serviceB: ServiceB,
    private serviceC: ServiceC,
) {}

// AFTER  (constructor removed entirely)
private serviceA = inject(ServiceA);
private serviceB = inject(ServiceB);
private serviceC = inject(ServiceC);
```

---

## Constructor with body code

```ts
// BEFORE
constructor(private router: Router) {
    this.router.navigate(["/home"]);
}

// AFTER  (constructor body stays, param removed)
private router = inject(Router);

constructor() {
    this.router.navigate(["/home"]);
}
```

---

## `readonly` modifier

```ts
// BEFORE
constructor(private readonly svc: MyService) {}

// AFTER
private readonly svc = inject(MyService);
```

---

## `public` or `protected` modifier (template or subclass access)

```ts
// BEFORE
constructor(public changeDetector: ChangeDetectorRef) {}

// AFTER
public changeDetector = inject(ChangeDetectorRef);
```

---

## Mix of injected and non-injected constructor params

Non-injected params (no access modifier) are **not** migrated — they stay in the constructor signature.

```ts
// BEFORE
constructor(private svc: SvcClass, config: SomeConfig) {
    this.value = config.value;
}

// AFTER  (only access-modifier params move to inject())
private svc = inject(SvcClass);

constructor(config: SomeConfig) {
    this.value = config.value;
}
```

---

## Class with `super()` call

```ts
// BEFORE
constructor(private svc: SvcClass) {
    super();
}

// AFTER  (constructor kept only for super())
private svc = inject(SvcClass);

constructor() {
    super();
}
```

If the super call passes injected deps, those must become field references:

```ts
// BEFORE
constructor(private http: HttpClient) {
    super(http);
}

// AFTER
private http = inject(HttpClient);

constructor() {
    super(this.http);   // <-- update reference
}
```

---

## `inject` already imported

Only add `inject` once. Find the existing `@angular/core` named import and append it:

```ts
// BEFORE
import { Component, OnInit } from "@angular/core";

// AFTER
import { Component, OnInit, inject } from "@angular/core";
```

---

## `inject` already present

No change to the import line needed.

---

## Edge case: `@Inject(TOKEN)` decorator — out of scope

This skill covers **only** TypeScript access-modifier params (`private|public|protected`).
`@Inject(TOKEN)` params require a separate migration (`inject(TOKEN)` with optional flags) and are handled by the `@Inject`-migration skill.

---

## Ordering of injected fields

Place `inject()` fields in the same order the constructor params appeared, directly at the top of the class body (after any class-level decorators but before other fields), to maintain readability.

If the class already has fields, place the new `inject()` fields **before** the first non-inject field, unless a different convention is established in the file.
