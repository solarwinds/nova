# Migrating UI Tests from Protractor to Playwright

This document outlines the strategy and implementation for migrating existing UI tests from **Protractor** to **Playwright** in the [SolarWinds Nova](https://github.com/solarwinds/nova) UI component library.

## ✅ Goals

- Fully deprecate Protractor usage.
- Migrate UI tests with minimal effort and maximum reusability.
- Support multiple test types: **E2E**, **A11y**, and **Visual**.
- Integrate into existing **CircleCI** CI/CD pipeline.

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

## 🧱 Helpers Mapping

### Protractor
```ts
await Helpers.prepareBrowser("button/button-test");
```
### Playwright Equivalent
```ts
await page.goto(`${BASE_URL}/#/button/button-test`);
```
### 🧪 Protractor to Playwright Test Rewrites
✅ hasClass() usage
Protractor
```ts
expect(await btn.hasClass("btn")).toBe(true);
```
Playwright
```ts
await expect(btn.locator).toHaveClass(/btn/);
```
Or using a PO helper:
```ts
expect(await btn.hasClass("btn")).toBe(true);
```

### 🔄 File Conversion Strategy
- Convert `beforeAll` test setup to `test.beforeEach()` or `test.describe()` block.
- Replace `Helpers.getElementByCSS` with `page.locator(...)`.
- Replace `.hasClass()` with `toHaveClass()` assertions.
- Replace `getText()` with `textContent()` and `toHaveText()` assertions.
- Use `dispatchEvent('mousedown')/mouseup` for hold logic.
