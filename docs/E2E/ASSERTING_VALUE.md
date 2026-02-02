# 🎯 Assertion Best Practices in Playwright
Playwright offers a powerful and expressive `expect()` API that allows writing reliable and readable assertions. This document outlines best practices for making the most of Playwright assertions in your UI tests.

> Nova guidance: whenever you can, assert through **Atoms** (see `docs/E2E/ATOMS.md`) so tests stay insulated from DOM/selector changes.

## ✅ 1. Use `expect(locator)` Instead of `expect(await locator.textContent())`

**Bad:**
```ts
expect(await page.locator('h1').textContent()).toBe('Welcome');
```

**Good:**
```ts
await expect(page.locator('h1')).toHaveText('Welcome');
```
**Why**: Built-in Playwright assertions automatically handle retries and timeouts. Manual .textContent() disables retries and can lead to flaky tests.


## ✅ 2. Use toHave* Assertions for Common DOM Checks

Playwright provides smart matchers that understand DOM semantics and wait for the expected state. These are much more stable than manually checking properties like `textContent` or `getAttribute`.

| Matcher           | Description                                |
|-------------------|--------------------------------------------|
| `toHaveText`      | Assert that an element has specific text   |
| `toHaveValue`     | Assert the value of an input field         |
| `toHaveAttribute` | Assert an element has a specific attribute |
| `toHaveClass`     | Assert the presence of specific CSS class  |
| `toHaveCount`     | Assert the number of nodes                 |
| `toBeVisible`     | Assert that the element is visible         |
| `toBeHidden`      | Assert that the element is hidden          |
| `toBeEnabled`     | Assert the element is enabled              |
| `toBeDisabled`    | Assert the element is disabled             |
| `toBeChecked`     | Assert that a checkbox or radio is checked |

**Examples:**

```ts
await expect(page.locator('button.submit')).toBeEnabled();
await expect(page.locator('input[name="email"]')).toHaveValue('user@example.com');
await expect(page.locator('h1')).toHaveText(/Welcome/);
await expect(page.locator('#profile')).toHaveClass(/active/);
```
✅ Tip: These assertions automatically retry for up to the default timeout (5s), reducing the need for manual waits or waitForTimeout.


## ✅ 3. Use `expect.poll()` for Dynamic Conditions

When you need to assert values that aren't tied directly to a DOM element — such as page title, local storage, or a global variable — `expect.poll()` is the best tool. It automatically retries until the condition is met or times out.

### 🔍 When to Use `expect.poll()`
- Asserting page title
- Checking dynamic values (e.g., API state, global JS variables)
- Verifying computed values not directly reflected in the DOM

### 📘 Syntax
```ts
await expect.poll(async () => {
  return await page.title();
}).toBe("Dashboard");
```

### ✅ Example 1: Check page title

```ts
await expect.poll(async () => await page.title()).toBe("Dashboard");
```
### ✅ Example 2: Verify a variable in the browser context
```ts
await expect.poll(async () => {
  return await page.evaluate(() => (window as any).appStatus);
}).toBe("ready");

```
✅ Tip: `expect.poll()`works great for custom scenarios where DOM-based matchers like toHaveText() aren't applicable.

## ✅ 4. Always Use Locators, Not Page Elements
Don’t extract raw elements or attributes manually.


**Bad:**
```ts
const el = await page.$('button');
const className = await el.getAttribute('class');
expect(className.includes('primary')).toBe(true);

```

**Good:**
```ts
await expect(page.locator('button')).toHaveClass(/primary/);
```

### Atom-friendly equivalent

If you already have an Atom, prefer using its retryable assertion helper instead of reading attributes yourself:

```ts
await buttonAtom.toContainClass("primary");
await buttonAtom.toBeVisible();
```


## ⚠️ Gotchas to Avoid
| Mistake                                       | Why It's Bad                                      |
| --------------------------------------------- | ------------------------------------------------- |
| Using `expect(await ...)` with locator values | Disables auto-wait and retry logic                |
| Exact `toHaveText()` on dynamic UI            | Can fail intermittently if text updates slowly    |
| Using hardcoded timeouts                      | Prefer Playwright's built-in waits and assertions |
