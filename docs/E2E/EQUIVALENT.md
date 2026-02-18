# UI Tests Migration from Protractor to Playwright - COMPLETED

This document outlines the completed migration of UI tests from **Protractor** to **Playwright** in the [SolarWinds Nova](https://github.com/solarwinds/nova) UI component library.

## ✅ Goals - ACHIEVED

- ✅ Fully deprecated Protractor usage.
- ✅ Migrated UI tests with minimal effort and maximum reusability.
- ✅ Support multiple test types: **E2E**, **A11y**, and **Visual**.
- ✅ Integrated into existing **CircleCI** CI/CD pipeline.

---

## 🧱 Prefer Atoms over raw locators

When migrating, don’t translate Protractor selectors 1:1 into Playwright selectors inside tests.

Instead:

- Keep selectors inside **Atoms**.
- Keep Playwright APIs (`page`, `locator`, `expect(locator)`) mostly out of tests.
- Expose semantic actions and retryable assertions on atoms.

See `docs/E2E/ATOMS.md`.

---

## 🔁 Protractor vs Playwright Equivalents

| Protractor                                                  | Playwright                                      |
|-------------------------------------------------------------|-------------------------------------------------|
| `browser.get(url)`                                          | `page.goto(url)`                                |
| `element(by.css('#my-id'))`                                 | `page.locator('#my-id')`                        |
| `element(by.id('my-id'))`                                   | `page.locator('#my-id')`                        |
| `element(by.cssContainingText(...))`                        | `page.getByText(...)` or `locator.filter(...)` |
| `await elem.getText()`                                      | `await locator.textContent()`                  |
| `await elem.isVisible()`                                    | `await locator.isVisible()`                  |
| `await elem.click()`                                        | `await locator.click()`                         |
| `await elem.sendKeys(Key.ENTER)`                            | `await locator.press('Enter')`                 |
| `expect(await elem.getAttribute('class')).toContain('btn')` | `expect(locator).toHaveClass(/btn/)` |
| `browser.waitForAngular()`                                  | 🔥 *Not needed (Playwright doesn't rely on Angular internals)* |

---

## 🧰 Helpers mapping

### Protractor
```ts
await Helpers.prepareBrowser("button/button-test");
```

### Playwright equivalent
```ts
await Helpers.prepareBrowser("button/button-test", page);
```

---

## ✅ Protractor → Playwright rewrites

### Class checks

Protractor:
```ts
expect(await btn.hasClass("btn")).toBe(true);
```

Playwright (preferred):
```ts
await btn.toContainClass("btn");
```

If you’re not using Atoms yet:
```ts
await expect(page.locator(".btn")).toHaveClass(/btn/);
```

---

## 🔄 File conversion strategy

- Convert `beforeAll` setup into `test.beforeEach()` or `test.describe()` blocks.
- Move selectors into Atoms (don’t inline locators in tests).
- Replace `.hasClass()` with `toHaveClass()` (or Atom helpers like `toContainClass()`).
- Replace `getText()` with `toHaveText()` / `textContent()`.
- Remove manual waits/timeouts and rely on Playwright's auto-wait + assertions.
