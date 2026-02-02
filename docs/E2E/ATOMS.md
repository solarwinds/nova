# Atoms (framework-agnostic page objects)

Atoms are small, user-focused wrappers around UI components used in Nova UI tests.

The goal is that **tests don’t talk to the test framework** (Playwright/Protractor/etc.) and don’t depend on:

- the internal DOM structure of a component
- implementation-specific CSS classes
- timing / waiting details
- Angular internals

Instead, tests use **Atoms** that expose *semantic actions* ("open the menu") and *semantic assertions* ("should be disabled").

---

## What an Atom is

An Atom is a class that wraps a *root element* (a Playwright `Locator` in the current implementation) and provides:

- a stable way to **find** the component in the DOM (`CSS_CLASS` / `CSS_SELECTOR`)
- methods to **interact** with the component (click, hover, type, select…)
- methods to **assert** state using retryable expectations (`toBeVisible`, `toContainClass`, etc.)

In this repo, the Playwright base Atom implementation lives in `packages/bits/e2e/atom.ts`.

---

## Two ways to create an Atom

### 1) Construct it directly

Use this when you already have a locator that represents the component root.

```ts
import { test } from "@nova-ui/bits/e2e/setup";
import { CheckboxAtom } from "@nova-ui/bits/e2e/components/checkbox/checkbox.atom";

test("checkbox can be checked", async ({ page }) => {
  // if you already have a locator
  const checkbox = new CheckboxAtom(page.locator(".nui-checkbox"));

  await checkbox.click();
  await checkbox.toContainClass("nui-checkbox--checked");
});
```

### 2) Find it via the Atom helpers (preferred)

This is the most common pattern. It keeps selectors in one place (`CSS_CLASS` / `CSS_SELECTOR`) and reduces duplication.

```ts
import { test, Helpers } from "../../setup";
import { Atom } from "../../atom";
import { ButtonAtom } from "../button/button.atom";

test("default dialog button is visible", async ({ page }) => {
  await Helpers.prepareBrowser("dialog", page);

  const openDialogBtn = Atom.find<ButtonAtom>(ButtonAtom, "nui-demo-default-dialog-btn");
  await openDialogBtn.toBeVisible();
});
```

Notes:
- `Atom.find(AtomClass, id)` finds by **element id** and then resolves the Atom inside it.
- `Atom.findIn(AtomClass, parentLocator)` finds an Atom within a parent context.

---

## Recommended test workflow

1. Navigate to the demo page (or app route) and ensure the right `page` is registered:

   - use `Helpers.prepareBrowser(pageName, page)`

2. Create atoms in `test.beforeEach` (or the start of each test) so tests are isolated.

3. Interact and assert through Atom methods.

### Example

```ts
import { test, Helpers } from "../../setup";
import { Atom } from "../../atom";
import { SearchAtom } from "./search.atom";

test.describe("search", () => {
  test.beforeEach(async ({ page }) => {
    await Helpers.prepareBrowser("search", page);
  });

  test("opens and accepts input", async () => {
    const search = Atom.find<SearchAtom>(SearchAtom, "nui-search-test");

    await search.open();
    await search.input.type("nova");
    await search.results.toBeVisible();
  });
});
```

---

## Atom API (Playwright base)

From `packages/bits/e2e/atom.ts`:

### Static helpers

- `Atom.find(AtomClass, id, root?)`
- `Atom.findIn(AtomClass, parentLocator?, root?)`
- `Atom.getSelector(AtomClass)`

### Instance helpers

- `getLocator()`
- `click()` / `hover()`

### Assertions (preferred)

Use the retryable Playwright expectations exposed by Atoms:

- `toBeVisible()`
- `toBeHidden()`
- `toBeDisabled()`
- `toContainClass(className)` / `toNotContainClass(className)`

Avoid `hasClass()` (deprecated in the Playwright Atom) because it loses auto-retry behavior.

See also: `docs/E2E/ASSERTING_VALUE.md`.

---

## Writing good Atoms

### Keep tests framework-agnostic

A test should ideally not import/return `Locator` directly. Prefer:

- Atom methods that return asserts values (`toBeOpened`, `toContainItem`, etc.)
- Atom methods that return other Atoms (`menu.open()` returns a `MenuAtom`)

If you need a locator for a rare case, expose it via `getLocator()` as the escape hatch.

### Prefer semantic actions

Bad (leaks HTML details):
- `clickChevronIcon()`

Good (user intent):
- `expand()` / `open()` / `selectItem(label)`

### Prefer stable selectors

Atoms should define either:

- `static CSS_DATA_TEST_ID = "…"` (preferred)
- `static CSS_CLASS = "…"`
- `static CSS_SELECTOR = "…"`

When possible, target stable automation ids (e.g., `id`, `data-automation-id`) rather than visual/structural selectors.

### Don’t encode component internals

If a component’s internal DOM changes but the user experience stays the same, ideally only the Atom needs updating.

---

## Migration note (Protractor → Playwright)

If you’re migrating legacy Protractor tests:

- Replace `ElementFinder` usage with Atoms wrapping Playwright `Locator`.
- Replace `expect(await atom.hasClass('x')).toBe(true)` with `await atom.toContainClass('x')`.
- Replace manual waits with Playwright `expect(locator)` matchers.

See `docs/E2E/EQUIVALENT.md` for a quick mapping table.
