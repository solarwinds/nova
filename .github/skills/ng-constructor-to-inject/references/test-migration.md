# Test Migration Guide

When a class is migrated from constructor injection to `inject()`, its unit tests may break if they instantiate the class manually with `new`. This guide covers how to fix those cases.

## 1. Detect which pattern the spec uses

### Pattern A — Manual instantiation (must migrate)

```ts
// spec file before
let component: MyComponent;
beforeEach(() => {
    component = new MyComponent(myServiceStub);
});
```

### Pattern B — TestBed (no change needed)

```ts
// spec file — already fine
beforeEach(async () => {
    await TestBed.configureTestingModule({
        declarations: [MyComponent],
        providers: [{ provide: MyService, useValue: myServiceStub }],
    }).compileComponents();
    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
});
```

---

## 2. Migrating Pattern A → TestBed

### 2a. Component spec

```ts
// BEFORE
import { MyService } from "./my.service";
import { MyComponent } from "./my.component";

describe("MyComponent", () => {
    let component: MyComponent;
    const myServiceStub: Partial<MyService> = { getValue: () => "test" };

    beforeEach(() => {
        component = new MyComponent(myServiceStub as MyService);
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

// AFTER
import { TestBed } from "@angular/core/testing";
import { MyService } from "./my.service";
import { MyComponent } from "./my.component";

describe("MyComponent", () => {
    let component: MyComponent;
    const myServiceStub: Partial<MyService> = { getValue: () => "test" };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MyComponent],
            providers: [{ provide: MyService, useValue: myServiceStub }],
        }).compileComponents();
        const fixture = TestBed.createComponent(MyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
```

### 2b. Service spec

```ts
// BEFORE
import { MyService } from "./my.service";
import { LoggerService } from "./logger.service";

describe("MyService", () => {
    let service: MyService;
    const loggerStub = { warn: jasmine.createSpy() };

    beforeEach(() => {
        service = new MyService(loggerStub as LoggerService);
    });
    // ...
});

// AFTER
import { TestBed } from "@angular/core/testing";
import { MyService } from "./my.service";
import { LoggerService } from "./logger.service";

describe("MyService", () => {
    let service: MyService;
    const loggerStub = { warn: jasmine.createSpy() };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                MyService,
                { provide: LoggerService, useValue: loggerStub },
            ],
        });
        service = TestBed.inject(MyService);
    });
    // ...
});
```

---

## 3. Handling `providedIn: 'root'` services

If the service under test is `@Injectable({ providedIn: 'root' })`, TestBed provides it automatically. You only need to override its deps:

```ts
TestBed.configureTestingModule({
    providers: [
        { provide: LoggerService, useValue: loggerStub },
    ],
});
service = TestBed.inject(MyService);
```

---

## 4. `standalone: true` components

For standalone components, use `imports` instead of `declarations`:

```ts
await TestBed.configureTestingModule({
    imports: [MyStandaloneComponent],
    providers: [{ provide: MyService, useValue: myServiceStub }],
}).compileComponents();
```

---

## 5. Imports to add/update

After migrating a spec from manual instantiation, ensure:

- `TestBed` is imported from `@angular/core/testing`
- `ComponentFixture` is imported if you need `fixture`
- Remove `jasmine.createSpyObj` / manual stub constructor args that are no longer passed

---

## 6. Checklist

- [ ] All `new MyClass(...)` calls replaced with TestBed pattern
- [ ] All injected stubs moved to `providers` array
- [ ] `TestBed.inject(MyService)` used for service retrieval
- [ ] `fixture.detectChanges()` called after component creation if needed
- [ ] `get_errors` run on the spec file — no TypeScript errors
- [ ] Tests pass with `runTests` tool
