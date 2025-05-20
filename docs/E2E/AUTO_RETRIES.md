## ✅ Auto-Retrying Assertions in Playwright

Playwright's built-in assertions automatically retry until the condition passes or the timeout is reached. This makes your tests more stable and removes the need for manual waits.

### 🔧 Common Auto-Retrying Matchers

| Matcher               | Description                                              |
|-----------------------|----------------------------------------------------------|
| `toBeVisible()`       | Waits until the element is visible                       |
| `toBeHidden()`        | Waits until the element is hidden                        |
| `toBeEnabled()`       | Waits until the element is enabled                       |
| `toBeDisabled()`      | Waits until the element is disabled                      |
| `toBeEditable()`      | Waits until the element is editable                      |
| `toBeChecked()`       | Waits until a checkbox or radio button is checked        |
| `toBeEmpty()`         | Waits until the element has no inner text                |
| `toHaveText()`        | Waits for the element to have the specified text         |
| `toHaveValue()`       | Waits for an input/textarea to have a specific value     |
| `toHaveAttribute()`   | Waits for the element to have a specific attribute value |
| `toHaveClass()`       | Waits for the element to have the specified class        |
| `toHaveCount()`       | Waits for a locator to match a specific number of nodes  |
| `toHaveURL()`         | Waits until the page’s URL matches the expected value    |
| `toHaveTitle()`       | Waits until the page’s title matches the expected value  |

### 📘 Example

```ts
await expect(page.locator('button#submit')).toBeVisible();
await expect(page.locator('input#email')).toHaveValue('user@example.com');
await expect(page).toHaveURL(/dashboard/);
```
🕒 Note: These matchers will retry for up to the default timeout (usually 5 seconds). You can customize the timeout with { timeout: 10000 } if needed.
